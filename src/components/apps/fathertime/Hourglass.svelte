<script>
  import { onMount, onDestroy } from "svelte";

  let {
    now = new Date(),
    currentMode = $bindable("minute")
  } = $props();

  // --- Canvas ---
  let canvasEl = $state();
  let widgetEl = $state();
  let animationId = null;

  // Canvas constants — NEVER change, widget size is always fixed
  const W        = 160;
  const H        = 240;
  const NECK_Y   = H / 2;
  const NECK_X   = W / 2;
  const PAD      = 14;
  const G_BASE   = 0.052; // base gravity per frame

  // ---------------------------------------------------------------------------
  // Grain specs: radius, mass, colors by mode+type
  // Heavier mass = faster fall (gravity scales by mass)
  // ---------------------------------------------------------------------------
  const GRAIN = {
    minute: {
      small: { r: 2.2, mass: 1.0, fill: "#7dd3fc", glow: "#38bdf8", ghost: "rgba(125,211,252,0.2)" }
    },
    hour: {
      small: { r: 1.4, mass: 0.55, fill: "#fcd34d", glow: "#f59e0b", ghost: "rgba(252,211,77,0.18)" },
      large: { r: 3.0, mass: 2.8,  fill: "#60a5fa", glow: "#3b82f6", ghost: "rgba(96,165,250,0.16)" }
    },
    day: {
      small: { r: 1.4, mass: 0.55, fill: "#818cf8", glow: "#6366f1", ghost: "rgba(129,140,248,0.18)" },
      large: { r: 4.0, mass: 5.0,  fill: "#c084fc", glow: "#a855f7", ghost: "rgba(192,132,252,0.16)" }
    }
  };

  // ---------------------------------------------------------------------------
  // Mutable counts (NOT reactive $state — mutated directly in rAF loop)
  // ---------------------------------------------------------------------------
  let bottomSmall = 0, bottomLarge = 0;
  let topSmall    = 0, topLarge    = 0;

  // Physics particles actively falling through neck
  let falling = [];

  // Dissolve-reset animation (replaces CSS flip)
  let resetAlpha  = 1.0;
  let isResetting = false;

  // Time boundary trackers — initialized to current time to avoid false first-fire
  const _nowInit  = new Date();
  let lastSec     = -1;
  let lastMin     = -1;
  let lastHr      = -1;
  let boundaryMin = _nowInit.getMinutes();
  let boundaryHr  = _nowInit.getHours() % 12 || 12;
  let boundaryDay = _nowInit.getDate();

  // Position cache — rebuilt only when counts change (not every frame)
  let posCache = { key: "", bsPos: [], blPos: [], tsPos: [], tlPos: [] };

  // ---------------------------------------------------------------------------
  // Geometry helpers
  // ---------------------------------------------------------------------------
  /**
   * Returns inner half-width of the hourglass glass profile at a given y.
   * @param {number} y
   * @param {string} mode
   * @returns {number}
   */
  function halfWidthAt(y, mode) {
    const d    = Math.abs(y - NECK_Y);
    const maxW = (W - PAD * 2) * 0.42;
    const t    = d / (H / 2);
    if (mode === "minute") return 4 + Math.pow(t, 1.4) * maxW;
    if (mode === "hour")   return 4 + Math.sqrt(t) * maxW;
    return 4 + t * maxW; // day: straight
  }

  /**
   * Build resting dot positions inside a bulb, filling from the gravity-settled edge.
   * @param {boolean} isTop
   * @param {number} count
   * @param {number} radius
   * @returns {Array<{x:number, y:number}>}
   */
  function buildPositions(isTop, count, radius) {
    if (count <= 0) return [];
    const mode    = currentMode;
    const yStart  = isTop ? PAD + 6      : NECK_Y + 12;
    const yEnd    = isTop ? NECK_Y - 12  : H - PAD - 6;
    const spacing = radius * 2 + 1.6;
    const rows    = Math.max(1, Math.floor(Math.abs(yEnd - yStart) / spacing));
    const rowH    = Math.abs(yEnd - yStart) / rows;

    const grid = [];
    for (let ri = 0; ri < rows; ri++) {
      // Bottom bulb fills from bottom up; top bulb fills from top down
      const y = isTop ? yStart + rowH * ri + rowH / 2
                      : yEnd   - rowH * ri - rowH / 2;
      const hw = halfWidthAt(y, mode) - radius - 1.5;
      if (hw <= 0) continue;
      const cols = Math.max(1, Math.floor((hw * 2) / spacing));
      for (let c = 0; c < cols; c++) {
        grid.push({ x: NECK_X - hw + (hw * 2 / cols) * c + (hw * 2 / cols) / 2, y });
      }
    }
    while (grid.length < count) grid.push(grid[grid.length - 1] || { x: NECK_X, y: (yStart + yEnd) / 2 });
    return grid.slice(0, count);
  }

  function getPositions() {
    const key = `${currentMode}-${bottomSmall}-${bottomLarge}-${topSmall}-${topLarge}`;
    if (posCache.key === key) return posCache;
    const g = GRAIN[currentMode];
    const sr = g.small.r;
    const lr = g.large?.r ?? sr;
    posCache = {
      key,
      bsPos: buildPositions(false, bottomSmall, sr),
      blPos: buildPositions(false, bottomLarge, lr),
      tsPos: buildPositions(true,  topSmall,    sr),
      tlPos: buildPositions(true,  topLarge,    lr),
    };
    return posCache;
  }

  // ---------------------------------------------------------------------------
  // Initialize counts from a Date (or current time)
  // ---------------------------------------------------------------------------
  function initCounts(mode) {
    const d   = now || new Date();
    const sec = d.getSeconds();
    const min = d.getMinutes();
    const hr  = d.getHours() % 12 || 12;
    falling   = [];
    posCache.key = "";

    if (mode === "minute") {
      bottomSmall = sec;     topSmall = 60 - sec;
      bottomLarge = 0;       topLarge = 0;
    } else if (mode === "hour") {
      bottomSmall = sec;     topSmall = 60 - sec;
      bottomLarge = min;     topLarge = 60 - min;
    } else {
      bottomSmall = min;     topSmall = 60 - min;
      bottomLarge = hr - 1;  topLarge = 12 - (hr - 1);
    }
    lastSec = sec; lastMin = min; lastHr = hr;
  }

  // ---------------------------------------------------------------------------
  // Release one grain — decrement top count and spawn physics particle at neck
  // ---------------------------------------------------------------------------
  function releaseGrain(type) {
    const spec = currentMode === "minute"
      ? GRAIN.minute.small
      : (type === "small" ? GRAIN[currentMode].small : GRAIN[currentMode].large);

    if (type === "small") { if (topSmall <= 0) return; topSmall--;  }
    else                  { if (topLarge <= 0) return; topLarge--;  }
    posCache.key = "";

    const jitter = (Math.random() - 0.5) * 2.5;
    falling.push({
      x: NECK_X + jitter,
      y: NECK_Y - spec.r - 1,
      vx: jitter * 0.07,
      vy: 0.35 + Math.random() * 0.25,
      r: spec.r,
      mass: spec.mass,
      fill: spec.fill,
      glow: spec.glow,
      type,
      done: false,
    });
  }

  // ---------------------------------------------------------------------------
  // Physics step — called every animation frame
  // ---------------------------------------------------------------------------
  function updatePhysics() {
    const mode  = currentMode;
    const floor = H - PAD - 5;

    for (let i = falling.length - 1; i >= 0; i--) {
      const g = falling[i];
      if (g.done) { falling.splice(i, 1); continue; }

      // Gravity — scaled by mass so heavy grains fall faster
      g.vy += G_BASE * g.mass;
      g.vx *= 0.97;

      // Funnel through the narrow neck passage
      const inNeck = g.y > NECK_Y - 18 && g.y < NECK_Y + 8;
      if (inNeck) {
        g.x  += (NECK_X - g.x) * 0.28;
        g.vx *= 0.3;
      }

      g.x += g.vx;
      g.y += g.vy;

      // Wall bounce (inside hourglass profile)
      const hw = Math.max(g.r + 0.5, halfWidthAt(g.y, mode) - g.r);
      if (g.x < NECK_X - hw) { g.x = NECK_X - hw + 0.5; g.vx =  Math.abs(g.vx) * 0.2; }
      if (g.x > NECK_X + hw) { g.x = NECK_X + hw - 0.5; g.vx = -Math.abs(g.vx) * 0.2; }

      // Bottom floor bounce
      if (g.y + g.r >= floor) {
        g.y = floor - g.r;
        g.vy *= -0.18;
        g.vx *= 0.65;
      }

      // Settle when slow enough AND below neck
      if (g.y > NECK_Y + 18 && Math.abs(g.vy) < 0.25 && Math.abs(g.vx) < 0.18) {
        if (g.type === "small") bottomSmall++;
        else                    bottomLarge++;
        posCache.key = "";
        g.done = true;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Draw helpers
  // ---------------------------------------------------------------------------
  function drawDots(ctx, positions, r, fill, glow) {
    if (!positions.length) return;
    ctx.shadowColor = glow;
    ctx.shadowBlur  = r > 2.5 ? 5 : 2.5;
    ctx.fillStyle   = fill;
    for (const p of positions) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function drawGrains(ctx) {
    const mode = currentMode;
    const g    = GRAIN[mode];
    const { bsPos, blPos, tsPos, tlPos } = getPositions();

    if (mode === "minute") {
      drawDots(ctx, bsPos, g.small.r, g.small.fill,  g.small.glow);
      drawDots(ctx, tsPos, g.small.r, g.small.ghost, g.small.glow);
    } else {
      drawDots(ctx, blPos, g.large.r, g.large.fill,  g.large.glow);
      drawDots(ctx, bsPos, g.small.r, g.small.fill,  g.small.glow);
      drawDots(ctx, tlPos, g.large.r, g.large.ghost, g.large.glow);
      drawDots(ctx, tsPos, g.small.r, g.small.ghost, g.small.glow);
    }

    // Falling physics grains — slightly larger glow while airborne
    for (const p of falling) {
      if (p.done) continue;
      ctx.shadowColor = p.glow;
      ctx.shadowBlur  = p.r > 2.5 ? 8 : 5;
      ctx.fillStyle   = p.fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawFrame(ctx) {
    const mode = currentMode;
    const tC = mode === "minute" ? "rgba(125,211,252,0.25)"
             : mode === "hour"   ? "rgba(96,165,250,0.25)"
                                 : "rgba(192,132,252,0.25)";
    const mC = mode === "minute" ? "rgba(125,211,252,0.45)"
             : mode === "hour"   ? "rgba(96,165,250,0.45)"
                                 : "rgba(192,132,252,0.45)";

    ctx.strokeStyle = tC;
    ctx.lineWidth   = 2.5;

    // Top bulb profile
    ctx.beginPath();
    ctx.moveTo(PAD, PAD);
    ctx.lineTo(W - PAD, PAD);
    if (mode === "minute") {
      ctx.bezierCurveTo(W - PAD - 5, PAD + 40, NECK_X + 15, NECK_Y - 20, NECK_X + 4, NECK_Y - 8);
      ctx.arcTo(NECK_X, NECK_Y - 2, NECK_X - 4, NECK_Y - 8, 4);
      ctx.bezierCurveTo(NECK_X - 15, NECK_Y - 20, PAD + 5, PAD + 40, PAD, PAD);
    } else if (mode === "hour") {
      ctx.bezierCurveTo(W - PAD + 15, PAD + 35, NECK_X + 22, NECK_Y - 30, NECK_X + 4, NECK_Y - 8);
      ctx.arcTo(NECK_X, NECK_Y - 2, NECK_X - 4, NECK_Y - 8, 4);
      ctx.bezierCurveTo(NECK_X - 22, NECK_Y - 30, PAD - 15, PAD + 35, PAD, PAD);
    } else {
      ctx.lineTo(NECK_X + 4, NECK_Y - 8);
      ctx.arcTo(NECK_X, NECK_Y - 2, NECK_X - 4, NECK_Y - 8, 4);
      ctx.lineTo(PAD, PAD);
    }
    ctx.stroke();

    // Bottom bulb profile
    ctx.beginPath();
    ctx.moveTo(PAD, H - PAD);
    ctx.lineTo(W - PAD, H - PAD);
    if (mode === "minute") {
      ctx.bezierCurveTo(W - PAD - 5, H - PAD - 40, NECK_X + 15, NECK_Y + 20, NECK_X + 4, NECK_Y + 8);
      ctx.arcTo(NECK_X, NECK_Y + 2, NECK_X - 4, NECK_Y + 8, 4);
      ctx.bezierCurveTo(NECK_X - 15, NECK_Y + 20, PAD + 5, H - PAD - 40, PAD, H - PAD);
    } else if (mode === "hour") {
      ctx.bezierCurveTo(W - PAD + 15, H - PAD - 35, NECK_X + 22, NECK_Y + 30, NECK_X + 4, NECK_Y + 8);
      ctx.arcTo(NECK_X, NECK_Y + 2, NECK_X - 4, NECK_Y + 8, 4);
      ctx.bezierCurveTo(NECK_X - 22, NECK_Y + 30, PAD - 15, H - PAD - 35, PAD, H - PAD);
    } else {
      ctx.lineTo(NECK_X + 4, NECK_Y + 8);
      ctx.arcTo(NECK_X, NECK_Y + 2, NECK_X - 4, NECK_Y + 8, 4);
      ctx.lineTo(PAD, H - PAD);
    }
    ctx.stroke();

    // End caps
    ctx.fillStyle = mC;
    ctx.fillRect(PAD - 6, PAD - 5, W - (PAD - 6) * 2, 5);
    ctx.fillRect(PAD - 6, H - PAD, W - (PAD - 6) * 2, 5);

    // Support pillars
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(PAD - 4, PAD);      ctx.lineTo(PAD - 4, H - PAD);
    ctx.moveTo(W - PAD + 4, PAD);  ctx.lineTo(W - PAD + 4, H - PAD);
    ctx.stroke();
  }

  // ---------------------------------------------------------------------------
  // Main rAF loop
  // ---------------------------------------------------------------------------
  function frame() {
    if (canvasEl) {
      const ctx = canvasEl.getContext("2d");
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = resetAlpha;
      drawFrame(ctx);
      updatePhysics();
      drawGrains(ctx);
      ctx.globalAlpha = 1;
    }
    animationId = requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------------------
  // Dissolve-reset: fades out → reinits counts → fades back in
  // Sand ALWAYS falls downward — no CSS flip ever applied
  // ---------------------------------------------------------------------------
  function triggerReset(mode) {
    if (isResetting) return;
    isResetting = true;
    const STEPS = 7;
    let step = 0;

    const fadeOut = () => {
      resetAlpha = 1 - step / STEPS;
      step++;
      if (step <= STEPS) {
        setTimeout(fadeOut, 16);
      } else {
        initCounts(mode || currentMode);
        step = 0;
        fadeIn();
      }
    };
    const fadeIn = () => {
      resetAlpha = step / STEPS;
      step++;
      if (step <= STEPS) setTimeout(fadeIn, 16);
      else { resetAlpha = 1; isResetting = false; }
    };
    fadeOut();
  }

  // ---------------------------------------------------------------------------
  // Mode cycling (click or shift+scroll)
  // ---------------------------------------------------------------------------
  const MODES = ["minute", "hour", "day"];

  function cycleMode(dir) {
    if (isResetting) return;
    const idx = MODES.indexOf(currentMode);
    currentMode = MODES[(idx + dir + 3) % 3];
  }

  function handleModeCycle() { cycleMode(1); }

  // Shift+scroll: cycle hourglass modes (non-passive so we can preventDefault)
  function handleWheel(e) {
    if (!e.shiftKey) return;
    e.preventDefault();
    e.stopPropagation();
    cycleMode(e.deltaY > 0 ? 1 : -1);
  }

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // Re-initialize when mode changes (user click or scroll)
  $effect(() => {
    const mode = currentMode;
    initCounts(mode);
    // Reset boundary trackers for new mode
    const d = now || new Date();
    boundaryMin = d.getMinutes();
    boundaryHr  = d.getHours() % 12 || 12;
    boundaryDay = d.getDate();
  });

  // React to each second tick from parent `now` prop
  $effect(() => {
    if (!now) return;
    const sec  = now.getSeconds();
    const min  = now.getMinutes();
    const hr   = now.getHours() % 12 || 12;
    const date = now.getDate();

    // Skip until properly initialized
    if (lastSec === -1) { lastSec = sec; lastMin = min; lastHr = hr; return; }
    if (isResetting) { lastSec = sec; lastMin = min; lastHr = hr; return; }
    if (sec === lastSec) return; // same second, no change

    const mode = currentMode;

    // --- Boundary resets (full hourglass depleted) ---
    if (mode === "minute" && min !== boundaryMin) {
      boundaryMin = min;
      triggerReset(mode);
      lastSec = sec; lastMin = min; lastHr = hr;
      return;
    }
    if (mode === "hour" && hr !== boundaryHr) {
      boundaryHr = hr;
      triggerReset(mode);
      lastSec = sec; lastMin = min; lastHr = hr;
      return;
    }
    if (mode === "day" && date !== boundaryDay) {
      boundaryDay = date;
      triggerReset(mode);
      lastSec = sec; lastMin = min; lastHr = hr;
      return;
    }

    // --- Per-tick grain releases ---
    if (mode === "minute") {
      releaseGrain("small"); // 1 grain per second
    } else if (mode === "hour") {
      releaseGrain("small"); // 1 tiny per second
      if (min !== lastMin) {
        releaseGrain("large"); // 1 large per minute
        // Tiny second grains reset for the new minute
        bottomSmall = 0; topSmall = 60;
        falling = falling.filter(g => g.type !== "small");
        posCache.key = "";
      }
    } else { // day
      if (min !== lastMin) {
        releaseGrain("small"); // 1 tiny per minute
      }
      if (hr !== lastHr) {
        releaseGrain("large"); // 1 large per hour
        // Minute grains reset for the new hour
        bottomSmall = 0; topSmall = 60;
        falling = falling.filter(g => g.type !== "small");
        posCache.key = "";
      }
    }

    lastSec = sec; lastMin = min; lastHr = hr;
  });

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  onMount(() => {
    // Non-passive wheel listener to allow preventDefault inside the widget
    widgetEl?.addEventListener("wheel", handleWheel, { passive: false });
    frame();
    return () => widgetEl?.removeEventListener("wheel", handleWheel);
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={widgetEl}
  class="hourglass-widget"
  class:minute-mode={currentMode === "minute"}
  class:hour-mode={currentMode === "hour"}
  class:day-mode={currentMode === "day"}
  onclick={handleModeCycle}
  role="button"
  tabindex="0"
  aria-label={`Hourglass clock in ${currentMode} mode. Click or Shift+scroll to cycle.`}
  onkeydown={(e) => e.key === "Enter" && handleModeCycle()}
>
  <canvas bind:this={canvasEl} width={W} height={H}></canvas>

  <div class="mode-metadata">
    <span class="mode-tag">{currentMode} Glass</span>
    <span class="mode-desc">
      {#if currentMode === "minute"}
        <span class="dot-key s-key">&#9679;</span> 1 grain = 1 sec
      {:else if currentMode === "hour"}
        <span class="dot-key s-key">&#9679;</span> sec &nbsp;
        <span class="dot-key l-key">&#9679;</span> min
      {:else}
        <span class="dot-key s-key">&#9679;</span> min &nbsp;
        <span class="dot-key l-key">&#9679;</span> hr
      {/if}
    </span>
  </div>
</div>

<style>
  /* Fixed dimensions — widget NEVER resizes on mode change */
  .hourglass-widget {
    width: 184px;
    min-width: 184px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: background 0.3s ease, box-shadow 0.3s ease;
    user-select: none;
    overflow: hidden; /* clip any stray pixels */
  }

  .hourglass-widget:hover {
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
  }

  .hourglass-widget.minute-mode { --accent: #7dd3fc; }
  .hourglass-widget.hour-mode   { --accent: #60a5fa; }
  .hourglass-widget.day-mode    { --accent: #c084fc; }

  canvas {
    display: block;
    width: 160px;
    height: 240px;
  }

  .mode-metadata {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    /* Fixed height prevents text changes from shifting layout */
    height: 36px;
    justify-content: center;
  }

  .mode-tag {
    color: var(--accent, #7dd3fc);
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.02);
    white-space: nowrap;
    transition: color 0.3s ease;
  }

  .mode-desc {
    display: flex;
    align-items: center;
    font-size: 8px;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    gap: 3px;
    white-space: nowrap;
  }

  .dot-key { line-height: 1; }
  .s-key { color: #fcd34d; font-size: 6px; }
  .l-key { color: #60a5fa; font-size: 10px; }

  .day-mode .s-key { color: #818cf8; }
  .day-mode .l-key { color: #c084fc; }
  .minute-mode .s-key { color: #7dd3fc; font-size: 8px; }
</style>
