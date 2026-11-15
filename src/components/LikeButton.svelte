<script>
  import { onDestroy } from "svelte";
  import { ThumbsUp } from "lucide-svelte";
  import { readCache, loadCount, sendLike } from "./likeClient.js";

  const ICON_STROKE = 1.75;
  const SHAKE_MS = 500;
  const CELEBRATE_MS = 650;
  const PRIVACY_URL = "/privacy.html";
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

<div class="like-slot relative flex w-full min-w-0 flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col max-lg:landscape:flex-col">
  <button
    type="button"
    class="info-card like-card w-full flex items-center justify-center rounded-xl md:rounded-2xl"
    class:liked
    class:failed
    class:celebrating
    aria-pressed={liked}
    aria-label={liked ? "You like DOGS" : "Like DOGS"}
    onclick={like}
  >
    <span class="like-group inline-flex items-center">
      <span class="like-thumb relative shrink-0 rounded-full flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16 max-lg:landscape:w-8 max-lg:landscape:h-8" aria-hidden="true">
        <span class="like-icon relative z-10 flex">
          <ThumbsUp class="w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 max-lg:landscape:w-4 max-lg:landscape:h-4" strokeWidth={ICON_STROKE} />
        </span>
        <span class="like-particles">
          {#each PARTICLES as particle}
            <span class="like-particle particle-{particle}"></span>
          {/each}
        </span>
      </span>
      <span class="like-text text-left text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-2xl max-lg:landscape:text-xs">
        <strong class="like-count" aria-hidden="true">
          <span class="count-current" class:rolling={celebrating && previousCount !== null}>{countText}</span>
          {#if celebrating && previousCount !== null}
            <span class="count-previous">{previousText}</span>
          {/if}
        </strong>
        <span class="like-wording block whitespace-nowrap"><span>{verb}</span> <strong class="block xl:inline font-black">DOGS</strong></span>
      </span>
    </span>
  </button>
  <!-- Outside the button's fixed accessible name so updates are announced once. -->
  <span class="sr-only" aria-live="polite" aria-atomic="true">{count === null ? "Like count unavailable" : `${countText} ${verb} DOGS`}</span>
  <p class="like-consent px-2 pt-2 text-center text-[11px] leading-snug sm:text-xs md:px-3 md:text-sm lg:text-sm xl:text-sm 2xl:text-lg max-lg:landscape:pt-1 max-lg:landscape:text-[10px]">
    Liking sends hashed device signals and a Cloudflare check to help limit repeat votes.
    <a href={PRIVACY_URL} target="_blank" rel="noopener">Read the privacy policy</a>.
  </p>
</div>

<style lang="scss">
  @use "sass:list";
  @use "../styles/variables" as vars;

  $EASE_OUT: cubic-bezier(0.16, 1, 0.3, 1);
  $EASE_POP: cubic-bezier(0.22, 1, 0.36, 1);
  $PARTICLE_ANGLES: -105deg, -45deg, 15deg, 75deg, 135deg, 195deg;

  // Override the parent card's transition: all; only transforms/opacity animate here.
  .like-slot .like-card {
    min-width: 0;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    cursor: pointer;
    background: vars.$color-like-card;
    border: 1px solid vars.$color-like-idle-line;
    -webkit-tap-highlight-color: transparent;
    transition: none;

    &:hover { transform: none; }
    &:focus { outline: 2px solid vars.$color-like-ink; outline-offset: 3px; }
    &:focus:not(:focus-visible) { outline: none; }
    &:focus-visible { outline: 2px solid vars.$color-like-ink; outline-offset: 3px; }
    &.liked { cursor: default; }
    &.failed { animation: like-shake 0.45s ease; }
  }

  .like-group { flex-shrink: 0; }
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

  .like-text {
    color: vars.$color-like-text;
    width: 10ch;
    flex-shrink: 0;
    margin-left: 0.625rem;
    line-height: 1.25;
  }
  .like-count {
    // Always reserves the same line, including the first-load placeholder and carries.
    position: relative;
    display: block;
    width: 10ch;
    min-width: 10ch;
    height: 1.25em;
    overflow: hidden;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }
  .count-current { display: block; }
  .count-current.rolling { animation: count-in 0.4s $EASE_OUT both; }
  .count-previous { position: absolute; top: 0; left: 0; animation: count-out 0.3s $EASE_OUT both; }
  .like-wording { min-width: 10ch; }

  @media (max-width: 400px) {
    .like-text { font-size: 11px; margin-left: 0.375rem; }
    .like-thumb { width: 2rem; height: 2rem; }
  }

  .like-particles { position: absolute; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none; }
  .like-particle {
    position: absolute; top: -2px; left: -2px; width: 4px; height: 4px;
    border-radius: 50%; background: vars.$color-like-particle; opacity: 0;
  }
  @for $i from 0 through 5 {
    $angle: list.nth($PARTICLE_ANGLES, $i + 1);
    .celebrating .particle-#{$i} { animation: like-particle-#{$i} 0.55s $EASE_OUT both; }
    @keyframes like-particle-#{$i} {
      0% { opacity: 0; transform: rotate($angle) translateX(0.7rem) scale(0.5); }
      20% { opacity: 1; }
      100% { opacity: 0; transform: rotate($angle) translateX(2.3rem) scale(0.3); }
    }
  }

  .like-consent {
    color: vars.$color-consent-text-muted;
    a { color: vars.$color-like-text; text-decoration: underline; text-underline-offset: 2px; }
    a:focus-visible { outline: 2px solid vars.$color-like-ink; outline-offset: 2px; }
  }

  @media (min-width: 1280px) { .like-text { width: 14ch; } }
  @media (min-width: 1536px) { .like-text { margin-left: 1.25rem; } }
  // Very short landscape screens retain a compact two-line total.
  @media (max-width: 1023px) and (orientation: landscape) and (max-height: 400px) {
    .like-slot .like-card { padding: 0.375rem 0.5rem; }
    .like-consent { font-size: 9px; line-height: 1.15; }
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
    .like-slot .like-card, .like-thumb, .like-thumb::before, .like-thumb::after,
    .like-icon, .like-particle, .count-current, .count-previous { animation: none !important; transition: none !important; }
    .like-slot .like-thumb { transform: none !important; }
    .count-previous { display: none; }
  }
</style>
