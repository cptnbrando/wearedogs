/**
 * lyricCanvas.js
 * Draws the lyric line onto a canvas the way the full-screen player shows it
 * (src/components/music/LyricLine.svelte): one row, each word arriving at its
 * moment with a flash. The stage recorder uses it to put the words into a
 * recorded video, where the page's own text cannot go.
 */

import { lineOnScreen } from "./lyricsFormat.js";

// The type's size follows the same rule as the page's line (.lyric-stage in
// LyricLine.svelte): a share of the frame's width, held back on short frames,
// between a floor and a ceiling in CSS pixels.
const FONT_WIDTH_SHARE = 0.052;
const FONT_HEIGHT_SHARE = 0.12;
const FONT_MIN_CSS_PX = 16;
const FONT_MAX_CSS_PX = 96;
/** The row never takes more of the frame's width than this: longer lines shrink. */
const MAX_ROW_SHARE = 0.92;
const WORD_GAP_EM = 0.3;
const FONT_WEIGHT = 800;
/** How long a word takes to settle after it lands, in seconds. */
const FLASH_S = 0.32;
const FLASH_SCALE = 0.18;
const FLASH_RISE_EM = 0.18;
/** Where the row's middle sits, as a share of the frame's height. */
const PLACE_Y = { top: 0.14, middle: 0.5, bottom: 0.8 };
const INK = "white";
const SHADOW = "rgba(0, 0, 0, 0.9)";
const SHADOW_BLUR_EM = 0.45;
const INHERIT = "inherit";

/**
 * Draws the line that is on screen at `seconds`, if any.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - the frame, in canvas pixels
 * @param {number} height
 * @param {{
 *   lines: import("./lyricsFormat.js").LyricLine[],
 *   seconds: number,
 *   place: "top" | "middle" | "bottom",
 *   fontStack: string,
 *   scale: number,
 *   ratio: number,
 * }} show - fontStack: a CSS font-family ("inherit" means the page's own); scale: the listener's
 *   size choice; ratio: canvas pixels per CSS pixel
 */
export function drawLyricLine(ctx, width, height, show) {
  const index = lineOnScreen(show.lines, show.seconds);
  if (index < 0) return;
  const words = show.lines[index].w;
  const family = show.fontStack === INHERIT ? getComputedStyle(document.body).fontFamily : show.fontStack;
  const fluid = Math.min(width * FONT_WIDTH_SHARE, height * FONT_HEIGHT_SHARE);
  let size = Math.min(Math.max(fluid, FONT_MIN_CSS_PX * show.ratio), FONT_MAX_CSS_PX * show.ratio) * show.scale;
  const measure = () => {
    ctx.font = `${FONT_WEIGHT} ${size}px ${family}`;
    const widths = words.map((word) => ctx.measureText(word[1]).width);
    return { widths, total: widths.reduce((sum, w) => sum + w, 0) + size * WORD_GAP_EM * (words.length - 1) };
  };
  let row = measure();
  if (row.total > width * MAX_ROW_SHARE) {
    size *= (width * MAX_ROW_SHARE) / row.total;
    row = measure();
  }

  ctx.save();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.shadowColor = SHADOW;
  ctx.shadowBlur = size * SHADOW_BLUR_EM;
  const y = height * (PLACE_Y[show.place] || PLACE_Y.bottom);
  let x = (width - row.total) / 2;
  words.forEach((word, i) => {
    const middle = x + row.widths[i] / 2;
    x += row.widths[i] + size * WORD_GAP_EM;
    const age = show.seconds - word[0];
    if (age < 0) return;
    // A word lands a little big and a little low, then settles
    const settle = Math.min(1, age / FLASH_S);
    const grow = 1 + FLASH_SCALE * (1 - settle);
    ctx.save();
    ctx.globalAlpha = Math.min(1, settle * 2 + 0.2);
    ctx.translate(middle, y + size * FLASH_RISE_EM * (1 - settle));
    ctx.scale(grow, grow);
    ctx.fillText(word[1], 0, 0);
    ctx.restore();
  });
  ctx.restore();
}
