<script>
  import { onMount, onDestroy } from "svelte";

  let {
    now = new Date(),
    currentMode = $bindable("minute")
  } = $props();

  let canvasEl = $state();
  let isFlipped = $state(false);
  let isFlipping = $state(false);

  let prevMinute = $state(new Date().getMinutes());
  let prevHour = $state(new Date().getHours());
  let prevDay = $state(new Date().getDate());

  let animationId = null;
  const W = 160;
  const H = 240;
  const NECK_Y = H / 2;
  const NECK_X = W / 2;
  const PAD = 14;

  // ---------------------------------------------------------------------------
  // Grain layout: pre-compute positions within each bulb
  // ---------------------------------------------------------------------------

  /**
   * Compute the half-width of the hourglass at a given Y coordinate.
   * @param {number} y - Canvas Y coordinate
   * @param {'minute'|'hour'|'day'} mode
   * @returns {number}
   */
  function halfWidthAt(y, mode) {
    const distToNeck = Math.abs(y - NECK_Y);
    const maxBulb = (W - PAD * 2) * 0.42;
    const t = distToNeck / (H / 2);
    if (mode === "minute") return 4 + Math.pow(t, 1.4) * maxBulb;
    if (mode === "hour")   return 4 + Math.sqrt(t) * maxBulb;
    return 4 + t * maxBulb; // day: straight
  }

  /**
   * Generate an evenly-distributed grid of dot positions inside one bulb.
   * @param {boolean} isTop - Top or bottom bulb
   * @param {number} count - Number of dots
   * @param {'minute'|'hour'|'day'} mode
   * @param {number} radius - Dot radius for spacing
   * @returns {Array<{x:number, y:number}>}
   */
  function buildBulbPositions(isTop, count, mode, radius) {
    const positions = [];
    const yStart = isTop ? PAD + 6 : NECK_Y + 10;
    const yEnd   = isTop ? NECK_Y - 10 : H - PAD - 6;
    const yRange  = yEnd - yStart;
    const spacing = radius * 2 + 1.5;
    const rows = Math.max(1, Math.floor(yRange / spacing));
    const rowH = yRange / rows;

    // Build candidate grid
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const y = yStart + rowH * r + rowH / 2;
      const hw = halfWidthAt(y, mode) - radius - 2;
      if (hw <= 0) continue;
      const cols = Math.max(1, Math.floor((hw * 2) / spacing));
      for (let c = 0; c < cols; c++) {
        const x = NECK_X - hw + hw * 2 / cols * c + (hw * 2 / cols) / 2;
        grid.push({ x, y });
      }
    }

    // Trim / pad to exact count
    while (grid.length < count) grid.push(grid[grid.length - 1] || { x: NECK_X, y: (yStart + yEnd) / 2 });
    return grid.slice(0, count);
  }

  // ---------------------------------------------------------------------------
  // Derive grain counts from current time
  // ---------------------------------------------------------------------------
  let grainData = $derived.by(() => {
    if (!now) return { bottomSmall: 0, bottomLarge: 0, topSmall: 0, topLarge: 0 };
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr  = now.getHours() % 12 || 12; // 1-12

    if (currentMode === "minute") {
      // 60 grains total — elapsed seconds in bottom
      return { bottomSmall: sec, bottomLarge: 0, topSmall: 60 - sec, topLarge: 0 };
    }

    if (currentMode === "hour") {
      // Bottom: completed minutes (large) + elapsed seconds of current minute (tiny)
      // Top: remaining minutes (large) + remaining seconds in current minute are still in top as tiny
      return {
        bottomLarge: min,       // completed minutes fallen
        bottomSmall: sec,       // seconds elapsed within current minute
        topLarge: 60 - min,     // minutes remaining
        topSmall: 60 - sec,     // seconds remaining in current minute
      };
    }

    // day mode: 24-hour -> 12-hour display (use 12 large grains for hours, seconds within current hour as tiny)
    const fullHours = hr - 1; // completed hours (0-11)
    const minInHour = min;
    return {
      bottomLarge: fullHours,         // completed hours
      bottomSmall: minInHour,         // minutes elapsed in current hour
      topLarge: 12 - hr,              // remaining hours
      topSmall: 60 - minInHour,       // remaining minutes in current hour
    };
  });

  // ---------------------------------------------------------------------------
  // Colour / size constants per mode
  // ---------------------------------------------------------------------------
  const SMALL_RADIUS = {
    minute: 2.2,
    hour:   1.5,
    day:    1.5,
  };
  const LARGE_RADIUS = {
    minute: 2.2, // unused for minute
    hour:   3.0,
    day:    4.0,
  };

  // ---------------------------------------------------------------------------
  // Draw loop
  // ---------------------------------------------------------------------------
  function draw() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    drawFrame(ctx);
    drawGrains(ctx);

    animationId = requestAnimationFrame(draw);
  }

  function drawGrains(ctx) {
    const { bottomSmall, bottomLarge, topSmall, topLarge } = grainData;
    const mode = currentMode;
    const sr = SMALL_RADIUS[mode];
    const lr = LARGE_RADIUS[mode];

    // Minute mode: only small grains, no large
    if (mode === "minute") {
      const botPos = buildBulbPositions(false, bottomSmall, mode, sr);
      const topPos = buildBulbPositions(true,  topSmall,    mode, sr);
      drawDots(ctx, botPos, sr, "#7dd3fc", "#38bdf8"); // sky blue fallen
      drawDots(ctx, topPos, sr, "rgba(125,211,252,0.25)", "#7dd3fc"); // ghost top
      return;
    }

    // Hour / Day modes: small grains (seconds/minutes) + large grains (minutes/hours)
    const totalBottom = bottomSmall + bottomLarge;
    const totalTop    = topSmall + topLarge;

    // Bottom bulb: render large grains first (they take more space), then small on remaining positions
    const botLargePos = buildBulbPositions(false, bottomLarge, mode, lr);
    const botSmallPos = buildBulbPositions(false, bottomSmall, mode, sr);

    // Top bulb
    const topLargePos = buildBulbPositions(true, topLarge, mode, lr);
    const topSmallPos = buildBulbPositions(true, topSmall,  mode, sr);

    if (mode === "hour") {
      drawDots(ctx, botLargePos,  lr, "#60a5fa", "#3b82f6");  // blue fallen minutes
      drawDots(ctx, botSmallPos,  sr, "#fcd34d", "#f59e0b");  // gold fallen seconds
      drawDots(ctx, topLargePos,  lr, "rgba(96,165,250,0.2)", "#60a5fa"); // ghost top minutes
      drawDots(ctx, topSmallPos,  sr, "rgba(252,211,77,0.2)", "#fcd34d"); // ghost top seconds
    } else {
      drawDots(ctx, botLargePos,  lr, "#c084fc", "#a855f7");  // violet fallen hours
      drawDots(ctx, botSmallPos,  sr, "#818cf8", "#6366f1");  // indigo fallen minutes
      drawDots(ctx, topLargePos,  lr, "rgba(192,132,252,0.2)", "#c084fc");
      drawDots(ctx, topSmallPos,  sr, "rgba(129,140,248,0.2)", "#818cf8");
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array<{x:number,y:number}>} positions
   * @param {number} radius
   * @param {string} fillColor
   * @param {string} glowColor
   */
  function drawDots(ctx, positions, radius, fillColor, glowColor) {
    positions.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = radius > 2.5 ? 4 : 2;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  function drawFrame(ctx) {
    let themeColor, metalColor;
    if (currentMode === "minute") {
      themeColor = "rgba(125, 211, 252, 0.25)"; metalColor = "rgba(125, 211, 252, 0.45)";
    } else if (currentMode === "hour") {
      themeColor = "rgba(96, 165, 250, 0.25)"; metalColor = "rgba(96, 165, 250, 0.45)";
    } else {
      themeColor = "rgba(192, 132, 252, 0.25)"; metalColor = "rgba(192, 132, 252, 0.45)";
    }

    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2.5;

    // Top bulb
    ctx.beginPath();
    ctx.moveTo(PAD, PAD);
    ctx.lineTo(W - PAD, PAD);
    if (currentMode === "minute") {
      ctx.bezierCurveTo(W - PAD - 5, PAD + 40, NECK_X + 15, NECK_Y - 20, NECK_X + 4, NECK_Y - 8);
      ctx.arcTo(NECK_X, NECK_Y - 2, NECK_X - 4, NECK_Y - 8, 4);
      ctx.bezierCurveTo(NECK_X - 15, NECK_Y - 20, PAD + 5, PAD + 40, PAD, PAD);
    } else if (currentMode === "hour") {
      ctx.bezierCurveTo(W - PAD + 15, PAD + 35, NECK_X + 22, NECK_Y - 30, NECK_X + 4, NECK_Y - 8);
      ctx.arcTo(NECK_X, NECK_Y - 2, NECK_X - 4, NECK_Y - 8, 4);
      ctx.bezierCurveTo(NECK_X - 22, NECK_Y - 30, PAD - 15, PAD + 35, PAD, PAD);
    } else {
      ctx.lineTo(NECK_X + 4, NECK_Y - 8);
      ctx.arcTo(NECK_X, NECK_Y - 2, NECK_X - 4, NECK_Y - 8, 4);
      ctx.lineTo(PAD, PAD);
    }
    ctx.stroke();

    // Bottom bulb
    ctx.beginPath();
    ctx.moveTo(PAD, H - PAD);
    ctx.lineTo(W - PAD, H - PAD);
    if (currentMode === "minute") {
      ctx.bezierCurveTo(W - PAD - 5, H - PAD - 40, NECK_X + 15, NECK_Y + 20, NECK_X + 4, NECK_Y + 8);
      ctx.arcTo(NECK_X, NECK_Y + 2, NECK_X - 4, NECK_Y + 8, 4);
      ctx.bezierCurveTo(NECK_X - 15, NECK_Y + 20, PAD + 5, H - PAD - 40, PAD, H - PAD);
    } else if (currentMode === "hour") {
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
    ctx.fillStyle = metalColor;
    ctx.fillRect(PAD - 6, PAD - 5, W - (PAD - 6) * 2, 5);
    ctx.fillRect(PAD - 6, H - PAD, W - (PAD - 6) * 2, 5);

    // Support pillars
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD - 4, PAD); ctx.lineTo(PAD - 4, H - PAD);
    ctx.moveTo(W - PAD + 4, PAD); ctx.lineTo(W - PAD + 4, H - PAD);
    ctx.stroke();
  }

  // ---------------------------------------------------------------------------
  // Mode cycle & flip
  // ---------------------------------------------------------------------------
  function handleModeCycle() {
    if (isFlipping) return;
    if (currentMode === "minute")      currentMode = "hour";
    else if (currentMode === "hour")   currentMode = "day";
    else                               currentMode = "minute";
  }

  function flip() {
    if (isFlipping) return;
    isFlipping = true;
    isFlipped = !isFlipped;
    setTimeout(() => { isFlipping = false; }, 850);
  }

  onMount(() => {
    draw();
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
  });

  // Auto-flip at time boundary
  $effect(() => {
    if (!now) return;
    const min  = now.getMinutes();
    const hr   = now.getHours();
    const date = now.getDate();

    if (currentMode === "minute" && min  !== prevMinute) flip();
    else if (currentMode === "hour" && hr !== prevHour)  flip();
    else if (currentMode === "day" && date !== prevDay)  flip();

    prevMinute = min;
    prevHour   = hr;
    prevDay    = date;
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="hourglass-widget"
  class:flipping={isFlipping}
  class:flipped={isFlipped}
  class:minute-mode={currentMode === "minute"}
  class:hour-mode={currentMode === "hour"}
  class:day-mode={currentMode === "day"}
  onclick={handleModeCycle}
  role="button"
  tabindex="0"
  aria-label={`Hourglass clock in ${currentMode} mode, click to cycle`}
  onkeydown={(e) => e.key === "Enter" && handleModeCycle()}
>
  <canvas bind:this={canvasEl} width={W} height={H}></canvas>

  <div class="mode-metadata">
    <span class="mode-tag">
      {currentMode} Glass
    </span>
    <span class="mode-desc">
      {#if currentMode === "minute"}
        1 grain = 1 second · 60 grains
      {:else if currentMode === "hour"}
        <span class="grain-key small-key">&#9679;</span> 1 tiny = 1 sec &nbsp;
        <span class="grain-key large-key">&#9679;</span> 1 large = 1 min
      {:else}
        <span class="grain-key small-key">&#9679;</span> 1 tiny = 1 min &nbsp;
        <span class="grain-key large-key">&#9679;</span> 1 large = 1 hr
      {/if}
    </span>
  </div>
</div>

<style>
  .hourglass-widget {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    perspective: 800px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease;
    transform-style: preserve-3d;
    user-select: none;
  }

  .hourglass-widget.minute-mode { --accent: #7dd3fc; }
  .hourglass-widget.hour-mode   { --accent: #60a5fa; }
  .hourglass-widget.day-mode    { --accent: #c084fc; }

  .hourglass-widget:hover {
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  }

  .hourglass-widget.flipped {
    transform: rotateX(180deg);
  }

  .hourglass-widget.flipped .mode-metadata {
    transform: rotateX(-180deg);
  }

  .hourglass-widget.flipping {
    pointer-events: none;
  }

  .mode-metadata {
    margin-top: 10px;
    text-align: center;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
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
  }

  .grain-key {
    font-size: 7px;
  }

  .small-key { color: #fcd34d; font-size: 6px; }
  .large-key { color: #60a5fa; font-size: 9px; }

  .day-mode .small-key { color: #818cf8; }
  .day-mode .large-key { color: #c084fc; }
</style>
