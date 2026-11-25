<script>
  // MilkdropControls: the full-screen visualizer's MilkDrop deck. What is on,
  // previous / random / next, auto-advance, and the preset list with a search
  // box. It only asks; MilkdropEngine (src/lib/visualizer) does the work.
  import { ChevronLeft, ChevronRight, Shuffle, Timer, Search } from "lucide-svelte";

  /** How many matching presets the list shows at once: enough to browse, cheap to draw. */
  const MAX_LISTED = 120;
  const AUTO_SECONDS = 30;

  /** The preset on screen. */
  export let current = "";
  /** Every preset loaded so far, sorted. */
  export let names = [];
  /** Auto-advance is on. */
  export let auto = true;
  export let onPrevious = () => {};
  export let onNext = () => {};
  export let onRandom = () => {};
  export let onToggleAuto = () => {};
  /** @type {(name: string) => void} */
  export let onPick = () => {};

  let query = "";
  let listOpen = false;

  $: words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  $: matches = words.length
    ? names.filter((name) => {
        const lower = name.toLowerCase();
        return words.every((word) => lower.indexOf(word) !== -1);
      })
    : names;
  $: listed = matches.slice(0, MAX_LISTED);
</script>

<div
  class="milkdrop-deck flex w-full flex-col gap-2 sm:max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-3xl 2xl:gap-3"
>
  {#if listOpen}
    <div
      class="flex max-h-[40vh] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/75 backdrop-blur-md sm:max-h-[50vh] 2xl:max-h-[60vh]"
    >
      <label class="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <Search size={14} class="shrink-0 text-white/40" />
        <input
          bind:value={query}
          type="search"
          placeholder="Search {names.length} presets"
          aria-label="Search MilkDrop presets"
          autocomplete="off"
          spellcheck="false"
          class="w-full min-w-0 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-white/30 2xl:text-[15px]"
        />
      </label>
      <ul class="min-h-0 flex-1 overflow-y-auto py-1">
        {#each listed as name (name)}
          <li>
            <button
              type="button"
              class="block w-full truncate px-3 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-white/10 md:text-[12px] 2xl:py-2 2xl:text-[15px]
                {name === current ? 'bg-white/15 text-white' : 'text-white/60'}"
              aria-current={name === current ? "true" : undefined}
              onclick={() => onPick(name)}
            >
              {name}
            </button>
          </li>
        {/each}
        {#if !listed.length}
          <li class="px-3 py-2 font-mono text-[11px] text-white/40 2xl:text-[15px]">
            {names.length ? "No preset matches that." : "Loading presets…"}
          </li>
        {:else if matches.length > listed.length}
          <li class="px-3 py-2 font-mono text-[10px] text-white/30 2xl:text-[13px]">
            {matches.length - listed.length} more. Search to narrow it down.
          </li>
        {/if}
      </ul>
    </div>
  {/if}

  <div
    class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md"
  >
    <button type="button" class="deck-btn" onclick={onPrevious} aria-label="Previous preset" title="Previous preset">
      <ChevronLeft size={16} />
    </button>
    <button type="button" class="deck-btn" onclick={onRandom} aria-label="Random preset" title="Random preset">
      <Shuffle size={14} />
    </button>
    <button type="button" class="deck-btn" onclick={onNext} aria-label="Next preset" title="Next preset">
      <ChevronRight size={16} />
    </button>
    <button
      type="button"
      class="min-w-0 flex-1 truncate px-2 text-left font-mono text-[10px] uppercase tracking-wider text-white/80 hover:text-white md:text-[11px] 2xl:text-[14px]"
      aria-expanded={listOpen}
      title={listOpen ? "Hide the preset list" : "Browse presets"}
      onclick={() => (listOpen = !listOpen)}
    >
      {current || "Loading MilkDrop…"}
    </button>
    <button
      type="button"
      class="deck-btn"
      class:deck-btn-on={auto}
      aria-pressed={auto}
      aria-label="Change preset by itself every {AUTO_SECONDS} seconds"
      title={auto ? `A new preset every ${AUTO_SECONDS} seconds: on` : `A new preset every ${AUTO_SECONDS} seconds: off`}
      onclick={onToggleAuto}
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
    transition: background $transition-speed-fast ease, color $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      background: $bg-blog-hover;
      color: $color-blog-ink-strong;
    }
  }

  .deck-btn-on {
    color: $color-neon-green;
  }

  // TV and ultra-wide: bigger targets for a remote or a pointer across the room
  @media (min-width: 1536px) {
    .deck-btn {
      width: 44px;
      height: 44px;
    }
  }
</style>
