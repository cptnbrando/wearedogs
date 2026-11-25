/**
 * captionsWave.js
 * Draws the Captions app's two waveforms: the strip (a few seconds around the
 * playhead, with a marker on every word) and the overview (the whole file).
 * Plain canvas drawing: the component hands in sizes, peaks and colours.
 */
import { PEAKS_PER_SECOND } from "./captionsMedia.svelte.js";

/** Where the playhead sits in the strip, as a share of its width. */
const PLAYHEAD_SHARE = 0.35;
const MIN_BAR_PX = 1;
const WAVE_HEIGHT_SHARE = 0.78;
const LABEL_FONT_PX = 11;
const LABEL_PAD_PX = 4;
const LABEL_TOP_PX = 2;
const MARK_WIDTH_PX = 1;
const SELECTED_MARK_WIDTH_PX = 3;
const HANDLE_RADIUS_PX = 6;
const PLAYHEAD_WIDTH_PX = 2;
const FLAT_LINE_PX = 1;

/**
 * @typedef {{ wave: string, played: string, mark: string, accent: string, text: string, font: string }} WaveColors
 * @typedef {{ t: number, label: string, selected: boolean }} WaveMark
 */

/**
 * The time at the strip's left edge: the playhead stays PLAYHEAD_SHARE across, except near the ends.
 * @param {number} now
 * @param {number} span - seconds the strip shows
 * @param {number} duration
 * @returns {number}
 */
export function stripStart(now, span, duration) {
  return Math.max(0, Math.min(now - span * PLAYHEAD_SHARE, Math.max(0, duration - span)));
}

/** The loudest peak between two moments. */
function peakBetween(peaks, from, to) {
  const start = Math.max(0, Math.floor(from * PEAKS_PER_SECOND));
  const end = Math.min(peaks.length, Math.max(start + 1, Math.ceil(to * PEAKS_PER_SECOND)));
  let max = 0;
  for (let i = start; i < end; i++) if (peaks[i] > max) max = peaks[i];
  return max;
}

/** Bars for the stretch of time [start, start + span], one per pixel column. */
function drawBars(ctx, width, height, peaks, start, span, now, colors) {
  const middle = height / 2;
  if (!peaks) {
    ctx.fillStyle = colors.wave;
    ctx.fillRect(0, middle, width, FLAT_LINE_PX);
    return;
  }
  const perPixel = span / width;
  for (let x = 0; x < width; x++) {
    const from = start + x * perPixel;
    const bar = Math.max(MIN_BAR_PX, peakBetween(peaks, from, from + perPixel) * height * WAVE_HEIGHT_SHARE);
    ctx.fillStyle = from < now ? colors.played : colors.wave;
    ctx.fillRect(x, middle - bar / 2, 1, bar);
  }
}

/**
 * The strip: a few seconds of waveform, the words in it, and the playhead.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - in CSS pixels (the context is already scaled)
 * @param {number} height
 * @param {{ peaks: Float32Array | null, start: number, span: number, now: number, marks: WaveMark[], colors: WaveColors }} view
 */
export function drawStrip(ctx, width, height, view) {
  ctx.clearRect(0, 0, width, height);
  drawBars(ctx, width, height, view.peaks, view.start, view.span, view.now, view.colors);
  ctx.font = `${LABEL_FONT_PX}px ${view.colors.font}`;
  ctx.textBaseline = "top";
  let labelEnd = -Infinity;
  for (const mark of view.marks) {
    const x = ((mark.t - view.start) / view.span) * width;
    if (x < -1 || x > width + 1) continue;
    ctx.fillStyle = mark.selected ? view.colors.accent : view.colors.mark;
    const markWidth = mark.selected ? SELECTED_MARK_WIDTH_PX : MARK_WIDTH_PX;
    ctx.fillRect(x - markWidth / 2, 0, markWidth, height);
    if (mark.selected) {
      ctx.beginPath();
      ctx.arc(x, height - HANDLE_RADIUS_PX, HANDLE_RADIUS_PX, 0, Math.PI * 2);
      ctx.fill();
    }
    // A label is only drawn where it does not run into the one before it
    if (x + LABEL_PAD_PX < labelEnd && !mark.selected) continue;
    ctx.fillStyle = mark.selected ? view.colors.accent : view.colors.text;
    ctx.fillText(mark.label, x + LABEL_PAD_PX, LABEL_TOP_PX);
    labelEnd = x + LABEL_PAD_PX * 2 + ctx.measureText(mark.label).width;
  }
  ctx.fillStyle = view.colors.accent;
  ctx.fillRect(((view.now - view.start) / view.span) * width - PLAYHEAD_WIDTH_PX / 2, 0, PLAYHEAD_WIDTH_PX, height);
}

/**
 * The overview: the whole file, the part played so far, and the stretch the strip shows.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {{ peaks: Float32Array | null, duration: number, now: number, start: number, span: number, colors: WaveColors }} view
 */
export function drawOverview(ctx, width, height, view) {
  ctx.clearRect(0, 0, width, height);
  if (!view.duration) return;
  drawBars(ctx, width, height, view.peaks, 0, view.duration, view.now, view.colors);
  ctx.fillStyle = view.colors.mark;
  ctx.fillRect((view.start / view.duration) * width, 0, Math.max(PLAYHEAD_WIDTH_PX, (view.span / view.duration) * width), height);
  ctx.fillStyle = view.colors.accent;
  ctx.fillRect((view.now / view.duration) * width - PLAYHEAD_WIDTH_PX / 2, 0, PLAYHEAD_WIDTH_PX, height);
}

/**
 * The words whose markers fall inside a stretch of time.
 * @param {import("./captionsEdit.js").Line[]} lines
 * @param {import("./captionsEdit.js").Spot | null} sel
 * @param {number} from
 * @param {number} to
 * @returns {WaveMark[]}
 */
export function marksBetween(lines, sel, from, to) {
  const marks = [];
  lines.forEach((line, li) => {
    line.words.forEach((word, wi) => {
      if (word.t === null || word.t < from || word.t > to) return;
      marks.push({ t: word.t, label: word.x, selected: !!sel && sel.li === li && sel.wi === wi });
    });
  });
  return marks;
}
