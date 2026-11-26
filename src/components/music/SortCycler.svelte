<script module>
  import { ListOrdered, MicVocal, Disc3, CalendarDays, FileText, Tags, Leaf } from "lucide-svelte";

  /** Every order the song list knows, in the order a tap goes through them. Colours: _variables.scss. */
  export const SORT_MODES = [
    { id: "default", name: "Default order", icon: ListOrdered },
    { id: "artist", name: "Artist", icon: MicVocal },
    { id: "album", name: "Album", icon: Disc3 },
    { id: "year", name: "Year", icon: CalendarDays },
    { id: "filename", name: "File name", icon: FileText },
    { id: "genre", name: "Genre", icon: Tags },
    { id: "season", name: "Season", icon: Leaf },
  ];
</script>

<script>
  /**
   * SortCycler: the song list's sort on a phone, as one symbol. Each tap
   * moves to the next order; the symbol and its colour say which one is on.
   * Wider screens keep the SORT BY menu (MusicPanel).
   */

  /** @type {{ value: string, onchange: (id: string) => void, class?: string }} */
  let { value, onchange, class: className = "" } = $props();

  let at = $derived(Math.max(0, SORT_MODES.findIndex((mode) => mode.id === value)));
  let mode = $derived(SORT_MODES[at]);
  let next = $derived(SORT_MODES[(at + 1) % SORT_MODES.length]);
</script>

<button
  type="button"
  class="sort-cycler sort-{mode.id} {className}"
  aria-label="Sorted by {mode.name}. Tap to sort by {next.name}."
  title="Sorted by {mode.name}"
  onclick={() => onchange(next.id)}
>
  {#key mode.id}
    <span class="sort-icon"><mode.icon size={13} /></span>
  {/key}
</button>

<style lang="scss">
  @use "../../styles/variables" as *;

  // Slim and square-cornered like the TRACKS and PRESETS tabs beside it (.tl-tab in MusicPanel)
  .sort-cycler {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 24px;
    padding: 0;
    border-radius: 6px;
    border: 1px solid currentColor;
    background: transparent;
    cursor: pointer;
    transition: color 0.2s ease, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:active {
      transform: scale(0.88);
    }
  }

  .sort-icon {
    display: flex;
    animation: sort-swap 0.25s ease-out;
  }

  // One colour per order (_variables.scss, "Music player song-list sort")
  .sort-default {
    color: $color-sort-default;
  }

  .sort-artist {
    color: $color-sort-artist;
  }

  .sort-album {
    color: $color-sort-album;
  }

  .sort-year {
    color: $color-sort-year;
  }

  .sort-filename {
    color: $color-sort-filename;
  }

  .sort-genre {
    color: $color-sort-genre;
  }

  .sort-season {
    color: $color-sort-season;
  }

  @keyframes sort-swap {
    from {
      opacity: 0;
      transform: rotate(-90deg) scale(0.6);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sort-icon {
      animation: none;
    }
  }
</style>
