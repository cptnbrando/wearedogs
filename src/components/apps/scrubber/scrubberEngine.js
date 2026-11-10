/**
 * Scrubber engine: everything the Scrubber app does that isn't markup.
 * Decodes a recording, talks to the worker that runs the WebAssembly scrubber
 * (github.com/YEAHDOGS/Scrubber-js), and turns the result into a WAV.
 * Nothing here touches the network: the file never leaves the device.
 */
import { bufferToWav } from "../../../lib/convert.js";

/** Reading a whole file into memory, then its decoded audio on top: keep both sane. */
export const MAX_FILE_BYTES = 1024 * 1024 * 1024;
export const MAX_MINUTES = 30;
const SECONDS_PER_MINUTE = 60;

/** The band the scrubber protects, Hz. The chart is drawn across it. */
export const BAND_LOW_HZ = 20;
export const BAND_HIGH_HZ = 2000;

/**
 * Pure noise throws up chance ridges, all under about 2 s and 11 dB. A ridge
 * is a real tone worth showing if it is long, or fairly long and loud.
 */
const NOTABLE_SECONDS = 3;
const NOTABLE_LOUD_SECONDS = 2;
const NOTABLE_DB = 12;
/**
 * A tone that ends within this of where it began is steady: hum, a fan, an
 * appliance. One and a half analysis bins, so a hum whose first and last
 * frames land in neighbouring bins still reads as steady.
 */
const STEADY_DRIFT_HZ = 6;

/** The same tone heard on two channels: this close in pitch, overlapping this much in time. */
const SAME_TONE_HZ = 8;
const SAME_TONE_OVERLAP = 0.5;

export const KIND_FALLING = "falling";
export const KIND_RISING = "rising";
export const KIND_STEADY = "steady";

const ERROR_TOO_BIG = "That file is over 1 GB. Trim it first, then try again.";
const ERROR_TOO_LONG = `That recording is over ${MAX_MINUTES} minutes. Trim it first, then try again.`;
const ERROR_NO_AUDIO = "No audio could be read from that file.";
const ERROR_WORKER = "The scrubber stopped unexpectedly. Reload and try again.";

/** True where this browser can run the scrubber at all. */
export function isSupported() {
  const hasAudio = typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined";
  return hasAudio && typeof WebAssembly === "object" && typeof Worker === "function";
}

/**
 * Which way a tone moves. A passing aircraft or vehicle falls in pitch.
 * @param {{fFirst: number, fLast: number}} ridge
 */
function kindOf(ridge) {
  const drift = ridge.fLast - ridge.fFirst;
  if (Math.abs(drift) <= STEADY_DRIFT_HZ) return KIND_STEADY;
  return drift < 0 ? KIND_FALLING : KIND_RISING;
}

/** True when two ridges on different channels are one tone picked up by both. */
function isSameTone(a, b) {
  const shared = Math.min(a.tEnd, b.tEnd) - Math.max(a.tStart, b.tStart);
  const isClose = Math.abs(a.fFirst - b.fFirst) <= SAME_TONE_HZ && Math.abs(a.fLast - b.fLast) <= SAME_TONE_HZ;
  return a.channel !== b.channel && isClose && shared >= SAME_TONE_OVERLAP * Math.min(a.seconds, b.seconds);
}

/**
 * The tones worth showing a person, longest first, each tagged with its kind.
 * A tone heard on several channels is listed once.
 * @param {{ridges: object[]}} report
 */
export function notableTones(report) {
  return report.ridges
    .map((ridge) => ({ ...ridge, kind: kindOf(ridge), seconds: ridge.tEnd - ridge.tStart }))
    .filter((tone) => tone.seconds >= NOTABLE_SECONDS || (tone.seconds >= NOTABLE_LOUD_SECONDS && tone.peakDb >= NOTABLE_DB))
    .sort((a, b) => b.seconds - a.seconds)
    .filter((tone, i, all) => !all.slice(0, i).some((earlier) => isSameTone(earlier, tone)));
}

export class ScrubberEngine {
  constructor() {
    this.worker = null;
    this.context = null;
    this.pending = new Map();
    this.nextId = 1;
  }

