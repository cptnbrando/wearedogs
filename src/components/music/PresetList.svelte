<script>
  /**
   * PresetList: every MilkDrop preset with a search box and a heart on each.
   * "Hearts" narrows it to the listener's own list. Tapping a name puts that
   * preset on screen. Used by the player's PRESETS tab and by the full-screen
   * deck (MilkdropControls); the deck itself is lib/visualizer/presetDeck.
   */
  import { Search, Heart } from "lucide-svelte";
  import { presetDeck } from "../../lib/visualizer/presetDeck.svelte.js";

  /** How many matching presets the list draws at once: enough to browse, cheap to draw. */
  const MAX_LISTED = 120;
  const FILTER_ALL = "all";
  const FILTER_HEARTS = "hearts";

  let query = $state("");
  let filter = $state(FILTER_ALL);

  let pool = $derived(filter === FILTER_HEARTS ? presetDeck.favorites : presetDeck.names);
  let words = $derived(query.trim().toLowerCase().split(/\s+/).filter(Boolean));
  let matches = $derived(
    words.length ? pool.filter((name) => words.every((word) => name.toLowerCase().indexOf(word) !== -1)) : pool,
  );
  let listed = $derived(matches.slice(0, MAX_LISTED));
  let emptyNote = $derived.by(() => {
    if (filter === FILTER_HEARTS && !presetDeck.favorites.length) return "No hearts yet. Tap the heart on a preset you love.";
    if (!presetDeck.names.length) return "Presets arrive when the visualizer starts. Press play.";
    return "No preset matches that.";
  });
</script>

<div class="preset-list flex min-h-0 flex-1 flex-col">
  <div class="flex items-center gap-2 border-b border-white/10 px-3 py-2 sm:py-1.5 md:px-4 2xl:px-5 2xl:py-3">
    <Search size={14} class="shrink-0 text-white/40" />
    <input
      bind:value={query}
      type="search"
      placeholder="Search {pool.length} presets"
      aria-label="Search MilkDrop presets"
      autocomplete="off"
      spellcheck="false"
      class="w-full min-w-0 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-white/30 2xl:text-[15px]"
    />
    <div class="flex shrink-0 items-center gap-1 rounded-md border border-white/10 p-0.5" role="group" aria-label="Which presets to list">
      <button
        type="button"
        class="filter-btn"
        class:filter-on={filter === FILTER_ALL}
        aria-pressed={filter === FILTER_ALL}
        onclick={() => (filter = FILTER_ALL)}
      >
        All
      </button>
      <button
        type="button"
        class="filter-btn"
        class:filter-on={filter === FILTER_HEARTS}
        aria-pressed={filter === FILTER_HEARTS}
        onclick={() => (filter = FILTER_HEARTS)}
      >
        <Heart size={10} /> {presetDeck.favorites.length}
      </button>
    </div>
  </div>
  <ul class="preset-rows min-h-0 flex-1 overflow-y-auto py-1">
    {#each listed as name (name)}
      <li class="flex items-center">
        <button
          type="button"
          class="min-w-0 flex-1 truncate px-3 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-white/10 md:px-4 md:text-[12px] 2xl:px-5 2xl:py-2 2xl:text-[15px]
            {name === presetDeck.current ? 'bg-white/15 text-white' : 'text-white/60'}"
          aria-current={name === presetDeck.current ? "true" : undefined}
          disabled={!presetDeck.names.length}
          onclick={() => presetDeck.pick(name)}
        >
          {name}
        </button>
        <button
          type="button"
          class="heart-btn"
          class:hearted={presetDeck.isFavorite(name)}
          aria-pressed={presetDeck.isFavorite(name)}
          aria-label={presetDeck.isFavorite(name) ? `Take the heart off ${name}` : `Heart ${name}`}
          onclick={() => presetDeck.toggleFavorite(name)}
        >
          <Heart size={13} fill={presetDeck.isFavorite(name) ? "currentColor" : "none"} />
        </button>
      </li>
    {/each}
    {#if !listed.length}
      <li class="px-3 py-3 font-mono text-[11px] text-white/40 md:px-4 2xl:px-5 2xl:text-[15px]">{emptyNote}</li>
    {:else if matches.length > listed.length}
      <li class="px-3 py-2 font-mono text-[10px] text-white/30 md:px-4 2xl:px-5 2xl:text-[13px]">
        {matches.length - listed.length} more. Search to narrow it down.
      </li>
    {/if}
  </ul>
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  .filter-btn {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $color-blog-ink;
    transition: background $transition-speed-fast ease, color $transition-speed-fast ease;
  }

  .filter-on {
    background: $bg-blog-hover;
    color: $color-blog-ink-strong;
  }

  .heart-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 34px;
    height: 30px;
    color: $color-blog-ink;
    opacity: 0.45;
    transition: opacity $transition-speed-fast ease, color $transition-speed-fast ease, transform $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      opacity: 1;
    }

    &:active {
      transform: scale(0.85);
    }
  }

  .hearted {
    opacity: 1;
    color: $color-like-fill;
  }

  // TV and ultra-wide: bigger targets for a remote or a pointer across the room
  @media (min-width: 1536px) {
    .filter-btn {
      font-size: 13px;
      padding: 4px 10px;
    }

    .heart-btn {
      width: 48px;
      height: 44px;
    }
  }
</style>
