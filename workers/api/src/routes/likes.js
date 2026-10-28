/**
 * /likes: the DOGS like counter (src/components/LikeButton.svelte).
 *
 *   GET  /likes -> { count }
 *   POST /likes { id, signals, token } -> { count, liked: true }
 *
 * No accounts. A repeat browser ID is blocked globally; otherwise a like can
 * be treated as a repeat when it comes from the same IP (/64 for IPv6) as a
 * recent like and enough device signals match. These are best-effort abuse
 * checks, not a one-person-one-vote guarantee. Turnstile and rate limits make
 * automated abuse harder. The count is shared by every site the Worker serves.
 */

import { reply, JSON_TYPE } from "../lib/http.js";
import { hash } from "../lib/hash.js";
import { spendWrites } from "../lib/budget.js";
import { verifyTurnstile } from "../lib/turnstile.js";

const APP = "likes";
const COUNTER_NAME = "likes";
// Same order and names as src/components/deviceSignals.js. Stored as a
// comma-joined list in this order, so only ever append.
const SIGNAL_KEYS = ["ua", "platform", "lang", "tz", "screen", "hardware", "webgl", "canvas", "audio"];
// What a device can't change by going incognito or updating: all must match.
// Brave, Firefox and Safari scramble canvas/audio, so those are never required.
const REQUIRED_SIGNALS = ["ua", "platform", "screen", "hardware"];
const REQUIRED_SIGNAL_INDEXES = REQUIRED_SIGNALS.map((key) => SIGNAL_KEYS.indexOf(key));
const MIN_MATCHING_SIGNALS = 6;
// Recent likes compared per IP. Bounds D1 reads on big shared IPs (~100 rows a like).
const MAX_IP_COMPARE = 100;
const SIGNAL_HASH_LENGTH = 12;
// Like row, each secondary-index entry, and the counter row changed by the trigger
const LIKE_WRITE_ROWS = 4;
// Includes the budget counter updates; actual new likes are fewer after index writes.
const LIKES_DAILY_WRITE_CAP = 25000;
const TURNSTILE_ACTION = "like";
const COUNT_CACHE_SECONDS = 60;
const MAX_BODY_BYTES = 4096;
const MAX_TOKEN_LENGTH = 2048;
const DEVICE_ID_PATTERN = /^[0-9a-f]{32}$/;
const SIGNAL_PATTERN = /^[0-9a-f]{1,16}$/;
const RESTING_MESSAGE = "Likes are resting until tomorrow";
const COUNT_SQL = "SELECT value FROM counters WHERE name = ?1";
// Fingerprint records are deleted after this long, as public/privacy.html
// promises; the device can then like again. Same value as LIKE_MEMORY_DAYS in
// src/components/likeClient.js. The count never goes down.
const RETENTION_DAYS = 20;
const DAY_MS = 24 * 60 * 60 * 1000;
// Cleanup capacity exceeds the maximum new likes allowed by LIKES_DAILY_WRITE_CAP.
const PRUNE_BATCH = 4500;
// Deleting a like removes its row and both secondary-index entries.
const PRUNE_ROWS_PER_LIKE = 3;
const COUNT_EXPIRED_SQL = "SELECT COUNT(*) AS count FROM likes WHERE created_at < ?1";
const DELETE_EXPIRED_SQL =
  "DELETE FROM likes WHERE device_hash IN (SELECT device_hash FROM likes WHERE created_at < ?1 ORDER BY created_at ASC LIMIT ?2)";

export default {
  path: "/likes",

  /**
   * @param {Request} request
   * @param {object} env
   * @param {ExecutionContext} ctx
   * @param {{ ip: string, ipKey: string, cors: object, url: URL }} visitor
   */
  handle(request, env, ctx, visitor) {
    if (request.method === "GET") return readCount(env, ctx, visitor);
    if (request.method === "POST") return addLike(request, env, ctx, visitor);
    return reply(405, { error: "Method not allowed" }, { ...visitor.cors, Allow: "GET, POST, OPTIONS" });
  },

  /**
   * Hourly: deletes fingerprint records (device, IP and signal hashes) older than
   * RETENTION_DAYS, after which that device can like again. Likes are forever:
   * the count lives in counters and is never decremented.
   * @param {{ DB: D1Database }} env
   */
  async scheduled(env) {
    const cutoff = Date.now() - RETENTION_DAYS * DAY_MS;
    const expired = await env.DB.prepare(COUNT_EXPIRED_SQL).bind(cutoff).first();
    const rows = Math.min(expired ? expired.count : 0, PRUNE_BATCH);
    if (!rows) return;

    const funded = await spendWrites(env, APP, rows * PRUNE_ROWS_PER_LIKE, Number.MAX_SAFE_INTEGER);
    if (!funded) return;

    await env.DB.prepare(DELETE_EXPIRED_SQL).bind(cutoff, rows).run();
  },
};

