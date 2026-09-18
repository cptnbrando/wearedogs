<script>
  // Background music for a blog post: plays the post's `music:` track from a
  // random point, looping, with nothing on screen but a volume slider pinned
  // to the left edge of the viewport. The slider's knob is a vinyl record that
  // spins while the track plays. No play/pause control on purpose.
  import { onMount } from "svelte";
  import { Volume1, Volume2, VolumeX } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";

  // `label` is the picture printed on the record's label (a square image).
  let { src, label = "/img/blog/toyota-cityscape.svg" } = $props();

  let audio = $state(null);
  // Always starts silent: the track is running underneath, the reader turns
  // it up when they want it.
  let volume = $state(0);
  let playing = $state(false);
  let blocked = $state(false); // autoplay refused until the reader interacts
  let dragging = $state(false);
  let trackEl = $state(null);

  // Random start: pick a point once the duration is known. Fresh
  // pseudo-randomness every load, so a 3-hour file lands somewhere new.
  function seekRandom() {
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    // Leave the last 30 s alone so it does not immediately wrap around.
    const span = Math.max(1, audio.duration - 30);
    audio.currentTime = Math.random() * span;
  }

  async function tryPlay() {
    if (!audio) return;
    try {
      await audio.play();
      blocked = false;
    } catch {
      // Browsers refuse audio before any user gesture: wait for the first one.
      blocked = true;
    }
  }

  function onFirstGesture() {
    if (!blocked) return;
    tryPlay();
  }

  onMount(() => {
    // The site's own player would otherwise play over the post's track.
    try {
      if (audioCore?.isPlaying) audioCore.pause();
    } catch {}
    audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    audio.addEventListener("loadedmetadata", () => {
      seekRandom();
      tryPlay();
    });
    audio.addEventListener("playing", () => (playing = true));
    audio.addEventListener("pause", () => (playing = false));
    audio.addEventListener("waiting", () => (playing = false));
    audio.src = src;

    const gestures = ["pointerdown", "keydown", "touchstart", "wheel"];
    gestures.forEach((g) => window.addEventListener(g, onFirstGesture, { passive: true }));

    return () => {
      gestures.forEach((g) => window.removeEventListener(g, onFirstGesture));
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio = null;
    };
  });

  $effect(() => {
    if (audio) audio.volume = volume;
  });

  // ── The slider ──────────────────────────────────────────────────────────
  // A custom control rather than <input type="range">: a native thumb cannot
  // be a spinning record with a printed label. Same interactions though:
  // drag, click anywhere on the track, arrow keys, Home/End, mouse wheel.
  function clamp01(v) {
    return Math.min(1, Math.max(0, v));
  }

  function setFromPointer(clientY) {
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const col = parseFloat(getComputedStyle(trackEl).getPropertyValue("--col")) || 24;
    const usable = rect.height - col; // the knob's centre travels this far
    volume = clamp01((rect.bottom - clientY - col / 2) / usable);
  }

  function onPointerDown(e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragging = true;
    trackEl.setPointerCapture(e.pointerId);
    setFromPointer(e.clientY);
    e.preventDefault();
  }
  function onPointerMove(e) {
    if (dragging) setFromPointer(e.clientY);
  }
  function onPointerUp(e) {
    dragging = false;
    try {
      trackEl.releasePointerCapture(e.pointerId);
    } catch {}
  }
  function onKey(e) {
    const step = e.shiftKey ? 0.1 : 0.05;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") volume = clamp01(volume + step);
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") volume = clamp01(volume - step);
    else if (e.key === "Home") volume = 0;
    else if (e.key === "End") volume = 1;
    else return;
    e.preventDefault();
  }
  function onWheel(e) {
    volume = clamp01(volume + (e.deltaY < 0 ? 0.05 : -0.05));
    e.preventDefault();
  }
</script>

<!-- Bezel-less: no box, border or backdrop, just the control on the page. -->
<div
  class="blog-music fixed left-2 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 select-none"
  title={blocked ? "Click anywhere to start the music" : "Music volume"}
