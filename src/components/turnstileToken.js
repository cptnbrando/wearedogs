/**
 * turnstileToken.js
 * Cloudflare Turnstile proof-of-human for likes and mail, in invisible mode: no
 * checkbox or puzzle is ever shown. The script loads only when someone
 * clicks like or submits the mailing form (see public/privacy.html): nothing
 * reaches Cloudflare's challenge servers before that.
 *
 * The widget "wearedogs-api likes" covers wearedogs.net, dogs.red and
 * wearedogs.pages.dev. Dev uses Cloudflare's always-pass invisible test key,
 * which matches the test secret in workers/api/.dev.vars.
 */

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SITE_KEY = import.meta.env.DEV ? "1x00000000000000000000BB" : "0x4AAAAAAFn0k2xvNoVQuLjj";
// Callers may supply their route action; preserve like for existing callers.
const DEFAULT_ACTION = "like";
const TOKEN_TIMEOUT_MS = 15000;
// Invisible widgets draw nothing, but still need a host element in the page
const HOST_STYLE = "position:fixed;left:0;bottom:0;width:0;height:0;overflow:hidden";

let scriptLoad = null;

/** Loads the Turnstile script once; a failed load can be retried. */
function loadTurnstile() {
  if (scriptLoad) return scriptLoad;
  scriptLoad = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      scriptLoad = null;
      reject(new Error("Turnstile unavailable"));
    };
    document.head.appendChild(script);
  });
  return scriptLoad;
}

/** @param {string} [action] route action; defaults to like
 * @returns {Promise<string>} a single-use token for this action */
export function getTurnstileToken(action = DEFAULT_ACTION) {
  return loadTurnstile().then(
    (turnstile) =>
      new Promise((resolve, reject) => {
        const host = document.createElement("div");
        host.style.cssText = HOST_STYLE;
        document.body.appendChild(host);
        let widgetId = null;
        const finish = (settle, value) => {
          clearTimeout(timer);
          if (widgetId !== null) turnstile.remove(widgetId);
          host.parentNode.removeChild(host);
          settle(value);
        };
        const timer = setTimeout(() => finish(reject, new Error("Turnstile timed out")), TOKEN_TIMEOUT_MS);
        widgetId = turnstile.render(host, {
          sitekey: SITE_KEY,
          action,
          callback: (token) => finish(resolve, token),
          // Returning true tells Turnstile the error was handled, so it doesn't log it
          "error-callback": () => {
            finish(reject, new Error("Turnstile failed"));
            return true;
          },
        });
      }),
  );
}
