<script>
  import { tick } from "svelte";
  import { fly } from "svelte/transition";
  import { ThumbsUp } from "lucide-svelte";
  import { readCache, loadCount, sendLike } from "./likeClient.js";

  /** True while the info page is on screen; a returning liker's count refreshes then. */
  export let active = false;

  const ICON_STROKE = 1.75;
  const SHAKE_MS = 500;
  const NOTICE_MS = 6000;
  const NOTICE_RISE_PX = 6;
  const NOTICE_FADE_MS = 200;
  const PRIVACY_URL = "/privacy.html";
  const COUNT_FORMAT = typeof Intl === "undefined" ? null : new Intl.NumberFormat();

  const cache = readCache();
  let liked = cache.liked;
  let count = cache.liked ? cache.count : null;
  let pending = false;
  let failed = false;
  let refreshed = false;
  let notice = false;
  /** @type {ReturnType<typeof setTimeout>|undefined} */
  let noticeTimer;
  /** @type {HTMLSpanElement} */
  let textEl;
  // Returning likers start fully open; first-time likers animate from 0
  let textWidth = count === null ? "0px" : "none";

  // Only someone who already liked sees the count before clicking, so nobody
  // else costs a request just by visiting.
  $: if (active && liked && !refreshed) {
    refreshed = true;
    loadCount()
      .then(reveal)
      .catch(() => {});
  }

  $: countText = count === null ? "" : COUNT_FORMAT ? COUNT_FORMAT.format(count) : String(count);
  $: verb = count === 1 ? "person likes" : "people like";

  /** Shows the count, sliding the text open to its measured width. */
  async function reveal(n) {
    const wasHidden = count === null;
    count = n;
    if (!wasHidden) return;
    await tick();
    textWidth = `${textEl.scrollWidth}px`;
  }

  // The consent notice stays while it is being read: hovering or focusing it pauses the timer
  function holdNotice() {
    clearTimeout(noticeTimer);
  }

  function releaseNotice() {
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => (notice = false), NOTICE_MS);
  }

  // Nothing about the device is read or sent before this click: liking is the consent
  function like() {
    if (liked || pending) return;
    notice = true;
    releaseNotice();
    liked = true;
    pending = true;
    sendLike()
      .then(reveal)
      .catch(() => {
        liked = false;
        failed = true;
        setTimeout(() => (failed = false), SHAKE_MS);
      })
      .then(() => (pending = false));
  }
</script>

