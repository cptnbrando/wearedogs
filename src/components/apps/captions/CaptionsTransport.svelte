<script>
  /**
   * The transport: the waveform to scrub, play / pause, and playback speed.
   *
   * Two waveforms: the overview is the whole file; the strip is a few seconds
   * around the playhead with a marker on every word. Dragging the selected
   * word's marker moves its time; dragging anywhere else scrubs.
   */
  import { Play, Pause, Rewind, ZoomIn, ZoomOut } from "lucide-svelte";
  import { SPEEDS } from "./captionsMedia.svelte.js";
  import { clock, roundTime } from "./captionsEdit.js";
  import { drawStrip, drawOverview, stripStart, marksBetween } from "./captionsWave.js";

  /** Seconds the strip can show; the middle one to start with. */
  const SPANS = [3, 6, 12, 24];
  const DEFAULT_SPAN_INDEX = 1;
  const BACK_S = 2;
  /** A press this close to the selected word's marker grabs it. */
  const GRAB_PX = 14;
  const CSS_WAVE = "--cap-wave";
  const CSS_PLAYED = "--cap-played";
  const CSS_MARK = "--cap-mark";
  const CSS_ACCENT = "--cap-accent";
  const CSS_TEXT = "--cap-ink";

  /** @type {{ media: import("./captionsMedia.svelte.js").CaptionsMedia, project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { media, project } = $props();

  let spanIndex = $state(DEFAULT_SPAN_INDEX);
  let stripEl = $state(null);
  let overviewEl = $state(null);
  /** While a pointer is down on the strip, the strip stops following the playhead. */
  let held = null;

  /** Sizes a canvas for the screen's pixel density and returns its drawing context, scaled to CSS pixels. */
  function fitCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx, width, height };
  }

  function colorsOf(canvas) {
    const style = getComputedStyle(canvas);
    const read = (name) => style.getPropertyValue(name).trim();
    return { wave: read(CSS_WAVE), played: read(CSS_PLAYED), mark: read(CSS_MARK), accent: read(CSS_ACCENT), text: read(CSS_TEXT), font: style.fontFamily };
  }

  const viewStart = (now) => (held ? held.start : stripStart(now, SPANS[spanIndex], media.duration));

  // Redrawn every frame only when something moved: the playhead, the words, the size
  $effect(() => {
    if (!stripEl || !overviewEl) return;
    let frame = 0;
    let drawn = "";
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const now = media.now();
      const span = SPANS[spanIndex];
      const start = viewStart(now);
      const sel = project.sel;
      const key = [now, span, start, project.rev, sel ? sel.li : -1, sel ? sel.wi : -1, stripEl.clientWidth, stripEl.clientHeight, media.peaks ? 1 : 0, media.duration].join("|");
      if (key === drawn) return;
      drawn = key;
      const colors = colorsOf(stripEl);
      const strip = fitCanvas(stripEl);
      drawStrip(strip.ctx, strip.width, strip.height, {
        peaks: media.peaks, start, span, now, colors,
        marks: marksBetween(project.lines, sel, start, start + span),
      });
      const overview = fitCanvas(overviewEl);
      drawOverview(overview.ctx, overview.width, overview.height, { peaks: media.peaks, duration: media.duration, now, start, span, colors });
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  });

  const timeAt = (event, start, span) => {
    const box = event.currentTarget.getBoundingClientRect();
    return start + ((event.clientX - box.left) / box.width) * span;
  };

  function stripDown(event) {
    const span = SPANS[spanIndex];
    const start = viewStart(media.now());
    const box = event.currentTarget.getBoundingClientRect();
    const word = project.selected;
    const markX = word && word.t !== null ? ((word.t - start) / span) * box.width : null;
    const grabbed = markX !== null && Math.abs(event.clientX - box.left - markX) <= GRAB_PX;
    held = { start, span, grabbed, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (!grabbed) media.seek(timeAt(event, start, span));
  }

  function stripMove(event) {
    if (!held) return;
    const seconds = timeAt(event, held.start, held.span);
    if (!held.grabbed) return media.seek(seconds);
    project.setTime(roundTime(seconds), held.moved);
    held.moved = true;
  }

  function stripUp() {
    held = null;
  }

  function overviewSeek(event) {
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture(event.pointerId);
    else if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    media.seek(timeAt(event, 0, media.duration));
  }
</script>

<div class="cap-transport flex min-h-0 flex-col gap-2 md:gap-3 2xl:gap-4">
  <canvas
    class="cap-overview"
    bind:this={overviewEl}
    onpointerdown={overviewSeek}
    onpointermove={overviewSeek}
    aria-label="The whole file. Drag to move through it."
  ></canvas>
  <canvas
    class="cap-strip"
    bind:this={stripEl}
    onpointerdown={stripDown}
    onpointermove={stripMove}
    onpointerup={stripUp}
    onpointercancel={stripUp}
    aria-label="The sound around the playhead, with a marker on every word. Drag to scrub, or drag the selected word's marker to move it."
  ></canvas>

  <div class="flex flex-row flex-wrap items-center gap-2 md:gap-3 2xl:gap-4">
    <button type="button" class="cap-btn cap-btn-main p-2 md:p-3 2xl:p-4" aria-label={media.playing ? "Pause" : "Play"} onclick={() => media.toggle()}>
      {#if media.playing}<Pause size={20} />{:else}<Play size={20} />{/if}
    </button>
    <span class="hidden sm:inline-flex">
      <button type="button" class="cap-btn p-2 md:p-3 2xl:p-4" aria-label="Back two seconds" onclick={() => media.seek(media.now() - BACK_S)}>
        <Rewind size={18} />
      </button>
    </span>
    <span class="cap-clock text-xs md:text-sm xl:text-base 2xl:text-xl">{clock(media.time)} / {clock(media.duration, false)}</span>

    <span class="ml-auto flex flex-row items-center gap-1 2xl:gap-2" role="group" aria-label="Playback speed">
      {#each SPEEDS as speed}
        <button type="button" class="cap-btn px-2 py-1 text-xs md:text-sm 2xl:px-4 2xl:py-2 2xl:text-lg" class:is-on={media.rate === speed} aria-pressed={media.rate === speed} onclick={() => media.setRate(speed)}>
          {speed}x
        </button>
      {/each}
    </span>
    <span class="hidden flex-row items-center gap-1 sm:flex 2xl:gap-2" role="group" aria-label="Zoom">
      <button type="button" class="cap-btn p-1 md:p-2 2xl:p-3" aria-label="Zoom in" disabled={spanIndex === 0} onclick={() => spanIndex--}>
        <ZoomIn size={16} />
      </button>
      <button type="button" class="cap-btn p-1 md:p-2 2xl:p-3" aria-label="Zoom out" disabled={spanIndex === SPANS.length - 1} onclick={() => spanIndex++}>
        <ZoomOut size={16} />
      </button>
    </span>
  </div>
</div>
