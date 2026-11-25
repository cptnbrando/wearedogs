/**
 * captionsEdit.js
 * The Captions app's working copy of a set of captions, and every change that
 * can be made to it. No DOM and no state here: plain functions over arrays.
 *
 * The working copy is the lyrics shape of src/lib/lyricsFormat.js with two
 * things the editor needs: a word may have no time yet (pasted words waiting
 * for tap along), and each line has an id so the list can be keyed.
 *   [{ id, words: [{ t: seconds | null, x: "word" }], e: seconds | null }]
 * toLyrics() turns it back into the shape everything else reads and writes.
 */
import { cleanLyrics, LYRICS_VERSION } from "../../../lib/lyricsFormat.js";

/** A line with no end of its own lasts this long past its last word, at most. */
const LAST_WORD_HOLD_S = 1.2;
const TIME_STEPS_PER_SECOND = 100;
/** A new word put after another one starts this much later. */
const NEW_WORD_GAP_S = 0.2;
export const NEW_WORD_TEXT = "word";

/** @typedef {{ t: number | null, x: string }} Word */
/** @typedef {{ id: number, words: Word[], e: number | null }} Line */
/** @typedef {{ li: number, wi: number }} Spot - a word's place: line index, word index */

let nextLineId = 1;

/** Times are kept to the hundredth of a second, as lyricsFormat.js keeps them. */
export const roundTime = (seconds) => Math.round(seconds * TIME_STEPS_PER_SECOND) / TIME_STEPS_PER_SECOND;

/** @param {Word[]} words @param {number | null} [end] @returns {Line} */
export function makeLine(words, end = null) {
  return { id: nextLineId++, words, e: end };
}

/** @param {import("../../../lib/lyricsFormat.js").Lyrics | null} lyrics @returns {Line[]} */
export function linesFromLyrics(lyrics) {
  if (!lyrics) return [];
  return lyrics.lines.map((line) => makeLine(line.w.map((word) => ({ t: word[0], x: word[1] })), line.e));
}

/**
 * Pasted words as lines with no times yet: each row of the text is a line.
 * @param {string} text
 * @returns {Line[]}
 */
export function linesFromText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((row) => row.trim().split(/\s+/).filter(Boolean))
    .filter((words) => words.length)
    .map((words) => makeLine(words.map((x) => ({ t: null, x }))));
}

/**
 * The working copy as it is stored on the device: times may still be null.
 * @param {Line[]} lines
 * @returns {{ w: [number | null, string][], e: number | null }[]}
 */
export function linesToStored(lines) {
  return lines.map((line) => ({ w: line.words.map((word) => [word.t, word.x]), e: line.e }));
}

/** @param {any} stored - what linesToStored() gave @returns {Line[]} */
export function linesFromStored(stored) {
  if (!Array.isArray(stored)) return [];
  const isTime = (value) => typeof value === "number" && isFinite(value) && value >= 0;
  return stored
    .filter((line) => line && Array.isArray(line.w))
    .map((line) => makeLine(
      line.w
        .filter((word) => Array.isArray(word) && typeof word[1] === "string" && word[1])
        .map((word) => ({ t: isTime(word[0]) ? word[0] : null, x: word[1] })),
      isTime(line.e) ? line.e : null,
    ))
    .filter((line) => line.words.length);
}

/** @param {Line} line @returns {number | null} when the line's first timed word is said */
export function lineStart(line) {
  for (const word of line.words) if (word.t !== null) return word.t;
  return null;
}

/** @param {Line} line @returns {number | null} when the line's last timed word is said */
function lastWordTime(line) {
  let last = null;
  for (const word of line.words) if (word.t !== null && (last === null || word.t > last)) last = word.t;
  return last;
}

/**
 * When a line is over: its own end if it has one, else when the next line
 * starts, and never long after its last word.
 * @param {Line[]} lines
 * @param {number} li
 * @returns {number | null} null when the line has no timed word
 */
export function lineEnd(lines, li) {
  const last = lastWordTime(lines[li]);
  if (last === null) return null;
  if (lines[li].e !== null) return Math.max(lines[li].e, last);
  for (let i = li + 1; i < lines.length; i++) {
    const next = lineStart(lines[i]);
    if (next !== null) return Math.max(last, Math.min(next, last + LAST_WORD_HOLD_S));
  }
  return last + LAST_WORD_HOLD_S;
}

/**
 * The working copy as lyrics: what the player shows and the exports are made
 * from. A line with no timed word is left out; a word still waiting for its
 * time inside a timed line shares the time of the word before it.
 * @param {Line[]} lines
 * @returns {import("../../../lib/lyricsFormat.js").Lyrics | null} null when nothing is timed yet
 */
export function toLyrics(lines) {
  const out = [];
  lines.forEach((line, li) => {
    let last = lineStart(line);
    if (last === null) return;
    const words = [];
    for (const word of line.words) {
      const text = word.x.trim();
      if (word.t !== null) last = word.t;
      if (text) words.push([last, text]);
    }
    if (words.length) out.push({ w: words, e: lineEnd(lines, li) });
  });
  return cleanLyrics({ v: LYRICS_VERSION, lines: out });
}

/** @param {Line[]} lines @returns {{ words: number, untimed: number }} */
export function countWords(lines) {
  let words = 0;
  let untimed = 0;
  for (const line of lines) {
    words += line.words.length;
    for (const word of line.words) if (word.t === null) untimed++;
  }
  return { words, untimed };
}

/** @param {Line[]} lines @param {Spot | null} spot @returns {Word | null} */
export function wordAt(lines, spot) {
  return (spot && lines[spot.li] && lines[spot.li].words[spot.wi]) || null;
}

