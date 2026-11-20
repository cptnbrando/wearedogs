<script>
  // The way to turn the landing's two-sided card (DogsMain.svelte) by tap, click or keyboard. Each side shows
  // one, named for what's on the back; the hint under it names the gesture for the device in hand.
  import { RefreshCw } from "lucide-svelte";

  const ICON_STROKE = 2;
  const HINT_POINTER = "or scroll down";
  const HINT_TOUCH = "or swipe up";

  /** What the other side holds, e.g. "meet the dogs". */
  export let label = "";
  /** True while this side is up; the button leaves the tab order otherwise. */
  export let active = false;
  /** Drops the gesture hint on phones in portrait, where the button shares the heading row. */
  export let compact = false;
  /** Turns the card. */
  export let onflip = () => {};
</script>

<div class:compact class="flip-wrap flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row items-center gap-3 md:gap-4 2xl:gap-6">
  <button type="button" class="flip text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-2xl max-lg:landscape:text-[11px]" tabindex={active ? 0 : -1} on:click={onflip}>
    <span class="icon" aria-hidden="true"><RefreshCw size="1.15em" strokeWidth={ICON_STROKE} /></span>{label}
  </button>
  <span class="hint text-[10px] sm:text-[10px] md:text-xs lg:text-xs xl:text-sm 2xl:text-lg max-lg:landscape:text-[9px]" aria-hidden="true">
    <span class="pointer">{HINT_POINTER}</span><span class="touch">{HINT_TOUCH}</span>
  </span>
</div>

<style lang="scss">
  @use "../styles/gallery" as g;

  .flip {
    display: inline-flex; align-items: center; gap: 0.55em; min-height: 40px; padding: 0 1em;
    background: none; border: 1px solid g.$line; border-radius: 999px; cursor: pointer;
    color: g.$ink; font-family: inherit; font-weight: 700; letter-spacing: 0.02em;
    -webkit-tap-highlight-color: transparent;
    transition: border-color 0.3s g.$ease, background-color 0.3s g.$ease;
  }
  .flip:focus-visible { outline: 2px solid g.$ink; outline-offset: 3px; }
  .icon { display: inline-flex; transition: transform 0.6s g.$ease; }
  @media (hover: hover) {
    .flip:hover { border-color: g.$ink; background: g.$chip-bg; }
    .flip:hover .icon { transform: rotate(180deg); }
  }
  .hint { font-family: g.$mono; color: g.$faint; }
  .touch { display: none; }
  @media (orientation: portrait) and (max-width: 767px) { .compact .hint { display: none; } }
  @media (hover: none) and (pointer: coarse) {
    .pointer { display: none; }
    .touch { display: inline; }
  }
  @media (orientation: landscape) and (max-height: 599px) { .flip { min-height: 32px; } }
  @media (min-width: 1920px) and (min-height: 1000px) { .flip { min-height: 64px; border-width: 2px; } }
  @media (prefers-reduced-motion: reduce) { .icon, .flip { transition: none; } }
</style>
