/**
 * fingerprintClient.js
 * Talks to the /fingerprint route of the API Worker (workers/api/src/routes/fingerprint.js).
 * Called only after consent. Each site calls the API on its own domain, so the
 * Worker's HttpOnly cookie travels as a same-site credential.
 *
 * XHR rather than fetch so Chrome 40 can reach the API too.
 */

import { getTurnstileToken } from "../../turnstileToken.js";

const API_BY_SITE = { "dogs.red": "https://api.dogs.red", "wearedogs.pages.dev": "https://api.dogs.red" };
const DEFAULT_API = "https://api.wearedogs.net";
const API_URL = import.meta.env.DEV ? "/api/fingerprint" : `${API_BY_SITE[location.hostname] || DEFAULT_API}/fingerprint`;
const NETWORK_URL = `${API_URL}/network`;
const TURNSTILE_ACTION = "fingerprint";
const LOCAL_ID_KEY = "wad-fp-id";
const ID_BYTES = 16;
const HEX_RADIX = 16;
const BYTE_LIMIT = 256;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * @param {"GET"|"POST"|"DELETE"} method
 * @param {string} url
 * @param {object} [body]
 * @returns {Promise<object>} the parsed JSON reply
 */
function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.timeout = REQUEST_TIMEOUT_MS;
    // The Worker's cookie only travels with credentials
    xhr.withCredentials = true;
    xhr.onload = () => {
      if (xhr.status !== 200) return reject(new Error(`Fingerprint ${xhr.status}`));
      try {
        const data = JSON.parse(xhr.responseText);
        if (!data || typeof data !== "object") return reject(new Error("Invalid reply"));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    xhr.onerror = xhr.ontimeout = () => reject(new Error("Fingerprint unreachable"));
    if (!body) return xhr.send();
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(body));
  });
}

/** @returns {Promise<{ ip: string, ipVersion: number, cf: object, headers: object, cookiePresent: boolean }>} */
export function fetchNetwork() {
  return request("GET", NETWORK_URL);
}

/**
 * Sends the consented profile: the local ID and per-signal hashes, never raw values.
 * @param {Object<string, string>} signals hex hashes keyed like SERVER_SIGNAL_KEYS
 * @returns {Promise<object>} the Worker's match result
 */
export function sendProfile(signals) {
  return getTurnstileToken(TURNSTILE_ACTION).then((token) => request("POST", API_URL, { id: localId(true), signals, token }));
}

/**
 * Deletes the server record, expires the cookie and drops the local ID. The
 * local ID goes even when the server can't be reached. The server is always
 * asked: its HttpOnly cookie may outlive the local ID, and only it can expire it.
 * @returns {Promise<number>} records the server deleted
 */
export function forgetMe() {
  const id = localId(false);
  dropLocalId();
  return getTurnstileToken(TURNSTILE_ACTION)
    .then((token) => request("DELETE", API_URL, id ? { id, token } : { token }))
    .then((data) => Number(data.forgotten) || 0);
}

/** @returns {boolean} whether an earlier run left its ID in this browser */
export function hasLocalId() {
  return Boolean(localId(false));
}

/**
 * @param {boolean} create make and save one when none is stored
 * @returns {string} 32 hex characters, or "" when none is stored and create is false
 */
function localId(create) {
  try {
    const saved = localStorage.getItem(LOCAL_ID_KEY);
    if (saved) return saved;
  } catch {
    // Storage blocked: a fresh ID each time
  }
  if (!create) return "";
  const id = randomHex();
  try {
    localStorage.setItem(LOCAL_ID_KEY, id);
  } catch {
    // Not persisted; the cookie and signals still recognise the device
  }
  return id;
}

function dropLocalId() {
  try {
    localStorage.removeItem(LOCAL_ID_KEY);
  } catch {
    // Nothing stored
  }
}

function randomHex() {
  const bytes = new Uint8Array(ID_BYTES);
  const cryptoApi = window.crypto || window.msCrypto;
  if (cryptoApi && cryptoApi.getRandomValues) cryptoApi.getRandomValues(bytes);
  else for (let i = 0; i < ID_BYTES; i++) bytes[i] = Math.floor(Math.random() * BYTE_LIMIT);
  return Array.prototype.map.call(bytes, (b) => (b < HEX_RADIX ? "0" : "") + b.toString(HEX_RADIX)).join("");
}
