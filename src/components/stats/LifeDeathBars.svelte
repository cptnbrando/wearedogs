<script>
  import { formatCompact, formatInt } from "../../data/stats/languageVitals.js";

  /** items: language vitals rows, largest speaker populations first */
  let { items = [] } = $props();

  const W = 640;
  const GUTTER = 96; // left column for language names
  const PAD_R = 14;
  const ROW_H = 27;
  const BAR_H = 12;
  const TOP = 8;

  let hovered = $state(-1);

  let maxVal = $derived(
    Math.max(...items.map((d) => Math.max(d.dailyBirths, d.dailyDeaths)), 1),
  );
  let half = $derived((W - GUTTER - PAD_R) / 2);
  let cx = $derived(GUTTER + half); // the zero baseline
  let scale = $derived(half / (maxVal * 1.08));
  let height = $derived(TOP + items.length * ROW_H + 26);

  // One clean mirrored tick per side, at roughly half the max
  let tick = $derived.by(() => {
    const raw = maxVal / 2;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const candidates = [1, 2, 2.5, 5, 10].map((m) => m * pow);
    return candidates.reduce((best, c) =>
      Math.abs(c - raw) < Math.abs(best - raw) ? c : best,
    );
  });

  // Rounded far end, square at the baseline (r capped by bar size)
  function barPath(x, w, y, rightward) {
    const r = Math.min(4, w, BAR_H / 2);
    if (w <= 0) return "";
    if (rightward) {
      return `M ${x} ${y} h ${w - r} a ${r} ${r} 0 0 1 ${r} ${r} v ${BAR_H - 2 * r} a ${r} ${r} 0 0 1 ${-r} ${r} h ${-(w - r)} Z`;
    }
    return `M ${x} ${y} h ${-(w - r)} a ${r} ${r} 0 0 0 ${-r} ${r} v ${BAR_H - 2 * r} a ${r} ${r} 0 0 0 ${r} ${r} h ${w - r} Z`;
  }

  let readout = $derived(hovered >= 0 ? items[hovered] : null);
</script>

<div class="bars-legend">
  <span class="key"><span class="swatch deaths"></span>Deaths / day</span>
  <span class="key"><span class="swatch births"></span>Births / day</span>
</div>

<svg
  viewBox="0 0 {W} {height}"
  class="bars-svg"
  role="img"
  aria-label="Daily births and deaths for the largest languages"
  onmouseleave={() => (hovered = -1)}
>
  <!-- mirrored ticks + hairlines -->
  {#each [-1, 1] as dir}
    <line
      x1={cx + dir * tick * scale}
      y1={TOP}
      x2={cx + dir * tick * scale}
      y2={TOP + items.length * ROW_H}
      class="gridline"
    />
    <text x={cx + dir * tick * scale} y={height - 8} text-anchor="middle" class="tick-label">
      {formatCompact(tick)}
    </text>
  {/each}
  <!-- zero baseline -->
  <line x1={cx} y1={TOP} x2={cx} y2={TOP + items.length * ROW_H} class="baseline" />
  <text x={cx} y={height - 8} text-anchor="middle" class="tick-label">0</text>

  {#each items as d, i (d.code)}
    {@const y = TOP + i * ROW_H + (ROW_H - BAR_H) / 2}
    <g class:dimmed={hovered >= 0 && hovered !== i}>
      <text
        x={GUTTER - 8}
        y={y + BAR_H / 2}
        text-anchor="end"
        dominant-baseline="central"
        class="row-label"
      >
        {d.name}
      </text>
      <!-- deaths grow left, births grow right; 2px surface gap at the baseline -->
      <path d={barPath(cx - 2, d.dailyDeaths * scale, y, false)} class="bar deaths" />
      <path d={barPath(cx + 2, d.dailyBirths * scale, y, true)} class="bar births" />
      {#if i === 0}
        <text x={cx - 2 - d.dailyDeaths * scale - 5} y={y + BAR_H / 2} text-anchor="end" dominant-baseline="central" class="end-label">
          {formatCompact(d.dailyDeaths)}
        </text>
        <text x={cx + 2 + d.dailyBirths * scale + 5} y={y + BAR_H / 2} dominant-baseline="central" class="end-label">
          {formatCompact(d.dailyBirths)}
        </text>
      {/if}
    </g>
    <!-- full-row hover target -->
    <rect
      x="0"
      y={TOP + i * ROW_H}
      width={W}
      height={ROW_H}
      fill="transparent"
      onmouseenter={() => (hovered = i)}
      role="presentation"
    />
  {/each}
</svg>

<div class="bars-readout" aria-live="polite">
  {#if readout}
    <strong>{readout.name}</strong> — {formatInt(readout.dailyBirths)} born /
    {formatInt(readout.dailyDeaths)} die per day · net
    {readout.dailyNet >= 0 ? "+" : "−"}{formatInt(Math.abs(readout.dailyNet))}
  {:else}
    Hover a row for exact figures
  {/if}
</div>

<style lang="scss">
  .bars-legend {
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

  .bars-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .bar.births {
    fill: var(--viz-births);
  }

  .bar.deaths {
    fill: var(--viz-deaths);
  }

  g {
    transition: opacity 0.15s ease;

    &.dimmed {
      opacity: 0.35;
    }
  }

  .row-label {
    font-size: 11px;
    fill: var(--viz-ink-2);
  }

  .end-label {
    font-size: 10px;
    font-weight: 600;
    fill: var(--viz-ink);
  }

  .tick-label {
    font-size: 9px;
    fill: var(--viz-muted);
    font-variant-numeric: tabular-nums;
  }

  .gridline {
    stroke: var(--viz-grid);
    stroke-width: 1;
  }

  .baseline {
    stroke: var(--viz-axis);
    stroke-width: 1;
  }

  .bars-readout {
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
