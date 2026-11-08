/**
 * The brain behind a blog post's volume slider (BlogMusic.svelte).
 *
 * Two modes, picked each time the post comes on screen:
 *   local - nothing is playing on the main player: the slider plays the post's
 *           own track on its own element. Volume 0 pauses it, anything above
 *           plays it. Leaving the post with it playing hands it to the main
 *           player as a hidden track (src/lib/hiddenTracks.js), same second,
 *           same loudness.
 *   main  - the main player is busy (or already holds this post's track): the
 *           slider drives the main player's volume instead, 0 pauses it, and
 *           leaving the post puts the volume back where it was.
 */
import { audioCore } from "../lib/AudioCore.svelte.js";
import { adoptHiddenTrack, isHiddenTrackLoaded } from "../lib/hiddenTracks.js";

// A random start keeps clear of the end, so it does not wrap around at once
const TAIL_GUARD_S = 30;

/** @typedef {"local" | "main" | null} DeckMode */

export class BlogMusicDeck {
  /** @type {DeckMode} */
  mode = null;
  /** local mode's volume, 0–1; kept across visits */
  volume = 0;
  /** @type {HTMLAudioElement | null} */
  audio = null;
  savedMainVolume = 1;

  /**
   * @param {string} src - the post's track
   * @param {(state: { mode: DeckMode, volume: number, playing: boolean }) => void} onChange
   */
  constructor(src, onChange) {
    this.src = src;
    this.onChange = onChange;
  }

  emit() {
    this.onChange({ mode: this.mode, volume: this.volume, playing: !!this.audio && !this.audio.paused });
  }

  /** The post came on screen. */
  arrive() {
    if (this.mode) return;
    if (audioCore.isPlaying || isHiddenTrackLoaded(this.src)) {
      this.mode = "main";
      this.savedMainVolume = audioCore.volume;
    } else {
      this.mode = "local";
      this.ensureAudio();
      if (this.volume > 0) this.playLocal();
    }
    this.emit();
  }

  /** The post left the screen (route change, hidden panel, unmount). */
  depart() {
    if (this.mode === "main") audioCore.setVolume(this.savedMainVolume);
    if (this.mode === "local" && this.audio && !this.audio.paused) {
      const at = this.audio.currentTime;
      this.audio.pause();
      adoptHiddenTrack(this.src, { at, volume: this.volume });
    }
    this.mode = null;
    this.emit();
  }

  /** @param {number} v - 0–1; 0 pauses */
  setVolume(v) {
    if (this.mode === "main") return this.setMainVolume(v);
    this.volume = v;
    if (!this.audio) return this.emit();
    this.audio.volume = v;
    if (v === 0) this.audio.pause();
    else if (this.audio.paused) this.playLocal();
    this.emit();
  }

  /** @param {number} v */
  setMainVolume(v) {
    // At 0 the main volume is left alone, so turning back up is not silent
    if (v === 0) return audioCore.isPlaying && audioCore.requestPause();
    audioCore.setVolume(v);
    if (!audioCore.isPlaying) audioCore.play();
  }

  ensureAudio() {
    if (this.audio) return;
    const audio = new Audio();
    // Metadata only: a long file is never pulled down unless it is listened to
    audio.preload = "metadata";
    audio.loop = true;
    // Same request mode as the main player's elements, so a handover hits cache
    audio.crossOrigin = "anonymous";
    audio.volume = this.volume;
    audio.addEventListener("loadedmetadata", () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = Math.random() * Math.max(1, audio.duration - TAIL_GUARD_S);
    });
    audio.addEventListener("playing", () => this.emit());
    audio.addEventListener("pause", () => this.emit());
    audio.src = this.src;
    this.audio = audio;
  }

  playLocal() {
    // Refused autoplay leaves it paused; the next slider move is a gesture
    this.audio.play().catch(() => this.emit());
  }

  /** Page is going away: stop without handing anything over. */
  halt() {
    if (this.audio) this.audio.pause();
  }

  destroy() {
    this.depart();
    if (!this.audio) return;
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio.load();
    this.audio = null;
  }
}
