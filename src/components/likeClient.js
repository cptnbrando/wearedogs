/**
 * likeClient.js
 * Talks to the likes route of the API Worker (workers/api) for LikeButton.svelte.
 *
 * Requests are kept rare for Cloudflare's free tier: the count is remembered
 * in localStorage for COUNT_TTL_MS, and a browser that already liked never
 * posts again. No accounts: each like carries a random device ID, per-signal
 * device hashes (deviceSignals.js) and a Turnstile token (turnstileToken.js),
 * and the Worker drops repeats from the same device and IP.
 *
 * Each site calls the API on its own domain: same-site requests, and one
 * shared count behind both.
 *
 * XHR rather than fetch so Chrome 40 can reach the API too.
 */

import { collectSignals } from "./deviceSignals.js";
import { getTurnstileToken } from "./turnstileToken.js";

const API_BY_SITE = { "dogs.red": "https://api.dogs.red", "wearedogs.pages.dev": "https://api.dogs.red" };
const DEFAULT_API = "https://api.wearedogs.net";
const LIKES_URL = import.meta.env.DEV ? "/api/likes" : `${API_BY_SITE[location.hostname] || DEFAULT_API}/likes`;
const STORAGE_KEY = "wad-likes";
const DEVICE_KEY = "wad-device";
const DEVICE_ID_BYTES = 16;
const COUNT_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

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
    // Not persisted; the Worker still dedupes on the device signals
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
  return Promise.all([collectSignals(), getTurnstileToken()])
    .then(([signals, token]) => request("POST", { id: deviceId(), signals, token }))
    .then((data) => writeCache({ count: data.count, liked: true }).count);
}

/** A random ID kept per browser; a fresh one each time if storage is unavailable. */
function deviceId() {
  try {
    const saved = localStorage.getItem(DEVICE_KEY);
    if (saved) return saved;
  } catch {
    // Storage disabled: fall through to a fresh ID
  }
  const bytes = new Uint8Array(DEVICE_ID_BYTES);
  crypto.getRandomValues(bytes);
  const id = Array.prototype.map.call(bytes, (b) => (b < 16 ? "0" : "") + b.toString(16)).join("");
  try {
    localStorage.setItem(DEVICE_KEY, id);
  } catch {
    // Not persisted
  }
  return id;
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
