<script>
  import { formatRate } from "../../data/stats/languageVitals.js";
  import { RATE_UNITS, rateUnitState } from "../../data/stats/rateUnits.svelte.js";

  /** items: language vitals rows, largest speaker populations first */
  let { items = [] } = $props();

  const W = 640;
  const H = 270;
  const M = { t: 18, r: 88, b: 48, l: 60 };

  let hovered = $state(-1);

  let unit = $derived(RATE_UNITS[rateUnitState.idx]);
  let factor = $derived(unit.perDay);

  function x(i) {
    return M.l + (i * (W - M.l - M.r)) / (items.length - 1 || 1);
  }

  let maxV = $derived(
    Math.max(
      ...items.flatMap((d) => [d.dailyBirths, d.dailyDeaths]),
      Number.MIN_VALUE,
    ) *
      factor *
      1.08,
  );

  function y(v) {
    return M.t + (1 - v / maxV) * (H - M.t - M.b);
  }

  let pts = $derived(
    items.map((d, i) => ({
      ...d,
      px: x(i),
      yB: y(d.dailyBirths * factor),
      yD: y(d.dailyDeaths * factor),
    })),
  );

  function linePath(key) {
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.px.toFixed(1)} ${p[key].toFixed(1)}`)
      .join(" ");
  }

  // The gap between the lines, one quad per segment, colored by whichever
  // rate is higher across that segment — the chart's whole point.
  let gapSegments = $derived(
    pts.slice(0, -1).map((p, i) => {
      const q = pts[i + 1];
      const birthsLead = p.yB + q.yB < p.yD + q.yD; // lower y = higher value
      return {
        path: `M ${p.px} ${p.yB} L ${q.px} ${q.yB} L ${q.px} ${q.yD} L ${p.px} ${p.yD} Z`,
        birthsLead,
      };
    }),
  );

  // 3 clean horizontal gridline values
  let yTicks = $derived.by(() => {
    const raw = maxV / 3;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10]
      .map((m) => m * pow)
      .reduce((best, c) => (Math.abs(c - raw) < Math.abs(best - raw) ? c : best));
    const out = [];
    for (let v = step; v <= maxV; v += step) out.push(v);
    return out;
  });

  let readout = $derived(hovered >= 0 ? pts[hovered] : null);
  let readoutRatio = $derived.by(() => {
    if (!readout) return null;
    const b = readout.dailyBirths;
    const d = readout.dailyDeaths;
    return b >= d
      ? `births outpace deaths ${(b / d).toFixed(1)}×`
      : `deaths outpace births ${(d / b).toFixed(1)}×`;
  });
</script>

<div class="lines-legend">
  <span class="key"><span class="swatch births"></span>Births / {unit.noun}</span>
  <span class="key"><span class="swatch deaths"></span>Deaths / {unit.noun}</span>
</div>

<svg
  viewBox="0 0 {W} {H}"
  class="lines-svg"
  role="img"
  aria-label="Births versus deaths per {unit.noun} for the ten largest languages"
  onmouseleave={() => (hovered = -1)}
>
  {#each yTicks as t (t)}
    <line x1={M.l} y1={y(t)} x2={W - M.r} y2={y(t)} class="gridline" />
    <text x={M.l - 8} y={y(t)} text-anchor="end" dominant-baseline="central" class="tick-label">
      {formatRate(t)}
    </text>
  {/each}
  <line x1={M.l} y1={H - M.b} x2={W - M.r} y2={H - M.b} class="baseline" />

  <!-- the gap: blue where life is winning, red where death is -->
  {#each gapSegments as seg, i (i)}
    <path d={seg.path} class="gap" class:births-lead={seg.birthsLead} />
  {/each}

  <path d={linePath("yD")} class="line deaths" />
  <path d={linePath("yB")} class="line births" />

  {#if readout}
    <line x1={readout.px} y1={M.t} x2={readout.px} y2={H - M.b} class="crosshair" />
  {/if}

  {#each pts as p, i (p.code)}
    <circle cx={p.px} cy={p.yD} r={hovered === i ? 5 : 4} class="marker deaths" />
    <circle cx={p.px} cy={p.yB} r={hovered === i ? 5 : 4} class="marker births" />
    <text
      x={p.px}
      y={H - M.b + 12}
      class="x-label"
      class:active={hovered === i}
      text-anchor="end"
      transform="rotate(-30 {p.px} {H - M.b + 12})"
    >
      {p.name}
    </text>
    <rect
      x={p.px - (W - M.l - M.r) / (items.length - 1 || 1) / 2}
      y={M.t}
      width={(W - M.l - M.r) / (items.length - 1 || 1)}
      height={H - M.t - M.b}
      fill="transparent"
      onmouseenter={() => (hovered = i)}
      role="presentation"
    />
  {/each}

  <!-- series labels riding the line ends -->
  {#if pts.length}
    <circle cx={pts[pts.length - 1].px + 12} cy={pts[pts.length - 1].yB} r="3" class="marker births" />
    <text x={pts[pts.length - 1].px + 19} y={pts[pts.length - 1].yB} dominant-baseline="central" class="end-label">
      Births
    </text>
    <circle cx={pts[pts.length - 1].px + 12} cy={pts[pts.length - 1].yD} r="3" class="marker deaths" />
    <text x={pts[pts.length - 1].px + 19} y={pts[pts.length - 1].yD} dominant-baseline="central" class="end-label">
      Deaths
    </text>
  {/if}
</svg>

<div class="lines-readout" aria-live="polite">
  {#if readout}
    <strong>{readout.name}</strong> — {formatRate(readout.dailyBirths * factor)}
    born / {formatRate(readout.dailyDeaths * factor)} die per {unit.noun} ·
    {readoutRatio}
  {:else}
    Hover a language — blue fill means births are winning, red means deaths are
  {/if}
</div>

<style lang="scss">
  .lines-legend {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
  }

  .key {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.7rem;
    color: var(--viz-ink-2);
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;

    &.births {
      background: var(--viz-births);
    }
    &.deaths {
      background: var(--viz-deaths);
    }
  }

  .lines-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .line {
    fill: none;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;

    &.births {
      stroke: var(--viz-births);
    }
    &.deaths {
      stroke: var(--viz-deaths);
    }
  }

  .gap {
    fill: var(--viz-deaths);
    opacity: 0.12;
    transition: opacity 0.15s ease;

    &.births-lead {
      fill: var(--viz-births);
    }
  }

  .marker {
    stroke: var(--viz-surface);
    stroke-width: 2;

    &.births {
      fill: var(--viz-births);
    }
    &.deaths {
      fill: var(--viz-deaths);
    }
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

  .x-label {
    font-size: 9px;
    fill: var(--viz-muted);

    &.active {
      fill: var(--viz-ink);
    }
  }

  .end-label {
    font-size: 10px;
    font-weight: 600;
    fill: var(--viz-ink-2);
  }

  .lines-readout {
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
