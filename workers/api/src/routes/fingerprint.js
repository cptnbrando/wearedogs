/**
 * /fingerprint: the Fingerprint toolbox app (src/components/apps/fingerprint),
 * the experimental groundwork for DOGS ID: recognising a device without a
 * sign-in page. Only ever called after the visitor accepts the app's consent banner.
 *
 *   GET    /fingerprint/network        -> what Cloudflare sees of the connection (display only, no D1)
 *   POST   /fingerprint { id, signals, token } -> { status, method, firstSeen, lastSeen, visits, ... }
 *   DELETE /fingerprint { id?, token }  -> { forgotten }  (by cookie, and by local ID when given)
 *
 * Recognition order: the HttpOnly cookie this route sets, then the page's
 * localStorage ID, then fuzzy matching of per-signal hashes against recent
 * records from the same network or with the same core device traits. Fuzzy
 * matching is best-effort: it can miss a device and can confuse identical ones.
 * Every identifier is stored as a salted hash (lib/hash.js).
 */

import { reply, readBoundedBody, JSON_TYPE } from "../lib/http.js";
import { hash } from "../lib/hash.js";
import { spendWrites } from "../lib/budget.js";
import { verifyTurnstile } from "../lib/turnstile.js";

const APP = "fingerprint";
const ROUTE_PATH = "/fingerprint";
const TURNSTILE_ACTION = "fingerprint";
const NETWORK_PATH = "/fingerprint/network";
const ROUTE_METHODS = "GET, POST, DELETE, OPTIONS";
// Same names and order as SERVER_SIGNAL_KEYS in src/components/apps/fingerprint/fingerprintEngine.js.
// Stored comma-joined in this order, so only ever append.
const SIGNAL_KEYS = [
  "ua", "platform", "lang", "tz", "screen", "hardware", "webgl", "canvas", "audio",
  "fonts", "math", "voices", "intl", "media", "features", "gpu",
];
// Traits incognito, cleared storage and browser updates leave alone: all must match
const REQUIRED_SIGNALS = ["ua", "platform", "screen", "hardware"];
const REQUIRED_SIGNAL_INDEXES = REQUIRED_SIGNALS.map((key) => SIGNAL_KEYS.indexOf(key));
// Brave, Firefox and Safari scramble canvas, audio and more, so a few misses are allowed
const MIN_MATCHING_SIGNALS = 12;
// The same network is extra evidence, so fewer signals have to agree
const MIN_MATCHING_SIGNALS_SAME_IP = 10;
// Recent records compared per bucket; bounds D1 reads on big shared IPs and common phones
const MAX_COMPARE = 50;
const SIGNAL_HASH_LENGTH = 12;

const COOKIE_NAME = "__Host-dogs_id";
const COOKIE_PATTERN = /(?:^|;\s*)__Host-dogs_id=([0-9a-f]{32})(?:;|$)/;
const ID_BYTES = 16;
const DAY_SECONDS = 24 * 60 * 60;
const DAY_MS = DAY_SECONDS * 1000;
// Records not seen for this long are deleted; each visit restarts the clock and the cookie's
const RETENTION_DAYS = 365;
const COOKIE_MAX_AGE_SECONDS = RETENTION_DAYS * DAY_SECONDS;

// Rows (and their four secondary-index entries) one profile insert or update may touch
const PROFILE_WRITE_ROWS = 10;
// Forget clears at most a cookie record and a local-ID record
const FORGET_WRITE_ROWS = 10;
const FINGERPRINT_DAILY_WRITE_CAP = 5000;
const PRUNE_BATCH = 500;
const PRUNE_ROWS_PER_RECORD = 5;

const MAX_BODY_BYTES = 4096;
const MAX_TOKEN_LENGTH = 2048;
const DEVICE_ID_PATTERN = /^[0-9a-f]{32}$/;
const SIGNAL_PATTERN = /^[0-9a-f]{1,16}$/;
// Request headers worth showing back: they identify the browser before any script runs
const ECHO_HEADERS = [
  "accept", "accept-language", "accept-encoding", "dnt", "sec-gpc", "save-data",
  "sec-ch-ua", "sec-ch-ua-mobile", "sec-ch-ua-platform",
];
// request.cf fields available on every plan
const CF_FIELDS = [
  "asn", "asOrganization", "colo", "continent", "country", "isEUCountry", "region", "regionCode", "city",
  "postalCode", "metroCode", "latitude", "longitude", "timezone", "httpProtocol", "tlsVersion", "tlsCipher",
  "clientTcpRtt", "clientAcceptEncoding", "requestPriority", "tlsClientHelloLength",
  "tlsClientCiphersSha1", "tlsClientExtensionsSha1",
];