>
  <div class="text-[#dc143c]" class:opacity-40={volume === 0}>
    {#if volume === 0}
      <VolumeX size={16} />
    {:else if volume < 0.5}
      <Volume1 size={16} />
    {:else}
      <Volume2 size={16} />
    {/if}
  </div>

  <div
    class="track-wrap"
    class:dragging
    bind:this={trackEl}
    role="slider"
    tabindex="0"
    aria-label="Music volume"
    aria-orientation="vertical"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={Math.round(volume * 100)}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onkeydown={onKey}
    onwheel={onWheel}
  >
    <div class="track">
      <div class="fill" style="height: {volume * 100}%"></div>
    </div>

    <!-- The knob: a record that spins while the track plays and coasts to a
         stop otherwise. Its centre rides the track from bottom (0) to top (100). -->
    <div
      class="vinyl"
      class:spinning={playing}
      style="bottom: calc({volume} * (100% - var(--col)))"
      aria-hidden="true"
    >
      <div class="disc">
        <div class="label" style="background-image: url({label})"></div>
        <div class="hole"></div>
        <div class="sheen"></div>
      </div>
    </div>
  </div>

  <span class="text-[9px] font-mono text-[#dc143c]/60 tabular-nums">{Math.round(volume * 100)}</span>
  {#if blocked}
    <span class="pulse-dot" aria-hidden="true"></span>
  {/if}
</div>

<style>
  /* One column width: the knob (the record) is exactly as wide as the control. */
  .blog-music {
    --col: 24px;
    width: var(--col);
    /* No bezel, but the control still floats: a drop shadow follows its exact
       shape (icon, track, knob, readout) rather than a box. */
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 8px rgba(220, 20, 60, 0.35));
  }

  .track-wrap {
    --col: 24px;
    position: relative;
    width: var(--col);
    height: 160px;
    cursor: pointer;
    touch-action: none;
    outline: none;
  }
  .track-wrap:focus-visible .track {
    box-shadow: 0 0 0 2px rgba(220, 20, 60, 0.6);
  }
  .track-wrap.dragging {
    cursor: grabbing;
  }
  .track {
    position: absolute;
    left: 50%;
    top: calc(var(--col) / 2);
    bottom: calc(var(--col) / 2);
    width: 6px;
    transform: translateX(-50%);
    border-radius: 9999px;
    background: rgba(220, 20, 60, 0.18);
    overflow: hidden;
  }
  .fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #dc143c;
    border-radius: 9999px;
  }

  /* ── The record (the knob) ── */
  .vinyl {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: var(--col);
    height: var(--col);
  }
  .disc {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    /* Grooves: fine concentric rings over near-black with a dark-red cast. */
    background:
      repeating-radial-gradient(circle at 50% 50%, #0a0305 0px, #0a0305 1px, #2a0810 1.5px, #2a0810 2px),
      #0a0305;
    box-shadow:
      0 0 0 1.5px #dc143c,
      0 3px 10px rgba(0, 0, 0, 0.7),
      inset 0 0 6px rgba(0, 0, 0, 0.8);
    animation: spin 1.8s linear infinite;
    animation-play-state: paused;
    transition: filter 0.6s ease;
    filter: saturate(0.6) brightness(0.8);
  }
  .vinyl.spinning .disc {
    animation-play-state: running;
    filter: none;
  }
  .label {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 42%;
    height: 42%;
    transform: translate(-50%, -50%);
    border-radius: 9999px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 0 0 1px rgba(220, 20, 60, 0.5);
  }
  .hole {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10%;
    height: 10%;
    transform: translate(-50%, -50%);
    border-radius: 9999px;
    background: #050507;
    box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.4);
  }
  .sheen {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: conic-gradient(from 0deg, transparent 0deg, rgba(255, 60, 90, 0.18) 40deg, transparent 80deg, transparent 180deg, rgba(255, 60, 90, 0.12) 220deg, transparent 260deg);
    pointer-events: none;
    mix-blend-mode: screen;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: #ff2a4d;
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @media (min-width: 1920px) {
    .blog-music,
    .track-wrap {
      --col: 36px;
    }
    .track-wrap {
      height: 240px;
    }
  }
</style>
