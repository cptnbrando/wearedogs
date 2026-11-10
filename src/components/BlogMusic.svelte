<script>
  // A blog post's soundtrack, with nothing on screen but a volume slider pinned
  // to the left edge. Its knob is a vinyl record that spins while music plays.
  // The slider is the only control: 0 pauses, up plays. What it plays (the
  // post's track, or the main player when that is already going) and the
  // handover to the main player on the way out live in blogMusicDeck.js.
  import { onMount } from "svelte";
  import { Volume1, Volume2, VolumeX } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import { BlogMusicDeck } from "./blogMusicDeck.js";

  const PRESENCE_POLL_MS = 400;
  const KEY_STEP = 0.05;
  const KEY_STEP_BIG = 0.1;
  const BLOG_POST_PATH = /\/apps\/blog\/[^/]+/;

  // `label` is the picture printed on the record's label (a square image).
  let { src, label = "/img/blog/toyota-cityscape.svg" } = $props();

  let mode = $state(null);
  let localVolume = $state(0);
  let localPlaying = $state(false);
  let dragging = $state(false);
  let trackEl = $state(null);
  let rootEl = $state(null);
  let deck = null;

  // In main mode the slider mirrors the main player: silent (paused) reads 0
  let volume = $derived(
    mode === "main" ? (audioCore.isPlaying ? audioCore.volume : 0) : localVolume,
  );
  let playing = $derived(mode === "main" ? audioCore.isPlaying : localPlaying);
  // Driving the main player, the record wears whatever is on it
  let recordLabel = $derived(
    mode === "main"
      ? audioCore.library[audioCore.currentTrackIndex]?.cover || label
      : label,
  );

  // The post is on screen: the URL is /apps/blog/<post> and the widget is not
  // hidden by a parent panel that swapped away without unmounting it.
  function isPostShowing() {
    if (!BLOG_POST_PATH.test(location.pathname)) return false;
    return !!(rootEl && rootEl.isConnected && rootEl.getClientRects().length > 0);
  }

  function syncToPresence() {
    if (isPostShowing()) deck.arrive();
    else deck.depart();
  }

  onMount(() => {
    deck = new BlogMusicDeck(src, (state) => {
      mode = state.mode;
      localVolume = state.volume;
      localPlaying = state.playing;
    });
    deck.arrive();

    // Route changes come through history and popstate; a cheap poll also
    // catches a parent hiding the widget without a route change.
    const halt = () => deck.halt();
    window.addEventListener("popstate", syncToPresence);
    window.addEventListener("pagehide", halt);
    const presenceTimer = setInterval(syncToPresence, PRESENCE_POLL_MS);

    if (import.meta.env.DEV) window.__blogMusic = deck; // dev-only handle for checks

    return () => {
      window.removeEventListener("popstate", syncToPresence);
      window.removeEventListener("pagehide", halt);
      clearInterval(presenceTimer);
      deck.destroy();
      if (import.meta.env.DEV && window.__blogMusic === deck) window.__blogMusic = null;
      deck = null;
    };
  });

  // ── The slider ──────────────────────────────────────────────────────────
  // A custom control rather than <input type="range">: a native thumb cannot
  // be a spinning record with a printed label. Same interactions though:
  // drag, click anywhere on the track, arrow keys, Home/End, mouse wheel.
  function setVolume(v) {
    deck?.setVolume(Math.min(1, Math.max(0, v)));
  }

  function setFromPointer(clientY) {
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const col = parseFloat(getComputedStyle(trackEl).getPropertyValue("--col")) || 24;
    const usable = rect.height - col; // the knob's centre travels this far
    setVolume((rect.bottom - clientY - col / 2) / usable);
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
    const step = e.shiftKey ? KEY_STEP_BIG : KEY_STEP;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") setVolume(volume + step);
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") setVolume(volume - step);
    else if (e.key === "Home") setVolume(0);
    else if (e.key === "End") setVolume(1);
    else return;
    e.preventDefault();
  }
  function onWheel(e) {
    setVolume(volume + (e.deltaY < 0 ? KEY_STEP : -KEY_STEP));
    e.preventDefault();
  }
</script>

<!-- Bezel-less: no box, border or backdrop, just the control on the page. -->
<div
  bind:this={rootEl}
  class="blog-music fixed left-2 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 select-none"
  title={mode === "main" ? "Music player volume" : "Music volume"}
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
    aria-label={mode === "main" ? "Music player volume" : "Music volume"}
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
        <div class="label" style="background-image: url({recordLabel})"></div>
        <div class="hole"></div>
        <div class="sheen"></div>
      </div>
    </div>
  </div>

  <span class="text-[9px] font-mono text-[#dc143c]/60 tabular-nums">{Math.round(volume * 100)}</span>
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
