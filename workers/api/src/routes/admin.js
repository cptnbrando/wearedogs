/**
 * /admin: the owner signs in with their key (lib/admin.js). The site's Settings app talks to this.
 *
 *   GET  /admin/session                        -> { admin, enrolled }   (with the session token, if any)
 *   POST /admin/challenge                      -> { challenge }
 *   POST /admin/login { challenge, signature } -> { token, expires }
 *
 * There is no way to register a key from here. The owner's key is made on
 * the owner's own computer and its public half is put in the database from
 * there (scripts/owner-key.js). The only way in is a signature from that key,
 * which cannot be guessed. Bad signatures are still counted, and everyone is
 * stopped for the hour after MAX_FAILS_PER_HOUR.
 */
import { reply, readBoundedBody, JSON_TYPE } from "../lib/http.js";
import { ADMIN_CORS, registeredKey, newChallenge, challengeSigned, issueSession, isAdmin } from "../lib/admin.js";

const MAX_BODY_BYTES = 4096;
const MAX_FAILS_PER_HOUR = 10;
const FAILS_PREFIX = "admin-fails:";
/** "2026-11-25T14": the hour a failed try is counted in. */
const HOUR_STAMP_LENGTH = 13;
const DAY_STAMP_LENGTH = 10;
const READ_FAILS_SQL = "SELECT value FROM counters WHERE name = ?1";
const COUNT_FAIL_SQL = "INSERT INTO counters (name, value) VALUES (?1, 1) ON CONFLICT(name) DO UPDATE SET value = value + 1";
const DELETE_OLD_FAILS_SQL = "DELETE FROM counters WHERE name LIKE 'admin-fails:%' AND name < ?1";
const LOCKED_MESSAGE = "Too many failed tries. Try again next hour.";
const NOT_SET_UP = "No key is registered.";

export default {
  path: "/admin",
  cors: ADMIN_CORS,

  /**
   * @param {Request} request
   * @param {object} env
   * @param {ExecutionContext} ctx
   * @param {{ ipKey: string, cors: object, url: URL }} visitor
   */
  async handle(request, env, ctx, { ipKey, cors, url }) {
    if (!env.HASH_SALT) return reply(500, { error: "Not configured" }, cors);
    const { success } = await env.ADMIN_LIMITER.limit({ key: ipKey });
    if (!success) return reply(429, { error: "Slow down" }, cors);

    const action = url.pathname.split("/")[2];
    const publicKey = await registeredKey(env);
    if (action === "session" && request.method === "GET") {
      return reply(200, { admin: await isAdmin(request, env), enrolled: !!publicKey }, cors);
    }
    if (request.method !== "POST" || (action !== "challenge" && action !== "login")) return reply(404, { error: "Not found" }, cors);
    if (!publicKey) return reply(409, { error: NOT_SET_UP }, cors);
    if (action === "challenge") return reply(200, { challenge: await newChallenge(env) }, cors);

    const data = await readJson(request);
    if (!data) return reply(400, { error: "Bad request" }, cors);
    const name = FAILS_PREFIX + new Date().toISOString().slice(0, HOUR_STAMP_LENGTH);
    const fails = await env.DB.prepare(READ_FAILS_SQL).bind(name).first();
    if (fails && fails.value >= MAX_FAILS_PER_HOUR) return reply(429, { error: LOCKED_MESSAGE }, cors);
    if (!(await challengeSigned(env, publicKey, data.challenge, data.signature))) {
      await env.DB.prepare(COUNT_FAIL_SQL).bind(name).run();
      return reply(401, { error: "That key was not accepted." }, cors);
    }
    return reply(200, await issueSession(env, publicKey), cors);
  },

  /** Hourly: yesterday's failed-try tallies are of no use. */
  async scheduled(env) {
    await env.DB.prepare(DELETE_OLD_FAILS_SQL).bind(FAILS_PREFIX + new Date().toISOString().slice(0, DAY_STAMP_LENGTH)).run();
  },
};

/** @returns {Promise<any>} the parsed JSON body, or null */
async function readJson(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  const body = await readBoundedBody(request, MAX_BODY_BYTES);
  if (body === null) return null;
  try {
    const data = JSON.parse(body);
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}
