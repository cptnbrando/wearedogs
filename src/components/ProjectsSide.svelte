<script>
  // Side one of the landing's two-sided card (DogsMain.svelte): the app gallery, the pencil-sketch like and a
  // quiet way to join the yearly email. Opening the email puts its card in the like's place (same size, so
  // nothing moves); closing it brings the like back. The dictionary entry and the dancing dogs are on the back.
  //   phones, portrait:   heading on top, gallery in the middle, like at the thumb's reach
  //   phones, landscape:  heading and like on the left, gallery on the right
  //   tablets, portrait:  same order as phones with room for every feature note
  //   desktop and TV:     heading and like in a left rail, gallery filling the rest
  import { tick } from "svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import AppGallery from "./AppGallery.svelte";
  import LikeButton from "./LikeButton.svelte";
  import MailingList from "./MailingList.svelte";
  import InfoBanner from "./InfoBanner.svelte";
  import FlipButton from "./FlipButton.svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";

  const TITLE = "apps";
  const BYLINE = "by DOGS";
  const LEDE = "what we've been building.";
  const FLIP_LABEL = "BARKBARKBARK";
  const JOIN_LABEL = "join the yearly email";
  const CLOSE_LABEL = "close";

  /** Flag-colors mode from the first page. */
  export let isFlagColors = false;
  /** True while the card's page is on screen; runs the entrance. */
  export let shown = false;
  /** True while this side is up with no panel over it. */
  export let active = false;
  /** Turns the card over. */
  export let onflip = () => {};

  let joining = false;
  /** @type {HTMLDivElement} */
  let slotEl;
  $: if (!active) joining = false;

  /** Swaps the like for the email card and back; the email field takes the focus when it opens. */
  async function toggleJoin() {
    joining = !joining;
    if (!joining) return;
    await tick();
    slotEl?.querySelector("input")?.focus();
  }
</script>

