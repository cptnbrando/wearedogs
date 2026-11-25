/**
 * playCounts.svelte.js
 * Counts plays of DOGS songs: one number per song, kept by the API Worker
 * (workers/api/src/routes/plays.js) and shown only to the owner, in Settings.
 *
 * A play is sent once a DOGS song has really sounded for PLAY_SECONDS in this
 * tab. What is sent is the song's id and nothing else: nothing about the
 * listener or the device. A tab that only follows or remote-controls another
 * tab's sound counts nothing, so one listen is one play.
 *
 * Importing this module starts the watcher (App.svelte does, once the player's
 * code has loaded). It reads the player's state and adds nothing to it.
 */
import { untrack } from "svelte";
import { audioCore } from "./AudioCore.svelte.js";
import { callApi } from "./dogsApi.js";
import { fullLibrary } from "../data/music/tracks.js";
import { musicCatalog } from "./musicCatalog.svelte.js";

/** The artist whose songs are counted. */
const COUNTED_ARTIST = "DOGS";
/** How long a song must sound before it is a play. */
const PLAY_SECONDS = 30;
/** The player's clock moves in small ticks; a bigger jump is a seek, not listening. */
const MAX_TICK_S = 2;
/** The clock falling back to within this of the start is the song starting again. */
const RESTART_WINDOW_S = 1;
/** Track ids the Worker takes. */
const TRACK_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

let trackId = null;
let lastTime = 0;
let heard = 0;
let counted = false;

function startOver(id, time) {
  trackId = id;
  lastTime = time;
  heard = 0;
  counted = false;
}

/**
 * One tick of the player's clock.
 * @param {boolean} playing
 * @param {number} time - seconds into the song
 */
function step(playing, time) {
  const track = audioCore.library[audioCore.currentTrackIndex];
  const id = track ? track.id : null;
  if (id !== trackId) return startOver(id, time);
  const moved = time - lastTime;
  // Back at the start after being further in: the song was restarted, or repeated
  if (moved < 0 && time <= RESTART_WINDOW_S) return startOver(id, time);
  lastTime = time;
  if (!playing || counted || !track || track.artist !== COUNTED_ARTIST) return;
  if (moved <= 0 || moved > MAX_TICK_S) return;
  // Only the tab that makes the sound counts, and only while its element is really running
  if (audioCore.masterTabId !== audioCore.tabId) return;
  const element = audioCore.primaryAudio();
  if (!element || element.paused) return;
  heard += moved;
  if (heard < PLAY_SECONDS) return;
  counted = true;
  if (TRACK_ID_PATTERN.test(id)) callApi("POST", "/plays", { body: { id } });
}

if (typeof window !== "undefined") {
  $effect.root(() => {
    $effect(() => {
      const playing = audioCore.isPlaying;
      const time = audioCore.currentTime;
      audioCore.currentTrackIndex;
      untrack(() => step(playing, time));
    });
  });
}

/**
 * @typedef {{ id: string, title: string, count: number, lastAt: number }} PlayRow
 */

/**
 * The play counts, most played first, with each song's title. The owner only.
 * @param {string} token - the owner's session token (lib/admin.svelte.js)
 * @returns {Promise<{ ok: boolean, error: string, status: number, rows: PlayRow[] }>}
 */
export async function loadPlayCounts(token) {
  const answer = await callApi("GET", "/plays", { token });
  if (!answer.ok || !answer.data || !Array.isArray(answer.data.plays)) {
    return { ok: false, error: answer.error, status: answer.status, rows: [] };
  }
  const titles = {};
  for (const track of fullLibrary.concat(musicCatalog.tracks)) titles[track.id] = track.title;
  const rows = answer.data.plays.map((row) => ({
    id: String(row.id),
    title: titles[row.id] || String(row.id),
    count: Number(row.count) || 0,
    lastAt: Number(row.lastAt) || 0,
  }));
  return { ok: true, error: "", status: answer.status, rows };
}
