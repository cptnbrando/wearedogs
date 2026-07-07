<script>
  import { onMount, onDestroy } from "svelte";

  let {
    now = new Date(),
    currentMode = $bindable("minute")
  } = $props();

  let canvasEl = $state();
  let containerEl = $state();
  let isFlipped = $state(false);
  let isFlipping = $state(false);

  // Time boundary trackers for automatic flipping
  let prevMinute = $state(new Date().getMinutes());
  let prevHour = $state(new Date().getHours());
  let prevDay = $state(new Date().getDate());

  // Physics particles configuration
  let particles = [];
  const MAX_PARTICLES = 120;
  let animationId = null;
  let canvasWidth = 140;
  let canvasHeight = 220;

  // Geometry configurations
  const neckX = canvasWidth / 2;
  const neckY = canvasHeight / 2;
  const glassPadding = 12;

  // Derive target sand progress (0 to 1) based on current mode
  let progress = $derived.by(() => {
    if (!now) return 0;
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();

    if (currentMode === "minute") {
      return sec / 60;
    } else if (currentMode === "hour") {
      return (min * 60 + sec) / 3600;
    } else {
      return (hr * 3600 + min * 60 + sec) / 86400;
    }
  });

  // Calculate glass boundaries based on current active mode
  function getHalfWidthAt(y) {
    const distToNeck = Math.abs(y - neckY);
    const maxBulbWidth = (canvasWidth - glassPadding * 2) * 0.42;
    const t = distToNeck / (canvasHeight / 2);
    
    let halfWidth;
    if (currentMode === "minute") {
      // Concave curves (Classic flared hourglass)
      halfWidth = 4 + Math.pow(t, 1.4) * maxBulbWidth;
    } else if (currentMode === "hour") {
      // Convex curves (Teardrop / bulbous glass)
      halfWidth = 4 + Math.sqrt(t) * maxBulbWidth;
    } else {
      // Straight lines (Minimalist / geometric polygon)
      halfWidth = 4 + t * maxBulbWidth;
    }
    return halfWidth;
  }

  function initParticles() {
    particles = [];
    
    const bottomCount = Math.floor(MAX_PARTICLES * progress);
    const topCount = MAX_PARTICLES - bottomCount;

    // Generate top particles (yet to fall)
    for (let i = 0; i < topCount; i++) {
      particles.push(generateParticleInBulb(true));
    }

    // Generate bottom particles (already fallen)
    for (let i = 0; i < bottomCount; i++) {
      particles.push(generateParticleInBulb(false));
    }
  }

  function generateParticleInBulb(isTop) {
    let x, y;
    const yStart = isTop ? glassPadding + 5 : neckY + 10;
    const yEnd = isTop ? neckY - 10 : canvasHeight - glassPadding - 5;
    
    y = yStart + Math.random() * (yEnd - yStart);
    const currentHalfWidth = getHalfWidthAt(y);
    
    // Position inside the boundaries
    x = neckX - currentHalfWidth + 3 + Math.random() * (currentHalfWidth * 2 - 6);

    const hue = currentMode === "minute" ? 38 + Math.random() * 8 : // Gold sand
                currentMode === "hour" ? 198 + Math.random() * 8 : // Sky Blue sand
                275 + Math.random() * 10; // Violet/Purple sand

    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.1,
      vy: isTop ? 0.2 + Math.random() * 0.2 : 0,
      isFallen: !isTop,
      isFalling: false,
      color: `hsl(${hue}, 85%, ${55 + Math.random() * 15}%)`
    };
  }

  function flip() {
    if (isFlipping) return;
    isFlipping = true;
    isFlipped = !isFlipped;

    setTimeout(() => {
      // Rotate particles by flipping Y axis coordinates in our internal physics buffer
      particles.forEach(p => {
        p.y = canvasHeight - p.y;
        p.vy = 0.2 + Math.random() * 0.2;
        p.isFallen = false;
        p.isFalling = false;
      });
      isFlipping = false;
    }, 850);
  }

  // Interactive mode cycle (Minute -> Hour -> Day)
  function handleModeCycle() {
    if (isFlipping) return;
    
    if (currentMode === "minute") {
      currentMode = "hour";
    } else if (currentMode === "hour") {
      currentMode = "day";
    } else {
      currentMode = "minute";
    }
    
    // Clear and regenerate particles for the new mode's coordinates
    initParticles();
  }

  function updatePhysics() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw active glass frame shapes
    drawGlassFrame(ctx);

    // Sand falls if active, and not currently mid-flip rotation
    const isActiveFalling = !isFlipping && progress < 1.0;
    let activeFallerScheduled = false;

    particles.forEach((p) => {
      if (!p.isFallen) {
        if (p.y > neckY - 12 && p.y <= neckY + 2) {
          // Approaching neck passage: funnel into center
          const dx = neckX - p.x;
          p.x += dx * 0.18;
          p.vx = 0;
          p.y += 0.35;
        } else if (p.y > neckY + 2 && p.y < canvasHeight - glassPadding - 8) {
          // Falling stream in bottom chamber
          p.vy += 0.08;
          p.y += p.vy;
          p.x += p.vx;
          p.isFalling = true;
        } else if (p.y >= canvasHeight - glassPadding - 8) {
          // Lands on the bottom pile
          p.isFallen = true;
          p.isFalling = false;
          p.vy = 0;
          p.vx = 0;
        } else {
          // Settle down in top bulb
          if (isActiveFalling && !activeFallerScheduled && Math.random() < 0.05) {
            if (p.y > neckY - 30) {
              p.y += 0.5;
              activeFallerScheduled = true;
            }
          }
          p.y += 0.08;
          
          const currentHalfWidth = getHalfWidthAt(p.y);
          if (p.x < neckX - currentHalfWidth) p.x = neckX - currentHalfWidth + 1.5;
          if (p.x > neckX + currentHalfWidth) p.x = neckX + currentHalfWidth - 1.5;
        }
      } else {
        // Bottom bulb pile settling cone physics
        const pileHeight = getPileHeightAt(p.x);
        const targetY = canvasHeight - glassPadding - 5 - pileHeight;

        if (p.y > targetY) {
          p.y -= 0.2;
        } else if (p.y < targetY - 1) {
          p.y += 0.15;
        }

        const currentHalfWidth = getHalfWidthAt(p.y);
        if (p.x < neckX - currentHalfWidth) p.x = neckX - currentHalfWidth + 1.5;
        if (p.x > neckX + currentHalfWidth) p.x = neckX + currentHalfWidth - 1.5;
      }

      // Draw sand grain particle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.isFalling ? 1.5 : 1.25, 0, Math.PI * 2);
      ctx.fill();
    });

    // Synchronize particle count ratios dynamically with time progress
    syncProgress();

    animationId = requestAnimationFrame(updatePhysics);
  }

  function getPileHeightAt(x) {
    const distToCenter = Math.abs(x - neckX);
    const fallenCount = particles.filter(p => p.isFallen).length;
    const baseHeight = (fallenCount / MAX_PARTICLES) * 45;
    const coneFactor = Math.max(0, 1 - distToCenter / 35);
    return baseHeight + coneFactor * 12;
  }

  function syncProgress() {
    const targetBottomCount = Math.floor(MAX_PARTICLES * progress);
    const currentBottomCount = particles.filter(p => p.isFallen).length;

    if (currentBottomCount < targetBottomCount) {
      const topP = particles.find(p => !p.isFallen && !p.isFalling);
      if (topP) {
        topP.y = neckY + 5;
        topP.isFallen = true;
      }
    } else if (currentBottomCount > targetBottomCount) {
      const bottomP = particles.find(p => p.isFallen);
      if (bottomP) {
        bottomP.y = glassPadding + Math.random() * 20;
        bottomP.isFallen = false;
        bottomP.isFalling = false;
      }
    }
  }

  function drawGlassFrame(ctx) {
    // Choose styling color theme based on mode
    let themeColor = "rgba(230, 185, 0, 0.25)"; // Gold (Minute)
    let metalColor = "rgba(230, 185, 0, 0.4)";
    if (currentMode === "hour") {
      themeColor = "rgba(56, 189, 248, 0.25)"; // Sky Blue (Hour)
      metalColor = "rgba(56, 189, 248, 0.4)";
    } else if (currentMode === "day") {
      themeColor = "rgba(167, 139, 250, 0.25)"; // Purple (Day)
      metalColor = "rgba(167, 139, 250, 0.4)";
    }

    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2.5;

    // Draw Top Bulb Glass Profile
    ctx.beginPath();
    ctx.moveTo(glassPadding, glassPadding);
    ctx.lineTo(canvasWidth - glassPadding, glassPadding);
    
    if (currentMode === "minute") {
      ctx.bezierCurveTo(canvasWidth - glassPadding - 5, glassPadding + 40, neckX + 15, neckY - 20, neckX + 4, neckY - 8);
      ctx.arcTo(neckX, neckY - 2, neckX - 4, neckY - 8, 4);
      ctx.bezierCurveTo(neckX - 15, neckY - 20, glassPadding + 5, glassPadding + 40, glassPadding, glassPadding);
    } else if (currentMode === "hour") {
      ctx.bezierCurveTo(canvasWidth - glassPadding + 15, glassPadding + 35, neckX + 22, neckY - 30, neckX + 4, neckY - 8);
      ctx.arcTo(neckX, neckY - 2, neckX - 4, neckY - 8, 4);
      ctx.bezierCurveTo(neckX - 22, neckY - 30, glassPadding - 15, glassPadding + 35, glassPadding, glassPadding);
    } else {
      ctx.lineTo(neckX + 4, neckY - 8);
      ctx.arcTo(neckX, neckY - 2, neckX - 4, neckY - 8, 4);
      ctx.lineTo(glassPadding, glassPadding);
    }
    ctx.stroke();

    // Draw Bottom Bulb Glass Profile
    ctx.beginPath();
    ctx.moveTo(glassPadding, canvasHeight - glassPadding);
    ctx.lineTo(canvasWidth - glassPadding, canvasHeight - glassPadding);
    
    if (currentMode === "minute") {
      ctx.bezierCurveTo(canvasWidth - glassPadding - 5, canvasHeight - glassPadding - 40, neckX + 15, neckY + 20, neckX + 4, neckY + 8);
      ctx.arcTo(neckX, neckY + 2, neckX - 4, neckY + 8, 4);
      ctx.bezierCurveTo(neckX - 15, neckY + 20, glassPadding + 5, canvasHeight - glassPadding - 40, glassPadding, canvasHeight - glassPadding);
    } else if (currentMode === "hour") {
      ctx.bezierCurveTo(canvasWidth - glassPadding + 15, canvasHeight - glassPadding - 35, neckX + 22, neckY + 30, neckX + 4, neckY + 8);
      ctx.arcTo(neckX, neckY + 2, neckX - 4, neckY + 8, 4);
      ctx.bezierCurveTo(neckX - 22, neckY + 30, glassPadding - 15, canvasHeight - glassPadding - 35, glassPadding, canvasHeight - glassPadding);
    } else {
      ctx.lineTo(neckX + 4, neckY + 8);
      ctx.arcTo(neckX, neckY + 2, neckX - 4, neckY + 8, 4);
      ctx.lineTo(glassPadding, canvasHeight - glassPadding);
    }
    ctx.stroke();

    // Draw Frame Caps (End plates)
    ctx.fillStyle = metalColor;
    ctx.fillRect(glassPadding - 6, glassPadding - 5, canvasWidth - (glassPadding - 6) * 2, 5);
    ctx.fillRect(glassPadding - 6, canvasHeight - glassPadding, canvasWidth - (glassPadding - 6) * 2, 5);

    // Support pillars
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(glassPadding - 4, glassPadding);
    ctx.lineTo(glassPadding - 4, canvasHeight - glassPadding);
    ctx.moveTo(canvasWidth - glassPadding + 4, glassPadding);
    ctx.lineTo(canvasWidth - glassPadding + 4, canvasHeight - glassPadding);
    ctx.stroke();
  }

  onMount(() => {
    initParticles();
    updatePhysics();
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });

  // Watch for clock updates and automatically trigger boundary flips
  $effect(() => {
    if (!now) return;

    const min = now.getMinutes();
    const hr = now.getHours();
    const date = now.getDate();

    if (currentMode === "minute" && min !== prevMinute) {
      flip();
    } else if (currentMode === "hour" && hr !== prevHour) {
      flip();
    } else if (currentMode === "day" && date !== prevDay) {
      flip();
    }

    prevMinute = min;
    prevHour = hr;
    prevDay = date;
  });

  // Watch for mode shifts to re-initialize particles in real time
  $effect(() => {
    const _mode = currentMode;
    initParticles();
  });
