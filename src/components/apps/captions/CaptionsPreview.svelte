<script>
  /**
   * The live preview: the caption as it will look. For a video it is drawn
   * over the picture; for sound alone it sits on a dark stage.
   *
   * The row is the music player's lyric line (src/components/music/LyricLine.svelte):
   * one row, each word arriving at its moment, a long line cut the way the
   * player cuts it and shrunk to fit. The clock is the media element's own.
   */
  import { tick } from "svelte";
  import { splitLongLines, lineOnScreen } from "../../../lib/lyricsFormat.js";

  const SUNG_CLASS = "is-sung";

  /** @type {{ media: import("./captionsMedia.svelte.js").CaptionsMedia, project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { media, project } = $props();

  let lineIndex = $state(-1);
  let boxEl = $state(null);
  let rowEl = $state(null);
  let fit = $state(1);

  let lines = $derived.by(() => {
    project.rev;
    const lyrics = project.lyrics();
    return lyrics ? splitLongLines(lyrics).lines : null;
  });
  let line = $derived(lines && lineIndex >= 0 ? lines[lineIndex] : null);

  /** Puts the media element inside the preview, so a video's picture shows. */
  function host(node) {
    if (media.el) node.appendChild(media.el);
  }

  let sungCount = 0;

  $effect(() => {
    const current = lines;
    lineIndex = -1;
    sungCount = 0;
    if (!current) return;
    let frame = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const now = media.now();
      const index = lineOnScreen(current, now);
      if (index !== lineIndex) {
        lineIndex = index;
        sungCount = 0;
        return;
      }
      if (index < 0 || !rowEl) return;
      const words = current[index].w;
      let sung = 0;
      while (sung < words.length && words[sung][0] <= now) sung++;
      if (sung === sungCount) return;
      const spans = rowEl.children;
      for (let i = Math.min(sung, sungCount); i < Math.max(sung, sungCount) && i < spans.length; i++) {
        spans[i].classList.toggle(SUNG_CLASS, i < sung);
      }
      sungCount = sung;
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  });

  // One row, always: a line wider than its place is scaled down to fit it.
  $effect(() => {
    line;
    fit = 1;
    tick().then(() => {
      if (!rowEl || !boxEl || !rowEl.scrollWidth) return;
      fit = Math.min(1, boxEl.clientWidth / rowEl.scrollWidth);
    });
  });
</script>

<div class="cap-preview cap-preview-{media.kind} relative flex min-h-0 items-center justify-center">
  <div class="cap-media flex min-h-0 items-center justify-center" use:host></div>
  <div class="cap-caption text-base sm:text-sm md:text-xl xl:text-2xl 2xl:text-4xl" bind:this={boxEl} style="--cap-fit: {fit};" aria-hidden="true">
    {#if line}
      {#key lineIndex}
        <span class="cap-caption-row" bind:this={rowEl}>
          {#each line.w as word}<span class="cap-caption-word">{word[1]}</span>{/each}
        </span>
      {/key}
    {/if}
  </div>
</div>
