<script>
  // The like on the landing's second page (DogsMain.svelte): one paper slip that reads "127 people like DOGS"
  // beside a thumb drawn in pencil. The thumb sketches itself in whenever the page comes on screen; a like
  // hatches it in, circles it in red pencil and underlines DOGS. likeClient.js does the talking and the
  // repeat-like checks; the privacy footnote under the slip (InfoBanner.svelte) says what a like sends.
  import { onDestroy } from "svelte";
  import { readCache, loadCount, sendLike } from "./likeClient.js";

  const SHAKE_MS = 500;
  const CELEBRATE_MS = 900;
  const COUNT_PLACEHOLDER = "…";
  const COUNT_FORMAT = typeof Intl === "undefined" ? null : new Intl.NumberFormat("en-US");
  const INITIAL_CACHE = readCache();
  // lucide's thumbs-up, redrawn stroke by stroke
  const THUMB_CUFF = "M7 10v12";
  const THUMB_HAND = "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z";
  // A loose red-pencil loop that overshoots where it started, like a hand circling something
  const SCRIBBLE = "M21.5 4.5C17-1.5 4.5-1 .5 6.5-3 13 0 22.5 8 25.5c7.5 2.5 16.5-1 18.5-8.5 1.5-5.5-1-11.5-7-13.5";
  const UNDERLINE = "M2 6C20 3 38 8 55 5s33-2 43 1";
  const HATCH_GAP = 3.2;
  const HATCH_LINES = 15;
  const HATCH_START = 3;
  const HATCH = Array.from({ length: HATCH_LINES }, (_, i) => HATCH_START + i * HATCH_GAP);
  const CLIP_ID = "like-thumb-clip";

  /** True while the second page is on screen: the thumb redraws and the count refreshes. */
  export let active = false;

  let liked = INITIAL_CACHE.liked;
  let count = INITIAL_CACHE.count;
  let previousCount = count;
  let pending = false;
  let failed = false;
  let celebrating = false;
  let refreshed = false;
  let interacted = false;
  let destroyed = false;
  let shakeTimer;
  let celebrateTimer;

  $: if (active && !refreshed) {
    refreshed = true;
    loadCount().then((value) => {
      if (destroyed || interacted) return;
      count = value;
    }).catch(() => {});
  }

  $: countText = count === null ? COUNT_PLACEHOLDER : COUNT_FORMAT ? COUNT_FORMAT.format(count) : String(count);
  $: previousText = previousCount === null ? COUNT_PLACEHOLDER : COUNT_FORMAT ? COUNT_FORMAT.format(previousCount) : String(previousCount);
  $: verb = count === 1 ? "person likes" : "people like";
  $: label = liked ? "You like DOGS" : "Like DOGS";
  $: spoken = count === null ? label : `${label}. ${countText} ${verb} DOGS`;

  onDestroy(() => {
    destroyed = true;
    clearTimeout(shakeTimer);
    clearTimeout(celebrateTimer);
  });

  /** Optimistically counts the like; the Worker stays the authority on the total. */
  async function like() {
    if (liked || pending) return;
    interacted = true;
    previousCount = count;
    if (count !== null) count += 1;
    liked = true;
    pending = true;
    failed = false;
    celebrating = true;
    clearTimeout(shakeTimer);
    clearTimeout(celebrateTimer);
    celebrateTimer = setTimeout(() => (celebrating = false), CELEBRATE_MS);
    try {
      const confirmedCount = await sendLike();
      if (destroyed) return;
      count = confirmedCount;
    } catch {
      if (destroyed) return;
      count = previousCount;
      liked = false;
      celebrating = false;
      failed = true;
      shakeTimer = setTimeout(() => (failed = false), SHAKE_MS);
    } finally {
      if (!destroyed) pending = false;
    }
  }
</script>

<button
  type="button"
  class="sketch flex items-center gap-3 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5 2xl:gap-8 max-lg:landscape:gap-2.5 px-4 py-3 sm:px-4 sm:py-3 md:px-5 md:py-3.5 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-10 2xl:py-7 max-lg:landscape:px-3 max-lg:landscape:py-2"
  class:drawn={active}
  class:liked
  class:failed
  class:celebrating
  aria-pressed={liked}
  aria-busy={pending}
  aria-label={spoken}
  tabindex={active ? 0 : -1}
  on:click={like}
