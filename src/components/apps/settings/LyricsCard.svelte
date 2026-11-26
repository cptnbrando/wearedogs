<script>
  /**
   * LyricsCard: how the lyric line looks over the full-screen visualizer:
   * where it sits, its font and its size. The same choices as the full-screen
   * top row, kept by lib/lyrics.svelte.js.
   */
  import { lyrics, LYRIC_PLACES, LYRIC_FONTS, LYRIC_SIZES } from "../../../lib/lyrics.svelte.js";

  const SAMPLE_LINE = "DOGS RUN THE WORLD";
  const PLACE_NAMES = { top: "Top", middle: "Middle", bottom: "Bottom" };
  const GROUP_CLASS = "flex flex-wrap gap-2 md:gap-3";
  const ROW_CLASS = "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 2xl:gap-6";
  const LABEL_CLASS = "lyrics-label shrink-0 text-xs sm:w-28 md:text-sm 2xl:w-40 2xl:text-base";
  const CHOICE_CLASS = "lyrics-choice px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-base";

  let font = $derived(LYRIC_FONTS.find((entry) => entry.id === lyrics.font));
</script>

<section class="settings-section mt-8 2xl:mt-12">
  <h3 class="lyrics-title">Lyrics</h3>
  <div class="lyrics-card flex flex-col gap-4 2xl:gap-6 2xl:p-6">
    <p class="lyrics-sample truncate text-lg md:text-xl 2xl:text-3xl" style="font-family: {font.stack}" aria-hidden="true">
      {SAMPLE_LINE}
    </p>

    <div class={ROW_CLASS} role="group" aria-label="Where the lyrics sit">
      <span class={LABEL_CLASS}>Where</span>
      <div class={GROUP_CLASS}>
        {#each LYRIC_PLACES as place}
          <button
            type="button"
            class={CHOICE_CLASS}
            class:lyrics-on={lyrics.place === place}
            aria-pressed={lyrics.place === place}
            onclick={() => lyrics.setPrefs({ place })}
          >
            {PLACE_NAMES[place]}
          </button>
        {/each}
      </div>
    </div>

    <div class={ROW_CLASS} role="group" aria-label="Lyric font">
      <span class={LABEL_CLASS}>Font</span>
      <div class={GROUP_CLASS}>
        {#each LYRIC_FONTS as entry}
          <button
            type="button"
            class={CHOICE_CLASS}
            class:lyrics-on={lyrics.font === entry.id}
            style="font-family: {entry.stack}"
            aria-pressed={lyrics.font === entry.id}
            onclick={() => lyrics.setPrefs({ font: entry.id })}
          >
            {entry.name}
          </button>
        {/each}
      </div>
    </div>

    <div class={ROW_CLASS} role="group" aria-label="Lyric size">
      <span class={LABEL_CLASS}>Size</span>
      <div class={GROUP_CLASS}>
        {#each LYRIC_SIZES as entry}
          <button
            type="button"
            class={CHOICE_CLASS}
            class:lyrics-on={lyrics.size === entry.id}
            aria-pressed={lyrics.size === entry.id}
            onclick={() => lyrics.setPrefs({ size: entry.id })}
          >
            {entry.name}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../../../styles/variables" as *;
  @use "./cards" as cards;

  // The section and its heading repeat SettingsApp's: styles there are scoped to that file
  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .lyrics-title {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-neon-red, #ff3344);
  }

  .lyrics-card {
    @include cards.settings-card;
  }

  .lyrics-sample {
    margin: 0;
    font-weight: 800;
    color: $color-blog-ink-strong;
  }

  .lyrics-label {
    color: var(--color-text-muted, rgba(255, 255, 255, 0.55));
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .lyrics-choice {
    border-radius: 8px;
    border: 1px solid $border-light;
    background: transparent;
    color: $color-blog-ink;
    font-weight: 700;
    cursor: pointer;
    transition: background $transition-speed-fast ease, color $transition-speed-fast ease, border-color $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      background: $bg-blog-hover;
      color: $color-blog-ink-strong;
    }
  }

  .lyrics-on,
  .lyrics-on:hover {
    border-color: $color-neon-green;
    color: $color-neon-green;
  }
</style>
