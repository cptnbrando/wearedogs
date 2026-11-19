/**
 * POST /waitlist { email, site, token } -> { joined: true }
 *
 * The waitlist for each DOGS app that is not open yet: Castle, Money 24 and 40. Their landing
 * pages post here; the address is stored in D1 beside the site it signed up on, and nothing
 * else happens yet (no email is sent). Joining twice gives the same answer as joining once.
 */
import { reply, readBoundedBody, JSON_TYPE } from "../lib/http.js";
import { spendWrites } from "../lib/budget.js";
import { verifyTurnstile } from "../lib/turnstile.js";

const APP = "waitlist";
const TURNSTILE_ACTION = "waitlist";
// The apps with a waitlist. A new one is added here and to ALLOWED_ORIGINS and TURNSTILE_HOSTNAMES.
const SITES = ["castle", "money24", "40"];
const WAITLIST_WRITE_ROWS = 1;
const WAITLIST_DAILY_WRITE_CAP = 2500;
const MAX_BODY_BYTES = 4096;
const MAX_TOKEN_LENGTH = 2048;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
const INSERT_SQL = "INSERT OR IGNORE INTO waitlist (site, email, created_at) VALUES (?1, ?2, ?3)";

export default {
  path: "/waitlist",
  /** Validates, verifies and reserves a bounded write; duplicates get the same response.
   * @param {Request} request
   * @param {object} env Worker bindings
   * @param {ExecutionContext} ctx
   * @param {{ip: string, ipKey: string, cors: object}} visitor
   */
  async handle(request, env, ctx, { ip, ipKey, cors }) {
    if (request.method !== "POST") return reply(405, { error: "Method not allowed" }, { ...cors, Allow: "POST, OPTIONS" });
    // Shares the mailing list's limiter: both are a rare, one-row signup from one visitor.
    const { success } = await env.MAIL_LIMITER.limit({ key: ipKey });
    if (!success) return reply(429, { error: "Slow down" }, cors);
    const signup = await readSignup(request);
    if (!signup) return reply(400, { error: "Bad request" }, cors);
    const human = await verifyTurnstile(env, signup.token, ip, TURNSTILE_ACTION);
    if (!human) return reply(403, { error: "Verification failed" }, cors);
    const funded = await spendWrites(env, APP, WAITLIST_WRITE_ROWS, WAITLIST_DAILY_WRITE_CAP);
    if (!funded) return reply(503, { error: "Please try again tomorrow" }, cors);
    await env.DB.prepare(INSERT_SQL).bind(signup.site, signup.email, Date.now()).run();
    return reply(200, { joined: true }, cors);
  },
};

/** @returns {Promise<{email: string, site: string, token: string}|null>} normalized, bounded signup or null */
async function readSignup(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return null;
  const body = await readBoundedBody(request, MAX_BODY_BYTES);
  if (body === null) return null;
  let data;
  try { data = JSON.parse(body); } catch { return null; }
  if (!data || typeof data.email !== "string" || !SITES.includes(data.site)) return null;
  const email = data.email.trim().toLowerCase();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) return null;
  if (typeof data.token !== "string" || !data.token || data.token.length > MAX_TOKEN_LENGTH) return null;
  return { email, site: data.site, token: data.token };
}
