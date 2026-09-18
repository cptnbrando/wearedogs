<script>
  // Background music for a blog post: plays the post's `music:` track from a
  // random point, looping, with nothing on screen but a volume slider pinned
  // to the left edge of the viewport. No play/pause control on purpose.
  import { onMount } from "svelte";
  import { Volume1, Volume2, VolumeX } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";

  // `label` is the picture printed on the vinyl's label (a square image).
  let { src, label = "/img/blog/toyota-cityscape.svg" } = $props();
  let playing = $state(false);

  let audio = $state(null);
  // Always starts silent: the track is running underneath, the reader turns
  // it up when they want it.
  let volume = $state(0);
  let blocked = $state(false); // autoplay refused until the reader interacts

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

  function onInput(e) {
    volume = parseFloat(e.currentTarget.value);
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
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={volume}
    style="--fill: {Math.round(volume * 100)}%"
    oninput={onInput}
    aria-label="Music volume"
    aria-orientation="vertical"
    class="volume-slider"
  />
  <span class="text-[9px] font-mono text-[#dc143c]/60 tabular-nums">{Math.round(volume * 100)}</span>
  {#if blocked}
    <span class="pulse-dot" aria-hidden="true"></span>
  {/if}
</div>

<!-- The record: spins while the track plays, coasts to a stop otherwise. -->
<div
  class="vinyl fixed left-2 bottom-4 z-30 select-none"
  class:spinning={playing}
  aria-hidden="true"
  title={blocked ? "Click anywhere to start the music" : "Now spinning"}
>
  <div class="disc">
    <div class="label" style="background-image: url({label})"></div>
    <div class="hole"></div>
    <div class="sheen"></div>
  </div>
</div>

<style>
  /* One column width for the slider (its thumb) and the record: the record
     is never wider than the slider. */
  .blog-music,
  .vinyl {
    --col: 24px;
  }
  .blog-music {
    width: var(--col);
    /* No bezel, but the control still floats: a drop shadow follows its exact
       shape (icon, track, knob, readout) rather than a box. */
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 8px rgba(220, 20, 60, 0.35));
  }
  .volume-slider {
    /* Vertical range input: rotate a normal one so it works in every browser. */
    writing-mode: vertical-lr;
    direction: rtl;
    appearance: none;
    -webkit-appearance: none;
    width: 6px;
    height: 140px;
    background: linear-gradient(to top, #dc143c var(--fill, 0%), rgba(220, 20, 60, 0.18) var(--fill, 0%));
    border-radius: 9999px;
    outline: none;
    cursor: pointer;
  }
  .volume-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: var(--col);
    height: var(--col);
    border-radius: 9999px;
    background: #1a0509;
    border: 2px solid #dc143c;
    box-shadow: 0 0 10px rgba(220, 20, 60, 0.7);
  }
  .volume-slider::-moz-range-thumb {
    width: var(--col);
    height: var(--col);
    border-radius: 9999px;
    background: #1a0509;
    border: 2px solid #dc143c;
    box-shadow: 0 0 10px rgba(220, 20, 60, 0.7);
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
  /* ── Vinyl ── */
  .vinyl {
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
      0 0 0 1px rgba(220, 20, 60, 0.35),
      0 3px 10px rgba(0, 0, 0, 0.6),
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
    width: 38%;
    height: 38%;
    transform: translate(-50%, -50%);
    border-radius: 9999px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 0 0 1.5px rgba(220, 20, 60, 0.5);
  }
  .hole {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7%;
    height: 7%;
    transform: translate(-50%, -50%);
    border-radius: 9999px;
    background: #050507;
    box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.4);
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
  @media (min-width: 1920px) {
    .volume-slider {
      height: 220px;
    }
    .blog-music,
    .vinyl {
      --col: 36px;
    }
  }
</style>