>
  <svg class="thumb shrink-0 w-11 h-11 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-28 2xl:h-28 max-lg:landscape:w-9 max-lg:landscape:h-9" viewBox="-6 -6 36 36" aria-hidden="true" focusable="false">
    <defs><clipPath id={CLIP_ID}><path d={THUMB_HAND} /></clipPath></defs>
    <g class="hatch" clip-path="url(#{CLIP_ID})">
      {#each HATCH as start, index}
        <line class="hatch-line hatch-{index}" x1={start} y1="0" x2={start - 24} y2="24" />
      {/each}
    </g>
    <path class="stroke stroke-hand" d={THUMB_HAND} />
    <path class="stroke stroke-cuff" d={THUMB_CUFF} />
    <path class="scribble" d={SCRIBBLE} pathLength="1" />
  </svg>

  <span class="words text-left leading-tight text-sm sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-3xl max-lg:landscape:text-xs" aria-hidden="true">
    <span class="count block font-black text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-6xl max-lg:landscape:text-xl">
      <span class="count-current" class:rolling={celebrating && previousCount !== null}>{countText}</span>
      {#if celebrating && previousCount !== null}<span class="count-previous">{previousText}</span>{/if}
    </span>
    <span class="whitespace-nowrap">{verb} <span class="dogs font-black">DOGS<svg class="underline" viewBox="0 0 100 10" preserveAspectRatio="none" focusable="false"><path d={UNDERLINE} pathLength="1" /></svg></span></span>
  </span>
  <span class="sr-only" aria-live="polite">{liked && !pending ? `Thanks. ${countText} ${verb} DOGS` : ""}</span>
</button>

<style lang="scss">
  @use "../styles/gallery" as g;

  $DRAW_MS: 900ms;
  $HATCH_STAGGER_MS: 28ms;
  $HATCH_COUNT: 15;

  .sketch {
    position: relative;
    max-width: 100%;
    color: g.$graphite;
    font-family: g.$font;
    background-color: g.$paper;
    // Ruled sketchbook paper
    background-image: repeating-linear-gradient(0deg, transparent 0, transparent 11px, g.$paper-grain 11px, g.$paper-grain 12px);
    border: 0;
    border-radius: 3px;
    box-shadow: 0 10px 28px g.$paper-shadow;
    transform: rotate(-1deg);
    transition: transform 0.35s g.$ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus { outline: 2px solid g.$ink; outline-offset: 4px; }
    &:focus:not(:focus-visible) { outline: none; }
    &:active:not(.liked) { transform: rotate(-1deg) scale(0.97); }
    &.liked { cursor: default; }
    &.failed { animation: like-shake 0.45s ease; }
  }

  @media (hover: hover) {
    .sketch:not(.liked):hover { transform: rotate(0deg) translateY(-2px); }
    .sketch:not(.liked):hover .thumb { animation: pencil-tap 0.6s ease; }
  }

  .thumb { overflow: visible; }

  .stroke, .scribble, .hatch-line, .underline path {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .stroke { stroke: g.$graphite; stroke-width: 1.6; }

  // The outline redraws each time the page comes on screen. Only the animation carries a dash, so a browser
  // without dash support simply shows the finished drawing.
  .drawn .stroke-hand { animation: sketch-in $DRAW_MS g.$ease 0.35s backwards; }
  .drawn .stroke-cuff { animation: sketch-in-cuff 0.35s g.$ease 1.05s backwards; }

  .hatch-line { stroke: g.$graphite-soft; stroke-width: 0.9; opacity: 0; }
  .liked .hatch-line { opacity: 1; }
  @for $i from 0 through $HATCH_COUNT - 1 {
    .celebrating .hatch-#{$i} { animation: hatch-in 0.22s ease-out ($i * $HATCH_STAGGER_MS) backwards; }
  }

  .scribble {
    stroke: g.$like-mark;
    stroke-width: 1.4;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    opacity: 0;
  }
  .liked .scribble { stroke-dashoffset: 0; opacity: 1; }
  .celebrating .scribble { animation: scribble-in 0.6s ease-out 0.3s backwards; }

  .count {
    // One line tall and clipped, so the old total rolls up and out while the new one rolls in
    position: relative;
    height: 1.05em;
    overflow: hidden;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }
  .count-current { display: block; }
  .count-current.rolling { animation: count-in 0.45s g.$ease both; }
  .count-previous { position: absolute; top: 0; left: 0; animation: count-out 0.35s g.$ease both; }

  .dogs { position: relative; display: inline-block; }
  .underline {
    position: absolute;
    left: -2%;
    bottom: -0.3em;
    width: 104%;
    height: 0.45em;
    overflow: visible;

    path { stroke: g.$like-mark; stroke-width: 2.4; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; vector-effect: non-scaling-stroke; }
  }
  .liked .underline path { stroke-dashoffset: 0; opacity: 1; }
  .celebrating .underline path { animation: scribble-in 0.4s ease-out 0.7s backwards; }

  @keyframes sketch-in {
    from { stroke-dasharray: 80; stroke-dashoffset: 80; }
    to { stroke-dasharray: 80; stroke-dashoffset: 0; }
  }
  @keyframes sketch-in-cuff {
    from { stroke-dasharray: 13; stroke-dashoffset: 13; }
    to { stroke-dasharray: 13; stroke-dashoffset: 0; }
  }
  @keyframes hatch-in {
    from { stroke-dasharray: 36; stroke-dashoffset: 36; opacity: 1; }
    to { stroke-dasharray: 36; stroke-dashoffset: 0; opacity: 1; }
  }
  @keyframes scribble-in {
    from { stroke-dashoffset: 1; opacity: 1; }
    to { stroke-dashoffset: 0; opacity: 1; }
  }
  @keyframes pencil-tap {
    0%, 100% { transform: rotate(0); }
    30% { transform: rotate(-6deg); }
    60% { transform: rotate(3deg); }
  }
  @keyframes count-in { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
  @keyframes count-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-100%); } }
  @keyframes like-shake {
    0%, 100% { transform: rotate(-1deg) translateX(0); }
    25% { transform: rotate(-1deg) translateX(-5px); }
    75% { transform: rotate(-1deg) translateX(5px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .sketch, .thumb, .stroke, .hatch-line, .scribble, .underline path, .count-current, .count-previous {
      animation: none !important;
      transition: none !important;
    }
    .count-previous { display: none; }
  }
</style>
