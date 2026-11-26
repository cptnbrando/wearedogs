/**
 * soundEcho.svelte.js
 * The visualizer on a tethered device that has no sound of its own.
 *
 * The device playing the music sends the other one how loud each part of the
 * sound is, 16 levels from bass to treble, ten times a second, but only while
 * that device's MilkDrop is on screen. The quiet device turns the levels back
 * into a silent signal (one tone per level, never played aloud) and MilkDrop
 * listens to that. Without it, MilkDrop on the quiet device hears nothing
 * and draws black, and the shared preset has nowhere to show.
 *
 * Messages over the tether (lib/tether.svelte.js): "viz-want" (this device
 * wants levels, or no longer does) and "viz" (the levels).
 */
import { audioCore } from "../AudioCore.svelte.js";

export const KIND_LEVELS = "viz";
export const KIND_WANT = "viz-want";
const BAND_COUNT = 16;
/** Where each level's slice of the player's analyser starts (fftSize 256: 128 bins), roughly evenly by ear. */
const BAND_EDGES = [0, 1, 2, 3, 4, 6, 8, 11, 15, 20, 27, 36, 48, 64, 80, 100, 128];
const SEND_EVERY_MS = 100;
const MAX_LEVEL = 255;
/** How loud the silent tones get at full level, and how quickly they follow. */
const TONE_GAIN = 0.4;
const FOLLOW_S = 0.04;
/** Levels stop for this long (the music paused, or the link dropped): the tones fade out. */
const QUIET_AFTER_MS = 600;
const FFT_SIZE = 256;

class SoundEcho {
  /** The silent signal's analyser, for MilkDrop on the quiet device; null until it is wanted. */
  analyser = $state(null);

  #link = null;
  #wanted = false;
  #peerWants = false;
  #sendTimer = null;
  #gains = [];
  #quietTimer = null;
  #bins = null;

  /**
   * The tether joined two devices, or parted them (null).
   * @param {{ send: (payload: object) => boolean, hasSound: () => boolean } | null} link
   */
  setLink(link) {
    this.#link = link;
    this.#peerWants = false;
    this.#stopSending();
    if (link && this.#wanted) link.send({ k: KIND_WANT, on: true });
  }

  /**
   * This device's MilkDrop wants levels (it is on screen and the sound is elsewhere), or no longer does.
   * @param {boolean} on
   */
  setWanted(on) {
    on = !!on;
    if (on) this.#build();
    if (on === this.#wanted) return;
    this.#wanted = on;
    if (this.#link) this.#link.send({ k: KIND_WANT, on });
    if (!on) this.#fade();
  }

  /** @param {unknown} on - the other device wants levels, or stopped wanting them */
  peerWants(on) {
    this.#peerWants = on === true;
    if (this.#peerWants) this.#startSending();
    else this.#stopSending();
  }

  /** @param {unknown} levels - BAND_COUNT numbers from 0 to 255 */
  hear(levels) {
    if (!this.#wanted || !Array.isArray(levels) || levels.length !== BAND_COUNT || !this.#gains.length) return;
    const ctx = audioCore.audioCtx;
    if (ctx.state !== "running") ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    for (let i = 0; i < BAND_COUNT; i++) {
      const level = Number(levels[i]);
      const value = Number.isFinite(level) ? Math.min(Math.max(level, 0), MAX_LEVEL) / MAX_LEVEL : 0;
      this.#gains[i].gain.setTargetAtTime(value * TONE_GAIN, now, FOLLOW_S);
    }
    clearTimeout(this.#quietTimer);
    this.#quietTimer = setTimeout(() => this.#fade(), QUIET_AFTER_MS);
  }

  /** The silent tones and their analyser, once: on the player's own audio context, never to the speakers. */
  #build() {
    if (this.analyser) return;
    audioCore.initContext();
    const ctx = audioCore.audioCtx;
    if (!ctx) return;
    const mix = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    mix.connect(analyser);
    // Pulled through a muted node so the browser keeps running it; nothing reaches the speakers
    const mute = ctx.createGain();
    mute.gain.value = 0;
    analyser.connect(mute);
    mute.connect(ctx.destination);
    const binHz = ctx.sampleRate / FFT_SIZE;
    for (let i = 0; i < BAND_COUNT; i++) {
      const tone = ctx.createOscillator();
      tone.frequency.value = ((BAND_EDGES[i] + BAND_EDGES[i + 1]) / 2 + 0.5) * binHz;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      tone.connect(gain);
      gain.connect(mix);
      tone.start();
      this.#gains.push(gain);
    }
    // A page that has not been touched yet may not run sound: the first touch starts it
    if (ctx.state !== "running") {
      const wake = () => ctx.resume().catch(() => {});
      document.addEventListener("pointerdown", wake, { once: true });
      document.addEventListener("keydown", wake, { once: true });
    }
    this.analyser = analyser;
  }

  #fade() {
    const ctx = audioCore.audioCtx;
    if (!ctx) return;
    for (const gain of this.#gains) gain.gain.setTargetAtTime(0, ctx.currentTime, FOLLOW_S * 4);
  }

  #startSending() {
    if (this.#sendTimer) return;
    this.#sendTimer = setInterval(() => this.#sendLevels(), SEND_EVERY_MS);
  }

  #stopSending() {
    clearInterval(this.#sendTimer);
    this.#sendTimer = null;
  }

  /** Ten times a second, while the other device wants them and this one plays: the 16 levels. */
  #sendLevels() {
    const link = this.#link;
    const analyser = audioCore.analyser;
    if (!link || !this.#peerWants || !analyser || !link.hasSound() || !audioCore.isPlaying) return;
    if (!this.#bins || this.#bins.length !== analyser.frequencyBinCount) this.#bins = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(this.#bins);
    const levels = [];
    for (let i = 0; i < BAND_COUNT; i++) {
      let sum = 0;
      const from = BAND_EDGES[i];
      const to = Math.min(BAND_EDGES[i + 1], this.#bins.length);
      for (let b = from; b < to; b++) sum += this.#bins[b];
      levels.push(to > from ? Math.round(sum / (to - from)) : 0);
    }
    link.send({ k: KIND_LEVELS, b: levels });
  }
}

export const soundEcho = new SoundEcho();
