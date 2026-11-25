/**
 * lyricsFormat.js
 * Timed lyrics and captions: one shape, and the file formats it is read from
 * and written to. Used by the music player's lyric line (lib/lyrics.svelte.js)
 * and by the Captions app.
 *
 * The shape:
 *   { v: 1, lines: [{ w: [[seconds, "word"], ...], e: seconds }] }
 * A line is what shows at once. Each word carries the moment it is said, and
 * `e` is the moment the line is over.
 */

export const LYRICS_VERSION = 1;
/** A line longer than this is cut in two, so the player never needs a second row. */
export const MAX_LINE_CHARS = 30;
const MAX_LINES = 1500;
const MAX_WORDS_PER_LINE = 80;
const MAX_WORD_LENGTH = 80;
const MAX_SECONDS = 6 * 60 * 60;
/** A silence this long between two words starts a new line. */
const LINE_GAP_S = 0.7;
/** A line with no end of its own lasts this long past its last word, at most. */
const LAST_WORD_HOLD_S = 1.2;
/** Without word timings, a line is assumed to be spoken within this long. */
const UNTIMED_LINE_MAX_S = 6;
const SENTENCE_END = /[.!?…]["')\]]?$/;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const LRC_LINE = /^\s*\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]\s*(.*)$/;
const LRC_WORD = /<(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)>\s*([^<]*)/g;
const CUE_TIMES = /(\d{1,2}:)?(\d{1,2}):(\d{1,2})[.,](\d{1,3})\s*-->\s*(\d{1,2}:)?(\d{1,2}):(\d{1,2})[.,](\d{1,3})/;
const TAGS = /<[^>]*>/g;

/** A finished line stays on screen this long, unless the next one starts first. */
const LINE_LINGER_S = 0.9;

/** @typedef {{ w: [number, string][], e: number }} LyricLine */
/** @typedef {{ v: number, lines: LyricLine[] }} Lyrics */

const round = (seconds) => Math.round(seconds * 100) / 100;
const isTime = (value) => typeof value === "number" && isFinite(value) && value >= 0 && value <= MAX_SECONDS;
const pad = (value, length = 2) => String(value).padStart(length, "0");

/** @param {LyricLine} line @returns {string} the line as plain text */
export function lineText(line) {
  return line.w.map((word) => word[1]).join(" ");
}

/**
 * Lyrics rebuilt from anything: only the parts the player uses are kept, in time order.
 * @param {any} raw
 * @returns {Lyrics | null} null when it is not lyrics
 */
export function cleanLyrics(raw) {
  if (!raw || raw.v !== LYRICS_VERSION || !Array.isArray(raw.lines)) return null;
  const lines = [];
  for (const line of raw.lines.slice(0, MAX_LINES)) {
    if (!line || !Array.isArray(line.w)) continue;
    const words = [];
    for (const word of line.w.slice(0, MAX_WORDS_PER_LINE)) {
      if (!Array.isArray(word) || !isTime(word[0]) || typeof word[1] !== "string") continue;
      const text = word[1].replace(/\s+/g, " ").trim().slice(0, MAX_WORD_LENGTH);
      if (text) words.push([round(word[0]), text]);
    }
    if (!words.length) continue;
    words.sort((a, b) => a[0] - b[0]);
    const last = words[words.length - 1][0];
    lines.push({ w: words, e: round(Math.max(isTime(line.e) ? line.e : 0, last)) });
  }
  if (!lines.length) return null;
  lines.sort((a, b) => a.w[0][0] - b.w[0][0]);
  return { v: LYRICS_VERSION, lines };
}

/**
 * The same lyrics with every line short enough for one row.
 * @param {Lyrics} lyrics
 * @param {number} [maxChars]
 * @returns {Lyrics}
 */
export function splitLongLines(lyrics, maxChars = MAX_LINE_CHARS) {
  const lines = [];
  for (const line of lyrics.lines) {
    // Cut into pieces of about the same length, so no piece is one stray word
    const total = lineText(line).length;
    const target = total / Math.ceil(total / maxChars);
    let piece = [];
    let length = 0;
    for (const word of line.w) {
      const added = (piece.length ? 1 : 0) + word[1].length;
      if (piece.length && (length + added > maxChars || length + added / 2 > target)) {
        // The cut piece is over when the next one starts
        lines.push({ w: piece, e: word[0] });
        piece = [];
        length = 0;
      }
      length += (piece.length ? 1 : 0) + word[1].length;
      piece.push(word);
    }
    lines.push({ w: piece, e: line.e });
  }
  return { v: LYRICS_VERSION, lines };
}

/**
 * Which line is on screen at a moment: the last one that has started. -1 before the first.
 * @param {LyricLine[]} lines
 * @param {number} seconds
 * @returns {number}
 */
export function lineIndexAt(lines, seconds) {
  let low = 0;
  let high = lines.length - 1;
  let found = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (lines[middle].w[0][0] <= seconds) {
      found = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return found;
}

/**
 * Which line shows at a moment: the last one that has started, until it has
 * been over for a little while. Between verses the row is empty.
 * @param {LyricLine[]} lines
 * @param {number} seconds
 * @returns {number} the line's index, or -1 for none
 */
export function lineOnScreen(lines, seconds) {
  const index = lineIndexAt(lines, seconds);
  return index >= 0 && seconds > lines[index].e + LINE_LINGER_S ? -1 : index;
}

/**
 * Words with their timings (speech to text gives these) gathered into lines:
 * a new line at a pause, after a sentence, and before a line gets too long.
 * @param {{ w: string, s: number, e: number }[]} words - text, start and end in seconds
 * @param {number} [maxChars]
 * @returns {Lyrics | null}
 */
export function linesFromWords(words, maxChars = MAX_LINE_CHARS) {
  const lines = [];
  let piece = [];
  let length = 0;
  let pieceEnd = 0;
  const close = () => {
    if (piece.length) lines.push({ w: piece, e: pieceEnd });
    piece = [];
    length = 0;
  };
  for (const word of words) {
    const text = String(word.w || "").trim();
    if (!text || !isTime(word.s)) continue;
    const paused = piece.length && word.s - pieceEnd > LINE_GAP_S;
    const tooLong = piece.length && length + 1 + text.length > maxChars;
    if (paused || tooLong) close();
    length += (piece.length ? 1 : 0) + text.length;
    piece.push([word.s, text]);
    pieceEnd = isTime(word.e) && word.e >= word.s ? word.e : word.s;
    if (SENTENCE_END.test(text)) close();
  }
  close();
  return cleanLyrics({ v: LYRICS_VERSION, lines });
}

/**
 * A line of text given only its start and end: its words are spread evenly across it.
 * @param {string} text
 * @param {number} start
 * @param {number} end
 * @returns {LyricLine | null}
 */
export function lineFromText(text, start, end) {
  const words = text.replace(TAGS, "").split(/\s+/).filter(Boolean);
  if (!words.length || !isTime(start)) return null;
  const span = Math.max(0, Math.min(end - start, UNTIMED_LINE_MAX_S));
  const step = span / words.length;
  return { w: words.map((word, i) => [start + step * i, word]), e: Math.max(end, start) };
}

/** "1:02.50" or "01:02:03.500" as seconds; a clock with no hours is minutes:seconds. */
function clockSeconds(hours, minutes, seconds, fraction) {
  const whole = Number(hours || 0) * SECONDS_PER_HOUR + Number(minutes) * SECONDS_PER_MINUTE + Number(seconds);
  return whole + (fraction ? Number(`0.${fraction}`) : 0);
}

const lrcSeconds = (minutes, rest) => Number(minutes) * SECONDS_PER_MINUTE + Number(rest.replace(":", "."));

/**
 * Reads .lrc lyrics, with or without a time on every word.
 * @param {string} text
 * @returns {Lyrics | null}
 */
export function fromLrc(text) {
  const rows = [];
  for (const row of text.split(/\r?\n/)) {
    const match = LRC_LINE.exec(row);
    if (match) rows.push({ start: lrcSeconds(match[1], match[2]), body: match[3] });
  }
  rows.sort((a, b) => a.start - b.start);
  const lines = [];
  rows.forEach((row, i) => {
    const next = rows[i + 1] ? rows[i + 1].start : row.start + UNTIMED_LINE_MAX_S;
    const timed = [];
    let word;
    LRC_WORD.lastIndex = 0;
    while ((word = LRC_WORD.exec(row.body))) {
      const at = lrcSeconds(word[1], word[2]);
      // One time can cover a few words: they share it
      for (const part of word[3].split(/\s+/).filter(Boolean)) timed.push([at, part]);
    }
    if (timed.length) {
      lines.push({ w: timed, e: Math.min(next, timed[timed.length - 1][0] + LAST_WORD_HOLD_S) });
      return;
    }
    const line = lineFromText(row.body, row.start, next);
    if (line) lines.push(line);
  });
  return cleanLyrics({ v: LYRICS_VERSION, lines });
}

/**
 * Reads .srt or .vtt captions: one cue becomes one line.
 * @param {string} text
 * @returns {Lyrics | null}
 */
export function fromCues(text) {
  const lines = [];
  for (const block of text.replace(/\r/g, "").split(/\n{2,}/)) {
    const rows = block.split("\n");
    const at = rows.findIndex((row) => CUE_TIMES.test(row));
    if (at === -1) continue;
    const t = CUE_TIMES.exec(rows[at]);
    const start = clockSeconds(t[1] && t[1].slice(0, -1), t[2], t[3], t[4]);
    const end = clockSeconds(t[5] && t[5].slice(0, -1), t[6], t[7], t[8]);
    const line = lineFromText(rows.slice(at + 1).join(" "), start, end);
    if (line) lines.push(line);
  }
  return cleanLyrics({ v: LYRICS_VERSION, lines });
}

/**
 * Reads a lyrics or captions file of any kind this module writes.
 * @param {string} name - the file's name, for its extension
 * @param {string} text
 * @returns {Lyrics | null} null when nothing timed could be read from it
 */
export function parseLyricsFile(name, text) {
  const trimmed = text.trim();
  if (/\.json$/i.test(name) || trimmed.startsWith("{")) {
    try {
      const data = JSON.parse(trimmed);
      return cleanLyrics(data && data.lyrics ? data.lyrics : data);
    } catch {
      return null;
    }
  }
  if (/\.lrc$/i.test(name) || (LRC_LINE.test(trimmed.split(/\r?\n/)[0] || "") && !CUE_TIMES.test(trimmed))) return fromLrc(text);
  return fromCues(text);
}

/** Seconds as an LRC stamp: 01:02.50 */
function lrcStamp(seconds) {
  const whole = Math.floor(seconds / SECONDS_PER_MINUTE);
  return `${pad(whole)}:${(seconds - whole * SECONDS_PER_MINUTE).toFixed(2).padStart(5, "0")}`;
}

/** Seconds as a cue stamp: 00:01:02,500 for .srt, 00:01:02.500 for .vtt */
function cueStamp(seconds, separator) {
  const ms = Math.round(seconds * 1000);
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const whole = Math.floor((ms % 60000) / 1000);
  return `${pad(hours)}:${pad(minutes)}:${pad(whole)}${separator}${pad(ms % 1000, 3)}`;
}

/**
 * .lrc with a time on every word (players that only read line times still work).
 * @param {Lyrics} lyrics
 * @returns {string}
 */
export function toLrc(lyrics) {
  return lyrics.lines
    .map((line) => `[${lrcStamp(line.w[0][0])}]${line.w.map((word) => `<${lrcStamp(word[0])}>${word[1]}`).join(" ")}`)
    .join("\n") + "\n";
}

/**
 * The cues of an .srt or .vtt file. Per word, each cue is the line so far:
 * imported into a video editor, the words arrive one at a time.
 * @param {Lyrics} lyrics
 * @param {boolean} perWord
 * @returns {{ start: number, end: number, text: string }[]}
 */
function cuesOf(lyrics, perWord) {
  const cues = [];
  lyrics.lines.forEach((line, i) => {
    const next = lyrics.lines[i + 1];
    // A line never runs into the next one
    const end = Math.max(line.w[0][0], next ? Math.min(line.e, next.w[0][0]) : line.e);
    if (!perWord) {
      cues.push({ start: line.w[0][0], end, text: lineText(line) });
      return;
    }
    line.w.forEach((word, at) => {
      const until = line.w[at + 1] ? line.w[at + 1][0] : end;
      if (until > word[0]) cues.push({ start: word[0], end: until, text: line.w.slice(0, at + 1).map((w) => w[1]).join(" ") });
    });
  });
  return cues;
}

/**
 * @param {Lyrics} lyrics
 * @param {{ perWord?: boolean }} [options] perWord: words arrive one at a time
 * @returns {string} an .srt file (CapCut, Premiere, DaVinci and YouTube read it)
 */
export function toSrt(lyrics, options = {}) {
  return cuesOf(lyrics, !!options.perWord)
    .map((cue, i) => `${i + 1}\n${cueStamp(cue.start, ",")} --> ${cueStamp(cue.end, ",")}\n${cue.text}\n`)
    .join("\n");
}

/**
 * @param {Lyrics} lyrics
 * @param {{ perWord?: boolean }} [options]
 * @returns {string} a .vtt file
 */
export function toVtt(lyrics, options = {}) {
  const cues = cuesOf(lyrics, !!options.perWord)
    .map((cue) => `${cueStamp(cue.start, ".")} --> ${cueStamp(cue.end, ".")}\n${cue.text}\n`);
  return `WEBVTT\n\n${cues.join("\n")}`;
}

/** @param {Lyrics} lyrics @returns {string} the words alone, a line per line */
export function toPlainText(lyrics) {
  return lyrics.lines.map(lineText).join("\n") + "\n";
}

/**
 * @param {Lyrics} lyrics
 * @param {string} [title]
 * @returns {string} Markdown: the title, then each line with its time
 */
export function toMarkdown(lyrics, title = "") {
  const rows = lyrics.lines.map((line) => `- \`${lrcStamp(line.w[0][0])}\` ${lineText(line)}`);
  return `${title ? `# ${title}\n\n` : ""}${rows.join("\n")}\n`;
}