/** @param {Line[]} lines @param {Spot} spot @returns {Spot | null} the word after, null at the end */
export function spotAfter(lines, spot) {
  if (spot.wi + 1 < lines[spot.li].words.length) return { li: spot.li, wi: spot.wi + 1 };
  return spot.li + 1 < lines.length ? { li: spot.li + 1, wi: 0 } : null;
}

/** @param {Line[]} lines @param {Spot} spot @returns {Spot | null} the word before, null at the start */
export function spotBefore(lines, spot) {
  if (spot.wi > 0) return { li: spot.li, wi: spot.wi - 1 };
  return spot.li > 0 ? { li: spot.li - 1, wi: lines[spot.li - 1].words.length - 1 } : null;
}

/** @param {Line[]} lines @returns {Spot | null} the first word still waiting for its time */
export function firstUntimed(lines) {
  for (let li = 0; li < lines.length; li++) {
    const wi = lines[li].words.findIndex((word) => word.t === null);
    if (wi !== -1) return { li, wi };
  }
  return null;
}

/**
 * The line being said at a moment: the last one that has started. -1 before the first.
 * @param {Line[]} lines
 * @param {number} seconds
 * @returns {number}
 */
export function lineIndexAtTime(lines, seconds) {
  let found = -1;
  for (let li = 0; li < lines.length; li++) {
    const start = lineStart(lines[li]);
    if (start !== null && start <= seconds) found = li;
  }
  return found;
}

/**
 * Moves a word's time, never before the start.
 * @param {Line[]} lines
 * @param {Spot} spot
 * @param {number} seconds - the new time
 */
export function setWordTime(lines, spot, seconds) {
  const word = wordAt(lines, spot);
  if (word) word.t = roundTime(Math.max(0, seconds));
}

/**
 * Moves every timed word, and every line end, by the same amount.
 * @param {Line[]} lines
 * @param {number} delta - seconds, may be negative
 */
export function shiftAll(lines, delta) {
  for (const line of lines) {
    for (const word of line.words) if (word.t !== null) word.t = roundTime(Math.max(0, word.t + delta));
    if (line.e !== null) line.e = roundTime(Math.max(0, line.e + delta));
  }
}

/**
 * Cuts a line in two: the word at `spot` starts the new line.
 * @param {Line[]} lines
 * @param {Spot} spot
 * @returns {boolean} false when there is nothing to cut (the line's first word)
 */
export function splitLine(lines, spot) {
  const line = lines[spot.li];
  if (!line || spot.wi <= 0 || spot.wi >= line.words.length) return false;
  const tail = makeLine(line.words.slice(spot.wi), line.e);
  line.words = line.words.slice(0, spot.wi);
  line.e = null;
  lines.splice(spot.li + 1, 0, tail);
  return true;
}

/**
 * Joins a line with the one after it.
 * @param {Line[]} lines
 * @param {number} li
 * @returns {boolean} false on the last line
 */
export function joinLines(lines, li) {
  if (li < 0 || li + 1 >= lines.length) return false;
  const next = lines[li + 1];
  lines[li].words = lines[li].words.concat(next.words);
  lines[li].e = next.e;
  lines.splice(li + 1, 1);
  return true;
}

/**
 * Adds a word after `spot`, a little later than it.
 * @param {Line[]} lines
 * @param {Spot} spot
 * @returns {Spot} where the new word is
 */
export function addWordAfter(lines, spot) {
  const before = wordAt(lines, spot);
  const t = before && before.t !== null ? roundTime(before.t + NEW_WORD_GAP_S) : null;
  lines[spot.li].words.splice(spot.wi + 1, 0, { t, x: NEW_WORD_TEXT });
  return { li: spot.li, wi: spot.wi + 1 };
}

/**
 * Deletes a word; a line left with no words goes with it.
 * @param {Line[]} lines
 * @param {Spot} spot
 */
export function deleteWord(lines, spot) {
  const line = lines[spot.li];
  if (!line) return;
  line.words.splice(spot.wi, 1);
  if (!line.words.length) lines.splice(spot.li, 1);
}

/**
 * Adds a one-word line after line `li` (or first, when li is -1), timed at `seconds`.
 * @param {Line[]} lines
 * @param {number} li
 * @param {number | null} seconds
 * @returns {Spot} where the new word is
 */
export function addLineAfter(lines, li, seconds) {
  lines.splice(li + 1, 0, makeLine([{ t: seconds === null ? null : roundTime(seconds), x: NEW_WORD_TEXT }]));
  return { li: li + 1, wi: 0 };
}

/**
 * Keeps a spot inside the lines after words or lines were removed.
 * @param {Line[]} lines
 * @param {Spot | null} spot
 * @returns {Spot | null}
 */
export function clampSpot(lines, spot) {
  if (!spot || !lines.length) return null;
  const li = Math.min(spot.li, lines.length - 1);
  return { li, wi: Math.min(li === spot.li ? spot.wi : 0, lines[li].words.length - 1) };
}

const SECONDS_PER_MINUTE = 60;
const NO_TIME = "–:––";

/**
 * A time as a clock for labels: "1:02.50", or "1:02" without the hundredths.
 * @param {number | null} seconds
 * @param {boolean} [hundredths]
 * @returns {string}
 */
export function clock(seconds, hundredths = true) {
  if (seconds === null || !isFinite(seconds)) return NO_TIME;
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const rest = seconds - minutes * SECONDS_PER_MINUTE;
  return `${minutes}:${hundredths ? rest.toFixed(2).padStart(5, "0") : String(Math.floor(rest)).padStart(2, "0")}`;
}
