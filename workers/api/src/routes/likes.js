/**
 * /likes: the DOGS like counter (src/components/LikeButton.svelte).
 *
 *   GET  /likes -> { count }
 *   POST /likes { id, signals, token } -> { count, liked: true }
 *
 * No accounts. A like is a duplicate when it comes from the same IP (IPv6 by
 * /64) as an earlier like whose device signals nearly all match: the same
 * phone in incognito or after a browser update is caught, while different
 * devices sharing a household or carrier IP each count. Every POST must
 * carry a valid Turnstile token, so scripts can't mint likes. The count is
 * shared by every site the Worker serves.
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
// Rows one like writes: like row, its ip index entry, the counter (trigger)
const LIKE_WRITE_ROWS = 3;
// 25k rows = 5k likes a day, within the Worker-wide budget
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
// Likes forgotten per daily run, so one run can't blow the write budget
const PRUNE_BATCH = 1000;
// Deleting a like removes its row and its index entry
const PRUNE_ROWS_PER_LIKE = 2;

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
   * Daily: deletes fingerprint records (device, IP and signal hashes) older than
   * RETENTION_DAYS, after which that device can like again. Likes are forever:
   * the count lives in counters and is never decremented.
   * @param {{ DB: D1Database }} env
   */
  async scheduled(env) {
    const cutoff = Date.now() - RETENTION_DAYS * DAY_MS;
    const { meta } = await env.DB.prepare(
      "DELETE FROM likes WHERE device_hash IN (SELECT device_hash FROM likes WHERE created_at < ?1 LIMIT ?2)",
    )
      .bind(cutoff, PRUNE_BATCH)
      .run();
    // Recorded after the fact: at most PRUNE_BATCH * 2 rows, inside the budget's headroom
    if (meta.changes) await spendWrites(env, APP, meta.changes * PRUNE_ROWS_PER_LIKE, Number.MAX_SAFE_INTEGER);
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

  const funded = await spendWrites(env, APP, LIKE_WRITE_ROWS, LIKES_DAILY_WRITE_CAP);
  if (!funded) return reply(503, { error: RESTING_MESSAGE }, cors);

  const salt = env.HASH_SALT;
  const [deviceHash, ipHash, ...signals] = await Promise.all([
    hash(salt, "device", like.id),
    hash(salt, "ip", ipKey),
    ...like.signals.map((value, i) => (value ? hash(salt, `sig:${SIGNAL_KEYS[i]}`, value, SIGNAL_HASH_LENGTH) : "")),
  ]);

  const { results } = await env.DB.prepare(
    "SELECT signals FROM likes WHERE ip_hash = ?1 ORDER BY created_at DESC LIMIT ?2",
  )
    .bind(ipHash, MAX_IP_COMPARE)
    .all();
  const duplicate = results.some((row) => sameDevice(row.signals.split(","), signals));

  // A duplicate still sees its like: a bot learns nothing about why it didn't count
  const countQuery = env.DB.prepare(COUNT_SQL).bind(COUNTER_NAME);
  const insert = env.DB.prepare(
    "INSERT OR IGNORE INTO likes (device_hash, ip_hash, signals, created_at) VALUES (?1, ?2, ?3, ?4)",
  ).bind(deviceHash, ipHash, signals.join(","), Date.now());
  const outcome = await env.DB.batch(duplicate ? [countQuery] : [insert, countQuery]);
  const counter = outcome[outcome.length - 1];
  const count = counter.results.length ? counter.results[0].value : 0;
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

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return null;
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
