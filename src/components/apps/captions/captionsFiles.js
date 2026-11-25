/**
 * captionsFiles.js
 * Reading captions from a file and writing them to one. Every format here is
 * read and written by src/lib/lyricsFormat.js; this only chooses between them
 * and hands the result to the browser as a download.
 */
import { parseLyricsFile, toSrt, toVtt, toLrc, toPlainText, toMarkdown } from "../../../lib/lyricsFormat.js";
import { linesFromLyrics, linesFromText } from "./captionsEdit.js";

const TEXT_TYPE = "text/plain;charset=utf-8";
const JSON_TYPE = "application/json";
/** Files with no times in them: their rows become lines waiting for tap along. */
const PLAIN_TEXT = /\.(txt|md)$/i;
export const IMPORT_ACCEPT = ".srt,.vtt,.lrc,.json,.txt,.md,text/plain,application/json";
const DEFAULT_BASE_NAME = "captions";

/**
 * @typedef {{ id: string, label: string, note: string, extension: string, type: string,
 *   write: (lyrics: import("../../../lib/lyricsFormat.js").Lyrics, title: string) => string }} ExportFormat
 */

/** @type {ExportFormat[]} */
export const EXPORT_FORMATS = [
  { id: "srt", label: "SRT, a line at a time", note: "CapCut, Premiere, DaVinci, YouTube", extension: ".srt", type: TEXT_TYPE, write: (lyrics) => toSrt(lyrics) },
  { id: "srt-words", label: "SRT, a word at a time", note: "Karaoke captions: each word arrives on its beat", extension: ".words.srt", type: TEXT_TYPE, write: (lyrics) => toSrt(lyrics, { perWord: true }) },
  { id: "vtt", label: "VTT", note: "Web video players", extension: ".vtt", type: TEXT_TYPE, write: (lyrics) => toVtt(lyrics) },
  { id: "lrc", label: "LRC", note: "Music players, a time on every word", extension: ".lrc", type: TEXT_TYPE, write: (lyrics) => toLrc(lyrics) },
  { id: "txt", label: "TXT", note: "The words alone", extension: ".txt", type: TEXT_TYPE, write: (lyrics) => toPlainText(lyrics) },
  { id: "md", label: "Markdown", note: "Each line with its time", extension: ".md", type: TEXT_TYPE, write: (lyrics, title) => toMarkdown(lyrics, title) },
  { id: "json", label: "JSON", note: "Everything, to bring back here later", extension: ".json", type: JSON_TYPE, write: (lyrics) => JSON.stringify(lyrics) + "\n" },
];

/** "My Song (final).mp3" -> "My Song (final)" */
export function baseName(name) {
  return String(name || "").replace(/\.[^.]+$/, "").trim() || DEFAULT_BASE_NAME;
}

/**
 * Reads a captions file into the editor's lines. A file with times gives timed
 * lines; plain text gives lines waiting for their times.
 * @param {string} name - the file's name
 * @param {string} text - its contents
 * @returns {import("./captionsEdit.js").Line[]} empty when nothing could be read
 */
export function readCaptionsFile(name, text) {
  if (!PLAIN_TEXT.test(name)) {
    const lines = linesFromLyrics(parseLyricsFile(name, text));
    if (lines.length) return lines;
  }
  return linesFromText(text);
}

/**
 * Saves text as a file through the browser's own download.
 * @param {string} fileName
 * @param {string} text
 * @param {string} [type]
 */
export function downloadText(fileName, text, type = TEXT_TYPE) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * @param {ExportFormat} format
 * @param {import("../../../lib/lyricsFormat.js").Lyrics} lyrics
 * @param {string} title - the project's name
 */
export function exportCaptions(format, lyrics, title) {
  downloadText(baseName(title) + format.extension, format.write(lyrics, baseName(title)), format.type);
}
