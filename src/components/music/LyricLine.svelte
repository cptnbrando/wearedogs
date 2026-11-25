<script>
  /**
   * The lyric line: the words of the song as they are sung, on one row, each
   * word flashing in at its moment. Never a second row: a line too wide for
   * its place is shrunk to fit.
   *
   * `slot` is the small line in the player, above the seek bar. `stage` is
   * the big one over the full-screen visualizer, placed top, middle or bottom
   * (lib/lyrics.svelte.js keeps the listener's choice).
   *
   * The clock is the audio element's own, read every frame, so a word lands
   * on the beat it was timed to rather than on the player's slower tick.
   */
  import { tick } from "svelte";
  import { audioCore } from "../../lib/AudioCore.svelte.js";
  import { lyrics, LYRIC_FONTS, LYRIC_SIZES } from "../../lib/lyrics.svelte.js";
  import { lineOnScreen } from "../../lib/lyricsFormat.js";

  const MS_PER_SECOND = 1000;
  const SUNG_CLASS = "sung";
  const VARIANT_STAGE = "stage";

  /** @type {{ variant?: "slot" | "stage" }} */
  let { variant = "slot" } = $props();

  let lineIndex = $state(-1);
  let boxEl = $state(null);
  let rowEl = $state(null);
  let fit = $state(1);

  let lines = $derived(lyrics.shown && lyrics.current ? lyrics.current.lines : null);
  let line = $derived(lines && lineIndex >= 0 ? lines[lineIndex] : null);
  let fontStack = $derived(LYRIC_FONTS.find((font) => font.id === lyrics.font).stack);
  let sizeScale = $derived(variant === VARIANT_STAGE ? LYRIC_SIZES.find((size) => size.id === lyrics.size).scale : 1);

  // The player's own time moves in ticks; between two of them the clock glides.
  let tickedTime = 0;
  let tickedAt = 0;
  $effect(() => {
    tickedTime = audioCore.currentTime;
    tickedAt = performance.now();
  });

  /** @returns {number} where the song is, in seconds */
  function songTime() {
    const el = audioCore.primaryAudio();
    // This tab makes the sound: its element knows the time to the sample
    if (el && el.src && !el.paused) return el.currentTime;
    if (!audioCore.isPlaying) return audioCore.currentTime;
    // Another tab or device plays it: glide from the last time it reported
    return tickedTime + (performance.now() - tickedAt) / MS_PER_SECOND;
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
      const now = songTime();
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
      // Only the words that changed are touched: a seek backwards hides them again
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
    fontStack;
    sizeScale;
    fit = 1;
    tick().then(() => {
      if (!rowEl || !boxEl || !rowEl.scrollWidth) return;
      fit = Math.min(1, boxEl.clientWidth / rowEl.scrollWidth);
    });
  });
</script>

<div
  class="lyric-line lyric-{variant} lyric-at-{lyrics.place}"
  bind:this={boxEl}
  style="--lyric-font: {fontStack}; --lyric-scale: {sizeScale}; --lyric-fit: {fit};"
  aria-hidden="true"
>
  {#if line}
    {#key lineIndex}
      <span class="lyric-row" bind:this={rowEl}>
        {#each line.w as word}<span class="lyric-word">{word[1]}</span>{/each}
      </span>
    {/key}
  {/if}
</div>

<style lang="scss">
  // Colours come from the player's palette (src/lib/musicPalettes.js), set on .mp-container.
  .lyric-line {
    overflow: hidden;
    white-space: nowrap;
    pointer-events: none;
    font-family: var(--lyric-font);
    user-select: none;
  }

  .lyric-row {
    display: inline-block;
    transform: scale(var(--lyric-fit));
  }

  .lyric-word {
    display: inline-block;
    margin-right: 0.3em;
    opacity: 0;
  }

  .lyric-word:global(.sung) {
    opacity: 1;
    animation: lyric-flash 0.32s ease-out;
  }

  // The small line in the player: where the seek bar starts, no frame, one row.
  .lyric-slot {
    flex-shrink: 0;
    height: 1.25rem;
    line-height: 1.25rem;
    width: 100%;
    text-align: left;
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: rgba(var(--mp-ink-rgb, 255, 255, 255), 0.92);

    .lyric-row {
      transform-origin: left center;
    }
  }

  // The big line over the full-screen visualizer. It is sized and placed by
  // the frame it sits in (.stage-frame in MusicPanel, which may be tall, square
  // or wide), so the recorded video (lib/lyricCanvas.js) matches the screen.
  // Browsers without container units size it from the window instead.
  .lyric-stage {
    position: absolute;
    left: 4%;
    right: 4%;
    z-index: 15;
    text-align: center;
    font-size: calc(clamp(1rem, min(5.2vw, 12vh), 6rem) * var(--lyric-scale));
    font-size: calc(clamp(1rem, min(5.2cqw, 12cqh), 6rem) * var(--lyric-scale));
    line-height: 1.3;
    font-weight: 800;
    color: rgb(var(--mp-ink-rgb, 255, 255, 255));
    text-shadow:
      0 0 0.5em rgba(0, 0, 0, 0.85),
      0 0.06em 0.12em rgba(0, 0, 0, 0.9);

    .lyric-row {
      transform-origin: center center;
    }

    &.lyric-at-top {
      top: 9%;
    }

    &.lyric-at-middle {
      top: 50%;
      margin-top: -0.65em;
    }

    &.lyric-at-bottom {
      bottom: 16%;
    }
  }

  @keyframes lyric-flash {
    0% {
      opacity: 0;
      transform: translateY(0.18em) scale(1.18);
      filter: brightness(2.2);
    }
    45% {
      opacity: 1;
      filter: brightness(1.8);
    }
    100% {
      opacity: 1;
      transform: none;
      filter: none;
    }
  }

  // Short screens: the player has no height to spare, so the small line is smaller.
  @media (max-height: 700px) {
    .lyric-slot {
      height: 0.875rem;
      line-height: 0.875rem;
      font-size: 0.75rem;
    }
  }

  // Phones on their side: the controls take more of the height, so the bottom line sits higher.
  @media (max-height: 500px) {
    .lyric-stage.lyric-at-bottom {
      bottom: 26%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lyric-word:global(.sung) {
      animation: none;
    }
  }
</style>
