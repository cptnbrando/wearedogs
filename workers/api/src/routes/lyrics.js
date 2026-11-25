/**
 * /lyrics: timed lyrics for the music player (src/lib/lyrics.svelte.js). Anyone reads; only the
 * owner writes (lib/admin.js), from the Captions app.
 *
 *   GET    /lyrics                   -> { lyrics: [{ id, updatedAt }] }   which tracks have lyrics
 *   GET    /lyrics/<track id>?v=<n>  -> { id, updatedAt, lyrics }
 *   PUT    /lyrics/<track id> { lyrics } -> { id, updatedAt }             the owner only
 *   DELETE /lyrics/<track id>        -> { deleted }                       the owner only
 *
 * Lyrics are { v: 1, lines: [{ w: [[seconds, "word"], ...], e: seconds }] }: each line's words
 * with the moment each one is sung, and the moment the line ends.
 *
 * Reads are kept off D1: the list is cached at the edge for LIST_CACHE_SECONDS, and one song's
 * lyrics, asked for with the `v` the list gave, never change, so browsers and the edge keep them.
 */
import { reply, readBoundedBody, JSON_TYPE } from "../lib/http.js";
import { spendWrites } from "../lib/budget.js";
import { ADMIN_CORS, isAdmin } from "../lib/admin.js";

const APP = "lyrics";
const LYRICS_WRITE_ROWS = 1;
const LYRICS_DAILY_WRITE_CAP = 400;
const MAX_BODY_BYTES = 300 * 1024;
const MAX_TRACKS = 600;
const MAX_LINES = 1500;
const MAX_WORDS_PER_LINE = 80;
const MAX_WORD_LENGTH = 80;
const MAX_SECONDS = 6 * 60 * 60;
const FORMAT_VERSION = 1;
const LIST_CACHE_SECONDS = 120;
const VERSIONED_CACHE_SECONDS = 30 * 24 * 60 * 60;
const UNVERSIONED_CACHE_SECONDS = 60;
/** Track ids as tracks.js and the catalog write them. */
const TRACK_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const LIST_SQL = "SELECT track_id AS id, updated_at AS updatedAt FROM lyrics ORDER BY track_id LIMIT ?1";
const READ_SQL = "SELECT body, updated_at AS updatedAt FROM lyrics WHERE track_id = ?1";
const SAVE_SQL = `INSERT INTO lyrics (track_id, body, updated_at)
  SELECT ?1, ?2, ?3
  WHERE EXISTS (SELECT 1 FROM lyrics WHERE track_id = ?1) OR (SELECT COUNT(*) FROM lyrics) < ?4
  ON CONFLICT(track_id) DO UPDATE SET body = ?2, updated_at = ?3`;
const DELETE_SQL = "DELETE FROM lyrics WHERE track_id = ?1";

export default {
  path: "/lyrics",
  cors: ADMIN_CORS,

  /**
   * @param {Request} request
   * @param {object} env
   * @param {ExecutionContext} ctx
   * @param {{ ipKey: string, cors: object, url: URL }} visitor
   */
  async handle(request, env, ctx, { ipKey, cors, url }) {
    const id = url.pathname.split("/")[2] || "";
    if (id && !TRACK_ID_PATTERN.test(id)) return reply(400, { error: "Bad request" }, cors);
    const listKey = `${url.origin}/lyrics/list`;

    if (request.method === "GET") {
      const version = url.searchParams.get("v") || "";
      const cacheKey = id ? `${url.origin}/lyrics/one/${id}/${/^\d{1,16}$/.test(version) ? version : "latest"}` : listKey;
      const cached = await caches.default.match(cacheKey);
      if (cached) return reply(200, await cached.json(), { ...cors, "Cache-Control": cached.headers.get("Cache-Control") });
      const { success } = await env.READ_LIMITER.limit({ key: ipKey });
      if (!success) return reply(429, { error: "Slow down" }, cors);
      return id ? readOne(env, ctx, cors, id, version, cacheKey) : readList(env, ctx, cors, cacheKey);
    }

    if (request.method !== "PUT" && request.method !== "DELETE") {
      return reply(405, { error: "Method not allowed" }, { ...cors, Allow: "GET, PUT, DELETE, OPTIONS" });
    }
    const { success } = await env.ADMIN_LIMITER.limit({ key: ipKey });
    if (!success) return reply(429, { error: "Slow down" }, cors);
    if (!(await isAdmin(request, env))) return reply(401, { error: "Sign in" }, cors);
    if (!id) return reply(400, { error: "Bad request" }, cors);
    if (!(await spendWrites(env, APP, LYRICS_WRITE_ROWS, LYRICS_DAILY_WRITE_CAP))) {
      return reply(429, { error: "Too many saves today. Try again tomorrow." }, cors);
    }
    ctx.waitUntil(caches.default.delete(listKey));

    if (request.method === "DELETE") {
      const outcome = await env.DB.prepare(DELETE_SQL).bind(id).run();
      return reply(200, { deleted: outcome.meta.changes > 0 }, cors);
    }
    const lyrics = await readLyrics(request);
    if (!lyrics) return reply(400, { error: "Those lyrics could not be read." }, cors);
    const updatedAt = Date.now();
    const outcome = await env.DB.prepare(SAVE_SQL).bind(id, JSON.stringify(lyrics), updatedAt, MAX_TRACKS).run();
    if (!outcome.meta.changes) return reply(409, { error: "The lyrics shelf is full." }, cors);
    return reply(200, { id, updatedAt }, cors);
  },
};

