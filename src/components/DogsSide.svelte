<script>
  // Side two of the landing's two-sided card (DogsMain.svelte): the DOGS dictionary entry and the dancing 3D
  // dogs. The 3D canvas loads the first time this side turns up and leaves once it has turned away, so the GPU
  // rests while the apps are showing.
  //   phones, portrait:   entry on top, dogs filling the rest
  //   phones, landscape:  entry on the left, dogs on the right
  //   tablets, portrait:  bigger entry, a tall stage for the dogs
  //   desktop and TV:     entry in a left rail, dogs filling the rest
  import { onDestroy } from "svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import FlipButton from "./FlipButton.svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import { bark } from "../lib/bark.js";
  import stickerUrl from "../assets/made-by-dogs-sticker.webp";

  const FLIP_LABEL = "see the apps";
  const ALSO = "also: a small team that builds apps. they're on the other side.";
  const LOADING = "Fetching the dogs...";
  const STICKER_ALT = "Made by DOGS";
  // The sticker's own pixel size (from logo.dogs.red), so its box is reserved before it loads
  const STICKER_WIDTH = 720;
  const STICKER_HEIGHT = 240;

  /** Flag-colors mode from the first page. */
  export let isFlagColors = false;
  /** True while the card's page is on screen; runs the entrance. */
  export let shown = false;
  /** True while this side is up with no panel over it. */
  export let active = false;
  /** How long the card takes to turn, so the dogs stay on stage until they're out of sight. */
  export let flipMs = 0;
  /** Turns the card over. */
  export let onflip = () => {};

  let ThreeDCanvas = null;
  let stageOn = false;
  let leaveTimer = 0;

  $: active ? enterStage() : leaveStage();

  function enterStage() {
    clearTimeout(leaveTimer);
    stageOn = true;
    if (ThreeDCanvas) return;
    import("./ThreeDCanvas.svelte")
      .then((module) => { ThreeDCanvas = module.default; })
      .catch((err) => console.error("Failed to lazy load Threlte canvas:", err));
  }

  function leaveStage() {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => { stageOn = false; }, flipMs);
  }

  onDestroy(() => clearTimeout(leaveTimer));
</script>

