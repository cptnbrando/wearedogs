/** XHR mailing-list client; no fetch dependency on Chrome 40. */
import { getTurnstileToken } from "./turnstileToken.js";

const API_BY_SITE = { "dogs.red": "https://api.dogs.red", "wearedogs.pages.dev": "https://api.dogs.red" };
const DEFAULT_API = "https://api.wearedogs.net";
const MAIL_URL = import.meta.env.DEV ? "/api/mail" : (API_BY_SITE[location.hostname] || DEFAULT_API) + "/mail";
const STORAGE_KEY = "wad-mail-joined";
const JOINED_VALUE = "yes";
const REQUEST_TIMEOUT_MS = 10000;
const TURNSTILE_ACTION = "mail";
const ERROR_MESSAGE = "couldn't join. please try again.";
const RATE_MESSAGE = "too many tries. wait a minute.";
const REST_MESSAGE = "please try again tomorrow.";

/** @returns {boolean} remembers signup without keeping the address in the browser */
export function hasJoined() {
  try { return localStorage.getItem(STORAGE_KEY) === JOINED_VALUE; }
  catch { return false; }
}

/** @param {string} email address to normalize and submit
 * @returns {Promise<void>} resolves after the Worker confirms storage
 */
export function joinMailingList(email) {
  return getTurnstileToken(TURNSTILE_ACTION)
    .catch(() => { throw new Error(ERROR_MESSAGE); })
    .then((token) => new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", MAIL_URL);
      xhr.timeout = REQUEST_TIMEOUT_MS;
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = () => {
        if (xhr.status !== 200) return reject(new Error(xhr.status === 429 ? RATE_MESSAGE : xhr.status === 503 ? REST_MESSAGE : ERROR_MESSAGE));
        try {
          if (JSON.parse(xhr.responseText).subscribed !== true) return reject(new Error(ERROR_MESSAGE));
        } catch { return reject(new Error(ERROR_MESSAGE)); }
        try { localStorage.setItem(STORAGE_KEY, JOINED_VALUE); } catch { /* Storage is optional. */ }
        resolve();
      };
      xhr.onerror = xhr.ontimeout = () => reject(new Error(ERROR_MESSAGE));
      xhr.send(JSON.stringify({ email: email.trim().toLowerCase(), token }));
    }));
}