<div class="side w-full h-full" class:shown class:colored={isFlagColors}>
  <div class="shell relative h-full grid px-5 pt-12 pb-20 sm:px-5 sm:pt-12 sm:pb-20 md:px-12 md:pt-16 md:pb-24 lg:px-14 lg:pt-14 lg:pb-12 xl:px-20 xl:pt-16 xl:pb-14 2xl:px-28 2xl:pt-24 2xl:pb-20 max-lg:landscape:px-6 max-lg:landscape:pt-4 max-lg:landscape:pb-4">
    <header class="entry flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col items-start gap-2 md:gap-3 2xl:gap-6 max-lg:landscape:gap-1.5">
      <div class="flex items-center gap-2.5 md:gap-3.5 2xl:gap-6">
        <button
          type="button"
          class="logo-btn"
          tabindex={active ? 0 : -1}
          on:click={() => window.dispatchEvent(new CustomEvent(audioCore.isPlaying ? "open-music-panel" : "open-info-panel"))}
          aria-label="DOGS Logo"
        >
          <DogsLogo size="dict" />
        </button>
        <h2 class="title font-black lowercase tracking-tight text-3xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-8xl max-lg:landscape:text-2xl">{TITLE}</h2>
        <span class="byline font-mono text-sm sm:text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-3xl max-lg:landscape:text-xs">{BYLINE}</span>
      </div>
      <p class="lede font-light tracking-wide leading-relaxed m-0 text-sm sm:text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-3xl max-lg:landscape:text-xs">{LEDE}</p>
      <FlipButton label={FLIP_LABEL} {active} {onflip} compact />
    </header>

    <div class="showcase min-h-0 min-w-0">
      <AppGallery {active} />
    </div>

    <footer class="community flex flex-col sm:flex-col md:flex-row lg:flex-col xl:flex-col 2xl:flex-col max-lg:landscape:flex-col items-start gap-3 md:gap-6 lg:gap-4 xl:gap-5 2xl:gap-8 max-lg:landscape:gap-2">
      <div class="like-row flex flex-col items-start gap-1 md:gap-1.5 2xl:gap-3 w-full md:w-[320px] md:shrink-0 lg:w-full max-lg:landscape:gap-0.5">
        <div bind:this={slotEl} class="like-slot relative w-full max-w-[300px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[320px] xl:max-w-[340px] 2xl:max-w-[520px] max-lg:landscape:max-w-[280px]">
          <div class="like-face" class:away={joining} inert={joining}><LikeButton active={active && !joining} /></div>
          {#if joining}<MailingList {active} />{/if}
        </div>
        <button type="button" class="join text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-2xl max-lg:landscape:text-[11px]" aria-expanded={joining} tabindex={active ? 0 : -1} on:click={toggleJoin}>
          {joining ? CLOSE_LABEL : JOIN_LABEL}
        </button>
      </div>
      <InfoBanner {active} />
    </footer>
  </div>
</div>

<style lang="scss">
  @use "../styles/gallery" as g;

  // ---- Grid: phones and tablets in portrait stack heading / gallery / community -----------------------
  .shell {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto;
    grid-template-areas: "entry" "showcase" "community";
    row-gap: 18px;
    max-width: 1800px;
    margin: 0 auto;
  }
  .entry { grid-area: entry; }
  // Clips at its own edge: copy too long for a small screen is cut, never laid over the like below
  .showcase { grid-area: showcase; overflow: hidden; }
  .community { grid-area: community; }

  // Landscape everywhere: a left rail for the heading and the like, the gallery filling the rest
  @media (orientation: landscape) {
    .shell {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 2.1fr);
      grid-template-rows: auto minmax(0, 1fr);
      grid-template-areas: "entry showcase" "community showcase";
      column-gap: 28px;
      row-gap: 12px;
    }
    .community { align-self: end; }
  }
  @media (min-width: 1024px) and (orientation: landscape) and (min-height: 600px) {
    .shell { grid-template-columns: minmax(0, 1fr) minmax(0, 2.2fr); column-gap: 56px; }
  }
  @media (min-width: 1920px) and (min-height: 1000px) {
    .shell { column-gap: 96px; max-width: 3200px; }
  }

  .logo-btn { background: none; border: 0; padding: 0; cursor: pointer; }
  .logo-btn:focus-visible, .join:focus-visible { outline: 2px solid g.$ink; outline-offset: 3px; }
  .title { color: g.$ink; margin: 0; transition: color 0.5s; }
  .byline { color: g.$muted; }
  .lede { color: g.$muted; max-width: 30ch; }

  // Phones in portrait: the flip button rides at the end of the heading row so the gallery keeps the height
  @media (orientation: portrait) and (max-width: 767px) {
    .entry { flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: space-between; }
    .lede { order: 3; width: 100%; }
  }
  .colored .title { color: g.$accent; }
  // The narrowest phones: the byline goes so the flip button stays on the heading row
  @media (orientation: portrait) and (max-width: 374px) { .byline { display: none; } }
  @media (orientation: portrait) and (max-height: 600px) { .side .shell { row-gap: 10px; } }

  // Short phones: the heading stays one tight block so the gallery keeps the height
  @media (orientation: portrait) and (max-height: 700px) {
    .side .shell { padding-top: 40px; padding-bottom: 20px; row-gap: 12px; }
    .lede { display: none; }
  }
  @media (orientation: landscape) and (max-height: 420px) { .lede { display: none; } }

  .join {
    background: none; border: 0; padding: 0; min-height: 40px; cursor: pointer;
    color: g.$ink; text-align: left; text-decoration: underline; text-underline-offset: 4px;
  }
  // The email card takes the like's place; the like stays mounted (no second count request) but out of sight
  .like-face.away { display: none; }

  // ---- Entrance: the heading slides in, the gallery develops, the like settles last -------------------
  .entry, .showcase, .community {
    opacity: 0;
    transition: transform 0.35s g.$ease, opacity 0.35s g.$ease;
  }
  .entry { transform: translate3d(-40px, 0, 0); }
  .showcase { transform: translate3d(0, 24px, 0) scale(0.98); }
  .community { transform: translate3d(0, 30px, 0); }
  .shown .entry, .shown .showcase, .shown .community {
    opacity: 1;
    transform: none;
    transition: transform 0.7s g.$ease, opacity 0.7s g.$ease;
  }
  .shown .entry { transition-delay: 0.1s; }
  .shown .showcase { transition-delay: 0.22s; }
  .shown .community { transition-delay: 0.36s; }

  @media (prefers-reduced-motion: reduce) {
    .entry, .showcase, .community, .shown .entry, .shown .showcase, .shown .community {
      transition: none; transform: none;
    }
  }
</style>
