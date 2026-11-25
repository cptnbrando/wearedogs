/**
 * captionsMedia.svelte.js
 * The audio or video the Captions app is timing: one media element, its
 * transport (play, pause, seek, speed), and the peaks its waveform is drawn
 * from. The element's own clock is the only clock: taps and nudges read
 * `now()`, never a timer.
 *
 * The file stays in memory for as long as it is open and is never stored.
 */
import { audioCore } from "../../../lib/AudioCore.svelte.js";

export const SPEEDS = [0.5, 0.75, 1];
/** How far before a word "hear this word" starts. */
export const PREROLL_S = 0.6;
/** Waveform detail: one peak for every hundredth of a second. */
export const PEAKS_PER_SECOND = 100;
/** The most a file may weigh to be decoded for its waveform; bigger files still play and scrub. */
const MAX_DECODE_BYTES = 200 * 1024 * 1024;
const VIDEO_TYPE = /^video\//;
const VIDEO_NAME = /\.(mp4|mov|m4v|webm|mkv|avi)$/i;
const KIND_VIDEO = "video";
const KIND_AUDIO = "audio";
const CANNOT_PLAY = "This browser cannot play that file.";
const CANNOT_FETCH = "Could not load that song's audio. Check the connection and try again.";

/**
 * The loudest sample of each hundredth of a second, 0 to 1.
 * @param {AudioBuffer} buffer
 * @returns {Float32Array}
 */
function peaksOf(buffer) {
  const step = buffer.sampleRate / PEAKS_PER_SECOND;
  const count = Math.max(1, Math.ceil(buffer.length / step));
  const peaks = new Float32Array(count);
  let top = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < count; i++) {
      const end = Math.min(data.length, Math.floor((i + 1) * step));
      let max = peaks[i];
      for (let j = Math.floor(i * step); j < end; j++) {
        const value = data[j] < 0 ? -data[j] : data[j];
        if (value > max) max = value;
      }
      peaks[i] = max;
      if (max > top) top = max;
    }
  }
  if (top > 0) for (let i = 0; i < count; i++) peaks[i] /= top;
  return peaks;
}

/**
 * Decodes a file's sound. The decode context is always closed again.
 * @param {Blob} blob
 * @returns {Promise<AudioBuffer | null>} null when it cannot be decoded here
 */
export async function decodeSound(blob) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass || blob.size > MAX_DECODE_BYTES) return null;
  let context = null;
  try {
    context = new AudioContextClass();
    return await context.decodeAudioData(await blob.arrayBuffer());
  } catch (e) {
    return null;
  } finally {
    const closing = context && typeof context.close === "function" ? context.close() : null;
    if (closing && typeof closing.catch === "function") closing.catch(() => {});
  }
}

export class CaptionsMedia {
  /** "audio" or "video"; "" when nothing is open. */
  kind = $state("");
  /** A file is being fetched or read. */
  loading = $state(false);
  error = $state("");
  duration = $state(0);
  /** The element's time, as of its last report: for labels. Use now() for timing. */
  time = $state(0);
  playing = $state(false);
  rate = $state(1);
  /** @type {Float32Array | null} PEAKS_PER_SECOND peaks, null until decoded (or when it cannot be) */
  peaks = $state.raw(null);
  /** @type {HTMLMediaElement | null} */
  el = null;
  /** @type {Blob | null} the open file, for the transcribers */
  blob = null;
  #url = "";

  /**
   * Opens a file to play and scrub.
   * @param {Blob} blob
   * @param {string} name - its file name
   * @returns {Promise<boolean>} false when the browser cannot play it
   */
  async openBlob(blob, name) {
    this.close();
    const video = VIDEO_TYPE.test(blob.type || "") || VIDEO_NAME.test(name || "");
    const el = document.createElement(video ? KIND_VIDEO : KIND_AUDIO);
    el.preload = "auto";
    el.playsInline = true;
    el.addEventListener("play", () => {
      this.playing = true;
      // One sound at a time: the site's music player gives way
      if (audioCore.isPlaying) audioCore.pause();
    });
    el.addEventListener("pause", () => (this.playing = false));
    el.addEventListener("ended", () => (this.playing = false));
    el.addEventListener("timeupdate", () => (this.time = el.currentTime));
    el.addEventListener("seeked", () => (this.time = el.currentTime));
    el.addEventListener("durationchange", () => {
      if (isFinite(el.duration)) this.duration = el.duration;
    });
    this.#url = URL.createObjectURL(blob);
    const ready = new Promise((resolve) => {
      el.addEventListener("loadedmetadata", () => resolve(true), { once: true });
      el.addEventListener("error", () => resolve(false), { once: true });
    });
    el.src = this.#url;
    if (!(await ready)) {
      URL.revokeObjectURL(this.#url);
      this.#url = "";
      this.error = CANNOT_PLAY;
      return false;
    }
    this.el = el;
    this.blob = blob;
    this.kind = video ? KIND_VIDEO : KIND_AUDIO;
    el.playbackRate = this.rate;
    // The waveform arrives when it is ready; playing does not wait for it
    decodeSound(blob).then((buffer) => {
      if (this.blob !== blob || !buffer) return;
      this.peaks = peaksOf(buffer);
      if (!this.duration) this.duration = buffer.duration;
    });
    return true;
  }

  /**
   * Opens a song from the player's library by fetching its audio.
   * @param {{ src?: string, instrumental?: string, title: string }} track
   * @returns {Promise<boolean>}
   */
  async openTrack(track) {
    this.close();
    this.loading = true;
    try {
      const response = await fetch(track.src || track.instrumental);
      if (!response.ok) throw new Error(CANNOT_FETCH);
      return await this.openBlob(await response.blob(), track.title);
    } catch (e) {
      this.error = CANNOT_FETCH;
      return false;
    } finally {
      this.loading = false;
    }
  }

  /** @returns {number} where the sound is right now, in seconds */
  now() {
    return this.el ? this.el.currentTime : 0;
  }

  play() {
    if (this.el) this.el.play().catch(() => {});
  }

  pause() {
    if (this.el) this.el.pause();
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  /** @param {number} seconds */
  seek(seconds) {
    if (!this.el) return;
    this.el.currentTime = Math.max(0, Math.min(seconds, this.duration || seconds));
    this.time = this.el.currentTime;
  }

  /** Plays from a little before a moment, to hear a word land. */
  playFrom(seconds) {
    this.seek(seconds - PREROLL_S);
    this.play();
  }

  /** @param {number} rate - one of SPEEDS */
  setRate(rate) {
    this.rate = rate;
    if (this.el) this.el.playbackRate = rate;
  }

  /** Lets go of the open file. */
  close() {
    if (this.el) {
      this.el.pause();
      this.el.removeAttribute("src");
      this.el.load();
      if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    }
    if (this.#url) URL.revokeObjectURL(this.#url);
    this.#url = "";
    this.el = null;
    this.blob = null;
    this.kind = "";
    this.error = "";
    this.duration = 0;
    this.time = 0;
    this.playing = false;
    this.peaks = null;
  }
}
