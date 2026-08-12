<script>
  import { fly, scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import {
    ArrowLeft,
    Clock,
    HeartPulse,
    Languages,
    PieChart,
    Scale,
    Table2,
  } from "lucide-svelte";
  import SwipeTabNav from "./SwipeTabNav.svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import {
    languageVitals,
    vitalsByCode,
    worldVitals,
    worldDogVitals,
    livePopulation,
    liveDogPopulation,
    speakerShare,
    formatCompact,
    formatInt,
    formatRate,
    formatCadence,
  } from "../data/stats/languageVitals.js";
  import {
    RATE_UNITS,
    rateUnitState,
    cycleRateUnit,
  } from "../data/stats/rateUnits.svelte.js";
  import SharePie from "./stats/SharePie.svelte";
  import LifeDeathLines from "./stats/LifeDeathLines.svelte";
  import ProjectionChart from "./stats/ProjectionChart.svelte";
  import VitalsTable from "./stats/VitalsTable.svelte";

  let {
    isClosing = false,
    currentLang = $bindable(),
    onClose,
    onHoverLang,
    onSelectLang,
  } = $props();

  // Enough languages that the folded "Other" tail stays under 25%.
  const shareData = speakerShare(0.25);
  const topTen = languageVitals.slice(0, 10);

  // Slices are ranked by size, so an ordinal blue ramp (dark = biggest)
  // carries the order; the ramp ends stay inside the dark-surface contrast
  // band. "Other" is neutral gray.
  function mixHex(a, b, t) {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ch = (sh) => {
      const va = (pa >> sh) & 255;
      return Math.round(va + (((pb >> sh) & 255) - va) * t);
    };
    return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
  }

  const langSliceCount = shareData.length - 1;
  const PIE_COLORS = shareData.map((d, i) =>
    d.code === "other"
      ? "#55555e"
      : mixHex("#184f95", "#9ec5f4", langSliceCount > 1 ? i / (langSliceCount - 1) : 0),
  );

  // ── Global rate-unit toggle: click forward, right-click / long-press back ──
  let unit = $derived(RATE_UNITS[rateUnitState.idx]);
  let lpTimer = null;
  let lpFired = false;

  function unitClick() {
    if (lpFired) {
      lpFired = false;
      return;
    }
    cycleRateUnit(1);
  }

  function unitContextMenu(e) {
    e.preventDefault();
    // Android long-press arrives as contextmenu; don't double-step with the timer
    if (lpFired) return;
    cycleRateUnit(-1);
  }

  function unitTouchStart() {
    lpFired = false;
    lpTimer = setTimeout(() => {
      lpFired = true;
      cycleRateUnit(-1);
    }, 450);
  }

  function unitTouchEnd() {
    clearTimeout(lpTimer);
  }

  let selected = $derived(vitalsByCode[currentLang] || languageVitals[0]);

  function selectLang(code) {
    currentLang = code;
    onHoverLang?.(code);
    onSelectLang?.(code);
  }

  // ── Tabs ──
  const statsTabs = [
    { id: "pulse", label: "Pulse", icon: HeartPulse },
    { id: "language", label: "Language", icon: Languages },
    { id: "share", label: "Share", icon: PieChart },
    { id: "balance", label: "Life & Death", icon: Scale },
    { id: "census", label: "Census", icon: Table2 },
  ];

  let activeTab = $state("pulse");

  // Slide direction for the pane transition: +1 moving right, −1 moving left.
  // $effect.pre updates it before the keyed block re-renders, so the fly
  // transitions read the fresh direction.
  let prevTabIdx = 0;
  let slideDir = $state(1);
  $effect.pre(() => {
    const idx = statsTabs.findIndex((t) => t.id === activeTab);
    slideDir = idx >= prevTabIdx ? 1 : -1;
    prevTabIdx = idx;
  });

  // ── Content swipe (mobile): horizontal drag changes tab ──
  let touchX = 0;
  let touchY = 0;
  let swipeIgnored = false;

  function onStageTouchStart(e) {
    if (!e.touches?.length) return;
    // Don't fight elements with their own horizontal scroll / controls
    swipeIgnored = !!e.target.closest(".table-scroll, input, select, button");
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }

  function onStageTouchEnd(e) {
    if (swipeIgnored || !e.changedTouches?.length) {
      swipeIgnored = false;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 60) {
      const idx = statsTabs.findIndex((t) => t.id === activeTab);
      const next = dx < 0 ? idx + 1 : idx - 1;
      if (next >= 0 && next < statsTabs.length) {
        activeTab = statsTabs[next].id;
      }
    }
  }

  // ── Live tickers ──
  let now = $state(Date.now());

  $effect(() => {
    const id = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(id);
  });

  let population = $derived(livePopulation(now));
  let dogPopulation = $derived(liveDogPopulation(now));

  // ── Pulse combined ⇄ split: hover splits on desktop, tap toggles on touch ──
  let pulseSplit = $state(false);

  function pulseEnter(e) {
    if (e.pointerType === "mouse") pulseSplit = true;
  }

  function pulseLeave(e) {
    if (e.pointerType === "mouse") pulseSplit = false;
  }

  function pulseTap(e) {
    if (e.pointerType !== "mouse") pulseSplit = !pulseSplit;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="stats-panel-backdrop" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="stats-panel-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
    style="--viz-surface:#101016; --viz-ink:rgba(255,255,255,0.95); --viz-ink-2:rgba(255,255,255,0.65); --viz-muted:rgba(255,255,255,0.42); --viz-grid:rgba(255,255,255,0.06); --viz-axis:rgba(255,255,255,0.16); --viz-births:#3987e5; --viz-deaths:#e66767; --viz-good:#0ca30c;"
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <button
          class="logo-btn"
          onclick={() =>
            window.dispatchEvent(
              new CustomEvent(
                audioCore.isPlaying ? "open-music-panel" : "open-info-panel",
              ),
            )}
          aria-label="Open DOGS Info"
        >
          <DogsLogo size="panel" />
        </button>
        <h1>stats <span class="subtitle">· life &amp; death</span></h1>
      </div>

      <div class="header-actions">
        <button
          class="unit-toggle"
          onclick={unitClick}
          oncontextmenu={unitContextMenu}
          ontouchstart={unitTouchStart}
          ontouchend={unitTouchEnd}
          ontouchcancel={unitTouchEnd}
          aria-label="Change rate time unit (click forward, right-click or hold back)"
          title="Click: next unit · right-click / hold: previous"
        >
          <Clock size={13} />
          per {unit.noun}
        </button>
        <button class="close-btn" onclick={onClose} aria-label="Close panel">
          <ArrowLeft size={20} />
        </button>
      </div>
    </header>

    <SwipeTabNav tabs={statsTabs} bind:activeTab />

    <!-- Body: one screen per tab, swipe or click to move -->
    <div
      class="tab-stage"
      ontouchstart={onStageTouchStart}
      ontouchend={onStageTouchEnd}
    >
      {#key activeTab}
        <div
          class="tab-pane"
          in:fly={{ x: 64 * slideDir, duration: 300, easing: cubicOut }}
          out:fly={{ x: -64 * slideDir, duration: 220, easing: cubicOut }}
        >
          {#if activeTab === "pulse"}
            <!-- ── PULSE: the world, alive. Combined until hovered/tapped,
                 then humans left / dogs right ── -->
            <div class="pulse-pane">
              <div
                class="pulse-stage"
                onpointerenter={pulseEnter}
                onpointerleave={pulseLeave}
                onpointerup={pulseTap}
              >
                {#if !pulseSplit}
                  <div
                    class="pulse-view pulse-combined"
                    transition:scale={{
                      start: 0.88,
                      duration: 280,
                      easing: cubicOut,
                    }}
                  >
                    <div class="combined-main">
                      <div class="pulse-eyebrow">
                        alive right now
                      </div>
                      <div class="pop-hero">
                        {formatInt(population + dogPopulation)}
                      </div>
                      <div class="pulse-sub">
                        growing +{(
                          worldVitals.netPerSecond + worldDogVitals.netPerSecond
                        ).toFixed(1)} every second
                      </div>
                    </div>

                    <div class="pulse-tiles">
                      <div class="tile accent-births">
                        <span class="tile-label">Births</span>
                        <span class="tile-value">
                          {formatRate(
                            (worldVitals.dailyBirths +
                              worldDogVitals.dailyBirths) *
                              unit.perDay,
                          )}
                        </span>
                        <span class="tile-sub">per {unit.noun}</span>
                      </div>
                      <div class="tile accent-deaths">
                        <span class="tile-label">Deaths</span>
                        <span class="tile-value">
                          {formatRate(
                            (worldVitals.dailyDeaths +
                              worldDogVitals.dailyDeaths) *
                              unit.perDay,
                          )}
                        </span>
                        <span class="tile-sub">per {unit.noun}</span>
                      </div>
                      <div class="tile accent-good">
                        <span class="tile-label">Net</span>
                        <span class="tile-value">
                          +{formatRate(
                            (worldVitals.dailyNet + worldDogVitals.dailyNet) *
                              unit.perDay,
                          )}
                        </span>
                        <span class="tile-sub">per {unit.noun}</span>
                      </div>
                    </div>
                  </div>
                {:else}
                  <div class="pulse-view pulse-split">
                    <div
                      class="split-col"
                      in:fly={{ x: 90, duration: 320, easing: cubicOut }}
                      out:fly={{ x: 90, duration: 240, easing: cubicOut }}
                    >
                      <div class="pulse-eyebrow">humans 😊</div>
                      <div class="pop-hero split-hero">
                        {formatInt(population)}
                      </div>
                      <div class="mini-rows">
                        <div class="mini-row">
                          <span class="mini-dot births"></span>
                          <span class="mini-label">Births</span>
                          <span class="mini-value">
                            {formatRate(worldVitals.dailyBirths * unit.perDay)}
                          </span>
                          <span class="mini-per">/ {unit.noun}</span>
                        </div>
                        <div class="mini-row">
                          <span class="mini-dot deaths"></span>
                          <span class="mini-label">Deaths</span>
                          <span class="mini-value">
                            {formatRate(worldVitals.dailyDeaths * unit.perDay)}
                          </span>
                          <span class="mini-per">/ {unit.noun}</span>
                        </div>
                        <div class="mini-row">
                          <span class="mini-dot good"></span>
                          <span class="mini-label">Net</span>
                          <span class="mini-value">
                            +{formatRate(worldVitals.dailyNet * unit.perDay)}
                          </span>
                          <span class="mini-per">/ {unit.noun}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      class="split-plus"
                      aria-hidden="true"
                      in:scale={{ start: 0.3, duration: 320, easing: cubicOut }}
                      out:scale={{ start: 0.3, duration: 200 }}
                    >
                      +
                    </div>

                    <div
                      class="split-col"
                      in:fly={{ x: -90, duration: 320, easing: cubicOut }}
                      out:fly={{ x: -90, duration: 240, easing: cubicOut }}
                    >
                      <div class="pulse-eyebrow">🐕 dogs</div>
                      <div class="pop-hero split-hero">
                        {formatInt(dogPopulation)}
                      </div>
                      <div class="mini-rows">
                        <div class="mini-row">
                          <span class="mini-dot births"></span>
                          <span class="mini-label">Births</span>
                          <span class="mini-value">
                            {formatRate(
                              worldDogVitals.dailyBirths * unit.perDay,
                            )}
                          </span>
                          <span class="mini-per">/ {unit.noun}</span>
                        </div>
                        <div class="mini-row">
                          <span class="mini-dot deaths"></span>
                          <span class="mini-label">Deaths</span>
                          <span class="mini-value">
                            {formatRate(
                              worldDogVitals.dailyDeaths * unit.perDay,
                            )}
                          </span>
                          <span class="mini-per">/ {unit.noun}</span>
                        </div>
                        <div class="mini-row">
                          <span class="mini-dot good"></span>
                          <span class="mini-label">Net</span>
                          <span class="mini-value">
                            +{formatRate(worldDogVitals.dailyNet * unit.perDay)}
                          </span>
                          <span class="mini-per">/ {unit.noun}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>

              <p class="pane-footnote">
                Human figures use UN world rates, never the sum of speaker
                populations · dog figures total each region's dog count with
                population-weighted rates · {worldVitals.languageCount} languages
                tracked
              </p>
            </div>
          {:else if activeTab === "language"}
            <!-- ── LANGUAGE: one population under the lens ── -->
            <div class="language-pane">
              <div class="lang-head">
                <div>
                  <h2 class="pane-title">{selected.name}</h2>
                  <p class="pane-sub">
                    #{selected.rank} by speakers · {selected.country} · “{selected.phrase}”
                  </p>
                </div>
                <select
                  class="lang-select"
                  value={selected.code}
                  onchange={(e) => selectLang(e.currentTarget.value)}
                  aria-label="Select a language"
                >
                  {#each languageVitals as v (v.code)}
                    <option value={v.code}>{v.name} — {v.speakersText}</option>
                  {/each}
                </select>
              </div>

              <div class="tile-row">
                <div class="tile">
                  <span class="tile-label">Speakers</span>
                  <span class="tile-value">
                    {formatCompact(selected.speakers)}
                  </span>
                  <span class="tile-sub">{selected.speakersText}</span>
                </div>
                <div class="tile accent-births">
                  <span class="tile-label">Births / {unit.short}</span>
                  <span class="tile-value">
                    {formatRate(selected.dailyBirths * unit.perDay)}
                  </span>
                  <span class="tile-sub">
                    one {formatCadence(selected.secondsPerBirth)}
                  </span>
                </div>
                <div class="tile accent-deaths">
                  <span class="tile-label">Deaths / {unit.short}</span>
                  <span class="tile-value">
                    {formatRate(selected.dailyDeaths * unit.perDay)}
                  </span>
                  <span class="tile-sub">
                    one {formatCadence(selected.secondsPerDeath)}
                  </span>
                </div>
                <div class="tile accent-good">
                  <span class="tile-label">Natural change</span>
                  <span class="tile-value">
                    {selected.growthRate >= 0 ? "+" : ""}{(
                      selected.growthRate * 100
                    ).toFixed(2)}%
                  </span>
                  <span class="tile-sub">per year (CBR − CDR)</span>
                </div>
              </div>

              <div class="dog-strip">
                🐕 {selected.dogsText} dogs · {formatRate(
                  selected.dogDailyBirths * unit.perDay,
                )} born / {formatRate(selected.dogDailyDeaths * unit.perDay)} die
                per {unit.noun}
              </div>

              <div class="chart-fit">
                <ProjectionChart vitals={selected} />
              </div>
            </div>
          {:else if activeTab === "share"}
            <!-- ── SHARE: who speaks what ── -->
            <div class="center-pane share-pane">
              <div>
                <h2 class="pane-title">Who speaks what</h2>
                <p class="pane-sub">
                  Share of combined speaker counts — multilinguals appear once
                  per language they speak
                </p>
              </div>
              <SharePie data={shareData} colors={PIE_COLORS} />
            </div>
          {:else if activeTab === "balance"}
            <!-- ── LIFE & DEATH: the daily balance ── -->
            <div class="center-pane balance-pane">
              <div>
                <h2 class="pane-title">Life &amp; death</h2>
                <p class="pane-sub">
                  Births vs deaths per {unit.noun}, ten largest languages — the
                  colored gap shows which rate is winning
                </p>
              </div>
              <div class="balance-chart">
                <LifeDeathLines items={topTen} />
              </div>
            </div>
          {:else if activeTab === "census"}
            <!-- ── CENSUS: every language ── -->
            <div class="census-pane">
              <div>
                <h2 class="pane-title">Every language</h2>
                <p class="pane-sub">
                  Crude birth/death rates (‰/yr) and derived daily figures —
                  click a row to select
                </p>
              </div>
              <VitalsTable currentLang={selected.code} onSelect={selectLang} />
              <p class="pane-footnote">
                World figures use the UN population estimate ({formatCompact(
                  worldVitals.population,
                )}, CBR {worldVitals.birthRate}‰ / CDR {worldVitals.deathRate}‰);
                per-language figures apply each language's rates to its own
                speaker population. Projections assume constant rates.
              </p>
            </div>
          {/if}
        </div>
      {/key}
    </div>

    <!-- Footer / Status Bar -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span class="status-indicator-green"></span>
        <span>🐕</span>
      </div>
      <div class="stats-counter">
        <span>BARKBARKBARKBARK</span>
      </div>
    </footer>
  </div>
</div>

<style lang="scss">
  /* ── Backdrop ── */
  .stats-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* ── Container ── */
  .stats-panel-container {
    width: 94vw;
    height: 90vh;
    max-width: 1280px;
    max-height: 850px;
    background: rgba(10, 10, 14, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    animation: panelSlideUpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
  }

  .stats-panel-container.closing {
    animation: panelSlideUpDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* ── Header ── */
  .panel-header {
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Outfit", "Inter", sans-serif;
  }

  .subtitle {
    font-weight: 500;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.42);
    text-transform: none;
    letter-spacing: 0.02em;
  }

  .logo-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .unit-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    min-width: 106px;
    justify-content: center;

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.5);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateX(-4px);
  }

  /* ── Tab stage: panes stack in one grid cell so the outgoing and incoming
     pane overlap while the directional fly transition runs ── */
  .tab-stage {
    flex: 1;
    min-height: 0;
    display: grid;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.1);
  }

  .tab-pane {
    grid-area: 1 / 1;
    min-height: 0;
    padding: 18px 26px 20px;
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* safety valve for very short viewports */
  }

  /* ── Shared pane chrome ── */
  .pane-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--viz-ink);
    letter-spacing: 0.02em;
    padding-bottom: 4px;
    display: inline-block;
    background: linear-gradient(
        90deg,
        var(--viz-births),
        var(--viz-deaths) 60%,
        transparent
      )
      left bottom / 100% 2px no-repeat;
  }

  .pane-sub {
    margin: 4px 0 0;
    font-size: 0.7rem;
    color: var(--viz-muted);
  }

  .pane-footnote {
    /* Always pinned to the bottom of its pane */
    margin: 12px 0 0;
    margin-top: auto;
    padding-top: 10px;
    font-size: 0.64rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.3);
    text-align: center;
    flex-shrink: 0;
  }

  /* ── Stat tiles ── */
  .tile-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .tile {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-top: 2px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .tile.accent-births {
    border-top-color: var(--viz-births);
  }

  .tile.accent-deaths {
    border-top-color: var(--viz-deaths);
  }

  .tile.accent-good {
    border-top-color: var(--viz-good);
  }

  .tile-label {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--viz-muted);
  }

  .tile-value {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--viz-ink);
    line-height: 1.15;
  }

  .tile-sub {
    font-size: 0.66rem;
    color: var(--viz-muted);
  }

  /* ── PULSE pane ── */
  .pulse-pane {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .pulse-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--viz-ink-2);
  }

  .pop-hero {
    font-size: clamp(2rem, 5.4vw, 3.8rem);
    font-weight: 800;
    color: var(--viz-ink);
    line-height: 1.05;
    letter-spacing: 0.01em;
    /* ticking digits: tabular so the number doesn't wobble */
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    text-shadow: 0 0 32px rgba(120, 170, 255, 0.25);
  }

  .pulse-sub {
    font-size: 0.75rem;
    color: var(--viz-muted);
    margin-bottom: 14px;
  }

  /* Combined and split views stack in one grid cell so they crossfade in
     place; the whole stage is the hover/tap target. flex:1 keeps the stage
     the same height in both states, so the footnote below never jumps. */
  .pulse-stage {
    display: grid;
    place-items: center;
    width: 100%;
    flex: 1;
    min-height: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .pulse-view {
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }

  .combined-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .pulse-split {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: clamp(12px, 3vw, 32px);
    width: 100%;
    max-width: 860px;
  }

  .split-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .pop-hero.split-hero {
    font-size: clamp(1.4rem, 3.2vw, 2.4rem);
  }

  .split-plus {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 300;
    color: var(--viz-ink-2);
    line-height: 1;
    text-shadow: 0 0 18px rgba(255, 255, 255, 0.15);
  }

  .mini-rows {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 6px;
  }

  .mini-row {
    display: grid;
    grid-template-columns: 10px 52px auto auto;
    align-items: baseline;
    gap: 8px;
    text-align: left;
  }

  .mini-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    align-self: center;

    &.births {
      background: var(--viz-births);
    }
    &.deaths {
      background: var(--viz-deaths);
    }
    &.good {
      background: var(--viz-good);
    }
  }

  .mini-label {
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--viz-muted);
  }

  .mini-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--viz-ink);
    font-variant-numeric: tabular-nums;
  }

  .mini-per {
    font-size: 0.64rem;
    color: var(--viz-muted);
  }

  @media (max-width: 640px) {
    .pulse-split {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .split-plus {
      font-size: 1.6rem;
    }
  }

  .pulse-tiles {
    display: grid;
    grid-template-columns: repeat(3, minmax(150px, 220px));
    gap: 12px;
    justify-content: center;
    width: 100%;

    .tile-value {
      font-size: 1.5rem;
    }

    /* Narrow phones: keep the three tiles on one slim row instead of a
       tall stack, so the combined view stays one screen. */
    @media (max-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;

      .tile {
        padding: 8px 6px;
        align-items: center;
        text-align: center;
      }

      .tile-value {
        font-size: 0.95rem;
      }

      .tile-label {
        font-size: 0.55rem;
      }

      .tile-sub {
        font-size: 0.58rem;
      }
    }
  }

  /* ── LANGUAGE pane ── */
  .language-pane {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 980px;
    width: 100%;
    margin: 0 auto;
  }

  .lang-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .lang-select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--viz-ink);
    font-size: 0.75rem;
    padding: 7px 10px;
    max-width: 260px;
    cursor: pointer;

    option {
      background: #16161c;
      color: #fff;
    }
  }

  .dog-strip {
    font-size: 0.72rem;
    color: var(--viz-ink-2);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 8px 14px;
    align-self: flex-start;
  }

  /* Chart flexes into whatever height remains; the SVG letterboxes inside */
  .chart-fit {
    flex: 1;
    min-height: 120px;

    :global(.proj-svg) {
      width: 100%;
      height: 100%;
    }
  }

  /* ── Centered chart panes (share, balance) ── */
  .center-pane {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 22px;
    text-align: center;
  }

  .share-pane :global(.pie-layout) {
    justify-content: center;
  }

  .share-pane :global(.pie-svg) {
    width: min(300px, 38vh);
    height: min(300px, 38vh);
  }

  .share-pane :global(.pie-legend) {
    min-width: 250px;
    flex: 0 1 auto;
  }

  .balance-chart {
    width: 100%;
    max-width: 860px;

    :global(.lines-legend) {
      justify-content: center;
    }
  }

  /* ── CENSUS pane ── */
  .census-pane {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── Footer ── */
  .panel-footer {
    height: 40px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.3);
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 500;
    letter-spacing: 0.05em;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    flex-shrink: 0;
  }

  .sys-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: monospace;
  }

  .status-indicator-green {
    width: 6px;
    height: 6px;
    background: #00ff66;
    border-radius: 50%;
    display: inline-block;
  }

  .stats-counter {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @keyframes panelSlideUpIn {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.97);
      backdrop-filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDown {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
      backdrop-filter: blur(0px);
    }
  }

  /* ── Responsive Mobile Overrides matching BasePanel ── */
  @media (max-width: 768px) {
    .stats-panel-backdrop {
      display: block;
      height: 100dvh;
    }

    .stats-panel-container {
      width: 100vw;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      border: none;
      animation: panelSlideUpInMobile 0.38s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
    }

    .stats-panel-container.closing {
      animation: panelSlideUpDownMobile 0.32s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
    }

    .panel-header {
      padding: 0 16px;
    }

    .tab-pane {
      padding: 14px 14px 16px;
    }

    .panel-footer {
      height: auto;
      min-height: 48px;
      padding-top: 8px;
      padding-bottom: max(14px, env(safe-area-inset-bottom, 14px));
    }
  }

  /* ── Short viewports (mobile landscape, small laptops) ── */
  @media (max-height: 520px) {
    .stats-panel-backdrop {
      display: block;
      height: 100dvh;
    }

    .stats-panel-container {
      width: 100vw;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      border: none;
    }

    .panel-header {
      height: 44px;
      padding: 0 14px;
    }

    .brand h1 {
      font-size: 0.9rem;
    }

    .subtitle {
      display: none;
    }

    .unit-toggle {
      padding: 4px 10px;
      font-size: 0.66rem;
      min-width: 94px;
    }

    /* Reclaim vertical space: the decorative footer goes, tab buttons slim */
    .panel-footer {
      display: none;
    }

    .stats-panel-container :global(.swipe-tab-nav .tab-btn) {
      padding: 0.3rem 0.75rem;
      font-size: 0.72rem;
      gap: 0.35rem;
    }

    .tab-pane {
      padding: 8px 16px 10px;
    }

    .pane-title {
      font-size: 0.85rem;
    }

    .pane-sub {
      font-size: 0.62rem;
    }

    .pane-footnote {
      font-size: 0.54rem;
      margin-top: auto;
      padding-top: 6px;
    }

    /* Pulse: shrink both states so combined and split fit without scroll */
    .pop-hero {
      font-size: clamp(1.5rem, 8vh, 2.4rem);
    }

    .pop-hero.split-hero {
      font-size: clamp(1.1rem, 6vh, 1.7rem);
    }

    .pulse-sub {
      font-size: 0.62rem;
      margin-bottom: 6px;
    }

    .pulse-eyebrow {
      font-size: 0.6rem;
    }

    /* Combined view goes side-by-side: births/deaths/net stacked on the
       left, the big alive-right-now counter on the right */
    .pulse-view.pulse-combined {
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: clamp(24px, 6vw, 64px);
      width: 100%;
    }

    .pulse-combined .combined-main {
      order: 2;
    }

    .pulse-combined .pulse-tiles {
      order: 1;
      display: flex;
      flex-direction: column;
      width: auto;
      gap: 8px;

      .tile {
        width: 176px;
        padding: 6px 12px;
        flex-direction: row;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        text-align: left;
      }

      .tile-value {
        font-size: 1rem;
      }

      .tile-sub {
        display: none;
      }
    }

    .mini-rows {
      gap: 2px;
      margin-top: 2px;
    }

    .mini-value {
      font-size: 0.8rem;
    }

    .split-plus {
      font-size: 1.6rem;
    }

    /* Language: slim tiles, chart takes what's left */
    .tile {
      padding: 7px 10px;
    }

    .tile-value {
      font-size: 1rem;
    }

    .language-pane {
      gap: 8px;
    }

    .dog-strip {
      padding: 5px 10px;
      font-size: 0.62rem;
    }

    .chart-fit {
      min-height: 90px;
    }

    /* Share: smaller donut, legend scrolls beside it */
    .share-pane :global(.pie-svg) {
      width: min(170px, 52vh);
      height: min(170px, 52vh);
    }

    .share-pane :global(.pie-legend) {
      max-height: 38vh;
    }

    .center-pane {
      gap: 6px;
    }

    /* Life & Death: drop the header, let the chart flex into whatever
       height remains — the SVG letterboxes inside its box */
    .balance-pane > div:first-child {
      display: none;
    }

    .balance-chart {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .balance-chart :global(.lines-svg) {
      flex: 1;
      min-height: 0;
      width: 100%;
    }

    .balance-chart :global(.lines-legend) {
      margin-bottom: 2px;
    }

    .balance-chart :global(.lines-readout) {
      margin-top: 2px;
      font-size: 0.62rem;
    }

    /* Census: search + table only; title and footnote go */
    .census-pane > div:first-child,
    .census-pane .pane-footnote {
      display: none;
    }

    .census-pane {
      gap: 6px;
    }

    .census-pane :global(.table-tools) {
      margin-bottom: 0;
    }

    .census-pane :global(.table-tools input) {
      padding: 4px 10px;
      font-size: 0.72rem;
    }

    .census-pane :global(table) {
      font-size: 0.68rem;
    }

    .census-pane :global(td) {
      padding: 4px 10px;
    }
  }

  @keyframes panelSlideUpInMobile {
    0% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
    100% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDownMobile {
    0% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
  }
</style>
