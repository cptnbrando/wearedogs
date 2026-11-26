/**
 * captionsAlign.js
 * What to do with the words a speech-to-text model heard.
 *
 * When the real words are known (pasted lyrics), they are kept exactly as
 * written, line breaks and all, and only the times are taken from what the
 * model heard: the two word lists are matched up in order. A word the model
 * misheard takes the time of what it heard instead; a word it missed is
 * placed evenly between its matched neighbours.
 * The hint sent with each piece of sound is made here too.
 */
import { makeLine } from "./captionsEdit.js";

/** A word the model did not hear, before the first or after the last one it did, is given this long. */
const UNHEARD_STEP_S = 0.3;
/** Matching two lists costs their lengths multiplied: past this it is not tried. */
const MAX_MATCH_CELLS = 16000000;
const HINT_MAX_LENGTH = 200;
/** A piece's hint is drawn from its own share of the lyrics, and this much either side. */
const HINT_MARGIN = 0.15;
const HINT_MIN_WORD_LENGTH = 3;
const NOT_A_LETTER = /[^\p{L}\p{N}]/gu;
const HINT_UNSAFE = /[^\p{L}\p{N} '-]/gu;

/** A word as it is compared: lowercase, letters and digits only. */
const plain = (word) => word.toLowerCase().normalize("NFKD").replace(NOT_A_LETTER, "");

/**
 * Pairs of positions (written word, heard word) that are the same word, in order:
 * the longest such run of pairs there is.
 * @param {string[]} written
 * @param {string[]} heard
 * @returns {[number, number][]}
 */
function matchInOrder(written, heard) {
  const rows = written.length + 1;
  const cols = heard.length + 1;
  if (rows * cols > MAX_MATCH_CELLS) return [];
  const best = new Uint16Array(rows * cols);
  for (let i = written.length - 1; i >= 0; i--) {
    for (let j = heard.length - 1; j >= 0; j--) {
      best[i * cols + j] = written[i] && written[i] === heard[j]
        ? best[(i + 1) * cols + j + 1] + 1
        : Math.max(best[(i + 1) * cols + j], best[i * cols + j + 1]);
    }
  }
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < written.length && j < heard.length) {
    if (written[i] && written[i] === heard[j]) pairs.push([i++, j++]);
    else if (best[(i + 1) * cols + j] >= best[i * cols + j + 1]) i++;
    else j++;
  }
  return pairs;
}

/**
 * The written words, in their own lines, with the times of the heard words.
 * @param {string[][]} writtenLines - each line's words, as the person wrote them
 * @param {{ w: string, s: number, e: number }[]} heard - what the model heard, in order
 * @returns {{ lines: import("./captionsEdit.js").Line[], matched: number, total: number } | null}
 *   null when nothing matched, so the heard words are the better result
 */
export function timeWrittenWords(writtenLines, heard) {
  const flat = [];
  for (const words of writtenLines) for (const x of words) flat.push({ t: null, x });
  const pairs = matchInOrder(flat.map((word) => plain(word.x)), heard.map((word) => plain(word.w)));
  if (!pairs.length) return null;
  for (const [i, j] of pairs) flat[i].t = heard[j].s;

  // A word with no match sits evenly between the matched words around it
  const first = pairs[0][0];
  const last = pairs[pairs.length - 1][0];
  // Before the first match and after the last, a written word takes the time of the heard word in
  // its place, while there is one (a word changed at the very start or end); past that, a short step
  const heardFirst = pairs[0][1];
  const heardLast = pairs[pairs.length - 1][1];
  for (let i = first - 1; i >= 0; i--) {
    const k = heardFirst - (first - i);
    flat[i].t = k >= 0 && heard[k].s < flat[i + 1].t ? heard[k].s : Math.max(0, flat[i + 1].t - UNHEARD_STEP_S);
  }
  for (let i = last + 1; i < flat.length; i++) {
    const k = heardLast + (i - last);
    flat[i].t = k < heard.length && heard[k].s > flat[i - 1].t ? heard[k].s : flat[i - 1].t + UNHEARD_STEP_S;
  }
  let misheard = 0;
  for (let p = 0; p + 1 < pairs.length; p++) {
    const from = pairs[p][0];
    const to = pairs[p + 1][0];
    const heardFrom = pairs[p][1];
    // As many words heard as written between two matches: the model misheard them, and their times stand
    if (to - from > 1 && pairs[p + 1][1] - heardFrom === to - from) {
      for (let i = from + 1; i < to; i++) flat[i].t = heard[heardFrom + i - from].s;
      misheard += to - from - 1;
      continue;
    }
    const step = (flat[to].t - flat[from].t) / (to - from);
    for (let i = from + 1; i < to; i++) flat[i].t = flat[from].t + step * (i - from);
  }
  for (const word of flat) word.t = Math.round(word.t * 100) / 100;

  let at = 0;
  const lines = writtenLines.map((words) => makeLine(flat.slice(at, (at += words.length))));
  return { lines, matched: pairs.length + misheard, total: flat.length };
}

/**
 * The hint for one piece of sound: the words most likely to be in it, drawn
 * from the part of the lyrics that piece covers. The API takes 200 characters.
 * @param {string} lyricsText - the pasted lyrics, or any names and unusual words
 * @param {number} from - where the piece starts, as a share of the whole (0 to 1)
 * @param {number} to - where it ends
 * @returns {string}
 */
export function hintFor(lyricsText, from, to) {
  const words = String(lyricsText || "").replace(HINT_UNSAFE, " ").split(/\s+/).filter(Boolean);
  const start = Math.max(0, Math.floor((from - HINT_MARGIN) * words.length));
  const end = Math.min(words.length, Math.ceil((to + HINT_MARGIN) * words.length));
  const seen = {};
  let hint = "";
  for (const word of words.slice(start, end)) {
    const key = word.toLowerCase();
    if (word.length < HINT_MIN_WORD_LENGTH || seen[key]) continue;
    seen[key] = true;
    if (hint.length + word.length + 2 > HINT_MAX_LENGTH) break;
    hint += (hint ? ", " : "") + word;
  }
  return hint;
}
