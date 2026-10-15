<script>
  /**
   * DocumentPreview — counts and an opening excerpt of a loaded document,
   * shown in the Catalytic Converter's settings slot.
   * @prop {{ paragraphs: number, headings: number, words: number, characters: number, preview: string }} stats
   */
  export let stats;

  const NUMBER_FORMAT = new Intl.NumberFormat();
  const TILES = [
    ["words", "Words"],
    ["paragraphs", "Blocks"],
    ["headings", "Headings"],
    ["characters", "Chars"],
  ];
</script>

<section class="doc-preview flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3 2xl:gap-5" aria-label="Document contents">
  <h3 class="doc-title text-[10px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-xs 2xl:text-base">
    Document Contents
  </h3>
  <dl class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-1.5 sm:gap-1.5 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-3 m-0">
    {#each TILES as [key, label]}
      <div class="doc-tile flex flex-col items-center py-1 sm:py-1 md:py-1.5 lg:py-1.5 xl:py-2 2xl:py-3 min-w-0">
        <dt class="doc-tile-label text-[8px] sm:text-[8px] md:text-[9px] lg:text-[9px] xl:text-[9px] 2xl:text-xs truncate max-w-full">
          {label}
        </dt>
        <dd class="doc-tile-value m-0 text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-xl truncate max-w-full">
          {NUMBER_FORMAT.format(stats[key] || 0)}
        </dd>
      </div>
    {/each}
  </dl>
  <p
    class="doc-excerpt m-0 text-[11px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-xs 2xl:text-base line-clamp-4 sm:line-clamp-2 md:line-clamp-6 lg:line-clamp-4 xl:line-clamp-5 2xl:line-clamp-6"
  >
    {stats.preview || "No text found."}
  </p>
</section>

<style lang="scss">
  @use "../../styles/variables" as vars;

  .doc-preview {
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid vars.$color-doc-sky-line;
  }

  .doc-title {
    margin: 0;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: vars.$color-doc-sky;
    font-family: monospace;
  }

  .doc-tile {
    border-radius: 8px;
    background: vars.$color-doc-sky-soft;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .doc-tile-label {
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.4);
    font-family: monospace;
  }

  .doc-tile-value {
    font-weight: 700;
    color: #fff;
    font-variant-numeric: tabular-nums;
  }

  .doc-excerpt {
    white-space: pre-line;
    overflow-wrap: anywhere;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.6);
    font-family: monospace;
  }
</style>
