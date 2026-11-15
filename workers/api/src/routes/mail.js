/** POST /mail: stores an address for the roughly yearly DOGS letter. */
import { reply, readBoundedBody, JSON_TYPE } from "../lib/http.js";
import { spendWrites } from "../lib/budget.js";
import { verifyTurnstile } from "../lib/turnstile.js";

const APP = "mail";
const TURNSTILE_ACTION = "mail";
const MAIL_WRITE_ROWS = 1;
const MAIL_DAILY_WRITE_CAP = 2500;
const MAX_BODY_BYTES = 4096;
const MAX_TOKEN_LENGTH = 2048;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
const INSERT_SQL = "INSERT OR IGNORE INTO mailing_list (email, created_at) VALUES (?1, ?2)";

export default {
  path: "/mail",
  /** Validates, verifies and reserves a bounded write; duplicates get the same response.
   * @param {Request} request
   * @param {object} env Worker bindings
   * @param {ExecutionContext} ctx
   * @param {{ip: string, ipKey: string, cors: object}} visitor
   */
  async handle(request, env, ctx, { ip, ipKey, cors }) {
    if (request.method !== "POST") return reply(405, { error: "Method not allowed" }, { ...cors, Allow: "POST, OPTIONS" });
    const { success } = await env.MAIL_LIMITER.limit({ key: ipKey });
    if (!success) return reply(429, { error: "Slow down" }, cors);
    const mail = await readMail(request);
    if (!mail) return reply(400, { error: "Bad request" }, cors);
    const human = await verifyTurnstile(env, mail.token, ip, TURNSTILE_ACTION);
    if (!human) return reply(403, { error: "Verification failed" }, cors);
    const funded = await spendWrites(env, APP, MAIL_WRITE_ROWS, MAIL_DAILY_WRITE_CAP);
    if (!funded) return reply(503, { error: "Please try again tomorrow" }, cors);
    await env.DB.prepare(INSERT_SQL).bind(mail.email, Date.now()).run();
    return reply(200, { subscribed: true }, cors);
  },
};

/** @returns {Promise<{email: string, token: string}|null>} normalized, bounded signup or null */
async function readMail(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return null;
  const body = await readBoundedBody(request, MAX_BODY_BYTES);
  if (body === null) return null;
  let data;
  try { data = JSON.parse(body); } catch { return null; }
  if (!data || typeof data.email !== "string") return null;
  const email = data.email.trim().toLowerCase();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) return null;
  if (typeof data.token !== "string" || !data.token || data.token.length > MAX_TOKEN_LENGTH) return null;
  return { email, token: data.token };
}
