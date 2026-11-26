/**
 * captionsSongs.js
 * The music player's songs that lyrics can be timed to, and a hand-off so
 * another app (the owner's Admin app) can open one of them in Captions.
 * Used by CaptionsStart, CaptionsApp and apps/admin/AdminApp.
 */
import { playerLibrary } from "../../../data/music/tracks.js";
import { libraryWithCatalog } from "../../../lib/musicCatalog.svelte.js";
import { musicLock } from "../../../lib/musicLock.svelte.js";

/** A song Captions was asked to open next, until it opens. */
let askedTrackId = "";

/**
 * The player's songs with sound to time lyrics to. Reactive when read inside $derived.
 * @returns {object[]} tracks as the player has them
 */
export function lyricSongs() {
  return libraryWithCatalog(playerLibrary(musicLock.unlocked), musicLock.unlocked).filter(
    (track) => !track.hidden && (track.src || track.instrumental),
  );
}

/** @param {string} trackId - the song Captions should open when it starts */
export function askCaptionsFor(trackId) {
  askedTrackId = String(trackId || "");
}

/** @returns {string} the song Captions was asked to open, once ("" after that) */
export function takeCaptionsAsk() {
  const trackId = askedTrackId;
  askedTrackId = "";
  return trackId;
}