  /** One AudioContext for decoding and for building the output buffer. */
  audioContext() {
    const Context = window.AudioContext || window.webkitAudioContext;
    this.context = this.context || new Context();
    return this.context;
  }

  /**
   * Reads the audio out of an audio or video file.
   * @param {File} file
   * @returns {Promise<{channels: Float32Array[], sampleRate: number, seconds: number}>}
   */
  async decode(file) {
    if (file.size > MAX_FILE_BYTES) throw new Error(ERROR_TOO_BIG);
    const bytes = await file.arrayBuffer();
    // The callback form: older Safari has no promise from decodeAudioData.
    // Newer browsers return one as well; its failure is already handled here.
    const buffer = await new Promise((resolve, reject) => {
      const pending = this.audioContext().decodeAudioData(bytes, resolve, () => reject(new Error(ERROR_NO_AUDIO)));
      if (pending && pending.catch) pending.catch(() => {});
    });
    if (!buffer || !buffer.length) throw new Error(ERROR_NO_AUDIO);
    if (buffer.duration > MAX_MINUTES * SECONDS_PER_MINUTE) throw new Error(ERROR_TOO_LONG);
    const channels = [];
    for (let i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));
    return { channels, sampleRate: buffer.sampleRate, seconds: buffer.duration };
  }

  /** Starts the worker on first use and routes its replies to whoever asked. */
  ensureWorker() {
    if (this.worker) return this.worker;
    this.worker = new Worker(new URL("./scrubberWorker.js", import.meta.url), { type: "module" });
    this.worker.onmessage = ({ data }) => {
      const job = this.pending.get(data.id);
      if (!job) return;
      if (data.progress !== undefined) return job.onProgress(data.progress);
      this.pending.delete(data.id);
      if (data.error) return job.reject(new Error(data.error));
      job.resolve(data.result);
    };
    this.worker.onerror = () => {
      for (const job of this.pending.values()) job.reject(new Error(ERROR_WORKER));
      this.pending.clear();
      this.dispose();
    };
    return this.worker;
  }

  /**
   * Sends a copy of the samples to the worker: the originals stay here, so a
   * recording can be inspected and then scrubbed without decoding it twice.
   */
  run(audio, rewrite, keepSteadyTones, onProgress) {
    const worker = this.ensureWorker();
    const id = this.nextId++;
    const channels = audio.channels.map((channel) => channel.slice());
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress });
      worker.postMessage(
        { id, rewrite, channels, sampleRate: audio.sampleRate, keepSteadyTones },
        channels.map((channel) => channel.buffer),
      );
    });
  }

  /**
   * Looks for long tones and grid hum without changing anything.
   * @returns {Promise<{report: object, hum: object}>}
   */
  inspect(audio) {
    return this.run(audio, false, false, () => {});
  }

  /**
   * Removes flight signatures (and steady hum, unless kept) from the audio.
   * @param {{channels: Float32Array[], sampleRate: number}} audio
   * @param {boolean} keepSteadyTones
   * @param {(fraction: number) => void} onProgress
   * @returns {Promise<{channels: Float32Array[], report: object, hum: object}>}
   */
  scrub(audio, keepSteadyTones, onProgress) {
    return this.run(audio, true, keepSteadyTones, onProgress);
  }

  /**
   * Scrubbed samples as a 16-bit WAV. Scaled down first if the scrub pushed a peak past full scale.
   * @param {Float32Array[]} channels
   * @param {number} sampleRate
   * @param {number} peak
   * @returns {Blob}
   */
  toWav(channels, sampleRate, peak) {
    const buffer = this.audioContext().createBuffer(channels.length, channels[0].length, sampleRate);
    const gain = peak > 1 ? 1 / peak : 1;
    channels.forEach((channel, i) => {
      const out = buffer.getChannelData(i);
      for (let n = 0; n < channel.length; n++) out[n] = channel[n] * gain;
    });
    return bufferToWav(buffer);
  }

  dispose() {
    if (this.worker) this.worker.terminate();
    if (this.context && this.context.state !== "closed") this.context.close();
    this.worker = null;
    this.context = null;
  }
}
