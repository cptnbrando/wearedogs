<script module>
  // Kept outside the component, so the backdrop stays on while the card turns away and back
  let backdropOn = $state(false);
</script>

<script>
  /**
   * DogStageVisuals: the dancing dogs' stage (ThreeDCanvas) while music plays.
   * Three buttons in its top corner: TV puts the MilkDrop show behind the dogs,
   * inside the stage only; the note opens the music player; the last one takes
   * the stage full screen. With no music playing there are no buttons and no show.
   *
   * The show is a MilkdropEngine joined to the site's preset deck
   * (lib/visualizer/presetDeck), so hearts, turned-down presets and shuffle
   * are the player's own. The stage only exists while no panel covers it, so
   * it never runs beside the player's visualizer.
   */
  import { onDestroy } from "svelte";
  import { Tv, Music, Maximize, Minimize } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import { MilkdropEngine, milkdropSupported } from "../lib/visualizer/MilkdropEngine.js";
  import { presetDeck } from "../lib/visualizer/presetDeck.svelte.js";

  /** @type {{ target?: HTMLElement | null }} target: the stage element that goes full screen */
  let { target = null } = $props();

  const CAN_SHOW = milkdropSupported();
  const OPEN_MUSIC_EVENT = "open-music-panel";
  /** Where the browser has no full screen for an element (iPhone), the stage fills the window instead. */
  const FILL_CLASS = "stage-fills-window";
  const TV_ON_LABEL = "Take the visuals from behind the dogs";
  const TV_OFF_LABEL = "Put the music's visuals behind the dogs";
  const MUSIC_LABEL = "Open the music player";
  const FULL_ON_LABEL = "Leave full screen";
  const FULL_OFF_LABEL = "Full screen";

  let canvasEl = $state(null);
  let full = $state(false);

  let playing = $derived(audioCore.isPlaying);
  let showing = $derived(CAN_SHOW && backdropOn && playing && !!audioCore.analyser);

  // The show runs only while it is on screen: no music, no GPU spent
  $effect(() => {
    if (!showing || !canvasEl) return;
    const engine = new MilkdropEngine(canvasEl, audioCore.analyser, audioCore.audioCtx, presetDeck.listeners());
    presetDeck.attach(engine);
    engine.start();
    return () => {
      presetDeck.detach(engine);
      engine.destroy();
    };
  });

  function onFullscreenChange() {
    full = !!target && document.fullscreenElement === target;
  }

  function leaveFill() {
    if (target) target.classList.remove(FILL_CLASS);
    full = false;
  }

  function toggleFull() {
    if (!target) return;
    if (full) {
      if (document.fullscreenElement === target) document.exitFullscreen().catch(() => {});
      else leaveFill();
      return;
    }
    const fill = () => {
      target.classList.add(FILL_CLASS);
      full = true;
    };
    if (!target.requestFullscreen) {
      fill();
      return;
    }
    target.requestFullscreen().catch(fill);
  }

  // The music stopped: the buttons go, and so does a stage that was filling the window
  $effect(() => {
    if (!playing && full && document.fullscreenElement !== target) leaveFill();
  });

  $effect(() => {
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  });

  onDestroy(() => {
    if (target && document.fullscreenElement === target) document.exitFullscreen().catch(() => {});
    if (target) target.classList.remove(FILL_CLASS);
  });
</script>

{#if showing}
  <canvas bind:this={canvasEl} class="stage-backdrop" aria-hidden="true"></canvas>
{/if}

{#if playing}
  <div
    class="stage-buttons flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-1.5 sm:gap-1.5 md:gap-2 2xl:gap-3"
    role="group"
    aria-label="Music on the dogs' stage"
  >
    {#if CAN_SHOW}
      <button
        type="button"
        class="stage-btn h-8 w-8 sm:h-8 sm:w-8 md:h-9 md:w-9 xl:h-9 xl:w-9 2xl:h-14 2xl:w-14"
        class:stage-btn-on={backdropOn}
        aria-pressed={backdropOn}
        aria-label={backdropOn ? TV_ON_LABEL : TV_OFF_LABEL}
        title={backdropOn ? TV_ON_LABEL : TV_OFF_LABEL}
        onpointerdown={(e) => e.stopPropagation()}
        onpointerup={(e) => e.stopPropagation()}
        onclick={() => (backdropOn = !backdropOn)}
      >
        <Tv class="h-4 w-4 2xl:h-7 2xl:w-7" aria-hidden="true" />
      </button>
    {/if}
    <button
      type="button"
      class="stage-btn h-8 w-8 sm:h-8 sm:w-8 md:h-9 md:w-9 xl:h-9 xl:w-9 2xl:h-14 2xl:w-14"
      aria-label={MUSIC_LABEL}
      title={MUSIC_LABEL}
      onpointerdown={(e) => e.stopPropagation()}
      onpointerup={(e) => e.stopPropagation()}
      onclick={() => window.dispatchEvent(new CustomEvent(OPEN_MUSIC_EVENT))}
    >
      <Music class="h-4 w-4 2xl:h-7 2xl:w-7" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="stage-btn h-8 w-8 sm:h-8 sm:w-8 md:h-9 md:w-9 xl:h-9 xl:w-9 2xl:h-14 2xl:w-14"
      class:stage-btn-on={full}
      aria-pressed={full}
      aria-label={full ? FULL_ON_LABEL : FULL_OFF_LABEL}
      title={full ? FULL_ON_LABEL : FULL_OFF_LABEL}
      onpointerdown={(e) => e.stopPropagation()}
      onpointerup={(e) => e.stopPropagation()}
      onclick={toggleFull}
    >
      {#if full}
        <Minimize class="h-4 w-4 2xl:h-7 2xl:w-7" aria-hidden="true" />
      {:else}
        <Maximize class="h-4 w-4 2xl:h-7 2xl:w-7" aria-hidden="true" />
      {/if}
    </button>
  </div>
{/if}

<style lang="scss">
  @use "../styles/variables" as *;

  // Behind the dogs, inside the stage: the stage is its own stacking context (ThreeDCanvas)
  .stage-backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
  }

  // Top right; on phones held sideways the dog's credit is up there, so the buttons go to the bottom
  .stage-buttons {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 20;
  }

  @media (orientation: landscape) and (max-width: 950px) {
    .stage-buttons {
      top: auto;
      bottom: 0.75rem;
      right: 0.75rem;
    }
  }

  .stage-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background: $bg-stage-chip;
    border: 1px solid $color-blog-line;
    color: $color-blog-ink;
    backdrop-filter: blur(4px);
    cursor: pointer;
    transition: color $transition-speed-fast ease, border-color $transition-speed-fast ease, transform $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      color: $color-blog-ink-strong;
      border-color: $color-blog-ink;
    }

    &:focus-visible {
      outline: 2px solid $color-blog-ink-strong;
      outline-offset: 2px;
    }

    &:active {
      transform: scale(0.9);
    }
  }

  .stage-btn-on {
    color: $color-neon-green;
    border-color: $color-neon-green;
  }

  // The fallback full screen: the stage over the whole window
  :global(.stage-fills-window) {
    position: fixed !important;
    inset: 0;
    z-index: 1000;
    background: $bg-app-dark;
  }
</style>