/** Serves the like count, from this zone's edge cache whenever possible. */
async function readCount(env, ctx, { ipKey, cors, url }) {
  const { success } = await env.READ_LIMITER.limit({ key: ipKey });
  if (!success) return reply(429, { error: "Slow down" }, cors);

  const headers = { ...cors, "Cache-Control": `public, max-age=${COUNT_CACHE_SECONDS}` };
  const cacheKey = `${url.origin}/likes/count`;
  const cached = await caches.default.match(cacheKey);
  if (cached) return reply(200, await cached.json(), headers);

  const row = await env.DB.prepare(COUNT_SQL).bind(COUNTER_NAME).first();
  const count = row ? row.value : 0;
  ctx.waitUntil(cacheCount(cacheKey, count));
  return reply(200, { count }, headers);
}

/** Records a like unless this device already liked from this IP. */
async function addLike(request, env, ctx, { ip, ipKey, cors, url }) {
  if (!env.HASH_SALT) return reply(500, { error: "Not configured" }, cors);

  const { success } = await env.LIKE_LIMITER.limit({ key: ipKey });
  if (!success) return reply(429, { error: "Slow down" }, cors);

  const like = await readLike(request);
  if (!like) return reply(400, { error: "Bad request" }, cors);

  const human = await verifyTurnstile(env, like.token, ip, TURNSTILE_ACTION);
  if (!human) return reply(403, { error: "Verification failed" }, cors);

  const salt = env.HASH_SALT;
  const [deviceHash, ipHash, ...signals] = await Promise.all([
    hash(salt, "device", like.id),
    hash(salt, "ip", ipKey),
    ...like.signals.map((value, i) => (value ? hash(salt, `sig:${SIGNAL_KEYS[i]}`, value, SIGNAL_HASH_LENGTH) : "")),
  ]);

  const [byId, byIp] = await env.DB.batch([
    env.DB.prepare("SELECT device_hash FROM likes WHERE device_hash = ?1 LIMIT 1").bind(deviceHash),
    env.DB.prepare("SELECT signals FROM likes WHERE ip_hash = ?1 ORDER BY created_at DESC LIMIT ?2").bind(
      ipHash,
      MAX_IP_COMPARE,
    ),
  ]);
  const duplicate =
    byId.results.length > 0 || byIp.results.some((row) => sameDevice(row.signals.split(","), signals));

  if (duplicate) return respondLiked(env, ctx, url, cors);

  const funded = await spendWrites(env, APP, LIKE_WRITE_ROWS, LIKES_DAILY_WRITE_CAP);
  if (!funded) return reply(503, { error: RESTING_MESSAGE }, cors);

  // A duplicate still sees its like: a bot learns nothing about why it didn't count
  const countQuery = env.DB.prepare(COUNT_SQL).bind(COUNTER_NAME);
  const insert = env.DB.prepare(
    "INSERT OR IGNORE INTO likes (device_hash, ip_hash, signals, created_at) VALUES (?1, ?2, ?3, ?4)",
  ).bind(deviceHash, ipHash, signals.join(","), Date.now());
  const outcome = await env.DB.batch([insert, countQuery]);
  const counter = outcome[1];
  const count = counter.results.length ? counter.results[0].value : 0;
  ctx.waitUntil(cacheCount(`${url.origin}/likes/count`, count));
  return reply(200, { count, liked: true }, cors);
}

/** Returns the existing count for a repeat without spending the D1 write budget. */
async function respondLiked(env, ctx, url, cors) {
  const row = await env.DB.prepare(COUNT_SQL).bind(COUNTER_NAME).first();
  const count = row ? row.value : 0;
  ctx.waitUntil(cacheCount(`${url.origin}/likes/count`, count));
  return reply(200, { count, liked: true }, cors);
}

/**
 * @returns {Promise<{ id: string, token: string, signals: string[] }|null>}
 *   the like, signals in SIGNAL_KEYS order ("" when missing), or null if malformed
 */
async function readLike(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return null;

  const body = await readBoundedBody(request);
  if (body === null) return null;
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return null;
  }
  if (!data || typeof data.id !== "string" || !DEVICE_ID_PATTERN.test(data.id)) return null;
  if (typeof data.token !== "string" || !data.token || data.token.length > MAX_TOKEN_LENGTH) return null;

  const raw = data.signals || {};
  const signals = SIGNAL_KEYS.map((key) => (typeof raw[key] === "string" && SIGNAL_PATTERN.test(raw[key]) ? raw[key] : ""));
  return { id: data.id, token: data.token, signals };
}

/** Reads no more than MAX_BODY_BYTES from an untrusted request stream. */
async function readBoundedBody(request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return new TextDecoder().decode(bytes);
}

/** True when every required signal and at least MIN_MATCHING_SIGNALS match. Missing signals never match. */
function sameDevice(stored, incoming) {
  const matches = incoming.map((value, i) => value !== "" && stored[i] === value);
  if (!REQUIRED_SIGNAL_INDEXES.every((i) => matches[i])) return false;
  return matches.filter(Boolean).length >= MIN_MATCHING_SIGNALS;
}

function cacheCount(cacheKey, count) {
  const response = new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": JSON_TYPE, "Cache-Control": `max-age=${COUNT_CACHE_SECONDS}` },
  });
  return caches.default.put(cacheKey, response);
}
