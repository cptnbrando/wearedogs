/**
 * /plays: how many times each DOGS track has been played (src/lib/playCounts.svelte.js).
 *
 *   POST /plays { id }  -> { counted: true }     anyone; the player sends one per listen
 *   GET  /plays         -> { plays: [{ id, count, lastAt }] }   the owner only (lib/admin.js)
 *
 * The numbers are hidden from visitors. A play is a track id and nothing else:
 * no listener, device or network is recorded with it. They are an honest
 * tally, not an audited one: the per-IP limiter and the daily cap keep a
 * script from running them up far, and that is all.
 */
import { reply, readBoundedBody, JSON_TYPE } from "../lib/http.js";
import { spendWrites } from "../lib/budget.js";
import { ADMIN_CORS, isAdmin } from "../lib/admin.js";

const APP = "plays";
const PLAY_WRITE_ROWS = 1;
const PLAYS_DAILY_WRITE_CAP = 9000;
const MAX_BODY_BYTES = 512;
/** Track ids as tracks.js and the catalog write them. */
const TRACK_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
/** A made-up id still gets a row, so the table stops taking new ones here. */
const MAX_TRACKS = 600;
const COUNT_PLAY_SQL = `INSERT INTO plays (track_id, count, last_at)
  SELECT ?1, 1, ?2
  WHERE EXISTS (SELECT 1 FROM plays WHERE track_id = ?1) OR (SELECT COUNT(*) FROM plays) < ?3
  ON CONFLICT(track_id) DO UPDATE SET count = count + 1, last_at = ?2`;
const LIST_PLAYS_SQL = "SELECT track_id AS id, count, last_at AS lastAt FROM plays ORDER BY count DESC LIMIT ?1";

export default {
  path: "/plays",
  cors: ADMIN_CORS,

  /**
   * @param {Request} request
   * @param {object} env
   * @param {ExecutionContext} ctx
   * @param {{ ipKey: string, cors: object }} visitor
   */
  async handle(request, env, ctx, { ipKey, cors }) {
    if (request.method === "GET") {
      const { success } = await env.READ_LIMITER.limit({ key: ipKey });
      if (!success) return reply(429, { error: "Slow down" }, cors);
      if (!(await isAdmin(request, env))) return reply(401, { error: "Sign in" }, cors);
      const { results } = await env.DB.prepare(LIST_PLAYS_SQL).bind(MAX_TRACKS).all();
      return reply(200, { plays: results }, cors);
    }
    if (request.method !== "POST") return reply(405, { error: "Method not allowed" }, { ...cors, Allow: "GET, POST, OPTIONS" });

    const { success } = await env.PLAYS_LIMITER.limit({ key: ipKey });
    if (!success) return reply(429, { error: "Slow down" }, cors);
    const id = await readTrackId(request);
    if (!id) return reply(400, { error: "Bad request" }, cors);
    const funded = await spendWrites(env, APP, PLAY_WRITE_ROWS, PLAYS_DAILY_WRITE_CAP);
    // Over the cap the play is simply not counted: the listener has nothing to fix
    if (funded) await env.DB.prepare(COUNT_PLAY_SQL).bind(id, Date.now(), MAX_TRACKS).run();
    return reply(200, { counted: funded }, cors);
  },
};

/** @returns {Promise<string | null>} the track id, or null when the request is not a play */
async function readTrackId(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  const body = await readBoundedBody(request, MAX_BODY_BYTES);
  if (body === null) return null;
  try {
    const data = JSON.parse(body);
    return data && typeof data.id === "string" && TRACK_ID_PATTERN.test(data.id) ? data.id : null;
  } catch {
    return null;
  }
}
