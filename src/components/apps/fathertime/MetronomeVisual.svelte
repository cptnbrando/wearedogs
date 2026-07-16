<script>
  import { onMount, onDestroy } from "svelte";

  let { bpm = 120, isPlaying = false } = $props();

  let pendulumAngle = $state(0);
  let animStartTime = 0;
  let animationId = null;

  function animate(timestamp) {
    if (!animStartTime) animStartTime = timestamp;

    if (isPlaying) {
      // Angular frequency = 2 * PI * (BPM / 120)
      const freq = bpm / 120;
      const t = (timestamp - animStartTime) / 1000;
      pendulumAngle = Math.sin(2 * Math.PI * freq * t) * 28;
    } else {
      // Settle down to center
      pendulumAngle = pendulumAngle * 0.92;
      if (Math.abs(pendulumAngle) < 0.1) pendulumAngle = 0;
    }

    animationId = requestAnimationFrame(animate);
  }

  onMount(() => {
    animationId = requestAnimationFrame(animate);
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
  });
</script>

<div
  class="metronome-visual select-none flex flex-col items-center justify-center p-2.5 bg-black/15 border border-white/5 rounded-2xl w-[140px] h-[220px] shadow-lg relative"
>
  <!-- Wood mechanical casing SVG -->
  <svg
    width="120"
    height="190"
    viewBox="0 0 120 190"
    class="overflow-visible z-10"
  >
    <defs>
      <!-- Wood Mahogany texture gradient -->
      <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2d170b" />
        <stop offset="50%" stop-color="#402313" />
        <stop offset="100%" stop-color="#1c0f07" />
      </linearGradient>
      <!-- Gold metal faceplate -->
      <linearGradient id="metalPlate" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffd700" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#b8860b" stop-opacity="0.3" />
      </linearGradient>
      <!-- Glowing shadow for neon rod -->
      <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
      </filter>
    </defs>

    <!-- Outer wood body rounded pyramid -->
    <path
      d="M 60 15 L 110 165 Q 112 173 103 173 L 17 173 Q 8 173 10 165 Z"
      fill="url(#woodGradient)"
      stroke="rgba(255,255,255,0.06)"
      stroke-width="1.5"
    />

    <!-- Inner faceplate -->
    <path
      d="M 60 40 L 92 155 L 28 155 Z"
      fill="url(#metalPlate)"
      stroke="rgba(218, 165, 32, 0.25)"
      stroke-width="1"
    />

    <!-- Tick marks on faceplate -->
    {#each Array(7) as _, idx}
      {@const y = 60 + idx * 14}
      {@const width = 12 + idx * 2.5}
      <line
        x1={60 - width}
        y1={y}
        x2={60 + width}
        y2={y}
        stroke="rgba(255,255,255,0.12)"
        stroke-width="1"
      />
    {/each}

    <!-- Pendulum pivot axis cover (bottom center) -->
    <circle
      cx="60"
      cy="155"
      r="5"
      fill="#111115"
      stroke="rgba(255,255,255,0.2)"
      stroke-width="1"
    />

    <!-- Swinging Metal Pendulum Arm -->
    <g
      style="transform: rotate({pendulumAngle}deg); transform-origin: 60px 155px; transition: transform 0.08s linear;"
    >
      <!-- Neon rod -->
      <line
        x1="60"
        y1="155"
        x2="60"
        y2="25"
        stroke="#ffd700"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Neon glowing blur behind -->
      <line
        x1="60"
        y1="155"
        x2="60"
        y2="25"
        stroke="#ffd700"
        stroke-width="5"
        stroke-linecap="round"
        opacity="0.35"
        filter="url(#neonGlow)"
      />

      <!-- Sliding balance mass weight -->
      <!-- Height on rod is controlled by BPM (lower weight = slower/bottom, higher = faster/top) -->
      <rect
        x="54"
        y={135 - ((bpm - 30) / 250) * 80}
        width="12"
        height="12"
        rx="2"
        fill="#b8860b"
        stroke="#ffd700"
        stroke-width="1"
        style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"
      />
    </g>

    <!-- Front casing bottom cap cover -->
    <path
      d="M 12 165 L 108 165 L 108 175 L 12 175 Z"
      fill="#1c0f07"
      stroke="rgba(255,255,255,0.05)"
      stroke-width="1"
    />
  </svg>

  <!-- Interactive status metadata -->
  <div
    class="text-[9px] font-black uppercase text-amber-500/70 tracking-widest mt-2 bg-white/2 border border-amber-500/10 px-2 py-0.5 rounded"
  >
    Rhythm Node
  </div>
</div>

<style>
  .metronome-visual {
    transition: all 0.3s ease;
  }
  .metronome-visual:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(245, 158, 11, 0.15);
  }
</style>
