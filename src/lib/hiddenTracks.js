/**
 * Hidden tracks: another app's soundtrack (a blog post's jazz) that lives in
 * the player's library without ever being listed. The app plays it on its own
 * element while it is on screen; when the reader walks away with it still
 * playing, the app hands it to the main player, which takes it from the same
 * second and from then on shows, controls and visualizes it like any track.
 * See `hidden` in src/data/music/tracks.js.
 */
import { audioCore } from "./AudioCore.svelte.js";
import { musicLock } from "./musicLock.svelte.js";
import { playerLibrary } from "../data/music/tracks.js";

/**
 * The hidden track with this file in the player's library, or -1. Loads the
 * library first if the music panel has never been opened.
 * @param {string} src
 * @returns {number}
 */
export function hiddenTrackIndex(src) {
  if (!audioCore.library.length) audioCore.init(playerLibrary(musicLock.unlocked));
  return audioCore.library.findIndex((t) => t.hidden && t.src === src);
}

/**
 * True when the main player holds this hidden track (playing or paused).
 * @param {string} src
 */
export function isHiddenTrackLoaded(src) {
  const track = audioCore.library[audioCore.currentTrackIndex];
  return !!track && track.hidden === true && track.src === src;
}

/**
 * Hands a hidden track to the main player mid-song.
 * @param {string} src
 * @param {{ at: number, volume: number }} from - position (s) and volume (0–1) it was playing at
 * @returns {boolean} false when the library has no hidden track for this file
 */
export function adoptHiddenTrack(src, { at, volume }) {
  const idx = hiddenTrackIndex(src);
  if (idx === -1) return false;
  // The music panel must not roll a random song over it when it first opens
  audioCore.hasPickedRandomTrack = true;
  // Same loudness the reader had it at
  audioCore.setVolume(volume);
  audioCore.loadTrack(idx, true, { startAt: at });
  return true;
}