const RECORD_COLUMNS = "cookie_hash, local_hash, ip_hash, signals, first_seen, last_seen, visits";
const BY_COOKIE_SQL = `SELECT ${RECORD_COLUMNS} FROM fingerprints WHERE cookie_hash = ?1`;
const BY_LOCAL_SQL = `SELECT ${RECORD_COLUMNS} FROM fingerprints WHERE local_hash = ?1 ORDER BY last_seen DESC LIMIT 1`;
const BY_IP_SQL = `SELECT ${RECORD_COLUMNS} FROM fingerprints WHERE ip_hash = ?1 ORDER BY last_seen DESC LIMIT ?2`;
const BY_CORE_SQL = `SELECT ${RECORD_COLUMNS} FROM fingerprints WHERE core_hash = ?1 ORDER BY last_seen DESC LIMIT ?2`;
const INSERT_SQL = `INSERT OR IGNORE INTO fingerprints
  (cookie_hash, local_hash, ip_hash, core_hash, signals, first_seen, last_seen, visits)
  VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6, 1)`;
const UPDATE_SQL = `UPDATE fingerprints
  SET cookie_hash = ?1, local_hash = ?2, ip_hash = ?3, core_hash = ?4, signals = ?5, last_seen = ?6, visits = visits + 1
  WHERE cookie_hash = ?7`;
const DELETE_BY_COOKIE_SQL = "DELETE FROM fingerprints WHERE cookie_hash = ?1";
const DELETE_BY_LOCAL_SQL = "DELETE FROM fingerprints WHERE local_hash = ?1";
const COUNT_EXPIRED_SQL = "SELECT COUNT(*) AS count FROM fingerprints WHERE last_seen < ?1";
const DELETE_EXPIRED_SQL =
  "DELETE FROM fingerprints WHERE cookie_hash IN (SELECT cookie_hash FROM fingerprints WHERE last_seen < ?1 ORDER BY last_seen ASC LIMIT ?2)";

export default {
  path: ROUTE_PATH,
  // Read by index.js: the cookie needs credentialed CORS, and forget uses DELETE
  cors: { methods: ROUTE_METHODS, credentials: true },

  /**
   * @param {Request} request
   * @param {object} env
   * @param {ExecutionContext} ctx
   * @param {{ ip: string, ipKey: string, cors: object, url: URL }} visitor
   */
  async handle(request, env, ctx, visitor) {
    const { cors, url } = visitor;
    const { success } = await env.FINGERPRINT_LIMITER.limit({ key: visitor.ipKey });
    if (!success) return reply(429, { error: "Slow down" }, cors);

    if (url.pathname === NETWORK_PATH) {
      if (request.method !== "GET") return reply(405, { error: "Method not allowed" }, { ...cors, Allow: "GET, OPTIONS" });
      return reply(200, describeNetwork(request, visitor.ip), cors);
    }
    if (url.pathname !== ROUTE_PATH) return reply(404, { error: "Not found" }, cors);
    if (request.method === "POST") return saveProfile(request, env, visitor);
    if (request.method === "DELETE") return forget(request, env, visitor);
    return reply(405, { error: "Method not allowed" }, { ...cors, Allow: ROUTE_METHODS });
  },

  /**
   * Hourly: deletes profiles not seen for RETENTION_DAYS.
   * @param {{ DB: D1Database }} env
   */
  async scheduled(env) {
    const cutoff = Date.now() - RETENTION_DAYS * DAY_MS;
    const expired = await env.DB.prepare(COUNT_EXPIRED_SQL).bind(cutoff).first();
    const rows = Math.min(expired ? expired.count : 0, PRUNE_BATCH);
    if (!rows) return;

    const funded = await spendWrites(env, APP, rows * PRUNE_ROWS_PER_RECORD, Number.MAX_SAFE_INTEGER);
    if (!funded) return;

    await env.DB.prepare(DELETE_EXPIRED_SQL).bind(cutoff, rows).run();
  },
};

/**
 * The connection as Cloudflare's edge saw it. Echoed back only; nothing is stored.
 * @param {Request} request
 * @param {string} ip
 */
