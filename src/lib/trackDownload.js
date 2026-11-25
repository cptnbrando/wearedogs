/**
 * Which file the music player's download button saves.
 *
 * Other artists' songs are shared as instrumentals only, so their download is
 * always the instrumental when there is one. DOGS songs are ours to give away
 * whole: their download follows the player's VOX / INS switch.
 */

/** The artist whose vocal mixes can be downloaded. */
const VOCAL_DOWNLOAD_ARTIST = "DOGS";
const LABEL_INSTRUMENTAL = "Download instrumental";
const LABEL_VOCALS = "Download vocal mix";
const LABEL_TRACK = "Download track";

/**
 * @param {{ artist?: string, src?: string, instrumental?: string }} track
 * @param {boolean} instrumentalMode - the player's switch is on INS
 * @returns {{ url: string, label: string }} the file to save ("" when the track has none) and the button's tooltip
 */
export function downloadChoice(track, instrumentalMode) {
  if (!track) return { url: "", label: LABEL_TRACK };
  const wantsVocals = track.artist === VOCAL_DOWNLOAD_ARTIST && !instrumentalMode;
  if (wantsVocals && track.src) return { url: track.src, label: LABEL_VOCALS };
  if (track.instrumental) return { url: track.instrumental, label: LABEL_INSTRUMENTAL };
  return { url: track.src || "", label: LABEL_TRACK };
}
