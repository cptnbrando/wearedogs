/**
 * lyricVideoLyrics.js
 * Where the Lyric Video app's lyrics come from, and the round trip to the
 * Captions app to edit them.
 *
 * Captions keeps one project per source on the device (captionsStore.js): a
 * file by its name, a song by its track id. The video and Captions share that
 * project: "Edit in Captions" seeds it with the video's lyrics (unless
 * Captions has newer work of its own), and the video takes the project's
 * words back whenever Captions saved them after the video's own copy.
 */

import { loadProject, saveProject, projectKey, KIND_FILE, KIND_TRACK } from "../captions/captionsStore.js";
import { linesFromStored, linesFromLyrics, linesToStored, toLyrics } from "../captions/captionsEdit.js";
import { cleanLyrics, parseLyricsFile } from "../../../lib/lyricsFormat.js";
import { lyrics as lyricsStore } from "../../../lib/lyrics.svelte.js";
import { callApi } from "../../../lib/dogsApi.js";

/** What the lyrics on screen came from, for the label under them. */
export const FROM_FILE = "file";
export const FROM_CAPTIONS = "captions";
export const FROM_PUBLISHED = "published";
const MAX_CAPTION_FILE_BYTES = 2 * 1024 * 1024;

/**
 * @typedef {{ kind: string, name: string, trackId: string }} VideoSource - KIND_FILE or KIND_TRACK, as captionsStore has them
 * @typedef {{ lyrics: import("../../../lib/lyricsFormat.js").Lyrics, from: string, at: number }} FoundLyrics
 */

/** @param {VideoSource} source @returns {string} the Captions project key the source shares */
export function sourceKey(source) {
  return projectKey(source.kind, source.kind === KIND_TRACK ? source.trackId : source.name);
}

/**
 * Captions' work for this source, when it is newer than `since` and has timed words.
 * @param {VideoSource} source
 * @param {number} since - when the video's own copy was last changed
 * @returns {FoundLyrics | null}
 */
export function newerCaptions(source, since) {
  const project = loadProject(sourceKey(source));
  if (!project || !(project.at > since)) return null;
  const lyrics = toLyrics(linesFromStored(project.lines));
  return lyrics ? { lyrics, from: FROM_CAPTIONS, at: project.at } : null;
}

/**
 * A player song's lyrics: this device's copy or the published ones. The player's own
 * lyrics store is only read from, never pointed at the song, so what is playing keeps its line.
 * @param {string} trackId
 * @returns {Promise<FoundLyrics | null>}
 */
export async function songLyrics(trackId) {
  const kept = lyricsStore.stored(trackId);
  if (kept) return { lyrics: kept, from: FROM_PUBLISHED, at: 0 };
  await lyricsStore.refreshList();
  const updatedAt = lyricsStore.published[trackId];
  if (!updatedAt) return null;
  const answer = await callApi("GET", `/lyrics/${encodeURIComponent(trackId)}?v=${updatedAt}`);
  const lyrics = answer.ok && answer.data ? cleanLyrics(answer.data.lyrics) : null;
  return lyrics ? { lyrics, from: FROM_PUBLISHED, at: 0 } : null;
}

/**
 * Reads a caption or lyrics file (.srt, .vtt, .lrc, .json).
 * @param {File} file
 * @returns {Promise<import("../../../lib/lyricsFormat.js").Lyrics | null>} null when nothing timed is in it
 */
export async function readCaptionFile(file) {
  if (!file || file.size > MAX_CAPTION_FILE_BYTES) return null;
  try {
    return parseLyricsFile(file.name, await file.text());
  } catch (e) {
    return null;
  }
}

/**
 * Before Captions opens this source: hands it the video's lyrics, unless
 * Captions already has work for it that is at least as new.
 * @param {VideoSource} source
 * @param {import("../../../lib/lyricsFormat.js").Lyrics | null} lyrics
 * @param {number} lyricsAt - when the video's lyrics last changed
 * @returns {boolean} false when the browser would not store them
 */
export function seedCaptions(source, lyrics, lyricsAt) {
  if (!lyrics) return true;
  const key = sourceKey(source);
  const project = loadProject(key);
  if (project && project.lines.length && project.at >= lyricsAt) return true;
  return saveProject({
    key,
    name: source.name,
    kind: source.kind === KIND_TRACK ? KIND_TRACK : KIND_FILE,
    trackId: source.trackId || "",
    lines: linesToStored(linesFromLyrics(lyrics)),
    draft: null,
  });
}