</script>

<div 
  bind:this={containerEl}
  class="hourglass-widget relative flex flex-col items-center select-none"
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
  <!-- Animated Sand Canvas -->
  <canvas 
    bind:this={canvasEl} 
    width={canvasWidth} 
    height={canvasHeight}
  ></canvas>

  <!-- Interactive Label Details -->
  <div class="mode-metadata mt-3 text-center">
    <span class="mode-tag text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/5 bg-white/2">
      {currentMode} Glass
    </span>
    <span class="mode-desc block text-[8px] text-white/30 uppercase tracking-wider mt-1.5 font-bold">
      {#if currentMode === "minute"}
        1 grain = 1 second
      {:else}
        {#if currentMode === "hour"}
          1 grain = 1 minute
        {:else}
          1 grain = 1 hour
        {/if}
      {/if}
    </span>
  </div>
</div>

<style>
  .hourglass-widget {
    display: flex;
    cursor: pointer;
    perspective: 800px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease;
    transform-style: preserve-3d;
  }

  /* Mode color accents */
  .hourglass-widget.minute-mode {
    --accent: #e6b900;
  }
  .hourglass-widget.hour-mode {
    --accent: #38bdf8;
  }
  .hourglass-widget.day-mode {
    --accent: #a78bfa;
  }

  .hourglass-widget:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(var(--accent), 0.35);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 15px rgba(var(--accent), 0.08);
  }

  .hourglass-widget.flipped {
    transform: rotateX(180deg);
  }

  /* Keep metadata facing forward during flipping */
  .hourglass-widget.flipped .mode-metadata {
    transform: rotateX(-180deg);
  }

  .hourglass-widget.flipping {
    pointer-events: none;
  }

  .mode-tag {
    color: var(--accent, #e6b900);
    border-color: rgba(var(--accent), 0.2);
    transition: color 0.3s ease, border-color 0.3s ease;
  }

  .mode-metadata {
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
