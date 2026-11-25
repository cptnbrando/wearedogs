<script>
  /**
   * StageLyricControls: the full-screen visualizer's lyric deck and its way
   * out. Lyrics on or off, where the line sits (top, middle, bottom), its
   * font and its size. The choices are kept by lib/lyrics.svelte.js.
   */
  import {
    Speech, Minimize, ArrowUpToLine, ArrowDownToLine, FoldVertical, Circle, Square, RectangleHorizontal, RectangleVertical, Expand,
  } from "lucide-svelte";
  import { lyrics, LYRIC_PLACES, LYRIC_FONTS, LYRIC_SIZES } from "../../lib/lyrics.svelte.js";
  import StrikeToggle from "./StrikeToggle.svelte";
  import { stageRecording, STAGE_FRAMES } from "./stageRecording.svelte.js";

  const PLACE_ICONS = { top: ArrowUpToLine, middle: FoldVertical, bottom: ArrowDownToLine };
  const FRAME_ICONS = { full: Expand, tall: RectangleVertical, square: Square, wide: RectangleHorizontal };
  const SECONDS_PER_MINUTE = 60;

  /**
   * @type {{ hasLyrics: boolean, canRecord: boolean, onExit: () => void, onRecord: () => void }}
   * hasLyrics: the song playing has lyrics; canRecord: there is a picture to record
   */
  let { hasLyrics, canRecord, onExit, onRecord } = $props();

  let frame = $derived(STAGE_FRAMES.find((entry) => entry.id === stageRecording.frame));
  let FrameIcon = $derived(FRAME_ICONS[frame.id]);
  let clock = $derived(
    `${Math.floor(stageRecording.seconds / SECONDS_PER_MINUTE)}:${String(stageRecording.seconds % SECONDS_PER_MINUTE).padStart(2, "0")}`,
  );

  let font = $derived(LYRIC_FONTS.find((entry) => entry.id === lyrics.font));
  let size = $derived(LYRIC_SIZES.find((entry) => entry.id === lyrics.size));
  let PlaceIcon = $derived(PLACE_ICONS[lyrics.place]);

  /** The entry after the current one, wrapping round. */
  function after(list, current) {
    return list[(list.indexOf(current) + 1) % list.length];
  }
</script>

<div class="flex items-center gap-1 self-start rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md sm:self-auto">
  <button type="button" class="stage-btn" onclick={onExit} aria-label="Leave full screen" title="Leave full screen">
    <Minimize size={15} />
  </button>
  <StrikeToggle
    class="stage-btn"
    on={lyrics.shown}
    dim={!hasLyrics}
    label={lyrics.shown ? (hasLyrics ? "Lyrics: on" : "Lyrics: on. This song has none yet.") : "Lyrics: off"}
    onclick={() => lyrics.setPrefs({ shown: !lyrics.shown })}
  >
    <Speech size={15} />
  </StrikeToggle>
  {#if lyrics.shown}
    <button
      type="button"
      class="stage-btn"
      aria-label="Lyrics sit at the {lyrics.place}. Tap to move them."
      title="Lyrics sit at the {lyrics.place}. Tap to move them."
      onclick={() => lyrics.setPrefs({ place: after(LYRIC_PLACES, lyrics.place) })}
    >
      <PlaceIcon size={15} />
    </button>
    <button
      type="button"
      class="stage-btn stage-btn-wide"
      style="font-family: {font.stack}"
      aria-label="Lyric font: {font.name}. Tap for the next one."
      title="Lyric font: {font.name}. Tap for the next one."
      onclick={() => lyrics.setPrefs({ font: after(LYRIC_FONTS, font).id })}
    >
      {font.name}
    </button>
    <button
      type="button"
      class="stage-btn"
      aria-label="Lyric size: {size.name}. Tap to change it."
      title="Lyric size: {size.name}. Tap to change it."
      onclick={() => lyrics.setPrefs({ size: after(LYRIC_SIZES, size).id })}
    >
      {size.id.toUpperCase()}
    </button>
  {/if}
  <button
    type="button"
    class="stage-btn"
    disabled={stageRecording.active}
    aria-label="Picture shape: {frame.name}. Tap for the next one."
    title="Picture shape: {frame.name}. Tap for the next one."
    onclick={() => stageRecording.nextFrame()}
  >
    <FrameIcon size={15} />
  </button>
  {#if canRecord && stageRecording.supported}
    <button
      type="button"
      class="stage-btn stage-btn-wide"
      class:stage-recording={stageRecording.active}
      aria-pressed={stageRecording.active}
      aria-label={stageRecording.active ? "Stop recording and save the video" : "Record a video: the song starts over"}
      title={stageRecording.active ? "Stop recording and save the video" : "Record a video: the song starts over"}
      onclick={onRecord}
    >
      {#if stageRecording.active}
        <Square size={11} fill="currentColor" /><span class="ml-1">{clock}</span>
      {:else}
        <Circle size={11} fill="currentColor" /><span class="ml-1">REC</span>
      {/if}
    </button>
  {/if}
</div>
{#if stageRecording.note}
  <p class="stage-note" role="status">{stageRecording.note}</p>
{/if}

<style lang="scss">
  @use "../../styles/variables" as *;

  div :global(.stage-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    min-width: 30px;
    height: 30px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    color: $color-blog-ink;
    transition: background $transition-speed-fast ease, color $transition-speed-fast ease;
  }

  div :global(.stage-btn:hover),
  div :global(.stage-btn:focus-visible) {
    background: $bg-blog-hover;
    color: $color-blog-ink-strong;
  }

  .stage-btn-wide {
    padding: 0 8px;
    min-width: 52px;
  }

  div :global(.stage-btn:disabled) {
    opacity: 0.35;
    pointer-events: none;
  }

  .stage-recording,
  .stage-recording:hover {
    color: $color-like-fill;
  }

  .stage-note {
    align-self: flex-start;
    max-width: 22rem;
    padding: 6px 10px;
    border-radius: 6px;
    background: $bg-stage-note;
    font-size: 11px;
    line-height: 1.4;
    color: $color-blog-ink-strong;
  }

  // TV and ultra-wide: bigger targets for a remote or a pointer across the room
  @media (min-width: 1536px) {
    div :global(.stage-btn) {
      min-width: 44px;
      height: 44px;
      font-size: 14px;
    }

    .stage-btn-wide {
      min-width: 76px;
    }

    .stage-note {
      font-size: 14px;
      max-width: 30rem;
    }
  }
</style>
