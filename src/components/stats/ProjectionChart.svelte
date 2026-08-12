<script>
  import {
    projectSpeakers,
    formatCompact,
    formatInt,
  } from "../../data/stats/languageVitals.js";

  /** vitals: one language's row from languageVitals */
  let { vitals } = $props();

  const W = 640;
  const H = 240;
  const M = { t: 18, r: 74, b: 30, l: 56 };
  const YEARS = 50;
  const START_YEAR = 2026;

  let hovered = $state(-1);

  let points = $derived(projectSpeakers(vitals, YEARS, 1, START_YEAR));
  let maxY = $derived(Math.max(...points.map((p) => p.speakers)) * 1.06);

  function x(year) {
    return M.l + ((year - START_YEAR) / YEARS) * (W - M.l - M.r);
  }
  function y(v) {
    return M.t + (1 - v / maxY) * (H - M.t - M.b);
  }

  let linePath = $derived(
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year).toFixed(1)} ${y(p.speakers).toFixed(1)}`)
      .join(" "),
  );
  let areaPath = $derived(
    `${linePath} L ${x(START_YEAR + YEARS)} ${y(0)} L ${x(START_YEAR)} ${y(0)} Z`,
  );

  // 4 clean horizontal gridline values
  let yTicks = $derived.by(() => {
    const raw = maxY / 4;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10]
      .map((m) => m * pow)
      .reduce((best, c) => (Math.abs(c - raw) < Math.abs(best - raw) ? c : best));
    const out = [];
    for (let v = step; v <= maxY; v += step) out.push(v);
    return out;
  });

  let xTicks = $derived(
    Array.from({ length: YEARS / 10 + 1 }, (_, i) => START_YEAR + i * 10),
  );

  let endPoint = $derived(points[points.length - 1]);
  let hoveredPoint = $derived(hovered >= 0 ? points[hovered] : null);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const year = START_YEAR + ((px - M.l) / (W - M.l - M.r)) * YEARS;
    hovered = Math.max(0, Math.min(YEARS, Math.round(year - START_YEAR)));
  }
</script>

<svg
  viewBox="0 0 {W} {H}"
  class="proj-svg"
  role="img"
  aria-label="Projected {vitals.name} speakers over the next {YEARS} years"
  onmousemove={handleMove}
  onmouseleave={() => (hovered = -1)}
>
  {#each yTicks as t (t)}
    <line x1={M.l} y1={y(t)} x2={W - M.r} y2={y(t)} class="gridline" />
    <text x={M.l - 8} y={y(t)} text-anchor="end" dominant-baseline="central" class="tick-label">
      {formatCompact(t)}
    </text>
  {/each}
  <line x1={M.l} y1={y(0)} x2={W - M.r} y2={y(0)} class="baseline" />
  {#each xTicks as t (t)}
    <text x={x(t)} y={H - 10} text-anchor="middle" class="tick-label">{t}</text>
  {/each}

  <path d={areaPath} class="area" />
  <path d={linePath} class="line" />

  {#if hoveredPoint}
    <line x1={x(hoveredPoint.year)} y1={M.t} x2={x(hoveredPoint.year)} y2={y(0)} class="crosshair" />
    <circle cx={x(hoveredPoint.year)} cy={y(hoveredPoint.speakers)} r="4" class="marker" />
  {/if}

  <!-- end marker: 2px surface ring + direct label -->
  <circle cx={x(endPoint.year)} cy={y(endPoint.speakers)} r="4" class="marker" />
  <text
    x={x(endPoint.year) + 10}
    y={y(endPoint.speakers)}
    dominant-baseline="central"
    class="end-label"
  >
    {formatCompact(endPoint.speakers)}
  </text>
</svg>

<div class="proj-readout" aria-live="polite">
  {#if hoveredPoint}
    <strong>{hoveredPoint.year}</strong> — {formatInt(hoveredPoint.speakers)} projected
    speakers
  {:else}
    At the current rates, {vitals.name} reaches {formatCompact(endPoint.speakers)}
    speakers by {endPoint.year}
    ({vitals.growthRate >= 0 ? "+" : ""}{(vitals.growthRate * 100).toFixed(2)}%/yr natural change)
  {/if}
</div>

<style lang="scss">
  .proj-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .line {
    fill: none;
    stroke: var(--viz-births);
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .area {
    fill: var(--viz-births);
    opacity: 0.1;
  }

  .marker {
    fill: var(--viz-births);
    stroke: var(--viz-surface);
    stroke-width: 2;
  }

  .crosshair {
    stroke: var(--viz-axis);
    stroke-width: 1;
  }

  .gridline {
    stroke: var(--viz-grid);
    stroke-width: 1;
  }

  .baseline {
    stroke: var(--viz-axis);
    stroke-width: 1;
  }

  .tick-label {
    font-size: 9px;
    fill: var(--viz-muted);
    font-variant-numeric: tabular-nums;
  }

  .end-label {
    font-size: 10px;
    font-weight: 600;
    fill: var(--viz-ink);
  }

  .proj-readout {
    margin-top: 8px;
    font-size: 0.72rem;
    color: var(--viz-muted);
    min-height: 1.2em;

    strong {
      color: var(--viz-ink-2);
      font-weight: 600;
    }
  }
</style>
