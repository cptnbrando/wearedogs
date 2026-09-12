/**
 * Per-deploy-target files for the static host.
 *
 * One codebase, two deployments:
 *   - live    → https://dogs.red            (YEAHDOGS/dogs.red, master)
 *   - archive → https://www.wearedogs.net   (cptnbrando/wearedogs, frozen)
 *
 * The workflow picks the target through SITE_MODE / SITE_ORIGIN; this plugin
 * writes the two files GitHub Pages and the archive gate need:
 *   CNAME        custom domain for GitHub Pages (must ship in every deploy,
 *                otherwise Pages drops the domain on the next push)
 *   health.json  answered by the live site; the archive's index.html gate
 *                probes it before redirecting visitors to dogs.red
 */

export const LIVE_ORIGIN = "https://dogs.red";
export const STAGING_ORIGIN = "https://staging.dogs.red";
export const ARCHIVE_ORIGIN = "https://www.wearedogs.net";
export const SITE_MODES = ["live", "archive"];
const PRODUCTION_BRANCH = "master";

/**
 * Resolve the deploy target from the environment, defaulting to the live site.
 * On Workers Builds, a non-master branch (WORKERS_CI_BRANCH) is a staging
 * deploy: same live mode, staging origin, and robots.txt blocks indexing.
 */
export function resolveSiteTarget(env = process.env) {
  const mode = SITE_MODES.includes(env.SITE_MODE) ? env.SITE_MODE : "live";
  const ciBranch = env.WORKERS_CI_BRANCH || "";
  const staging = mode === "live" && ciBranch !== "" && ciBranch !== PRODUCTION_BRANCH;
  const fallbackOrigin = mode === "archive" ? ARCHIVE_ORIGIN : staging ? STAGING_ORIGIN : LIVE_ORIGIN;
  const origin = (env.SITE_ORIGIN || fallbackOrigin).replace(/\/+$/, "");
  return { mode, origin, host: origin.replace(/^https?:\/\//, ""), staging };
}

/** Body of health.json — the archive gate only follows a `mode: "live"` answer. */
export function buildHealth(target, env = process.env) {
  return {
    mode: target.mode,
    origin: target.origin,
    staging: Boolean(target.staging),
    builtAt: new Date().toISOString(),
    commit: env.GITHUB_SHA || "local",
  };
}

export default function siteFiles(target) {
  return {
    name: "wad-site-files",
    // Dev: answer /health.json too, so an archive-mode dev server (SITE_MODE=archive,
    // LIVE_ORIGIN=http://<this host>) can exercise the gate against a live one.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if ((req.url || "").split("?")[0] !== "/health.json") return next();
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify(buildHealth(target), null, 2));
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "CNAME", source: target.host + "\n" });
      this.emitFile({
        type: "asset",
        fileName: "health.json",
        source: JSON.stringify(buildHealth(target), null, 2) + "\n",
      });
      if (target.staging) {
        this.emitFile({ type: "asset", fileName: "robots.txt", source: "User-agent: *\nDisallow: /\n" });
      }
    },
  };
}
