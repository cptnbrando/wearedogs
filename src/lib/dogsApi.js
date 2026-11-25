/**
 * dogsApi.js
 * One small way to call the API Worker (workers/api) for the routes that speak
 * JSON: /admin, /plays, /captions, /lyrics. Each site calls the API on its own
 * domain; the dev server proxies /api to a local Worker (vite.config.js).
 *
 * XHR rather than fetch so Chrome 40 can reach the API too.
 */

const API_BY_SITE = { "dogs.red": "https://api.dogs.red", "wearedogs.pages.dev": "https://api.dogs.red" };
const DEFAULT_API = "https://api.wearedogs.net";
const API_BASE = import.meta.env.DEV ? "/api" : API_BY_SITE[location.hostname] || DEFAULT_API;
const DEFAULT_TIMEOUT_MS = 15000;
const JSON_TYPE = "application/json";
const OFFLINE_MESSAGE = "Could not reach DOGS. Check the connection and try again.";

/**
 * @typedef {{ ok: boolean, status: number, data: any, error: string }} ApiAnswer
 * `error` is the Worker's own message when it gave one, ready to show.
 */

/**
 * Calls the API. Never rejects: a failure comes back as { ok: false }.
 * @param {string} method
 * @param {string} path - e.g. "/lyrics/demons"
 * @param {{ body?: any, token?: string, timeoutMs?: number }} [options] token: the owner's session (lib/admin.svelte.js)
 * @returns {Promise<ApiAnswer>}
 */
export function callApi(method, path, options = {}) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const fail = () => resolve({ ok: false, status: 0, data: null, error: OFFLINE_MESSAGE });
    xhr.open(method, API_BASE + path);
    xhr.timeout = options.timeoutMs || DEFAULT_TIMEOUT_MS;
    if (options.body !== undefined) xhr.setRequestHeader("Content-Type", JSON_TYPE);
    if (options.token) xhr.setRequestHeader("Authorization", `Bearer ${options.token}`);
    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // Not JSON (a proxy's error page): the status alone decides
      }
      const ok = xhr.status >= 200 && xhr.status < 300;
      resolve({ ok, status: xhr.status, data, error: ok ? "" : (data && data.error) || OFFLINE_MESSAGE });
    };
    xhr.onerror = fail;
    xhr.ontimeout = fail;
    xhr.send(options.body !== undefined ? JSON.stringify(options.body) : null);
  });
}
