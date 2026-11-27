/**
 * captionsSongs.js
 * The music player's songs that lyrics can be timed to, and a hand-off so
 * another app (the owner's Admin app, Lyric Video) can open a song or a file
 * in Captions. Used by CaptionsStart, CaptionsApp, apps/admin/AdminApp and
 * apps/lyricvideo.
 */
import { playerLibrary } from "../../../data/music/tracks.js";
import { libraryWithCatalog } from "../../../lib/musicCatalog.svelte.js";
import { musicLock } from "../../../lib/musicLock.svelte.js";

/**
 * What Captions was asked to open next, until it opens: a song by its id, or a file (the Lyric Video
 * app hands over the sound it is making a video of), and the app to offer a way back to.
 * @type {{ trackId: string, returnTo: string, file: { blob: Blob, name: string } | null }}
 */
let asked = { trackId: "", returnTo: "", file: null };

/**
 * The player's songs with sound to time lyrics to. Reactive when read inside $derived.
 * @returns {object[]} tracks as the player has them
 */
export function lyricSongs() {
  return libraryWithCatalog(playerLibrary(musicLock.unlocked), musicLock.unlocked).filter(
    (track) => !track.hidden && (track.src || track.instrumental),
  );
}

/**
 * @param {string} trackId - the song Captions should open when it starts ("" when handing a file)
 * @param {string} [returnTo] - the app that asked: Captions shows a button back to it
 * @param {{ blob: Blob, name: string } | null} [file] - a file to open instead of a song
 */
export function askCaptionsFor(trackId, returnTo = "", file = null) {
  asked = { trackId: String(trackId || ""), returnTo: String(returnTo || ""), file: file && file.blob ? file : null };
}

/** @returns {{ trackId: string, returnTo: string, file: { blob: Blob, name: string } | null }} the ask, once (empty after that) */
export function takeCaptionsAsk() {
  const taken = asked;
  asked = { trackId: "", returnTo: "", file: null };
  return taken;
}
