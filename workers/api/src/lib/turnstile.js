/** Server-side check of a Cloudflare Turnstile token (free, unlimited). */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * @param {{ TURNSTILE_SECRET?: string, TURNSTILE_HOSTNAMES?: string }} env
 * @param {string} token from the page's widget
 * @param {string} ip the visitor's raw IP
 * @param {string} action the action the page rendered the widget with
 * @returns {Promise<boolean>}
 */
export async function verifyTurnstile(env, token, ip, action) {
  if (!env.TURNSTILE_SECRET || !token) return false;

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body: form });
    if (!res.ok) return false;

    const outcome = await res.json();
    const hostnames = (env.TURNSTILE_HOSTNAMES || "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean);
    return Boolean(
      outcome.success &&
      hostnames.length &&
      hostnames.includes(outcome.hostname) &&
      outcome.action === action,
    );
  } catch {
    return false;
  }
}
