/**
 * adminLyrics.js
 * Where the lyrics the owner can publish for a song come from (AdminApp.svelte):
 * the captions made for that song on this device, and the owner's cloud
 * caption projects (captionsCloud.js), with the song's own cloud copy first.
 */
import { loadProject, projectKey, KIND_TRACK } from "../captions/captionsStore.js";
import { loadCloudProject, cloudId } from "../captions/captionsCloud.js";
import { linesFromStored, toLyrics } from "../captions/captionsEdit.js";

const SOURCE_DEVICE = "device";
const SOURCE_CLOUD = "cloud";
const NOTHING_TIMED = "Nothing in those captions is timed yet.";

/**
 * @typedef {{ id: string, label: string, kind: string, cloudId?: string }} LyricSource
 * @typedef {{ id: string, name: string, updatedAt: number }} ShelfEntry - a cloud project, as listCloudProjects gives it
 */

/**
 * Every set of captions that could become this song's lyrics.
 * @param {string} trackId
 * @param {ShelfEntry[]} shelf - the owner's cloud projects
 * @returns {LyricSource[]}
 */
export function sourcesFor(trackId, shelf) {
  const key = projectKey(KIND_TRACK, trackId);
  const ownCloudId = cloudId(key);
  const sources = [];
  const kept = loadProject(key);
  if (kept && kept.lines.length) sources.push({ id: SOURCE_DEVICE, label: "Captions for this song on this device", kind: SOURCE_DEVICE });
  const own = shelf.find((entry) => entry.id === ownCloudId);
  if (own) sources.push({ id: `${SOURCE_CLOUD}:${own.id}`, label: `Cloud: ${own.name} (this song)`, kind: SOURCE_CLOUD, cloudId: own.id });
  for (const entry of shelf) {
    if (entry.id !== ownCloudId) sources.push({ id: `${SOURCE_CLOUD}:${entry.id}`, label: `Cloud: ${entry.name}`, kind: SOURCE_CLOUD, cloudId: entry.id });
  }
  return sources;
}

/**
 * A source's captions as lyrics, ready to publish.
 * @param {LyricSource} source
 * @param {string} trackId
 * @param {string} token - the owner's session token, for a cloud project
 * @returns {Promise<{ lyrics: import("../../../lib/lyricsFormat.js").Lyrics | null, error: string }>}
 */
export async function lyricsFrom(source, trackId, token) {
  let stored = null;
  if (source.kind === SOURCE_DEVICE) {
    const kept = loadProject(projectKey(KIND_TRACK, trackId));
    stored = kept ? kept.lines : null;
  } else {
    const answer = await loadCloudProject(source.cloudId, token);
    if (!answer.ok) return { lyrics: null, error: answer.error };
    stored = answer.lines;
  }
  const lyrics = stored ? toLyrics(linesFromStored(stored)) : null;
  return { lyrics, error: lyrics ? "" : NOTHING_TIMED };
}
