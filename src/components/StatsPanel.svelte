<script>
  import { ArrowLeft } from "lucide-svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import {
    languageVitals,
    vitalsByCode,
    worldVitals,
    livePopulation,
    speakerShare,
    formatCompact,
    formatInt,
    formatCadence,
  } from "../data/stats/languageVitals.js";
  import SharePie from "./stats/SharePie.svelte";
  import LifeDeathBars from "./stats/LifeDeathBars.svelte";
  import ProjectionChart from "./stats/ProjectionChart.svelte";
  import VitalsTable from "./stats/VitalsTable.svelte";

  let {
    isClosing = false,
    currentLang = $bindable(),
    onClose,
    onHoverLang,
    onSelectLang,
  } = $props();

  // Categorical slots validated for this dark surface (dataviz palette);
  // "Other" folds the tail into a neutral gray.
  const PIE_COLORS = [
    "#3987e5",
    "#d95926",
    "#199e70",
    "#c98500",
    "#d55181",
    "#55555e",
  ];

  const shareData = speakerShare(5);
  const topTen = languageVitals.slice(0, 10);

  let selected = $derived(vitalsByCode[currentLang] || languageVitals[0]);

  function selectLang(code) {
    currentLang = code;
    onHoverLang?.(code);
    onSelectLang?.(code);
  }

  // ── Live "today" tickers ──
  // Estimated events so far today = daily rate × fraction of the local day
  // elapsed, re-derived every second.
  let now = $state(Date.now());

  $effect(() => {
    const id = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(id);
  });

  let dayFraction = $derived.by(() => {
    const d = new Date(now);
    return (
      (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 86_400
    );
  });

  let bornToday = $derived(worldVitals.dailyBirths * dayFraction);
  let diedToday = $derived(worldVitals.dailyDeaths * dayFraction);
  let population = $derived(livePopulation(now));
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

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <ArrowLeft size={20} />
      </button>
    </header>

    <!-- Body: single scientific dashboard, no tabs -->
    <main class="panel-body">
      <!-- 1. World vital signs -->
      <section class="viz-card">
        <header class="card-head">
          <h2>World vital signs</h2>
          <p>
            Humanity's pulse — UN world rates, live · {worldVitals.languageCount}
            languages tracked
          </p>
        </header>
        <div class="tile-row">
          <div class="tile">
            <span class="tile-label">World population</span>
            <span class="tile-value hero pop-live">{formatInt(population)}</span>
            <span class="tile-sub">
              UN estimate · +{worldVitals.netPerSecond.toFixed(1)} per second
            </span>
          </div>
          <div class="tile">
            <span class="tile-label">Born today (est.)</span>
            <span class="tile-value">{formatInt(bornToday)}</span>
            <span class="tile-sub">
              ≈ {worldVitals.birthsPerSecond.toFixed(1)} per second
            </span>
          </div>
          <div class="tile">
            <span class="tile-label">Died today (est.)</span>
            <span class="tile-value">{formatInt(diedToday)}</span>
            <span class="tile-sub">
              ≈ {worldVitals.deathsPerSecond.toFixed(1)} per second
            </span>
          </div>
          <div class="tile">
            <span class="tile-label">Net change / day</span>
            <span class="tile-value">
              {worldVitals.dailyNet >= 0 ? "+" : "−"}{formatCompact(
                Math.abs(worldVitals.dailyNet),
              )}
            </span>
            <span class="tile-sub">births − deaths</span>
          </div>
        </div>
      </section>

      <!-- 2. Selected language -->
      <section class="viz-card">
        <header class="card-head lang-head">
          <div>
            <h2>{selected.name}</h2>
            <p>
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
        </header>

        <div class="tile-row">
          <div class="tile">
            <span class="tile-label">Speakers</span>
            <span class="tile-value">{formatCompact(selected.speakers)}</span>
            <span class="tile-sub">{selected.speakersText}</span>
          </div>
          <div class="tile">
            <span class="tile-label">Births / day</span>
            <span class="tile-value">{formatInt(selected.dailyBirths)}</span>
            <span class="tile-sub">
              one {formatCadence(selected.secondsPerBirth)}
            </span>
          </div>
          <div class="tile">
            <span class="tile-label">Deaths / day</span>
            <span class="tile-value">{formatInt(selected.dailyDeaths)}</span>
            <span class="tile-sub">
              one {formatCadence(selected.secondsPerDeath)}
            </span>
          </div>
          <div class="tile">
            <span class="tile-label">Natural change</span>
            <span class="tile-value">
              {selected.growthRate >= 0 ? "+" : ""}{(
                selected.growthRate * 100
              ).toFixed(2)}%
            </span>
            <span class="tile-sub">per year (CBR − CDR)</span>
          </div>
        </div>

        <h3 class="chart-title">Projected speakers, next 50 years</h3>
        <ProjectionChart vitals={selected} />
      </section>

      <!-- 3. Charts -->
      <div class="chart-grid">
        <section class="viz-card">
          <header class="card-head">
            <h2>Who speaks what</h2>
            <p>
              Share of combined speaker counts — multilinguals appear once per
              language they speak
            </p>
          </header>
          <SharePie data={shareData} colors={PIE_COLORS} />
        </section>

        <section class="viz-card">
          <header class="card-head">
            <h2>Life &amp; death, daily</h2>
            <p>Births and deaths per day, ten largest languages</p>
          </header>
          <LifeDeathBars items={topTen} />
        </section>
      </div>

      <!-- 4. Full table -->
      <section class="viz-card">
        <header class="card-head">
          <h2>Every language</h2>
          <p>
            Crude birth/death rates (per 1,000 speakers per year) and derived
            daily figures — click a row to select
          </p>
        </header>
        <VitalsTable currentLang={selected.code} onSelect={selectLang} />
      </section>

      <p class="methodology">
        Methodology: world vital signs use the UN World Population Prospects
        estimate ({formatCompact(worldVitals.population)} people, CBR
        {worldVitals.birthRate}‰, CDR {worldVitals.deathRate}‰) — never the sum
        of speaker populations, which would double-count multilingual people.
        Per-language daily figures derive from that language's crude birth and
        death rates (events per 1,000 speakers per year, WHO/UN convention)
        applied to its speaker population over a 365.25-day year; those
        populations overlap, so shares are of combined counts. Projections
        assume constant rates.
      </p>
    </main>

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

  /* ── Body ── */
  .panel-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: rgba(0, 0, 0, 0.1);
  }

  .viz-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 18px 20px 20px;
  }

  .card-head {
    margin-bottom: 14px;

    h2 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--viz-ink);
      letter-spacing: 0.02em;
    }

    p {
      margin: 2px 0 0;
      font-size: 0.7rem;
      color: var(--viz-muted);
    }
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

  /* ── Stat tiles ── */
  .tile-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .tile {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
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

  .tile-value.hero {
    font-size: 1.7rem;
  }

  /* Live population counter: tabular digits so the ticking number doesn't
     jitter horizontally; sized to fit all 13 characters. */
  .tile-value.pop-live {
    font-size: 1.4rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .tile-sub {
    font-size: 0.66rem;
    color: var(--viz-muted);
  }

  .chart-title {
    margin: 18px 0 8px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--viz-ink-2);
  }

  /* ── Chart grid ── */
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  .methodology {
    margin: 0;
    font-size: 0.66rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.32);
    max-width: 72ch;
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

    .panel-body {
      padding: 14px 14px 22px;
    }

    .panel-footer {
      height: auto;
      min-height: 48px;
      padding-top: 8px;
      padding-bottom: max(14px, env(safe-area-inset-bottom, 14px));
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
