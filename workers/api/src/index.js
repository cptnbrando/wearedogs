/**
 * wearedogs-api: the like counter on the DOGS info page.
 *
 *   GET  /likes                  -> { count }
 *   POST /likes  { fp: "<hex>" } -> { count, liked: true }
 *
 * No accounts. Each like is keyed on a salted hash of the browser fingerprint
 * (one like per fingerprint), and each IP (IPv6 by /64) is capped at
 * MAX_LIKES_PER_IP. Every request needs an allowed Origin, a browser-like
 * User-Agent and a pass from the per-IP rate limiter. A daily attempt cap
 * hard-stops writes before D1's free tier runs out, and the count is
 * edge-cached so reads hardly touch D1.
 */

const LIKES_PATH = "/likes";
const COUNTER_NAME = "likes";
const ATTEMPTS_PREFIX = "attempts:";
// Households and phone carriers share one public IP, so allow a few per IP
const MAX_LIKES_PER_IP = 3;
// Each attempt writes about 4 D1 rows (attempts counter, like row, its index, like total).
// 15k attempts = 60k rows, well below the free tier's 100k rows/day.
const DAILY_LIKE_ATTEMPT_CAP = 15000;
// One D1 read per colo per minute at most, whatever the traffic
const COUNT_CACHE_SECONDS = 60;
const COUNT_CACHE_KEY = "https://api.wearedogs.net/likes/count";
const PREFLIGHT_MAX_AGE_SECONDS = 7200;
const MAX_BODY_BYTES = 256;
const FINGERPRINT_PATTERN = /^[0-9a-f]{16,64}$/;
const HASH_HEX_LENGTH = 32;
const IPV6_GROUPS = 8;
const IPV6_PREFIX_GROUPS = 4;
const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|curl|wget|python|httpclient|okhttp|scrapy|headless|phantom|go-http|java\//i;
const JSON_TYPE = "application/json";
const RESTING_MESSAGE = "Likes are resting until tomorrow";

export default {
  /**
   * @param {Request} request
   * @param {{ DB: D1Database, LIKE_LIMITER: RateLimit, READ_LIMITER: RateLimit, ALLOWED_ORIGINS: string, HASH_SALT: string }} env
   * @param {ExecutionContext} ctx
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== LIKES_PATH) return reply(404, { error: "Not found" });

    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = (env.ALLOWED_ORIGINS || "").split(",");
    if (!allowedOrigins.includes(origin)) return reply(403, { error: "Forbidden" });

    const cors = corsHeaders(origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const userAgent = request.headers.get("User-Agent") || "";
    if (!userAgent || BOT_UA_PATTERN.test(userAgent)) return reply(403, { error: "Forbidden" }, cors);

    const ip = ipKey(request.headers.get("CF-Connecting-IP") || "");
    if (request.method === "GET") return readCount(env, ctx, ip, cors);
    if (request.method === "POST") return addLike(request, env, ctx, ip, cors);
    return reply(405, { error: "Method not allowed" }, { ...cors, Allow: "GET, POST, OPTIONS" });
  },
};

/** Serves the like count, from the edge cache whenever possible. */
async function readCount(env, ctx, ip, cors) {
  const { success } = await env.READ_LIMITER.limit({ key: ip });
  if (!success) return reply(429, { error: "Slow down" }, cors);

  const headers = { ...cors, "Cache-Control": `public, max-age=${COUNT_CACHE_SECONDS}` };
  const cached = await caches.default.match(COUNT_CACHE_KEY);
  if (cached) return reply(200, await cached.json(), headers);

  const row = await env.DB.prepare("SELECT value FROM counters WHERE name = ?1").bind(COUNTER_NAME).first();
  const count = row ? row.value : 0;
  ctx.waitUntil(cacheCount(count));
  return reply(200, { count }, headers);
}

/** Records one like per fingerprint, within the per-IP and daily caps. */
async function addLike(request, env, ctx, ip, cors) {
  if (!env.HASH_SALT) return reply(500, { error: "Not configured" }, cors);

  const { success } = await env.LIKE_LIMITER.limit({ key: ip });
  if (!success) return reply(429, { error: "Slow down" }, cors);

  const fp = await readFingerprint(request);
  if (!fp) return reply(400, { error: "Bad request" }, cors);

  // Today's attempts share the counters table with the like total
  const attemptsKey = ATTEMPTS_PREFIX + new Date().toISOString().slice(0, 10);
  const budget = await env.DB.prepare(
    `INSERT INTO counters (name, value) VALUES (?1, 1)
     ON CONFLICT (name) DO UPDATE SET value = value + 1 WHERE value < ?2
     RETURNING value`,
  )
    .bind(attemptsKey, DAILY_LIKE_ATTEMPT_CAP)
    .first();
  if (!budget) return reply(503, { error: RESTING_MESSAGE }, cors);

  const [fpHash, ipHash] = await Promise.all([hash(env.HASH_SALT, "fp", fp), hash(env.HASH_SALT, "ip", ip)]);
  // A repeat fingerprint or a full IP inserts nothing; either way the visitor
  // sees their like, and a bot learns nothing about which filter stopped it.
  const [, counter] = await env.DB.batch([
    env.DB.prepare(
      `INSERT OR IGNORE INTO likes (fp_hash, ip_hash, created_at)
       SELECT ?1, ?2, ?3 WHERE (SELECT COUNT(*) FROM likes WHERE ip_hash = ?2) < ?4`,
    ).bind(fpHash, ipHash, Date.now(), MAX_LIKES_PER_IP),
    env.DB.prepare("SELECT value FROM counters WHERE name = ?1").bind(COUNTER_NAME),
  ]);
  const count = counter.results.length ? counter.results[0].value : 0;
  ctx.waitUntil(cacheCount(count));
  return reply(200, { count, liked: true }, cors);
}

/** @returns {Promise<string|null>} the fingerprint, or null for any malformed body */
async function readFingerprint(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return null;

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return null;
  try {
    const { fp } = JSON.parse(body);
    return typeof fp === "string" && FINGERPRINT_PATTERN.test(fp) ? fp : null;
  } catch {
    return null;
  }
}

/** Collapses IPv6 to its /64: one subscriber owns the whole block. */
function ipKey(ip) {
  if (!ip.includes(":")) return ip;
  const [head, tail] = ip.split("::");
  const headGroups = head ? head.split(":") : [];
  const tailGroups = tail ? tail.split(":") : [];
  const fill = tail === undefined ? [] : Array(IPV6_GROUPS - headGroups.length - tailGroups.length).fill("0");
  return [...headGroups, ...fill, ...tailGroups].slice(0, IPV6_PREFIX_GROUPS).join(":") + "::/64";
}

async function hash(salt, kind, value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${kind}:${value}`));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, HASH_HEX_LENGTH);
}

function cacheCount(count) {
  const response = new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": JSON_TYPE, "Cache-Control": `max-age=${COUNT_CACHE_SECONDS}` },
  });
  return caches.default.put(COUNT_CACHE_KEY, response);
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": String(PREFLIGHT_MAX_AGE_SECONDS),
    Vary: "Origin",
  };
}

function reply(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": JSON_TYPE,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}