/** Which tracks have lyrics, and when each was last saved. */
async function readList(env, ctx, cors, cacheKey) {
  const { results } = await env.DB.prepare(LIST_SQL).bind(MAX_TRACKS).all();
  const cacheControl = `public, max-age=${LIST_CACHE_SECONDS}`;
  const body = { lyrics: results };
  ctx.waitUntil(keep(cacheKey, body, cacheControl));
  return reply(200, body, { ...cors, "Cache-Control": cacheControl });
}

/** One song's lyrics. Asked for with the current `v`, the answer can be kept for good. */
async function readOne(env, ctx, cors, id, version, cacheKey) {
  const row = await env.DB.prepare(READ_SQL).bind(id).first();
  if (!row) return reply(404, { error: "No lyrics for that track" }, cors);
  const seconds = version === String(row.updatedAt) ? VERSIONED_CACHE_SECONDS : UNVERSIONED_CACHE_SECONDS;
  const cacheControl = `public, max-age=${seconds}`;
  const body = { id, updatedAt: row.updatedAt, lyrics: JSON.parse(row.body) };
  ctx.waitUntil(keep(cacheKey, body, cacheControl));
  return reply(200, body, { ...cors, "Cache-Control": cacheControl });
}

/** Stores an answer at the edge under its own key (no CORS headers: reply() adds the asker's). */
function keep(cacheKey, body, cacheControl) {
  return caches.default.put(cacheKey, new Response(JSON.stringify(body), {
    headers: { "Content-Type": JSON_TYPE, "Cache-Control": cacheControl },
  }));
}

/**
 * The lyrics in a PUT body, rebuilt from only the parts the player uses.
 * @param {Request} request
 * @returns {Promise<{ v: number, lines: { w: [number, string][], e: number }[] } | null>} null when they are not lyrics
 */
async function readLyrics(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  const text = await readBoundedBody(request, MAX_BODY_BYTES);
  if (text === null) return null;
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const given = data && data.lyrics;
  if (!given || given.v !== FORMAT_VERSION || !Array.isArray(given.lines)) return null;
  if (!given.lines.length || given.lines.length > MAX_LINES) return null;
  const isTime = (value) => typeof value === "number" && value >= 0 && value <= MAX_SECONDS;
  const lines = [];
  for (const line of given.lines) {
    if (!line || !Array.isArray(line.w) || !line.w.length || line.w.length > MAX_WORDS_PER_LINE || !isTime(line.e)) return null;
    const words = [];
    for (const word of line.w) {
      if (!Array.isArray(word) || !isTime(word[0]) || typeof word[1] !== "string") return null;
      if (!word[1] || word[1].length > MAX_WORD_LENGTH) return null;
      words.push([word[0], word[1]]);
    }
    lines.push({ w: words, e: line.e });
  }
  return { v: FORMAT_VERSION, lines };
}