function describeNetwork(request, ip) {
  const cf = request.cf || {};
  const edge = {};
  CF_FIELDS.forEach((field) => {
    if (cf[field] !== undefined && cf[field] !== "") edge[field] = cf[field];
  });
  const headers = {};
  ECHO_HEADERS.forEach((name) => {
    const value = request.headers.get(name);
    if (value) headers[name] = value;
  });
  return {
    ip,
    ipVersion: ip.includes(":") ? 6 : 4,
    cf: edge,
    headers,
    cookiePresent: COOKIE_PATTERN.test(request.headers.get("Cookie") || ""),
  };
}

/** Matches the consented profile to an earlier one, then records this visit. */
async function saveProfile(request, env, { ip, ipKey, cors }) {
  if (!env.HASH_SALT) return reply(500, { error: "Not configured" }, cors);

  const profile = await readBody(request, true);
  if (!profile) return reply(400, { error: "Bad request" }, cors);

  const human = await verifyTurnstile(env, profile.token, ip, TURNSTILE_ACTION);
  if (!human) return reply(403, { error: "Verification failed" }, cors);

  const salt = env.HASH_SALT;
  const cookie = readCookie(request);
  const [cookieHash, localHash, ipHash, ...signals] = await Promise.all([
    cookie ? hash(salt, "fp:cookie", cookie) : "",
    hash(salt, "fp:local", profile.id),
    hash(salt, "fp:ip", ipKey),
    ...profile.signals.map((value, i) => (value ? hash(salt, `fp:${SIGNAL_KEYS[i]}`, value, SIGNAL_HASH_LENGTH) : "")),
  ]);
  const coreValues = REQUIRED_SIGNAL_INDEXES.map((i) => signals[i]);
  const coreHash = coreValues.every(Boolean) ? await hash(salt, "fp:core", coreValues.join(",")) : "";

  const lookups = [
    env.DB.prepare(BY_COOKIE_SQL).bind(cookieHash),
    env.DB.prepare(BY_LOCAL_SQL).bind(localHash),
    env.DB.prepare(BY_IP_SQL).bind(ipHash, MAX_COMPARE),
  ];
  // Without every core trait no record can fuzzy-match, so skip the bucket read
  if (coreHash) lookups.push(env.DB.prepare(BY_CORE_SQL).bind(coreHash, MAX_COMPARE));
  const [byCookie, byLocal, byIp, byCore] = await env.DB.batch(lookups);
  const candidates = byCore ? byIp.results.concat(byCore.results) : byIp.results;
  const match = findMatch(byCookie.results, byLocal.results, candidates, signals, ipHash);

  // A record found without its cookie gets a fresh one: only the cookie's hash was kept
  const nextCookie = match && match.method === "cookie" ? cookie : newId();
  const nextCookieHash = nextCookie === cookie ? cookieHash : await hash(salt, "fp:cookie", nextCookie);
  const now = Date.now();
  const joined = signals.join(",");
  const funded = await spendWrites(env, APP, PROFILE_WRITE_ROWS, FINGERPRINT_DAILY_WRITE_CAP);
  const headers = funded ? { ...cors, "Set-Cookie": cookieHeader(nextCookie, COOKIE_MAX_AGE_SECONDS) } : cors;
  if (!match) {
    if (funded) await env.DB.prepare(INSERT_SQL).bind(nextCookieHash, localHash, ipHash, coreHash, joined, now).run();
    return reply(200, { status: "new", method: null, firstSeen: now, lastSeen: null, visits: 1, saved: funded }, headers);
  }

  const { record } = match;
  if (funded) {
    await env.DB.prepare(UPDATE_SQL)
      .bind(nextCookieHash, localHash, ipHash, coreHash, joined, now, record.cookie_hash)
      .run();
  }
  return reply(200, {
    status: "returning",
    method: match.method,
    matched: match.matched,
    compared: match.compared,
    sameNetwork: record.ip_hash === ipHash,
    firstSeen: record.first_seen,
    lastSeen: record.last_seen,
    visits: record.visits + (funded ? 1 : 0),
    saved: funded,
  }, headers);
}

/**
 * Cookie first, then the local ID, then the best fuzzy signal match.
 * @param {object[]} byCookie
 * @param {object[]} byLocal
 * @param {object[]} candidates recent records sharing the IP or the core traits
 * @param {string[]} signals this visit's signal hashes in SIGNAL_KEYS order
 * @param {string} ipHash
 * @returns {{ method: string, record: object, matched?: string[], compared?: number }|null}
 */
