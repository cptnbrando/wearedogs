/**
 * Turns a track's URLs into sources the player's <audio> elements can play,
 * and fetches the next song ahead of time.
 *
 * Streamed files play straight off their URL: the browser's media stack keeps
 * loading them while a screen-off page is throttled. Lockup files are gated
 * behind the calculator passcode, so they download whole (with the auth
 * header) into a blob: URL the caller owns and must revoke. That download
 * takes seconds, and a silent gap between songs with the screen off lets the
 * OS drop the media notification for good. So while one song plays, the next
 * lockup song is already downloading, and the switch is instant.
 */
import { musicLock, isLockupUrl } from "./musicLock.svelte.js";

const SIDES = ["track", "inst"];
// Which track field holds each side's file
const FILE_KEYS = { track: "src", inst: "instrumental" };

/**
 * @typedef {{ id: string, src?: string, instrumental?: string }} Track
 * @typedef {"track" | "inst"} Side vocal ("track") or instrumental file
 */

export class TrackSources {
  /**
   * @param {(trackId: string, blob: Blob) => void} onBlob a vocal file arrived whole
   * @param {(trackId: string, url: string) => void} onStream a vocal file will stream
   */
  constructor(onBlob, onStream) {
    this.onBlob = onBlob;
    this.onStream = onStream;
    /** @type {{ id: string, track: Promise<string> | null, inst: Promise<string> | null } | null} */
    this.ahead = null;
  }

  /**
   * A playable source for one side of a track ("" when it has no such file):
   * the download already under way when there is one, else a fresh one.
   * @param {Track} track
   * @param {Side} side
   * @returns {Promise<string>}
   */
  get(track, side) {
    const ahead = this.ahead;
    if (ahead && ahead.id === track.id && ahead[side]) {
      const pending = ahead[side];
      ahead[side] = null;
      // Fully handed over: the same song can be warmed again next time round
      if (!ahead.track && !ahead.inst) this.ahead = null;
      return pending;
    }
    return this.resolve(track[FILE_KEYS[side]], side, track.id);
  }

  /**
   * Starts downloading a lockup track's files, dropping any earlier ones
   * nobody took. Streamed tracks need nothing ahead.
   * @param {Track} track
   */
  warm(track) {
    if (!track || (this.ahead && this.ahead.id === track.id)) return;
    this.drop();
    if (!isLockupUrl(track.src) && !isLockupUrl(track.instrumental)) return;
    const ahead = { id: track.id, track: null, inst: null };
    SIDES.forEach((side) => {
      if (!track[FILE_KEYS[side]]) return;
      ahead[side] = this.resolve(track[FILE_KEYS[side]], side, track.id);
      // A failure surfaces when the player takes it, not as an unhandled rejection
      ahead[side].catch(() => {});
    });
    this.ahead = ahead;
  }

  /** Frees downloads nobody took. */
  drop() {
    const ahead = this.ahead;
    this.ahead = null;
    if (!ahead) return;
    SIDES.forEach((side) => {
      if (!ahead[side]) return;
      ahead[side].then((src) => {
        if (src.indexOf("blob:") === 0) URL.revokeObjectURL(src);
      }, () => {});
    });
  }

  /**
   * @param {string | undefined} url
   * @param {Side} side
   * @param {string} trackId
   * @returns {Promise<string>}
   */
  async resolve(url, side, trackId) {
    if (!url) return "";
    if (!isLockupUrl(url)) {
      if (side === "track") this.onStream(trackId, url);
      return url;
    }
    try {
      const blob = await musicLock.fetchBlob(url);
      if (side === "track") this.onBlob(trackId, blob);
      return URL.createObjectURL(blob);
    } catch (e) {
      console.warn(`Failed to fetch remote audio source for ${url}:`, e);
      throw e;
    }
  }
}
