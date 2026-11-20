<script>
  // The like on the apps side of the landing's card (ProjectsSide.svelte): a hollow pencil sketch of the
  // MADE BY DOGS sticker. Where the sticker has the dog, this box has a thumb drawn in pencil; where it says
  // MADE BY DOGS, this one says "128 PEOPLE / LIKE DOGS". The thumb sketches itself in whenever the page comes
  // on screen; a like hatches it in, circles it in red pencil and underlines DOGS. The box is the same height
  // as the yearly-email card (MailingList.svelte) at every size, so the two can trade places without a jump.
  // likeClient.js does the talking and the repeat-like checks; InfoBanner.svelte says what a like sends.
  import { onDestroy } from "svelte";
  import { readCache, loadCount, sendLike } from "./likeClient.js";

  const SHAKE_MS = 500;
  const CELEBRATE_MS = 900;
  const COUNT_PLACEHOLDER = "…";
  const COUNT_FORMAT = typeof Intl === "undefined" ? null : new Intl.NumberFormat("en-US");
  const WHO_ONE = "PERSON";
  const WHO_MANY = "PEOPLE";
  const VERB_ONE = "LIKES";
  const VERB_MANY = "LIKE";
  const NAME = "DOGS";
  // lucide's thumbs-up, redrawn stroke by stroke
  const THUMB_CUFF = "M7 10v12";
  const THUMB_HAND = "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z";
  // A loose red-pencil loop that overshoots where it started, like a hand circling something
  const SCRIBBLE = "M21.5 4.5C17-1.5 4.5-1 .5 6.5-3 13 0 22.5 8 25.5c7.5 2.5 16.5-1 18.5-8.5 1.5-5.5-1-11.5-7-13.5";
  const UNDERLINE = "M2 6C20 3 38 8 55 5s33-2 43 1";
  // The box: four pencil strokes that overshoot at the corners, then a second lighter pass slightly off them
  const FRAME_FIRST = "M4 5C70 2 160 6 296 3M297 2C299 30 295 68 297 97M298 96C200 99 100 95 3 98M4 99C1 70 5 34 3 4";
  const FRAME_SECOND = "M2 7C100 4 210 8 298 6M295 1C296 40 299 70 295 99M296 94C190 97 80 93 5 96M6 97C4 60 7 30 5 2";
  const DIVIDER_FIRST = "M5 1C4 30 6 70 5 99";
  const DIVIDER_SECOND = "M6 4C7 40 4 66 6 97";
  const HATCH_GAP = 3.2;
  const HATCH_LINES = 15;
  const HATCH_START = 3;
  const HATCH = Array.from({ length: HATCH_LINES }, (_, i) => HATCH_START + i * HATCH_GAP);
  const CLIP_ID = "like-thumb-clip";

  /** True while the apps side is up: the thumb redraws and the count refreshes. */
  export let active = false;

  const INITIAL_CACHE = readCache();
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
  $: who = count === 1 ? WHO_ONE : WHO_MANY;
  $: verb = count === 1 ? VERB_ONE : VERB_MANY;
  $: spokenVerb = count === 1 ? "person likes" : "people like";
  $: label = liked ? "You like DOGS" : "Like DOGS";
  $: spoken = count === null ? label : `${label}. ${countText} ${spokenVerb} DOGS`;

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
  class="sketch w-full grid h-[72px] sm:h-[72px] md:h-20 lg:h-20 xl:h-[88px] 2xl:h-32 max-lg:landscape:h-[60px]"
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
  <svg class="frame" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path class="frame-first" d={FRAME_FIRST} />
    <path class="frame-second" d={FRAME_SECOND} />
  </svg>

  <span class="thumb-cell flex items-center justify-center h-full w-[min(72px,30cqw)] sm:w-[min(72px,30cqw)] md:w-[min(80px,30cqw)] lg:w-[min(80px,30cqw)] xl:w-[min(88px,30cqw)] 2xl:w-[min(128px,30cqw)] max-lg:landscape:w-[min(60px,30cqw)]" aria-hidden="true">
    <svg class="thumb w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-[4.5rem] 2xl:h-[4.5rem] max-lg:landscape:w-8 max-lg:landscape:h-8" viewBox="-6 -6 36 36" focusable="false">
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
  </span>

  <span class="words relative flex flex-col justify-center min-w-0 h-full pl-4 pr-3 sm:pl-4 md:pl-5 lg:pl-5 xl:pl-6 2xl:pl-9 2xl:pr-6 max-lg:landscape:pl-3 max-lg:landscape:pr-2 text-[min(24px,11cqw)] sm:text-[min(24px,11cqw)] md:text-[min(28px,11cqw)] lg:text-[min(28px,11cqw)] xl:text-[min(30px,11cqw)] 2xl:text-[min(46px,11cqw)] max-lg:landscape:text-[min(20px,11cqw)]" aria-hidden="true">
    <svg class="divider" viewBox="0 0 10 100" preserveAspectRatio="none" focusable="false">
      <path class="frame-first" d={DIVIDER_FIRST} />
      <path class="frame-second" d={DIVIDER_SECOND} />
    </svg>
    <span class="line whitespace-nowrap">
      <span class="count">
        <span class="count-current" class:rolling={celebrating && previousCount !== null}>{countText}</span>
        {#if celebrating && previousCount !== null}<span class="count-previous">{previousText}</span>{/if}
      </span>
      {who}
    </span>
    <span class="line whitespace-nowrap">{verb} <span class="dogs">{NAME}<svg class="underline" viewBox="0 0 100 10" preserveAspectRatio="none" focusable="false"><path d={UNDERLINE} pathLength="1" /></svg></span></span>
  </span>
  <span class="sr-only" aria-live="polite">{liked && !pending ? `Thanks. ${countText} ${spokenVerb} DOGS` : ""}</span>
</button>

<style lang="scss">
  @use "../styles/gallery" as g;

  $DRAW_MS: 900ms;
  $HATCH_STAGGER_MS: 28ms;
  $HATCH_COUNT: 15;

  // The box is its own size container: in a narrow rail the words and the thumb cell shrink with it (cqw)
  // instead of running out of it. Browsers without container units drop those sizes and fall back to the
  // thumb's own width and the inherited text size, which still fit.
  .sketch {
    position: relative;
    container-type: inline-size;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: stretch;
    padding: 0;
    color: g.$sketch-line;
    background: transparent;
    border: 0;
    border-radius: 0;
    text-align: left;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.35s g.$ease, background-color 0.35s g.$ease;

    &:focus { outline: 2px solid g.$ink; outline-offset: 4px; }
    &:focus:not(:focus-visible) { outline: none; }
    &:active:not(.liked) { transform: scale(0.98); }
    &.liked { cursor: default; }
    &.failed { animation: like-shake 0.45s ease; }
  }

  @media (hover: hover) {
    .sketch:not(.liked):hover { background-color: g.$sketch-hover; transform: translateY(-2px); }
    .sketch:not(.liked):hover .thumb { animation: pencil-tap 0.6s ease; }
  }

  // ---- The box and the divider, in pencil; the strokes stay the same width however wide the box is ----
  .frame, .divider { position: absolute; overflow: visible; pointer-events: none; }
  .frame { top: 0; left: 0; width: 100%; height: 100%; }
  .divider { top: 0; left: -5px; width: 10px; height: 100%; }
  .frame path, .divider path { fill: none; stroke-linecap: round; vector-effect: non-scaling-stroke; }
  .frame-first { stroke: g.$sketch-line; stroke-width: 2; }
  .frame-second { stroke: g.$sketch-soft; stroke-width: 1; }
  .drawn .frame, .drawn .divider { animation: frame-in 0.7s g.$ease 0.1s backwards; }

  // ---- The thumb ----
  .thumb { overflow: visible; }

  .stroke, .scribble, .hatch-line, .underline path {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .stroke { stroke: g.$sketch-line; stroke-width: 1.6; }

  // The outline redraws each time the page comes on screen. Only the animation carries a dash, so a browser
  // without dash support simply shows the finished drawing.
  .drawn .stroke-hand { animation: sketch-in $DRAW_MS g.$ease 0.35s backwards; }
  .drawn .stroke-cuff { animation: sketch-in-cuff 0.35s g.$ease 1.05s backwards; }

  .hatch-line { stroke: g.$sketch-soft; stroke-width: 0.9; opacity: 0; }
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

  // ---- The words, in the sticker's tall condensed capitals ----
  .words { font-family: g.$sticker-font; font-weight: 700; line-height: 0.98; letter-spacing: 0.01em; }
  .line { display: block; }

  .count {
    // One line tall and clipped, so the old total rolls up and out while the new one rolls in
    position: relative;
    display: inline-block;
    height: 1em;
    line-height: 1em;
    overflow: hidden;
    vertical-align: bottom;
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
    bottom: -0.22em;
    width: 104%;
    height: 0.3em;
    overflow: visible;

    path { stroke: g.$like-mark; stroke-width: 2.4; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; vector-effect: non-scaling-stroke; }
  }
  .liked .underline path { stroke-dashoffset: 0; opacity: 1; }
  .celebrating .underline path { animation: scribble-in 0.4s ease-out 0.7s backwards; }

  @keyframes frame-in {
    from { opacity: 0; clip-path: inset(0 100% 0 0); }
    to { opacity: 1; clip-path: inset(0 0 0 0); }
  }
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
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .sketch, .frame, .divider, .thumb, .stroke, .hatch-line, .scribble, .underline path, .count-current, .count-previous {
      animation: none !important;
      transition: none !important;
    }
    .count-previous { display: none; }
  }
</style>
