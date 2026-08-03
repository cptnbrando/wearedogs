# Branch Audit — August 2, 2026

Every branch with commits not yet on `master`, what it contains, and what happened when
the features were actually run. Testing was done on a local dev server (Vite, Chrome-based
browser pane) after merging candidates into `ai/branch-audit-aug02`.

**The favorite five** — merged into this PR, in merge order:

1. `ai/security-hardening`
2. `ai/sale-day-takeover` (the 8 commits that came after PR #38)
3. `ai/texas-marijuana-fundraiser`
4. `ai-july2026/pricks-mode-wiretap`
5. `july19`

Everything else stays on its branch, with notes below on what it would take to land.

---

## Merged branches

### 1. `ai/security-hardening` — 1 commit, only 14 behind master

**Contains:** XSS hardening from a full-project scan.

- `MusicPanel.svelte` — song-info text is HTML-escaped before the `{@html}` linkify pass,
  so only the anchors/`<br>` built by the code reach the DOM.
- `StorePanel.svelte` — bio links get a scheme allowlist (`https?:`/`mailto:`/`tel:`/relative);
  `javascript:`/`data:`/`vbscript:` hrefs are defanged to `#`, both in the marked renderer
  and in raw pasted anchors. Checkout/cash-app `window.open` calls get `noopener,noreferrer`.
- `blogApi.js` — markdown links get the same scheme allowlist plus quote-escaping.
- `MemesApp.svelte` — fallback `window.open` gets `noopener,noreferrer`.
- `vite.config.js` — removes `secure: false` from the `/vid` dev proxy (TLS verification back on).

**Testing:** merges and builds clean. Music panel, store bios, blog posts, and memes all
render normally after the change — no console errors anywhere. The defang regexes were
reviewed by hand; behavior for legitimate links is unchanged (verified live on the blog
and store pages).

**Verdict: keep. Small, correct, overdue.**

### 2. `ai/sale-day-takeover` — 8 unmerged commits on top of the already-merged sale work

**Contains:** the post-sale-day evolution of the Texas campaign page.

- **WHY tab** on the map stats sheet: a sourced timeline from the 1937 Marihuana Tax Act
  through the 2018 Farm Bill to the July 31 shelf-pull and the Nov 12 federal deadline,
  every entry with a citation link (`hempTimeline.js`, 383 lines).
- **HEALTH tab**: deaths-per-year, ER-visit and bottom-line comparisons vs alcohol, all
  cited (`hempHealth.js`, 150 lines).
- **Deep links**: `/stats/health`, `/stats/why`, `/stats/money`, `/stats/representation`
  (plus aliases) route straight into the campaign map's stats sheet; bare `/stats` still
  means the world-stats panel.
- **Correspondence section**: Sen. Cornyn's reply on THC scheduling published in full
  (`public/correspondence/`), plus a long "letter from one driver" reply as a third
  campaign tab (🚗 Drive).
- **Mail tooling**: stance-sorted recipient buckets (for / middle / against), a
  "TALK TO THE ARCHITECTS" targeted send, REACH ALL in mailto-sized batches of
  `MAIL_BATCH_SIZE = 40`, random persuadable rep, and a default send group
  (`defaultReps` — Senate/statewide/federal offices) so the big green button always
  does something valid.
- Message copy refinements in the last three commits.

**Testing:** merges and builds clean. Verified live: `/stats/health` and `/stats/why`
deep links open the right tabs with full content and citations; stance buckets populate
(64 / 12 / 105 offices), architects button shows its 3 targets, REACH ALL reports
181 recipients in batches of 40, default selection is 32 recipients, countdown and
correspondence render. No console errors.

**Verdict: keep. This is the biggest and best chunk of unmerged work.**

### 3. `ai/texas-marijuana-fundraiser` — 1 commit

**Contains:** UX polish for the campaign's Find-My-Location flow.

- The campaign-selection sync effect now tracks only the campaign id (with `untrack`
  around the body) so a geolocation result can't be reverted a frame later by a derived
  recompute.
- A minimum 900 ms "LOCATING…" hold with spinner + button pulse, so a cached instant
  fix doesn't read as a glitch.
- Status text gets a keyed fade + flash so repeat runs visibly re-announce.
- Timer cleanup on destroy.

**Testing:** this was the only conflicting merge of the five — the sale branch rewrote
the same selection effect (to add `defaultReps`). Resolved by keeping the sale branch's
default-group machinery inside the fundraiser branch's guarded effect; both features
verified working together: default selection lands (32 recipients), and with location
blocked in the test browser the fallback path shows "Location is blocked for this site…
Selected the 10 priority offices" with the new status flash. No console errors.

**Verdict: keep, as resolved in this PR.**

### 4. `ai-july2026/pricks-mode-wiretap` — 1 commit

**Contains:** Wiretap prick-mode burst analytics.

- `WiretapEngine` tracks how long each triggering sound burst actually lasted
  (`burstStartTime`/`burstEndTime`, plus a peak-count fallback so the two measures
  can't disagree downward).
- Clips get `burstDuration`, `isPrick` (< 1.0 s) or `isNotJustAPrick` (>= 1.0 s), also
  written into the export metadata JSON.
- Clip list UI: short bursts get a "⚡ PRICK (0.4s)" tag, sustained sounds get a
  yellow-highlighter crossed-out "NOT JUST A PRICK" label; burst time shown next to
  the timestamp.

**Testing:** merges and builds clean (including alongside july19's Wiretap changes —
git auto-merged both into `Wiretap.svelte` without conflict). The app loads to its
permission gate; microphone capture is blocked in the sandboxed test browser, so the
live burst-labeling path could not be exercised end-to-end. The engine logic was
verified by review against the current engine (all referenced fields exist), and the
tag rendering is condition-guarded so clips without `burstDuration` are unaffected.
Worth one real-mic smoke test after merge.

**Verdict: keep, with the mic-test caveat above.**

### 5. `july19` — 6 commits

**Contains:** the secret-calculator unlock system plus data-loss guards.

- **Calculator app** (`GoProCalculator.svelte` → `Calculator.svelte`): a "SECURE CALC
  TI-75" where every key is a codeword (Leopard=1, Cheetah=+, Taco=0 …). It is a real
  working calculator; every `=` press also sends the buffered codeword sequence to
  `data.wearedogs.net` as a password check, and a correct sequence unlocks a hidden
  app (GoPro/DOGS TV by default, server can name another target). Unlocks persist in
  localStorage as shortcut buttons.
- GoPro's tile is removed from the toolbox grid (replaced by Calculator); the hidden
  app's header still resolves via a `hiddenApps` map.
- **Close guards**: Frames and Wiretap set `window.hasUnsavedData`; the toolbox
  back/close/backdrop paths and a `beforeunload` hook confirm before discarding
  loaded video/clips.

**Testing:** merges and builds clean. Verified live: Calculator tile appears in the
toolbox, GoPro tile is gone, and 1 + 2 = 3 computes with the codeword buffer displayed
(LEOPARD CHEETAH FOXTROT). The unlock itself needs the real password against the
production endpoint, so it wasn't exercised. Two findings to know about:

- `calculator` was never added to `VALID_APPS` in the router, so `/apps/calculator`
  doesn't deep-link — the app only opens from the grid. Possibly intentional (it is a
  "secret" surface), but inconsistent.
- `/apps/gopro` still routes straight to GoPro, bypassing the calculator gate entirely
  (GoPro keeps its own password screen, so nothing is exposed — but "hidden" is only
  grid-deep).

**Verdict: keep. The two routing quirks are documented, not blockers.**

---

## Not merged, and why

### `swarm/document-converter` — 1 commit, 240 behind

Adds a pure client-side document converter to Catalytic Converter: .docx/.doc/.pdf/.md/
.txt/.odt/.rtf parsing and generation in a hand-rolled 1,137-line `convertDoc.js`
(fflate for the zip formats, no new dependencies). Genuinely cool feature, but it
conflicts with master in `CatalyticConverter.svelte`, `package.json`, and the generated
`public/changelog.json`. Needs a rebase onto current master (the changelog conflict just
regenerates via `npm run changelog`). **Recommend: rebase and land separately.**

### `ai/cropper` — 2 commits, 265 behind

Client-side image cropping (center-square/16:9/4:3/custom) and more output formats
(avif/svg) for the converter, plus a big ImageReader rework. Conflicts with master in
`CatalyticConverter.svelte` and — worse — targets `src/components/apps/convert.js`,
which has since moved/diverged as `src/lib/convert.js`. Needs a manual port, not a merge.

### `scope` — 2 commits, 326 behind

Scrollbar theming tied to the color toggle (grayscale scrollbars until the site is
"colored"), an is-scrolling class, and a DogsMain responsive/lazy-3D rework. Master's
DogsMain and app.scss have moved a lot since; all three files conflict. The scrollbar
idea is nice and small — worth re-doing fresh on master rather than untangling this.

### `swarm/app-dog-sitter` — 1 commit, 536 behind

A complete Tamagotchi-style idle game (breed selection, procedural Web-Audio barks,
collar shop, persistent game store). Self-contained except for its ToolboxPanel hook,
which was written against the old hardcoded grid — master's toolbox is now a dynamic
`appModules` loader, so the hook conflicts. Porting is mechanical: add the app to the
grid list + loader map. **Recommend: port and land if you still want the game.**

### `swarm/wall-app` — 1 commit, 544 behind

An R2-backed public post-it note wall with a full Cloudflare Worker backend
(`worker/wall-worker.js`, 441 lines), Turnstile bot-verification, and rate limiting.
Conflicts in ToolboxPanel/router/.gitignore for the same staleness reasons, and it
can't be tested or shipped without deploying the worker and configuring Turnstile
secrets. Biggest lift of the bunch; needs a deliberate deploy decision, not a merge.

### Older remote-only branches

`swarm/recorder`, `ribbit-patch` / `swarm/catalytic-tiktok-mp3`, `ai/battle`, `OPTIMIZE`,
`ai/letters`, `ai/datatrain`, `2607-w2/ocr-app`, `clock`, `logo`, `qr-gen`, `dogs-info`,
`swarm/blog-app`, `fuck`, and friends are 290–560 commits behind, and their features
either already shipped in another form (converter, arcade, OCR, world cup, GoPro auth)
or were abandoned. Nothing worth salvaging wholesale; candidates for deletion next time
branches get pruned.

### Already merged (tips still sitting as branches)

`ai/music-landscape-fix`, `ai/worldcup-2026-freeze`, and the first 7 commits of
`ai/sale-day-takeover` are already on master via PRs #41/#38/#37.
`ai-july2026/password-generator` and `swarm/frames-mobile-responsive` are fully
contained in master. Safe to delete locally.

---

## Build & test environment

- `npm run build` on the merged result: **passes** (2m 37s, share cards prerendered,
  one pre-existing chunk-size warning on the vendor bundle).
- Dev-server smoke tests in the browser pane: landing page, toolbox grid, Calculator,
  Wiretap gate, `/stats/health`, `/stats/why`, campaign page + mail tools + location
  fallback, `/music`, `/apps/blog/woof` — all clean consoles throughout.
- Not testable in this environment: microphone capture (Wiretap), real geolocation fix,
  the calculator's production password check, and mailto hand-offs to a desktop client.
