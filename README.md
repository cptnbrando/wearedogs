# DOGSDOGSDOGSDOGSDOGS

A home for debauchery, magic, and mischief

## Current Features

* DOG BLOG - BARKBARKBARKBARKBARK
* QR Generator - Generate resizable QR codes with custom center logo overlays.
* Catalytic Converter - Convert img vid and audio files in the browser.
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

One codebase, two GitHub Pages deployments, picked by repository variables read in `.github/workflows/deploy.yml`:

| Repo | `SITE_MODE` | `SITE_ORIGIN` | Role |
|---|---|---|---|
| `YEAHDOGS/dogs.red` | `live` (default) | `https://dogs.red` (default) | The site. |
| `cptnbrando/wearedogs` | `archive` | `https://www.wearedogs.net` | Frozen backup. Never touched again. |

The build emits `CNAME` (so Pages keeps its custom domain) and `health.json` (`{ mode, origin, builtAt, commit }`). The archive build's `index.html` probes `https://dogs.red/health.json` on load and forwards the visitor to the same path on dogs.red only if it answers `"mode": "live"`. If dogs.red is down, broken, or slow, the archive serves as usual. Visitors can also stay on the archive on purpose: the Settings app toggle persists it, and `?stay` on any archive URL keeps them there for the browser session.

Local dev always runs as `live`, so the gate never fires on localhost.





woof

