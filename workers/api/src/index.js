/**
 * dogs-api: the one Worker behind every DOGS app, served at
 * api.wearedogs.net and api.dogs.red.
 *
 * Kept as a single Worker on purpose: the free tier's 100k requests and D1
 * rows a day are account-wide, and one Worker means one place to cap them
 * (lib/budget.js) and one set of gates for every app:
 *   - Origin allowlist + CORS (ALLOWED_ORIGINS)
 *   - browser-like User-Agent
 *   - per-route rate limiters and, for writes, Turnstile (lib/turnstile.js)
 *
 * Adding an app:
 *   1. src/routes/<app>.js exporting { path: "/<app>", handle(request, env, ctx, visitor) }
 *   2. register it in ROUTES below
 *   3. its tables in migrations/NNNN_<app>.sql
 *   4. spend writes through spendWrites(env, "<app>", rows, cap)
 *   5. its own rate limiter in wrangler.jsonc if it needs different limits
 *   6. optional daily upkeep: export scheduled(env), run by the cron in wrangler.jsonc
 */

import { reply, corsHeaders } from "./lib/http.js";
import { ipKey } from "./lib/hash.js";
import likes from "./routes/likes.js";

const ROUTES = { [likes.path]: likes };
const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|curl|wget|python|httpclient|okhttp|scrapy|headless|phantom|go-http|java\//i;

export default {
  /**
   * @param {Request} request
   * @param {object} env bindings and vars from wrangler.jsonc, plus HASH_SALT and TURNSTILE_SECRET
   * @param {ExecutionContext} ctx
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // Routes own everything under their first path segment
    const route = ROUTES[`/${url.pathname.split("/")[1]}`];
    if (!route) return reply(404, { error: "Not found" });

    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = (env.ALLOWED_ORIGINS || "").split(",");
    if (!allowedOrigins.includes(origin)) return reply(403, { error: "Forbidden" });

    const cors = corsHeaders(origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const userAgent = request.headers.get("User-Agent") || "";
    if (!userAgent || BOT_UA_PATTERN.test(userAgent)) return reply(403, { error: "Forbidden" }, cors);

    const ip = request.headers.get("CF-Connecting-IP") || "";
    return route.handle(request, env, ctx, { ip, ipKey: ipKey(ip), cors, url });
  },

  /** Daily upkeep from the cron trigger: every route that exports scheduled(env) gets a turn. */
  async scheduled(controller, env, ctx) {
    const jobs = Object.values(ROUTES).filter((route) => route.scheduled);
    ctx.waitUntil(Promise.all(jobs.map((route) => route.scheduled(env))));
  },
};
