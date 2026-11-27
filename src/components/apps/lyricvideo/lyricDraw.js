/**
 * lyricDraw.js
 * Draws the lyric line onto the video's canvas, the way the Lyric Video app
 * was told to show it: where on the frame, which font, how big, what colour,
 * and whether the words arrive one by one as they are sung or the whole line
 * shows at once. The canvas is what is recorded, so the words are in the video.
 */

import { lineOnScreen } from "../../../lib/lyricsFormat.js";

// The type's size is a share of the frame's short side, then the chosen scale
const FONT_SHORT_SIDE_SHARE = 0.075;
/** The row never takes more of the frame's width than this: longer lines shrink. */
const MAX_ROW_SHARE = 0.9;
const WORD_GAP_EM = 0.3;
const FONT_WEIGHT = 800;
/** How long a word takes to settle after it lands, in seconds. */
const FLASH_S = 0.32;
const FLASH_SCALE = 0.18;
const FLASH_RISE_EM = 0.18;
const SHADOW = "rgba(0, 0, 0, 0.9)";
const SHADOW_BLUR_EM = 0.45;
const OUTLINE_EM = 0.08;
const INHERIT = "inherit";
/** Arrival modes: each word as it is sung, or the whole line at once. */
export const MODE_WORDS = "words";
export const MODE_LINE = "line";

/**
 * @typedef {{ y: number, fontStack: string, scale: number, color: string, mode: string, caps: boolean, shadow: boolean }} LyricLook
 *   y: where the row's middle sits, 0 (top) to 1 (bottom); fontStack: a CSS font-family ("inherit": the page's)
 */

/**
 * Draws one line.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {[number, string][]} words
 * @param {number} seconds - where the song is; words not sung yet are left out (MODE_WORDS)
 * @param {LyricLook} look
 * @param {boolean} whole - every word, settled (a still preview)
 */
function drawWords(ctx, width, height, words, seconds, look, whole) {
  const family = look.fontStack === INHERIT ? getComputedStyle(document.body).fontFamily : look.fontStack;
  const texts = words.map((word) => (look.caps ? word[1].toUpperCase() : word[1]));
  let size = Math.min(width, height) * FONT_SHORT_SIDE_SHARE * look.scale;
  const measure = () => {
    ctx.font = `${FONT_WEIGHT} ${size}px ${family}`;
    const widths = texts.map((text) => ctx.measureText(text).width);
    return { widths, total: widths.reduce((sum, w) => sum + w, 0) + size * WORD_GAP_EM * (texts.length - 1) };
  };
  let row = measure();
  if (row.total > width * MAX_ROW_SHARE) {
    size *= (width * MAX_ROW_SHARE) / row.total;
    row = measure();
  }

  ctx.save();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  ctx.fillStyle = look.color;
  ctx.strokeStyle = SHADOW;
  ctx.lineWidth = size * OUTLINE_EM;
  if (look.shadow) {
    ctx.shadowColor = SHADOW;
    ctx.shadowBlur = size * SHADOW_BLUR_EM;
  }
  const y = height * look.y;
  let x = (width - row.total) / 2;
  texts.forEach((text, i) => {
    const middle = x + row.widths[i] / 2;
    x += row.widths[i] + size * WORD_GAP_EM;
    const lineAge = seconds - words[0][0];
    const age = whole ? FLASH_S : look.mode === MODE_LINE ? lineAge : seconds - words[i][0];
    if (age < 0) return;
    // A word lands a little big and a little low, then settles
    const settle = Math.min(1, age / FLASH_S);
    const grow = 1 + FLASH_SCALE * (1 - settle);
    ctx.save();
    ctx.globalAlpha = Math.min(1, settle * 2 + 0.2);
    ctx.translate(middle, y + size * FLASH_RISE_EM * (1 - settle));
    ctx.scale(grow, grow);
    if (look.shadow) ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

/**
 * Draws the line that is on screen at `seconds`. With `preview` and no line
 * on screen, the next line is drawn whole, so the look can be judged while
 * the song is stopped.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - the frame, in canvas pixels
 * @param {number} height
 * @param {import("../../../lib/lyricsFormat.js").LyricLine[]} lines - already cut into one-row lines
 * @param {number} seconds
 * @param {LyricLook} look
 * @param {boolean} preview
 */
export function drawLyrics(ctx, width, height, lines, seconds, look, preview) {
  if (!lines || !lines.length) return;
  const index = lineOnScreen(lines, seconds);
  if (index >= 0) {
    drawWords(ctx, width, height, lines[index].w, seconds, look, false);
    return;
  }
  if (!preview) return;
  const next = lines.find((line) => line.w[0][0] >= seconds) || lines[lines.length - 1];
  drawWords(ctx, width, height, next.w, seconds, look, true);
}
