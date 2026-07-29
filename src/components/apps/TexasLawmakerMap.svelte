<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<script>
  import { spring } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import {
    px,
    py,
    toPath,
    TEXAS_OUTLINE,
    NEIGHBORS,
    HIGHWAYS,
    CITIES,
    LANDMARKS,
    WATER_LABELS,
    RIVERS,
    RIO_GRANDE,
    DEFAULT_VIEW,
    viewAround,
  } from "../../lib/texasGeo.js";

  let {
    lawmakers = [],
    selectedEmails = [],
    focusRequest = null,
    title = "TEXAS LAWMAKERS",
  } = $props();

  let activeEmail = $state(null);
  let hoveredEmail = $state(null);
  let showLegend = $state(false);

  // Spring-animated viewBox, matching the pan/zoom feel of the main /map panel.
  const vx = spring(DEFAULT_VIEW.x, { stiffness: 0.16, damping: 0.86 });
  const vy = spring(DEFAULT_VIEW.y, { stiffness: 0.16, damping: 0.86 });
  const vw = spring(DEFAULT_VIEW.w, { stiffness: 0.16, damping: 0.86 });
  const vh = spring(DEFAULT_VIEW.h, { stiffness: 0.16, damping: 0.86 });

  let zoomFactor = $derived(DEFAULT_VIEW.w / $vw);

  // The SVG scales its viewBox to fit the stage, so a "20 unit" label renders
  // at wildly different physical sizes. Measure the stage and convert desired
  // *screen pixels* into user units, so type is the size we asked for at every
  // zoom level and on every screen.
  let stageW = $state(0);
  let stageH = $state(0);

  let renderScale = $derived(
    stageW && stageH ? Math.min(stageW / $vw, stageH / $vh) : 0,
  );

  /** Screen pixels -> SVG user units. */
  let u = $derived((screenPx) => (renderScale ? screenPx / renderScale : 0));

  // Small screens get slightly tighter type so labels don't collide.
  let compact = $derived(stageW > 0 && stageW < 520);
  let ts = $derived(compact ? 0.82 : 1);

  let activeRep = $derived(
    lawmakers.find((l) => l.email === activeEmail) || null,
  );

  /**
   * A clicked/focused pin wins — otherwise the card would vanish the moment
   * you moved the pointer off the dot toward it. Hover only drives the card
   * when nothing is pinned.
   */
  let infoRep = $derived(
    activeRep || lawmakers.find((l) => l.email === hoveredEmail) || null,
  );

  const texasPath = toPath(TEXAS_OUTLINE, true);
  const rioGrandePath = toPath(RIO_GRANDE);
  const neighborPaths = NEIGHBORS.map((n) => ({ ...n, d: toPath(n.coords, true) }));
  const highwayPaths = HIGHWAYS.map((h) => ({ ...h, d: toPath(h.coords) }));
  const riverPaths = RIVERS.map((r) => ({ ...r, d: toPath(r.coords) }));

  // Quick-jump chips for the places people actually look for.
  const CHIP_NAMES = [
    "DALLAS",
    "HOUSTON",
    "AUSTIN",
    "SAN ANTONIO",
    "FORT WORTH",
    "EL PASO",
    "LUBBOCK",
    "AMARILLO",
    "CORPUS CHRISTI",
    "MCALLEN",
    "GALVESTON",
    "WACO",
    "MIDLAND",
    "TYLER",
  ];
  const chipCities = CHIP_NAMES.map((n) => CITIES.find((c) => c.name === n)).filter(
    Boolean,
  );

  let activeCity = $state(null);

  function initialsOf(rep) {
    const stripped = rep.name.replace(
      /^(Lt\.?\s*Gov\.?|Sen\.?|Rep\.?|Gov\.?)\s*/i,
      "",
    );
    return stripped
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  function setView(v) {
    vx.set(v.x);
    vy.set(v.y);
    vw.set(v.w);
    vh.set(v.h);
  }

  function resetView() {
    activeEmail = null;
    activeCity = null;
    setView(DEFAULT_VIEW);
  }

  function zoomTo(rep) {
    // Clicking the already-focused lawmaker zooms back out — "in and out of their name".
    if (activeEmail === rep.email) {
      resetView();
      return;
    }
    activeCity = null;
    activeEmail = rep.email;
    setView(viewAround(rep.lng, rep.lat, 300));
  }

  function zoomToCity(city) {
    if (activeCity === city.name) {
      resetView();
      return;
    }
    activeEmail = null;
    activeCity = city.name;
    setView(viewAround(city.lng, city.lat, 340));
  }

  function stepZoom(factor) {
    const cx = $vx + $vw / 2;
    const cy = $vy + $vh / 2;
    const nw = Math.min(DEFAULT_VIEW.w, Math.max(180, $vw * factor));
    const nh = (nw * 9) / 16;
    vw.set(nw);
    vh.set(nh);
    vx.set(cx - nw / 2);
    vy.set(cy - nh / 2);
  }

  function isSelected(email) {
    return selectedEmails.includes(email);
  }

  /**
   * Ticking a name in the recipient list drives the map: checking someone
   * flies to them and pops their name, unchecking pulls back out to the whole
   * state. `seq` makes repeat toggles of the same person re-fire.
   */
  let lastFocusSeq = -1;
  $effect(() => {
    const req = focusRequest;
    if (!req || req.seq === lastFocusSeq) return;
    lastFocusSeq = req.seq;
    const rep = lawmakers.find((l) => l.email === req.email);
    if (!rep) return;
    if (req.zoomIn) {
      activeCity = null;
      activeEmail = rep.email;
      setView(viewAround(rep.lng, rep.lat, 300));
    } else {
      resetView();
    }
  });

  // Dots for every real city so you can see where everything is; the *labels*
  // come in progressively, otherwise thirty names fight over the same corner
  // of DFW and none of them are readable.
  function dotVisible(tier) {
    if (tier === 1 || tier === 2) return true;
    return zoomFactor >= 1.6;
  }

  function labelVisible(tier) {
    if (tier === 1) return true;
    if (tier === 2) return zoomFactor >= 1.3;
    return zoomFactor >= 2.2;
  }

  // Zoomed out the map is about *where the cities are*. River names, highway
  // shields, landmark captions and lawmaker names would all pile on top of
  // each other, so they wait until you zoom in — or, for a lawmaker, until you
  // point at their dot.
  let showDetail = $derived(zoomFactor >= 1.6);
</script>

<div class="tx-map">
  <!-- Header -->
  <div class="tx-head">
    <div class="tx-title">
      <span class="tx-dot"></span>
      <span class="tx-title-text">{title}</span>
    </div>
    <div class="tx-tools">
      <button class="tx-btn" onclick={() => stepZoom(0.65)} title="Zoom in">+</button>
      <button class="tx-btn" onclick={() => stepZoom(1.55)} title="Zoom out">−</button>
      <button class="tx-btn" onclick={resetView} title="Reset view">RESET</button>
      <button
        class="tx-btn"
        class:tx-btn-on={showLegend}
        onclick={() => (showLegend = !showLegend)}
        title="Toggle legend">KEY</button
      >
    </div>
  </div>

  <!-- City quick-jump chips -->
  <div class="tx-chips">
    <button
      class="tx-chip tx-chip-all"
      class:on={!activeCity && !activeEmail}
      onclick={resetView}>ALL TEXAS</button
    >
    {#each chipCities as c}
      <button
        class="tx-chip"
        class:on={activeCity === c.name}
        onclick={() => zoomToCity(c)}>{c.name}</button
      >
    {/each}
  </div>

  <div class="tx-stage" bind:clientWidth={stageW} bind:clientHeight={stageH}>
    <svg
      viewBox="{$vx} {$vy} {$vw} {$vh}"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Interactive map of Texas showing state lawmakers"
    >
      <defs>
        <radialGradient id="txGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="txFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#059669" stop-opacity="0.05" />
        </linearGradient>
      </defs>

      <!-- Gulf / open water backdrop -->
      <rect x={$vx} y={$vy} width={$vw} height={$vh} class="tx-water" />

      <!-- Neighbouring states & Mexico -->
      {#each neighborPaths as n}
        <path d={n.d} class="tx-neighbor" vector-effect="non-scaling-stroke" />
      {/each}
      {#each neighborPaths as n}
        <text
          x={px(n.labelAt[0])}
          y={py(n.labelAt[1])}
          class="tx-state-label"
          text-anchor="middle"
          style="font-size: {u(14 * ts)}px">{n.name}</text
        >
      {/each}

      <!-- Texas -->
      <path d={texasPath} class="tx-state" vector-effect="non-scaling-stroke" />

      <!-- Rivers -->
      <path d={rioGrandePath} class="tx-river" vector-effect="non-scaling-stroke" />
      {#each riverPaths as r}
        <path d={r.d} class="tx-river" vector-effect="non-scaling-stroke" />
      {/each}
      {#if showDetail}
        {#each RIVERS as r}
          <text
            transition:fade={{ duration: 160 }}
            x={px(r.labelAt[0])}
            y={py(r.labelAt[1])}
            class="tx-river-label"
            text-anchor="middle"
            transform={r.rotate
              ? `rotate(${r.rotate} ${px(r.labelAt[0])} ${py(r.labelAt[1])})`
              : null}
            style="font-size: {u(9 * ts)}px">{r.name}</text
          >
        {/each}
      {/if}

      <!-- Highways -->
      {#each highwayPaths as h}
        <path
          d={h.d}
          class="tx-hwy"
          class:tx-hwy-us={h.kind === "us"}
          vector-effect="non-scaling-stroke"
        />
      {/each}

      <!-- Highway shields -->
      {#if showDetail}
        {#each HIGHWAYS as h}
          <g transition:fade={{ duration: 160 }}>
            <rect
              x={px(h.shieldAt[0]) - u(17 * ts)}
              y={py(h.shieldAt[1]) - u(8 * ts)}
              width={u(34 * ts)}
              height={u(16 * ts)}
              rx={u(3)}
              class="tx-shield"
              class:tx-shield-us={h.kind === "us"}
              vector-effect="non-scaling-stroke"
            />
            <text
              x={px(h.shieldAt[0])}
              y={py(h.shieldAt[1]) + u(4 * ts)}
              class="tx-shield-text"
              text-anchor="middle"
              style="font-size: {u(9.5 * ts)}px">{h.label}</text
            >
          </g>
        {/each}
      {/if}

      <!-- Water labels -->
      {#each WATER_LABELS as w}
        {#if w.size >= 20 || showDetail}
          <text
            transition:fade={{ duration: 160 }}
            x={px(w.lng)}
            y={py(w.lat)}
            class="tx-water-label"
            text-anchor="middle"
            transform={w.rotate
              ? `rotate(${w.rotate} ${px(w.lng)} ${py(w.lat)})`
              : null}
            style="font-size: {u((w.size >= 20 ? 18 : 9) * ts)}px">{w.name}</text
          >
        {/if}
      {/each}

      <!-- Landmarks -->
      {#each LANDMARKS as lm}
        {#if dotVisible(lm.tier)}
          <g transition:fade={{ duration: 180 }}>
            <text
              x={px(lm.lng)}
              y={py(lm.lat) + u(5)}
              text-anchor="middle"
              style="font-size: {u(15 * ts)}px">{lm.icon}</text
            >
            {#if showDetail}
              <text
                transition:fade={{ duration: 160 }}
                x={px(lm.lng)}
                y={py(lm.lat) + u(18 * ts)}
                class="tx-landmark-label"
                text-anchor="middle"
                style="font-size: {u(8.5 * ts)}px">{lm.name}</text
              >
            {/if}
          </g>
        {/if}
      {/each}

      <!-- Cities -->
      {#each CITIES as c}
        {#if dotVisible(c.tier)}
          <g transition:fade={{ duration: 180 }}>
            {#if c.capital}
              <path
                d="M{px(c.lng)},{py(c.lat) - u(7)} L{px(c.lng) + u(6.5)},{py(
                  c.lat,
                ) + u(4.5)} L{px(c.lng) - u(6.5)},{py(c.lat) + u(4.5)} Z"
                class="tx-capital"
                vector-effect="non-scaling-stroke"
              />
            {:else}
              <circle
                cx={px(c.lng)}
                cy={py(c.lat)}
                r={u(c.tier === 1 ? 4.5 : c.tier === 2 ? 3.2 : 2.4)}
                class="tx-city"
                class:tx-city-major={c.tier === 1}
                vector-effect="non-scaling-stroke"
              />
            {/if}
            {#if labelVisible(c.tier)}
              <text
                transition:fade={{ duration: 160 }}
                x={px(c.lng) + (c.anchor === "end" ? -u(8) : u(8))}
                y={py(c.lat) + u(4.5)}
                text-anchor={c.anchor === "end" ? "end" : "start"}
                class="tx-city-label"
                class:tx-city-label-major={c.tier === 1}
                style="font-size: {u(
                  (c.tier === 1 ? 15 : c.tier === 2 ? 11.5 : 9.5) * ts,
                )}px">{c.name}</text
              >
            {/if}
          </g>
        {/if}
      {/each}

      <!-- Lawmaker pins -->
      {#each lawmakers as rep}
        {@const isOn = isSelected(rep.email)}
        {@const isActive = activeEmail === rep.email}
        {@const isHot = hoveredEmail === rep.email}
        <g
          class="tx-pin"
          class:tx-pin-active={isActive}
          onclick={() => zoomTo(rep)}
          onmouseenter={() => (hoveredEmail = rep.email)}
          onmouseleave={() => (hoveredEmail = null)}
          role="button"
          tabindex="0"
        >
          {#if isActive || isHot}
            <circle cx={px(rep.lng)} cy={py(rep.lat)} r={u(30)} fill="url(#txGlow)" />
          {/if}
          <!-- Zoomed out, six DFW offices sit within a thumbnail of each other,
               so pins stay small dots until you zoom in or point at one. -->
          <circle
            cx={px(rep.lng)}
            cy={py(rep.lat)}
            r={u(showDetail ? 20 : 11)}
            fill="transparent"
          />
          <circle
            cx={px(rep.lng)}
            cy={py(rep.lat)}
            r={u(
              isActive || isHot ? (showDetail ? 12 : 8.5) : showDetail ? 9 : 4.5,
            )}
            class="tx-pin-halo"
            class:tx-pin-on={isOn}
            vector-effect="non-scaling-stroke"
          />
          <circle
            cx={px(rep.lng)}
            cy={py(rep.lat)}
            r={u(
              isActive || isHot ? (showDetail ? 5.5 : 4) : showDetail ? 4 : 2.2,
            )}
            class="tx-pin-core"
            class:tx-pin-on={isOn}
          />
          <!-- Names stay off the map until you point at a dot or zoom in —
               fifteen labels at once is an unreadable pile. -->
          {#if isActive || isHot || showDetail}
            <text
              transition:fade={{ duration: 130 }}
              x={px(rep.lng)}
              y={py(rep.lat) - u(15)}
              text-anchor="middle"
              class="tx-pin-label"
              class:tx-pin-label-active={isActive || isHot}
              style="font-size: {u((isActive || isHot ? 15 : 12.5) * ts)}px"
              >{rep.shortName || rep.name}</text
            >
            <text
              transition:fade={{ duration: 130 }}
              x={px(rep.lng)}
              y={py(rep.lat) - u(15) + u(11 * ts)}
              text-anchor="middle"
              class="tx-pin-sub"
              style="font-size: {u(9 * ts)}px">{rep.title}</text
            >
          {/if}
        </g>
      {/each}
    </svg>

    <!-- Legend -->
    {#if showLegend}
      <div class="tx-legend" transition:fade={{ duration: 140 }}>
        <h4>MAP KEY</h4>
        <div class="tx-legend-row"><span class="sw sw-on"></span> Selected recipient</div>
        <div class="tx-legend-row"><span class="sw sw-off"></span> Lawmaker office</div>
        <div class="tx-legend-row"><span class="sw sw-capital"></span> State capital</div>
        <div class="tx-legend-row"><span class="sw sw-hwy"></span> Interstate</div>
        <div class="tx-legend-row"><span class="sw sw-us"></span> US highway</div>
        <div class="tx-legend-row"><span class="sw sw-river"></span> Major river</div>
        <div class="tx-legend-note">
          Hover a pin for detail · tap to zoom · tap again to zoom out
        </div>
      </div>
    {/if}

    <!-- Lawmaker detail — follows hover, stays pinned on the clicked pin -->
    {#if infoRep}
      {#key infoRep.email}
        <div class="tx-card" transition:fly={{ y: 12, duration: 160 }}>
          <div class="tx-card-head">
            <div
              class="tx-avatar"
              class:on={isSelected(infoRep.email)}
              class:dem={infoRep.party === "D"}
            >
              {initialsOf(infoRep)}
            </div>
            <div class="tx-card-idbox">
              <div class="tx-card-name">{infoRep.name}</div>
              <div class="tx-card-title">
                {infoRep.title}{infoRep.party ? ` · ${infoRep.party}` : ""}
              </div>
            </div>
            {#if activeRep}
              <button class="tx-card-x" onclick={resetView} aria-label="Close"
                >✕</button
              >
            {/if}
          </div>

          <div class="tx-card-meta">
            <span>📍 {infoRep.hometown || infoRep.region}</span>
            {#if infoRep.phone}<span>☎ {infoRep.phone}</span>{/if}
          </div>

          {#if infoRep.record}
            <div class="tx-card-record">
              <span class="tx-tag tx-tag-hot">ON THIS ISSUE</span>
              {infoRep.record}
            </div>
          {/if}

          {#if infoRep.counties}
            <div class="tx-card-counties">
              <span class="tx-tag">REPRESENTS</span>
              {infoRep.counties}
            </div>
          {/if}

          <div class="tx-card-email">{infoRep.email}</div>
          {#if infoRep.emailVerified === false}
            <div class="tx-card-warn">
              ⚠ Address unconfirmed — verify before sending
            </div>
          {/if}

          <div class="tx-card-status" class:on={isSelected(infoRep.email)}>
            {isSelected(infoRep.email)
              ? "✓ ON YOUR MAIL LIST"
              : "○ NOT ON YOUR MAIL LIST"}
          </div>
        </div>
      {/key}
    {/if}

    <!-- Zoom readout -->
    <div class="tx-zoom">{zoomFactor.toFixed(1)}×</div>
  </div>
</div>

<style>
  .tx-map {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: radial-gradient(circle at 50% 40%, #0b1220 0%, #05070c 100%);
    overflow: hidden;
  }

  .tx-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 5px 8px;
    border-bottom: 1px solid rgba(16, 185, 129, 0.18);
    background: rgba(0, 0, 0, 0.55);
    z-index: 5;
    flex-shrink: 0;
  }

  .tx-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: ui-monospace, "SFMono-Regular", monospace;
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: #d4d4d8;
    min-width: 0;
  }

  .tx-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tx-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
    animation: txPulse 1.8s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes txPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.8); }
  }

  .tx-tools {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .tx-btn {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.75);
    font-family: ui-monospace, monospace;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 3px 7px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.18s ease;
    line-height: 1.4;
  }

  .tx-btn:hover {
    background: rgba(16, 185, 129, 0.18);
    border-color: rgba(16, 185, 129, 0.5);
    color: #fff;
  }

  .tx-btn-on {
    background: rgba(16, 185, 129, 0.25);
    border-color: rgba(16, 185, 129, 0.6);
    color: #fff;
  }

  /* --- city jump chips --- */
  .tx-chips {
    display: flex;
    gap: 4px;
    padding: 5px 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    flex-shrink: 0;
    z-index: 5;
  }

  .tx-chips::-webkit-scrollbar { display: none; }

  .tx-chip {
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.72);
    font-family: ui-monospace, monospace;
    font-size: 0.53rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    padding: 3px 8px;
    border-radius: 999px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.16s ease;
  }

  .tx-chip:hover {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
  }

  .tx-chip.on {
    background: rgba(16, 185, 129, 0.85);
    border-color: #10b981;
    color: #04110b;
  }

  .tx-chip-all {
    border-color: rgba(16, 185, 129, 0.45);
    color: #6ee7b7;
  }

  .tx-stage {
    position: relative;
    flex: 1;
    min-height: 0;
  }

  .tx-stage svg {
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
  }

  /* --- geography --- */
  .tx-water { fill: #060a12; }

  .tx-neighbor {
    fill: rgba(255, 255, 255, 0.04);
    stroke: rgba(255, 255, 255, 0.22);
    stroke-width: 1.2px;
  }

  .tx-state {
    fill: url(#txFill);
    stroke: #10b981;
    stroke-width: 2.2px;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.35));
  }

  .tx-river {
    fill: none;
    stroke: #38bdf8;
    stroke-width: 1.3px;
    stroke-opacity: 0.62;
    stroke-linecap: round;
  }

  .tx-river-label {
    fill: rgba(56, 189, 248, 0.72);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.14em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.9);
    stroke-width: 2.4px;
    pointer-events: none;
    user-select: none;
  }

  .tx-hwy {
    fill: none;
    stroke: #f59e0b;
    stroke-width: 1.6px;
    stroke-opacity: 0.72;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .tx-hwy-us {
    stroke: #94a3b8;
    stroke-width: 1.1px;
    stroke-opacity: 0.55;
    stroke-dasharray: 5 4;
  }

  .tx-shield {
    fill: rgba(10, 10, 15, 0.9);
    stroke: #f59e0b;
    stroke-width: 1px;
  }

  .tx-shield-us { stroke: #94a3b8; }

  .tx-shield-text {
    fill: #fbbf24;
    font-family: ui-monospace, monospace;
    font-weight: 800;
    letter-spacing: 0.02em;
    pointer-events: none;
    user-select: none;
  }

  .tx-state-label {
    fill: rgba(255, 255, 255, 0.34);
    font-family: ui-monospace, monospace;
    font-weight: 800;
    letter-spacing: 0.3em;
    pointer-events: none;
    user-select: none;
  }

  .tx-water-label {
    fill: rgba(56, 189, 248, 0.45);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    font-style: italic;
    letter-spacing: 0.22em;
    pointer-events: none;
    user-select: none;
  }

  .tx-city {
    fill: #e4e4e7;
    stroke: #09090b;
    stroke-width: 1px;
  }

  .tx-city-major {
    fill: #fff;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
  }

  .tx-capital {
    fill: #fbbf24;
    stroke: #09090b;
    stroke-width: 1px;
    filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.7));
  }

  .tx-city-label {
    fill: rgba(235, 235, 240, 0.88);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.06em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.92);
    stroke-width: 3px;
    pointer-events: none;
    user-select: none;
  }

  .tx-city-label-major {
    fill: #fff;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  .tx-landmark-label {
    fill: rgba(251, 191, 36, 0.82);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.06em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.92);
    stroke-width: 2.6px;
    pointer-events: none;
    user-select: none;
  }

  /* --- lawmaker pins --- */
  .tx-pin { cursor: pointer; }

  .tx-pin-halo {
    fill: rgba(239, 68, 68, 0.14);
    stroke: #ef4444;
    stroke-width: 1.6px;
    transition: all 0.2s ease;
  }

  .tx-pin-core {
    fill: #ef4444;
    transition: all 0.2s ease;
  }

  .tx-pin-halo.tx-pin-on {
    fill: rgba(16, 185, 129, 0.18);
    stroke: #10b981;
  }

  .tx-pin-core.tx-pin-on { fill: #10b981; }

  .tx-pin:hover .tx-pin-halo { stroke-width: 2.4px; }

  .tx-pin-active .tx-pin-core { filter: drop-shadow(0 0 8px currentColor); }

  .tx-pin-label {
    fill: #fff;
    font-family: ui-monospace, monospace;
    font-weight: 900;
    letter-spacing: 0.05em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.96);
    stroke-width: 3.4px;
    pointer-events: none;
    user-select: none;
  }

  .tx-pin-label-active {
    fill: #6ee7b7;
    letter-spacing: 0.09em;
  }

  .tx-pin-sub {
    fill: rgba(255, 255, 255, 0.75);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.06em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.96);
    stroke-width: 2.8px;
    pointer-events: none;
    user-select: none;
  }

  /* --- overlays --- */
  .tx-legend {
    position: absolute;
    left: 8px;
    bottom: 8px;
    background: rgba(5, 7, 12, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px 10px;
    font-family: ui-monospace, monospace;
    z-index: 6;
    max-width: 190px;
  }

  .tx-legend h4 {
    margin: 0 0 6px;
    font-size: 0.52rem;
    letter-spacing: 0.16em;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 800;
  }

  .tx-legend-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 3px;
  }

  .sw {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .sw-on { background: #10b981; box-shadow: 0 0 6px #10b981; }
  .sw-off { background: #ef4444; }
  .sw-capital {
    background: #fbbf24;
    border-radius: 0;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
  .sw-hwy { background: #f59e0b; height: 3px; border-radius: 2px; }
  .sw-us { background: #94a3b8; height: 3px; border-radius: 2px; }
  .sw-river { background: #38bdf8; height: 3px; border-radius: 2px; }

  .tx-legend-note {
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.5;
  }

  .tx-card {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: min(272px, calc(100% - 16px));
    max-height: calc(100% - 16px);
    overflow-y: auto;
    background: rgba(5, 7, 12, 0.96);
    border: 1px solid rgba(16, 185, 129, 0.4);
    border-radius: 10px;
    padding: 9px 11px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
    font-family: ui-monospace, monospace;
    z-index: 7;
  }

  .tx-card-head {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .tx-avatar {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    color: #fecaca;
    background: linear-gradient(145deg, rgba(239, 68, 68, 0.35), rgba(127, 29, 29, 0.5));
    border: 1px solid rgba(239, 68, 68, 0.55);
  }

  .tx-avatar.dem {
    color: #bfdbfe;
    background: linear-gradient(145deg, rgba(59, 130, 246, 0.35), rgba(30, 58, 138, 0.5));
    border-color: rgba(59, 130, 246, 0.55);
  }

  .tx-avatar.on {
    color: #04110b;
    background: linear-gradient(145deg, #34d399, #059669);
    border-color: #10b981;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
  }

  .tx-card-idbox { flex: 1; min-width: 0; }

  .tx-card-name {
    font-size: 0.72rem;
    font-weight: 900;
    color: #fff;
    letter-spacing: 0.03em;
    line-height: 1.25;
  }

  .tx-card-x {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 0.7rem;
    padding: 0 2px;
    line-height: 1;
    flex-shrink: 0;
  }

  .tx-card-x:hover { color: #fff; }

  .tx-card-title {
    font-size: 0.56rem;
    color: #6ee7b7;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-top: 2px;
  }

  .tx-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.53rem;
    color: rgba(255, 255, 255, 0.62);
    margin-top: 6px;
  }

  .tx-tag {
    display: inline-block;
    font-size: 0.44rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 3px;
    padding: 0 3px;
    margin-right: 4px;
    vertical-align: 1px;
  }

  .tx-tag-hot {
    color: #fca5a5;
    border-color: rgba(239, 68, 68, 0.5);
    background: rgba(239, 68, 68, 0.12);
  }

  .tx-card-record {
    font-size: 0.53rem;
    color: rgba(255, 255, 255, 0.82);
    margin-top: 6px;
    line-height: 1.5;
  }

  .tx-card-counties {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 5px;
    line-height: 1.45;
  }

  .tx-card-email {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.55);
    margin-top: 5px;
    word-break: break-all;
  }

  .tx-card-warn {
    font-size: 0.48rem;
    color: #fbbf24;
    margin-top: 3px;
    line-height: 1.4;
  }

  /* Read-only status — the recipient list below the map is the control. */
  .tx-card-status {
    margin-top: 7px;
    padding: 4px 6px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.5rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .tx-card-status.on {
    border-color: rgba(16, 185, 129, 0.55);
    background: rgba(16, 185, 129, 0.16);
    color: #6ee7b7;
  }

  .tx-zoom {
    position: absolute;
    top: 8px;
    right: 8px;
    font-family: ui-monospace, monospace;
    font-size: 0.52rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 2px 6px;
    pointer-events: none;
    z-index: 6;
  }

  @media (prefers-reduced-motion: reduce) {
    .tx-dot { animation: none; }
  }
</style>