function findMatch(byCookie, byLocal, candidates, signals, ipHash) {
  const compared = signals.filter(Boolean).length;
  const exact = (method, record) => ({ method, record, matched: matchingKeys(record.signals.split(","), signals), compared });
  if (byCookie.length) return exact("cookie", byCookie[0]);
  if (byLocal.length) return exact("local", byLocal[0]);

  let best = null;
  candidates.forEach((record) => {
    const stored = record.signals.split(",");
    if (!REQUIRED_SIGNAL_INDEXES.every((i) => signals[i] && stored[i] === signals[i])) return;
    const matched = matchingKeys(stored, signals);
    const needed = record.ip_hash === ipHash ? MIN_MATCHING_SIGNALS_SAME_IP : MIN_MATCHING_SIGNALS;
    if (matched.length < needed) return;
    if (best && best.matched.length >= matched.length) return;
    best = { method: "signals", record, matched, compared };
  });
  return best;
}

/** @returns {string[]} names of the signals present in both lists and equal. Missing signals never match. */
function matchingKeys(stored, incoming) {
  return SIGNAL_KEYS.filter((key, i) => incoming[i] !== "" && stored[i] === incoming[i]);
}

/** Deletes the records behind this browser's cookie and local ID, and expires the cookie. */
async function forget(request, env, { ip, cors }) {
  if (!env.HASH_SALT) return reply(500, { error: "Not configured" }, cors);

  const body = await readBody(request, false);
  if (!body) return reply(400, { error: "Bad request" }, cors);

  const human = await verifyTurnstile(env, body.token, ip, TURNSTILE_ACTION);
  if (!human) return reply(403, { error: "Verification failed" }, cors);

  const expired = { ...cors, "Set-Cookie": cookieHeader("", 0) };
  const salt = env.HASH_SALT;
  const cookie = readCookie(request);
  const [cookieHash, localHash] = await Promise.all([
    cookie ? hash(salt, "fp:cookie", cookie) : "",
    body.id ? hash(salt, "fp:local", body.id) : "",
  ]);
  const deletes = [];
  if (cookieHash) deletes.push(env.DB.prepare(DELETE_BY_COOKIE_SQL).bind(cookieHash));
  if (localHash) deletes.push(env.DB.prepare(DELETE_BY_LOCAL_SQL).bind(localHash));
  // Nothing to look up: no write budget spent
  if (!deletes.length) return reply(200, { forgotten: 0 }, expired);

  const funded = await spendWrites(env, APP, FORGET_WRITE_ROWS, FINGERPRINT_DAILY_WRITE_CAP);
  if (!funded) return reply(503, { error: "Please try again tomorrow" }, cors);

  const outcome = await env.DB.batch(deletes);
  const forgotten = outcome.reduce((total, result) => total + ((result.meta && result.meta.changes) || 0), 0);
  return reply(200, { forgotten }, expired);
}

/**
 * @param {Request} request
 * @param {boolean} withSignals a profile (id and signals required) rather than a forget (id optional)
 * @returns {Promise<{ id: string, token: string, signals: string[] }|null>} signals in SIGNAL_KEYS order, or null if malformed
 */
async function readBody(request, withSignals) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return null;

  const body = await readBoundedBody(request, MAX_BODY_BYTES);
  if (body === null) return null;
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return null;
  }
  if (!data || typeof data.token !== "string" || !data.token || data.token.length > MAX_TOKEN_LENGTH) return null;
  const validId = typeof data.id === "string" && DEVICE_ID_PATTERN.test(data.id);
  if (!withSignals) return data.id === undefined || validId ? { id: validId ? data.id : "", token: data.token, signals: [] } : null;
  if (!validId) return null;

  const raw = data.signals || {};
  const signals = SIGNAL_KEYS.map((key) => (typeof raw[key] === "string" && SIGNAL_PATTERN.test(raw[key]) ? raw[key] : ""));
  return { id: data.id, token: data.token, signals };
}

/** @returns {string} the cookie this route set earlier, or "" */
function readCookie(request) {
  const found = COOKIE_PATTERN.exec(request.headers.get("Cookie") || "");
  return found ? found[1] : "";
}

/** Host-only (__Host- forbids a Domain), so only this API host ever receives it. */
function cookieHeader(value, maxAge) {
  return `${COOKIE_NAME}=${value}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=Lax`;
}

/** @returns {string} 32 random hex characters */
function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(ID_BYTES));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
