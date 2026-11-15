<script>
  // Two cells of the info grid (DogsMain.svelte): the like count on the left, the thumb button on the right.
  // The disclosure for what a like sends lives in the banner under the grid.
  import { onDestroy } from "svelte";
  import { ThumbsUp } from "lucide-svelte";
  import { readCache, loadCount, sendLike } from "./likeClient.js";

  const ICON_STROKE = 1.75;
  const SHAKE_MS = 500;
  const CELEBRATE_MS = 650;
  const COUNT_PLACEHOLDER = "—";
  const COUNT_FORMAT = typeof Intl === "undefined" ? null : new Intl.NumberFormat("en-US");
  const INITIAL_CACHE = readCache();
  const PARTICLES = [0, 1, 2, 3, 4, 5];

  /** True while the info page is visible; all visitors refresh through the shared cache. */
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

  onDestroy(() => {
    destroyed = true;
    clearTimeout(shakeTimer);
    clearTimeout(celebrateTimer);
  });

  /** Optimistically acknowledges a vote; the Worker remains the authority on totals. */
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
    celebrateTimer = setTimeout(() => (celebrating = false), CELEBRATE_MS);
    try {
      const confirmedCount = await sendLike();
      if (destroyed) return;
      // End a pending roll before reconciling a deduplicated or concurrent vote.
      if (confirmedCount !== count) celebrating = false;
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

<div class="info-card like-count-card flex flex-col items-center justify-center rounded-xl md:rounded-2xl" class:celebrating>
  <strong class="like-count font-black leading-none text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-7xl max-lg:landscape:text-2xl" aria-hidden="true">
    <span class="count-current" class:rolling={celebrating && previousCount !== null}>{countText}</span>
    {#if celebrating && previousCount !== null}
      <span class="count-previous">{previousText}</span>
    {/if}
  </strong>
  <span class="like-wording mt-1 whitespace-nowrap text-[11px] sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-xl max-lg:landscape:mt-0.5 max-lg:landscape:text-[10px]" aria-hidden="true">{verb} <strong class="font-black">DOGS</strong></span>
  <span class="sr-only" aria-live="polite" aria-atomic="true">{count === null ? "Like count unavailable" : `${countText} ${verb} DOGS`}</span>
</div>

<button
  type="button"
  class="info-card like-card flex items-center justify-center rounded-xl md:rounded-2xl"
  class:liked
  class:failed
  class:celebrating
  aria-pressed={liked}
  aria-label={liked ? "You like DOGS" : "Like DOGS"}
  onclick={like}
>
  <span class="like-thumb relative shrink-0 rounded-full flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-24 2xl:h-24 max-lg:landscape:w-9 max-lg:landscape:h-9" aria-hidden="true">
    <span class="like-icon relative z-10 flex">
      <ThumbsUp class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 max-lg:landscape:w-[18px] max-lg:landscape:h-[18px]" strokeWidth={ICON_STROKE} />
    </span>
    <span class="like-particles">
      {#each PARTICLES as particle}
        <span class="like-particle particle-{particle}"></span>
      {/each}
    </span>
  </span>
</button>

<style lang="scss">
  @use "sass:list";
  @use "../styles/variables" as vars;

  $EASE_OUT: cubic-bezier(0.16, 1, 0.3, 1);
  $EASE_POP: cubic-bezier(0.22, 1, 0.36, 1);
  $PARTICLE_ANGLES: -105deg, -45deg, 15deg, 75deg, 135deg, 195deg;

  // Both cards override the grid's shared hover lift and transition: only transforms/opacity animate here.
  .like-count-card,
  .like-card {
    min-width: 0;
    background: vars.$color-like-card;
    border: 1px solid vars.$color-like-idle-line;
    transition: none;

    &:hover { transform: none; }
  }

  .like-count-card {
    color: vars.$color-like-text;
  }

  .like-card {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus { outline: 2px solid vars.$color-like-ink; outline-offset: 3px; }
    &:focus:not(:focus-visible) { outline: none; }
    &:focus-visible { outline: 2px solid vars.$color-like-ink; outline-offset: 3px; }
    &.liked { cursor: default; }
    &.failed { animation: like-shake 0.45s ease; }
  }

  .like-thumb {
    color: vars.$color-like-ink;
    background: vars.$color-like-idle-bg;
    border: 1px solid vars.$color-like-idle-line;
    transition: transform 0.18s $EASE_OUT;

    &::before, &::after {
      content: "";
      position: absolute;
      top: -1px; right: -1px; bottom: -1px; left: -1px;
      border-radius: inherit;
      pointer-events: none;
    }
    &::before { background: vars.$color-like-fill; transform: scale(0); }
    &::after { border: 2px solid vars.$color-like-fill; opacity: 0; }
  }

  @media (hover: hover) {
    .like-card:not(.liked):hover .like-thumb { transform: rotate(-8deg) scale(1.06); }
  }
  .like-card:not(.liked):active .like-thumb { transform: rotate(-5deg) scale(0.9); }
  .liked .like-thumb {
    color: vars.$color-like-ink-filled;
    &::before { transform: scale(1); }
    :global(svg path) { fill: currentColor; }
  }
  .celebrating .like-thumb {
    &::before { animation: like-fill 0.4s $EASE_POP; }
    &::after { animation: like-ripple 0.6s $EASE_OUT; }
    .like-icon { animation: like-pop 0.5s $EASE_POP; }
  }

  .like-count {
    // One line tall and clipped, so the old total rolls up and out while the new one rolls in.
    position: relative;
    display: block;
    height: 1em;
    overflow: hidden;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }
  .count-current { display: block; }
  .count-current.rolling { animation: count-in 0.4s $EASE_OUT both; }
  .count-previous { position: absolute; top: 0; left: 0; right: 0; animation: count-out 0.3s $EASE_OUT both; }

  .like-particles { position: absolute; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none; }
  .like-particle {
    position: absolute; top: -2px; left: -2px; width: 5px; height: 5px;
    border-radius: 50%; background: vars.$color-like-particle; opacity: 0;
  }
  @for $i from 0 through 5 {
    $angle: list.nth($PARTICLE_ANGLES, $i + 1);
    .celebrating .particle-#{$i} { animation: like-particle-#{$i} 0.55s $EASE_OUT both; }
    @keyframes like-particle-#{$i} {
      0% { opacity: 0; transform: rotate($angle) translateX(1rem) scale(0.5); }
      20% { opacity: 1; }
      100% { opacity: 0; transform: rotate($angle) translateX(3rem) scale(0.3); }
    }
  }

  @keyframes like-fill { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes like-pop {
    0% { transform: scale(0.85) rotate(0); }
    40% { transform: scale(1.35) rotate(-18deg); }
    100% { transform: scale(1) rotate(0); }
  }
  @keyframes like-ripple {
    from { opacity: 0.7; transform: scale(1); }
    to { opacity: 0; transform: scale(1.9); }
  }
  @keyframes count-in { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
  @keyframes count-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-100%); } }
  @keyframes like-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .like-card, .like-thumb, .like-thumb::before, .like-thumb::after,
    .like-icon, .like-particle, .count-current, .count-previous { animation: none !important; transition: none !important; }
    .like-card .like-thumb { transform: none !important; }
    .count-previous { display: none; }
  }
</style>
