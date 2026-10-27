/**
 * likeClient.js
 * Talks to the likes Worker (workers/api) for LikeButton.svelte.
 *
 * Requests are kept rare for Cloudflare's free tier: the count is remembered
 * in localStorage for COUNT_TTL_MS, and a browser that already liked never
 * posts again. No accounts: the Worker dedupes on a fingerprint hash of
 * stable browser traits, so clearing storage does not grant a second like.
 *
 * XHR rather than fetch so Chrome 40 can like DOGS too. Hashing is a plain JS
 * hash because crypto.subtle is missing on the LAN dev origin (not a secure
 * context); the Worker re-hashes it with a secret salt anyway.
 */

const LIKES_URL = import.meta.env.DEV ? "/api/likes" : "https://api.wearedogs.net/likes";
const STORAGE_KEY = "wad-likes";
const COUNT_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;
const HASH_SEEDS = [0x9e3779b1, 0x85ebca6b];
const HASH_HEX_LENGTH = 14;
const CANVAS_WIDTH = 220;
const CANVAS_HEIGHT = 40;
const CANVAS_TEXT = "WEAREDOGS bark \u{1F415} 2026";
const CANVAS_FONT = "16px Arial, sans-serif";
const CANVAS_INK = "#f60";
const CANVAS_WASH = "rgba(102, 204, 0, 0.7)";
const CANVAS_BLOCK = [100, 1, 62, 20]; // x, y, w, h of the ink block under the text
const CANVAS_TEXT_AT = [4, 12];
// Browser updates bump version numbers; dropping digits keeps the print stable
const VERSION_DIGITS = /[\d._]+/g;

/** @typedef {{ count: number|null, at: number, liked: boolean }} LikeCache */

/** @returns {LikeCache} */
export function readCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) return saved;
  } catch {
    // Storage disabled (private mode) or corrupt: fall through to empty
  }
  return { count: null, at: 0, liked: false };
}

function writeCache(patch) {
  const next = { ...readCache(), ...patch, at: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Not persisted; the Worker still dedupes on the fingerprint
  }
  return next;
}

/** @returns {Promise<number>} the like count, from cache while it is fresh */
export function loadCount() {
  const cache = readCache();
  if (cache.count !== null && Date.now() - cache.at < COUNT_TTL_MS) return Promise.resolve(cache.count);
  return request("GET").then((data) => writeCache({ count: data.count }).count);
}

/** @returns {Promise<number>} the count after this browser's like */
export function sendLike() {
  return request("POST", { fp: fingerprint() }).then((data) => writeCache({ count: data.count, liked: true }).count);
}

/**
 * @param {"GET"|"POST"} method
 * @param {object} [body]
 * @returns {Promise<{count: number}>}
 */
function request(method, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, LIKES_URL);
    xhr.timeout = REQUEST_TIMEOUT_MS;
    xhr.onload = () => {
      if (xhr.status !== 200) return reject(new Error(`Likes ${xhr.status}`));
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (err) {
        reject(err);
      }
    };
    xhr.onerror = xhr.ontimeout = () => reject(new Error("Likes unreachable"));
    if (!body) return xhr.send();
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(body));
  });
}

/** Stable-ish browser traits, hashed to hex. Nothing here leaves the page unhashed. */
function fingerprint() {
  const nav = navigator;
  const screenInfo = window.screen || {};
  // Phones swap width and height on rotation
  const sides = [screenInfo.width, screenInfo.height].sort((a, b) => a - b);
  let timeZone = "";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    // Pre-Intl browsers
  }
  const traits = [
    (nav.userAgent || "").replace(VERSION_DIGITS, ""),
    nav.language,
    (nav.languages || []).join(","),
    nav.platform,
    nav.hardwareConcurrency,
    nav.deviceMemory,
    nav.maxTouchPoints,
    sides.join("x"),
    screenInfo.colorDepth,
    timeZone,
    canvasPrint(),
  ].join("|");
  return HASH_SEEDS.map((seed) => cyrb53(traits, seed).toString(16).padStart(HASH_HEX_LENGTH, "0")).join("");
}

/** GPU, font and anti-aliasing differences make the same drawing render slightly differently per device. */
function canvasPrint() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "top";
    ctx.font = CANVAS_FONT;
    ctx.fillStyle = CANVAS_INK;
    ctx.fillRect(CANVAS_BLOCK[0], CANVAS_BLOCK[1], CANVAS_BLOCK[2], CANVAS_BLOCK[3]);
    ctx.fillStyle = CANVAS_WASH;
    ctx.fillText(CANVAS_TEXT, CANVAS_TEXT_AT[0], CANVAS_TEXT_AT[1]);
    return canvas.toDataURL();
  } catch {
    return "";
  }
}

/** cyrb53: small, fast 53-bit string hash with good spread. */
function cyrb53(str, seed) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
