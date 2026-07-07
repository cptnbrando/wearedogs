<script>
  import { onMount, onDestroy } from "svelte";

  let {
    isActive = false,
    progress = null, // If provided (0 to 1), matches timer progress. If null, ticks in real-time.
    onFlipComplete = null
  } = $props();

  let canvasEl = $state();
  let containerEl = $state();
  let isFlipped = $state(false);
  let isFlipping = $state(false);

  // Physics particles
  let particles = [];
  const MAX_PARTICLES = 160;
  let animationId = null;
  let canvasWidth = 140;
  let canvasHeight = 220;

  // Hourglass geometry coordinates
  const neckX = canvasWidth / 2;
  const neckY = canvasHeight / 2;
  const neckWidth = 8;
  const glassPadding = 12;

  // Initialize particles
  function initParticles() {
    particles = [];
    
    // Determine how many particles start in the bottom vs top bulb
    const bottomFraction = progress !== null ? progress : 0;
    const bottomCount = Math.floor(MAX_PARTICLES * bottomFraction);
    const topCount = MAX_PARTICLES - bottomCount;

    // Generate top particles (inside top trapezoid)
    for (let i = 0; i < topCount; i++) {
      particles.push(generateParticleInBulb(true));
    }

    // Generate bottom particles (inside bottom trapezoid)
    for (let i = 0; i < bottomCount; i++) {
      particles.push(generateParticleInBulb(false));
    }
  }

  function generateParticleInBulb(isTop) {
    // Generate within a trapezoid shape
    // Top bulb: wider at y = glassPadding, narrows down to neckY
    // Bottom bulb: narrows up to neckY, wider at y = canvasHeight - glassPadding
    let x, y;
    const yStart = isTop ? glassPadding + 5 : neckY + 10;
    const yEnd = isTop ? neckY - 10 : canvasHeight - glassPadding - 5;
    
    y = yStart + Math.random() * (yEnd - yStart);
    
    // Narrow down boundaries as we get closer to the neck
    const distToNeck = Math.abs(y - neckY);
    const maxBulbWidth = (canvasWidth - glassPadding * 2) * 0.42;
    const currentHalfWidth = 4 + (distToNeck / (canvasHeight / 2)) * maxBulbWidth;
    
    x = neckX - currentHalfWidth + Math.random() * (currentHalfWidth * 2);

    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.1,
      vy: isTop ? 0.2 + Math.random() * 0.2 : 0,
      isFallen: !isTop,
      isFalling: false,
      color: `hsl(${35 + Math.random() * 10}, 85%, ${55 + Math.random() * 15}%)` // Golden sand shades
    };
  }

  // Flip the hourglass physically using CSS and then swap particle positions
  export function flip() {
    if (isFlipping) return;
    isFlipping = true;
    isFlipped = !isFlipped;

    setTimeout(() => {
      // Post-animation logic: invert Y coords of all particles so they are at the top bulb again
      particles.forEach(p => {
        p.y = canvasHeight - p.y;
        p.vy = 0.2 + Math.random() * 0.2;
        p.isFallen = false;
        p.isFalling = false;
      });
      // Toggle rotation classes and notify parent
      isFlipping = false;
      if (onFlipComplete) onFlipComplete();
    }, 850); // Matches transition duration
  }

  // Core physics loop
  function updatePhysics() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw glass contours
    drawGlassFrame(ctx);

    const activeState = isActive || (progress === null && Math.random() < 0.15);

    // Update and draw particles
    let activeFallerScheduled = false;

    particles.forEach((p) => {
      if (!p.isFallen) {
        if (p.y > neckY - 12 && p.y <= neckY + 2) {
          // Approaching neck: funnel towards center
          const dx = neckX - p.x;
          p.x += dx * 0.18;
          p.vx = 0;
          p.y += 0.3; // Squeeze through
        } else if (p.y > neckY + 2 && p.y < canvasHeight - glassPadding - 8) {
          // Falling in bottom chamber
          p.vy += 0.08; // Acceleration due to gravity
          p.y += p.vy;
          p.x += p.vx;
          p.isFalling = true;
        } else if (p.y >= canvasHeight - glassPadding - 8) {
          // Hit the pile at bottom
          p.isFallen = true;
          p.isFalling = false;
          p.vy = 0;
          p.vx = 0;
        } else {
          // Top bulb behavior: stack down towards neck
          // Only drop down if there is space or active
          if (activeState && !activeFallerScheduled && Math.random() < 0.04) {
            // Pick particles near the bottom of top bulb to start falling
            if (p.y > neckY - 30) {
              p.y += 0.5;
              activeFallerScheduled = true;
            }
          }
          
          // Subtle gravity settling in top bulb
          p.y += 0.06;
          // Constrain width
          const distToNeck = neckY - p.y;
          const maxBulbWidth = (canvasWidth - glassPadding * 2) * 0.42;
          const currentHalfWidth = 3 + (distToNeck / (canvasHeight / 2)) * maxBulbWidth;
          if (p.x < neckX - currentHalfWidth) p.x = neckX - currentHalfWidth + 1;
          if (p.x > neckX + currentHalfWidth) p.x = neckX + currentHalfWidth - 1;
        }
      } else {
        // Bottom bulb stacking physics: slightly wiggle to form a cone
        const pileHeight = getPileHeightAt(p.x);
        const targetY = canvasHeight - glassPadding - 5 - pileHeight;

        if (p.y > targetY) {
          p.y -= 0.2; // float up to stack
        } else if (p.y < targetY - 1) {
          p.y += 0.15; // settle down
        }

        // Keep inside bottom boundaries
        const distToNeck = p.y - neckY;
        const maxBulbWidth = (canvasWidth - glassPadding * 2) * 0.42;
        const currentHalfWidth = 3 + (distToNeck / (canvasHeight / 2)) * maxBulbWidth;
        if (p.x < neckX - currentHalfWidth) p.x = neckX - currentHalfWidth + 1;
        if (p.x > neckX + currentHalfWidth) p.x = neckX + currentHalfWidth - 1;
      }

      // Draw particle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.isFalling ? 1.5 : 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Handle incoming inputs dynamically if timer progress changes
    if (progress !== null) {
      syncProgress();
    }

    animationId = requestAnimationFrame(updatePhysics);
  }

  // Estimate stacking pile height to create natural cone shape at bottom
  function getPileHeightAt(x) {
    const distToCenter = Math.abs(x - neckX);
    const fallenCount = particles.filter(p => p.isFallen).length;
    const baseHeight = (fallenCount / MAX_PARTICLES) * 45;
    
    // Cone shape peak in the center
    const coneFactor = Math.max(0, 1 - distToCenter / 35);
    return baseHeight + coneFactor * 12;
  }

  // Adjust particle count allocations on the fly based on timer progress
  function syncProgress() {
    const bottomFraction = progress !== null ? progress : 0;
    const targetBottomCount = Math.floor(MAX_PARTICLES * bottomFraction);
    
    const currentBottomCount = particles.filter(p => p.isFallen).length;
    
    if (currentBottomCount < targetBottomCount) {
      // Force a particle from the top to fall
      const topP = particles.find(p => !p.isFallen && !p.isFalling);
      if (topP) {
        topP.y = neckY + 5;
        topP.isFallen = true;
      }
    } else if (currentBottomCount > targetBottomCount) {
      // Force a particle back to the top
      const bottomP = particles.find(p => p.isFallen);
      if (bottomP) {
        bottomP.y = glassPadding + Math.random() * 20;
        bottomP.isFallen = false;
        bottomP.isFalling = false;
      }
    }
  }

  function drawGlassFrame(ctx) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2.5;

    // Top bulb outer border
    ctx.beginPath();
    ctx.moveTo(glassPadding, glassPadding);
    ctx.lineTo(canvasWidth - glassPadding, glassPadding);
    ctx.lineTo(neckX + 5, neckY - 8);
    ctx.arcTo(neckX, neckY - 2, neckX - 5, neckY - 8, 4);
    ctx.lineTo(glassPadding, glassPadding);
    ctx.stroke();

    // Bottom bulb outer border
    ctx.beginPath();
    ctx.moveTo(glassPadding, canvasHeight - glassPadding);
    ctx.lineTo(canvasWidth - glassPadding, canvasHeight - glassPadding);
    ctx.lineTo(neckX + 5, neckY + 8);
    ctx.arcTo(neckX, neckY + 2, neckX - 5, neckY + 8, 4);
    ctx.lineTo(glassPadding, canvasHeight - glassPadding);
    ctx.stroke();

    // Metallic glass stands (Top & Bottom bars)
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(glassPadding - 6, glassPadding - 5, canvasWidth - (glassPadding - 6) * 2, 5);
    ctx.fillRect(glassPadding - 6, canvasHeight - glassPadding, canvasWidth - (glassPadding - 6) * 2, 5);

    // Decorative support rods (left/right)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2.5;
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

  // Watch for external progress updates or state restarts
  $effect(() => {
    if (progress !== null) {
      syncProgress();
    }
  });
</script>

<div 
  bind:this={containerEl}
  class="hourglass-widget"
  class:flipping={isFlipping}
  class:flipped={isFlipped}
  onclick={flip}
  role="button"
  tabindex="0"
  aria-label="Hourglass animation widget, click to rotate"
  onkeydown={(e) => e.key === "Enter" && flip()}
>
  <canvas 
    bind:this={canvasEl} 
    width={canvasWidth} 
    height={canvasHeight}
  ></canvas>
</div>

<style>
  .hourglass-widget {
    display: inline-block;
    cursor: pointer;
    perspective: 800px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }

  .hourglass-widget:hover {
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .hourglass-widget.flipped {
    transform: rotateX(180deg);
  }

  .hourglass-widget.flipping {
    pointer-events: none;
  }
</style>
