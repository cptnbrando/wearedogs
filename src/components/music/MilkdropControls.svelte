<script>
  /**
   * MilkdropControls: the full-screen visualizer's MilkDrop deck. Previous and
   * next, the name of what is on (tap it for the list), a heart to keep it,
   * "hearts only" to play just the kept ones, shuffle, and auto-advance.
   * It only asks; the deck (lib/visualizer/presetDeck) and its engine do the work.
   */
  import { ChevronLeft, ChevronRight, Shuffle, Timer, Heart, ListMusic } from "lucide-svelte";
  import { presetDeck } from "../../lib/visualizer/presetDeck.svelte.js";
  import PresetList from "./PresetList.svelte";

  const AUTO_SECONDS = 30;

  let listOpen = $state(false);
  let hearted = $derived(presetDeck.isFavorite(presetDeck.current));
</script>

<div
  class="milkdrop-deck flex w-full flex-col gap-2 sm:max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-3xl 2xl:gap-3"
>
  {#if listOpen}
    <div
      class="flex max-h-[40vh] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/75 backdrop-blur-md sm:max-h-[50vh] 2xl:max-h-[60vh]"
    >
      <PresetList />
    </div>
  {/if}

  <div
    class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md"
  >
    <button type="button" class="deck-btn" onclick={() => presetDeck.previous()} aria-label="Previous preset" title="Previous preset">
      <ChevronLeft size={16} />
    </button>
    <button type="button" class="deck-btn" onclick={() => presetDeck.next()} aria-label="Next preset" title="Next preset">
      <ChevronRight size={16} />
    </button>
    <button
      type="button"
      class="min-w-0 flex-1 truncate px-2 text-left font-mono text-[10px] uppercase tracking-wider text-white/80 hover:text-white md:text-[11px] 2xl:text-[14px]"
      aria-expanded={listOpen}
      title={listOpen ? "Hide the preset list" : "Browse presets"}
      onclick={() => (listOpen = !listOpen)}
    >
      {presetDeck.current || "Loading MilkDrop…"}
    </button>
    <button
      type="button"
      class="deck-btn deck-heart"
      class:deck-hearted={hearted}
      aria-pressed={hearted}
      aria-label={hearted ? "Take the heart off this preset" : "Heart this preset"}
      title={hearted ? "In your hearts. Tap to take it out." : "Heart this preset"}
      onclick={() => presetDeck.toggleFavorite()}
    >
      <Heart size={14} fill={hearted ? "currentColor" : "none"} />
    </button>
    <button
      type="button"
      class="deck-btn"
      class:deck-btn-on={presetDeck.favoritesOnly}
      aria-pressed={presetDeck.favoritesOnly}
      aria-label="Play only my hearted presets"
      title={presetDeck.favoritesOnly ? "Playing only your hearts" : "Play only your hearts"}
      onclick={() => presetDeck.setFavoritesOnly(!presetDeck.favoritesOnly)}
    >
      <ListMusic size={14} />
    </button>
    <button
      type="button"
      class="deck-btn"
      class:deck-btn-on={presetDeck.shuffle}
      aria-pressed={presetDeck.shuffle}
      aria-label="Shuffle presets"
      title={presetDeck.shuffle ? "Shuffle: on" : "Shuffle: off, presets go in order"}
      onclick={() => presetDeck.setShuffle(!presetDeck.shuffle)}
    >
      <Shuffle size={14} />
    </button>
    <button
      type="button"
      class="deck-btn"
      class:deck-btn-on={presetDeck.auto}
      aria-pressed={presetDeck.auto}
      aria-label="Change preset by itself every {AUTO_SECONDS} seconds"
      title={presetDeck.auto ? `A new preset every ${AUTO_SECONDS} seconds: on` : `A new preset every ${AUTO_SECONDS} seconds: off`}
      onclick={() => presetDeck.setAuto(!presetDeck.auto)}
    >
      <Timer size={14} />
    </button>
  </div>
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  .deck-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    color: $color-blog-ink;
    transition: background $transition-speed-fast ease, color $transition-speed-fast ease, transform $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      background: $bg-blog-hover;
      color: $color-blog-ink-strong;
    }

    &:active {
      transform: scale(0.88);
    }
  }

  .deck-btn-on {
    color: $color-neon-green;
  }

  .deck-hearted {
    color: $color-like-fill;
  }

  // TV and ultra-wide: bigger targets for a remote or a pointer across the room
  @media (min-width: 1536px) {
    .deck-btn {
      width: 44px;
      height: 44px;
    }
  }
</style>