<div class="like-slot relative flex">
  <button
    type="button"
    class="info-card like-card w-full flex items-center justify-center rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
    class:liked
    class:failed
    aria-pressed={liked}
    aria-label={liked ? "You like DOGS" : "Like DOGS"}
    onclick={like}
  >
    <span class="like-group inline-flex items-center">
      <span
        class="like-thumb relative shrink-0 rounded-full flex items-center justify-center w-9 h-9 max-lg:landscape:w-8 max-lg:landscape:h-8 md:w-11 md:h-11 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16"
      >
        <span class="like-icon relative z-10 flex">
          <ThumbsUp
            class="w-[18px] h-[18px] max-lg:landscape:w-4 max-lg:landscape:h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8"
            strokeWidth={ICON_STROKE}
          />
        </span>
      </span>

      <!-- Width opens from 0 inside this card only: the grid around it never moves -->
      <span
        bind:this={textEl}
        class="like-text block overflow-hidden whitespace-nowrap text-left leading-tight text-xs sm:text-sm md:text-base 2xl:text-2xl"
        class:shown={count !== null}
        style:max-width={textWidth}
        ontransitionend={(e) => e.propertyName === "max-width" && (textWidth = "none")}
        aria-live="polite"
      >
        {#if count !== null}
          <span class="block xl:inline"><strong class="font-bold">{countText}</strong> {verb}</span>
          <strong class="block xl:inline font-black">DOGS</strong>
        {/if}
      </span>
    </span>
  </button>

  {#if notice}
    <!-- Hangs above the card, absolutely placed: nothing around it moves. The
         pointer aims at the card's centre; the bubble keeps to its right edge
         so it never runs off the screen. -->
    <div
      class="like-notice-anchor absolute bottom-full left-0 right-0 z-20 h-0"
      transition:fly={{ y: NOTICE_RISE_PX, duration: NOTICE_FADE_MS }}
    >
      <span
        class="like-notice-arrow absolute left-1/2 bottom-[5px] -ml-[5px] w-2.5 h-2.5 2xl:bottom-2 2xl:-ml-2 2xl:w-4 2xl:h-4"
        aria-hidden="true"
      ></span>
      <div
        class="like-notice absolute right-0 bottom-2.5 2xl:bottom-4 w-max rounded-lg 2xl:rounded-xl px-3 py-2 max-lg:landscape:px-2.5 max-lg:landscape:py-1.5 2xl:px-5 2xl:py-3 text-[11px] sm:text-xs md:text-sm 2xl:text-lg leading-snug text-left"
        role="status"
        onpointerenter={holdNotice}
        onpointerleave={releaseNotice}
        onfocusin={holdNotice}
        onfocusout={releaseNotice}
      >
        By liking DOGS, you agree to our
        <a href={PRIVACY_URL} target="_blank" rel="noopener" class="font-bold underline underline-offset-2">privacy policy</a>.
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../styles/variables" as vars;

  $ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  $ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);

  .like-card {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus-visible {
      outline: 2px solid vars.$color-like-ink;
      outline-offset: 3px;
    }

    &.liked {
      cursor: default;
    }

    &.failed {
      animation: like-shake 0.45s ease;
    }
  }

  .like-thumb {
    color: vars.$color-like-ink;
    background: vars.$color-like-idle-bg;
    border: 1px solid vars.$color-like-idle-line;
    transition:
      color 0.25s ease 0.1s,
      border-color 0.3s ease,
      box-shadow 0.4s ease;

    // Colour fill grows out from the centre
    &::before {
      content: "";
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      border-radius: inherit;
      background: vars.$color-like-fill;
      transform: scale(0);
      transition: transform 0.45s $ease-pop;
    }

    // One-shot ripple ring
    &::after {
      content: "";
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      border-radius: inherit;
      border: 2px solid vars.$color-like-fill;
      opacity: 0;
      pointer-events: none;
    }

    :global(svg path) {
      fill: transparent;
      transition: fill 0.3s ease 0.12s;
    }
  }

  .like-card:hover .like-thumb {
    border-color: vars.$color-like-ink;
  }

  .liked .like-thumb {
    color: vars.$color-like-ink-filled;
    border-color: transparent;
    box-shadow: 0 0 18px vars.$color-like-glow;

    &::before {
      transform: scale(1);
    }

    &::after {
      animation: like-ripple 0.6s $ease-out;
    }

    .like-icon {
      animation: like-pop 0.5s $ease-pop;
    }

    :global(svg path) {
      fill: currentColor;
    }
  }

  // Consent notice: a small dark bubble pointing down at the card
  .like-notice {
    max-width: 16rem;
    max-width: min(16rem, calc(100vw - 3rem));
    color: vars.$color-consent-text;
    background: vars.$color-consent-bg;
    box-shadow: 0 8px 24px vars.$color-consent-shadow;

    a {
      color: inherit;
    }

    a:focus-visible {
      outline: 2px solid vars.$color-consent-text;
      outline-offset: 2px;
    }
  }

  // Tucked half behind the bubble, so only a triangle shows below it
  .like-notice-arrow {
    background: vars.$color-consent-bg;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    pointer-events: none;
  }

  @media (min-width: 1536px) {
    .like-notice {
      max-width: 26rem;
    }
  }

  .like-text {
    color: vars.$color-like-text;
    opacity: 0;
    transform: translate3d(-0.75rem, 0, 0);
    transition:
      max-width 0.6s $ease-out,
      margin-left 0.6s $ease-out,
      transform 0.6s $ease-out,
      opacity 0.4s ease 0.1s;

    &.shown {
      opacity: 1;
      margin-left: 0.625rem;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (min-width: 1536px) {
    .like-text.shown {
      margin-left: 1.25rem;
    }
  }

  @keyframes like-pop {
    0% {
      transform: scale(1) rotate(0);
    }
    40% {
      transform: scale(1.35) rotate(-14deg);
    }
    100% {
      transform: scale(1) rotate(0);
    }
  }

  @keyframes like-ripple {
    from {
      opacity: 0.9;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(1.9);
    }
  }

  @keyframes like-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-4px);
    }
    75% {
      transform: translateX(4px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .like-thumb,
    .like-thumb::before,
    .like-text {
      transition-duration: 0.01ms;
    }

    .liked .like-thumb::after,
    .liked .like-icon,
    .like-card.failed {
      animation: none;
    }
  }
</style>