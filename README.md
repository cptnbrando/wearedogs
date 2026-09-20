# DOGSDOGSDOGSDOGSDOGS

A home for debauchery, magic, and mischief

## Current Features

* DOG BLOG - BARKBARKBARKBARKBARK
* QR Generator - Generate resizable QR codes with custom center logo overlays.
* Catalytic Converter - Convert img vid audio data and N64 ROM (z64/v64/n64) files in the browser.
* DataFlash - Visual file transfer protocol over flashing QR codes.
* Father Time - Stopwatch, timer, alarms, world clock, metronome \& tuning fork.
* Windshield Wiper - Clean watermarks and logos from images and videos using canvas magic.
* Sound Stripper - Extract vocal acapellas by subtracting reference instrumental bleed.
* 2026 World Cup - Archived matches, group stage standings, and the responsive bracket.
* Snake - Classic. AI Mode included.
* Paint - Draw paint and sketch.
* Soundboard - Play some music.

## Network Dependencies

* https://flagcdn.com - Flags for teams

## Deploy Targets

One codebase, three deployments:

| Where | Host | `SITE_MODE` | Origin | Role |
|---|---|---|---|---|
| `YEAHDOGS/dogs.red`, `master` | Cloudflare Workers (`wrangler.jsonc`) | `live` | `https://dogs.red` | The site. |
| `YEAHDOGS/dogs.red`, any other branch | Cloudflare Workers, `--env staging` | `live` | `https://staging.dogs.red` | Staging. `robots.txt` blocks indexing. |
| `cptnbrando/wearedogs` | GitHub Pages (`.github/workflows/deploy.yml`) | `archive` | `https://www.wearedogs.net` | Frozen backup. Never touched again. |

Cloudflare Workers Builds settings for `YEAHDOGS/dogs.red`: build command `npm ci --legacy-peer-deps && npm run build`, deploy command `npx wrangler deploy`, non-production branch deploy command `npx wrangler deploy --env staging`, variables `NODE_VERSION=24` and `SKIP_DEPENDENCY_INSTALL=true`. The staging origin is picked automatically from the `WORKERS_CI_BRANCH` the build runs on.

The GitHub Pages workflow reads `SITE_MODE` / `SITE_ORIGIN` repository variables (defaults: `live`, `https://dogs.red`); the archive repo sets them to `archive` / `https://www.wearedogs.net`.

Every build emits `CNAME` (so GitHub Pages keeps its custom domain) and `health.json` (`{ mode, origin, staging, builtAt, commit }`). The archive build's `index.html` probes `https://dogs.red/health.json` on load and forwards the visitor to the same path on dogs.red only if it answers `"mode": "live"`. If dogs.red is down, broken, or slow, the archive serves as usual. Visitors can also stay on the archive on purpose: the Settings app toggle persists it, and `?stay` on any archive URL keeps them there for the browser session.

Local dev always runs as `live`, so the gate never fires on localhost.

## Old Browsers (`/lite/`)

There is no `@vitejs/plugin-legacy` any more (it doubled the build time for SystemJS bundles that old TVs still could not run, since Svelte 5 needs `Proxy`). The modern bundle targets Chrome 84 / Firefox 79 / Safari 14. Older engines are detected by the inline gate in `index.html` and sent to static ES5 pages that actually work: `/lite/` (the landing page: same words, all 205 languages, same interactions) and `/gopro/` (GoPro TV). `scripts/check-es5.js` fails the build if modern syntax sneaks into any of them. `public/lite/dogs.js` is generated from the translations at build time and is gitignored.





woof

