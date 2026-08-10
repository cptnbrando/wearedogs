<script>
  import { formatCompact } from "../../data/stats/languageVitals.js";

  /** data: [{ code, name, speakers, share }] — top slices + folded "Other" */
  let { data = [], colors = [] } = $props();

  const CX = 110;
  const CY = 110;
  const R = 88;
  const INNER = 52;

  let hovered = $state(-1);

  function polar(angle, radius) {
    return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
  }

  // Donut slice path from startAngle to endAngle (radians)
  function slicePath(a0, a1) {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const [x0, y0] = polar(a0, R);
    const [x1, y1] = polar(a1, R);
    const [x2, y2] = polar(a1, INNER);
    const [x3, y3] = polar(a0, INNER);
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${INNER} ${INNER} 0 ${large} 0 ${x3} ${y3} Z`;
  }

  let slices = $derived.by(() => {
    let angle = -Math.PI / 2;
    return data.map((d, i) => {
      const sweep = d.share * Math.PI * 2;
      const a0 = angle;
      const a1 = angle + sweep;
      angle = a1;
      const mid = (a0 + a1) / 2;
      const [lx, ly] = polar(mid, (R + INNER) / 2);
      return { ...d, i, path: slicePath(a0, a1), lx, ly };
    });
  });

  let total = $derived(data.reduce((s, d) => s + d.speakers, 0));
  let readout = $derived(hovered >= 0 ? slices[hovered] : null);

  // In-fill labels are the one place text sits on a series color: pick
  // white or ink by the fill's luminance so contrast always clears.
  function labelInk(hex) {
    if (!hex || hex[0] !== "#") return "#fff";
    const n = parseInt(hex.slice(1), 16);
    const lum =
      0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
    return lum > 150 ? "#0b0b0b" : "#ffffff";
  }
</script>

<div class="pie-layout">
  <svg
    viewBox="0 0 220 220"
    class="pie-svg"
    role="img"
    aria-label="Share of all tracked speakers by language"
    onmouseleave={() => (hovered = -1)}
  >
    {#each slices as s (s.code)}
      <path
        d={s.path}
        fill={colors[s.i]}
        class="slice"
        class:dimmed={hovered >= 0 && hovered !== s.i}
        onmouseenter={() => (hovered = s.i)}
        role="presentation"
      />
      {#if s.share >= 0.07}
        <text
          x={s.lx}
          y={s.ly}
          text-anchor="middle"
          dominant-baseline="central"
          class="slice-label"
          fill={labelInk(colors[s.i])}
        >
          {Math.round(s.share * 100)}%
        </text>
      {/if}
    {/each}
    <text x={CX} y={CY - 8} text-anchor="middle" class="center-value">
      {formatCompact(total)}
    </text>
    <text x={CX} y={CY + 12} text-anchor="middle" class="center-caption">
      speakers
    </text>
  </svg>

  <ul class="pie-legend">
    {#each slices as s (s.code)}
      <li
        class:active={hovered === s.i}
        onmouseenter={() => (hovered = s.i)}
        onmouseleave={() => (hovered = -1)}
      >
        <span class="swatch" style="background:{colors[s.i]}"></span>
        <span class="legend-name">{s.name}</span>
        <span class="legend-value">{formatCompact(s.speakers)}</span>
        <span class="legend-share">{(s.share * 100).toFixed(1)}%</span>
      </li>
    {/each}
  </ul>
</div>

<div class="pie-readout" aria-live="polite">
  {#if readout}
    <strong>{readout.name}</strong> — {formatCompact(readout.speakers)} speakers ·
    {(readout.share * 100).toFixed(1)}% of all tracked
  {:else}
    Hover a slice for details
  {/if}
</div>

<style lang="scss">
  .pie-layout {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .pie-svg {
    width: 200px;
    height: 200px;
    flex-shrink: 0;
  }

  .slice {
    stroke: var(--viz-surface);
    stroke-width: 2;
    transition: opacity 0.15s ease;
    cursor: pointer;
  }

  .slice.dimmed {
    opacity: 0.35;
  }

  .slice-label {
    font-size: 11px;
    font-weight: 700;
    pointer-events: none;
  }

  .center-value {
    font-size: 20px;
    font-weight: 700;
    fill: var(--viz-ink);
  }

  .center-caption {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    fill: var(--viz-muted);
  }

  .pie-legend {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 210px;
    flex: 1;
  }

  .pie-legend li {
    display: grid;
    grid-template-columns: 10px 1fr auto auto;
    align-items: center;
    gap: 8px;
    padding: 3px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s ease;

    &.active {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }

  .legend-name {
    font-size: 0.75rem;
    color: var(--viz-ink-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .legend-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--viz-ink);
    font-variant-numeric: tabular-nums;
  }

  .legend-share {
    font-size: 0.7rem;
    color: var(--viz-muted);
    font-variant-numeric: tabular-nums;
    min-width: 42px;
    text-align: right;
  }

  .pie-readout {
    margin-top: 10px;
    font-size: 0.72rem;
    color: var(--viz-muted);
    min-height: 1.2em;

    strong {
      color: var(--viz-ink-2);
      font-weight: 600;
    }
  }
</style>