<div class="side w-full h-full" class:shown class:colored={isFlagColors}>
  <div class="shell relative h-full grid px-5 pt-12 pb-20 sm:px-5 sm:pt-12 sm:pb-20 md:px-12 md:pt-16 md:pb-24 lg:px-14 lg:pt-14 lg:pb-12 xl:px-20 xl:pt-16 xl:pb-14 2xl:px-28 2xl:pt-24 2xl:pb-20 max-lg:landscape:px-6 max-lg:landscape:pt-4 max-lg:landscape:pb-4">
    <header class="entry flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col items-start gap-3 md:gap-5 2xl:gap-8 max-lg:landscape:gap-2">
      <div>
        <div class="flex items-center gap-2.5 md:gap-3.5 2xl:gap-6">
          <button
            type="button"
            class="logo-btn"
            tabindex={active ? 0 : -1}
            on:click={() => (audioCore.isPlaying ? window.dispatchEvent(new CustomEvent("open-music-panel")) : bark())}
            aria-label={audioCore.isPlaying ? "Open the music player" : "DOGS: tap to hear a bark"}
          >
            <DogsLogo size="dict" />
          </button>
          <h2 class="dict-word font-black uppercase tracking-tight text-3xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-8xl max-lg:landscape:text-2xl">DOGS</h2>
          <span class="phonetic font-mono text-sm sm:text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-3xl max-lg:landscape:text-xs">/dôɡz/</span>
          <span class="part italic font-serif text-xs sm:text-xs md:text-base lg:text-base xl:text-lg 2xl:text-2xl max-lg:landscape:text-[11px]">n.</span>
        </div>
        <p class="dict-def font-light tracking-wide leading-relaxed mt-2 mb-0 2xl:mt-5 text-sm sm:text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-3xl max-lg:landscape:text-xs max-lg:landscape:mt-1">
          a carnivorous mammal (<span class="italic">Canis Familiaris</span>) that has long been domesticated as a pet.
          <!-- <span class="also block mt-1 2xl:mt-3">{ALSO}</span> -->
        </p>
      </div>
      <div class="actions flex flex-row sm:flex-row md:flex-row lg:flex-col xl:flex-col 2xl:flex-col max-lg:landscape:flex-col items-center lg:items-start xl:items-start 2xl:items-start max-lg:landscape:items-start gap-4 md:gap-6 lg:gap-6 xl:gap-8 2xl:gap-12 max-lg:landscape:gap-2">
        <FlipButton label={FLIP_LABEL} {active} {onflip} />
        <img
          class="sticker h-10 w-auto sm:h-10 md:h-14 lg:h-auto lg:w-[220px] xl:w-[260px] 2xl:w-[440px] max-lg:landscape:h-9 max-lg:landscape:w-auto"
          src={stickerUrl}
          alt={STICKER_ALT}
          width={STICKER_WIDTH}
          height={STICKER_HEIGHT}
          draggable="false"
        />
      </div>
    </header>

    <div class="stage relative min-h-0 min-w-0">
      {#if stageOn && ThreeDCanvas}
        <svelte:component this={ThreeDCanvas} {isFlagColors} active={stageOn} />
      {:else}
        <div class="loading w-full h-full flex items-center justify-center pointer-events-none">
          <span class="font-mono uppercase tracking-widest animate-pulse text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-xl">{LOADING}</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @use "../styles/gallery" as g;

  // ---- Grid: phones and tablets in portrait stack the entry over the dogs -----------------------------
  .shell {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-areas: "entry" "stage";
    row-gap: 12px;
    max-width: 1800px;
    margin: 0 auto;
  }
  .entry { grid-area: entry; }
  .stage { grid-area: stage; }

  // Landscape everywhere: the entry in a left rail, centred, the dogs filling the rest
  @media (orientation: landscape) {
    .shell {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
      grid-template-rows: minmax(0, 1fr);
      grid-template-areas: "entry stage";
      column-gap: 28px;
    }
    .entry { align-self: center; }
  }
  @media (min-width: 1024px) and (orientation: landscape) and (min-height: 600px) {
    .shell { grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); column-gap: 56px; }
  }
  @media (min-width: 1920px) and (min-height: 1000px) {
    .shell { column-gap: 96px; max-width: 3200px; }
  }

  .logo-btn { background: none; border: 0; padding: 0; cursor: pointer; }
  .logo-btn:focus-visible { outline: 2px solid g.$ink; outline-offset: 3px; }
  .dict-word { color: g.$ink; margin: 0; transition: color 0.5s; }
  .phonetic { color: g.$muted; }
  .part { color: g.$faint; }
  .dict-def { color: g.$ink; max-width: 34ch; transition: color 0.5s; }
  .colored .dict-word, .colored .dict-def { color: g.$accent; }
  .loading { color: g.$faint; }
  // Slapped on a little crooked, like a real sticker
  .sticker { display: block; max-width: 100%; transform: rotate(-2deg); box-shadow: 0 6px 18px g.$chip-bg; }

  // Short phones: tighter padding so the dogs keep the height
  @media (orientation: portrait) and (max-height: 700px) {
    .side .shell { padding-top: 40px; padding-bottom: 20px; }
  }

  // ---- Entrance: the entry slides in, the dogs walk on after it ---------------------------------------
  .entry, .stage {
    opacity: 0;
    transition: transform 0.35s g.$ease, opacity 0.35s g.$ease;
  }
  .entry { transform: translate3d(-40px, 0, 0); }
  .stage { transform: translate3d(40px, 0, 0) scale(0.92); }
  .shown .entry, .shown .stage {
    opacity: 1;
    transform: none;
    transition: transform 0.7s g.$ease, opacity 0.7s g.$ease;
  }
  .shown .entry { transition-delay: 0.1s; }
  .shown .stage { transition-delay: 0.25s; }

  @media (prefers-reduced-motion: reduce) {
    .entry, .stage, .shown .entry, .shown .stage { transition: none; transform: none; }
  }
</style>
