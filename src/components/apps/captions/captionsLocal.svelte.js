/**
 * captionsLocal.svelte.js
 * Transcription that stays on the device: a small Whisper model run in a web
 * worker (src/lib/transcriberWorker.js). Nothing is uploaded. The model's
 * weights are downloaded once, from Hugging Face, and kept by the browser.
 *
 * It is slower and rougher than the online model, English only, and it times
 * phrases, not words: each phrase's words are spread evenly across it.
 */
import { speechSamples, SPEECH_RATE } from "./captionsSound.js";

const STATUS_READING = "Reading the sound on this device…";
const STATUS_ERROR = "error";
const STATUS_COMPLETE = "complete";
const WORKER_FAILED = "The in-browser transcriber could not start in this browser.";

/** @typedef {import("./captionsOnline.svelte.js").HeardWord} HeardWord */

/**
 * A phrase's words, spread evenly from its start to its end.
 * @param {{ text: string, start: number, end: number | null }} chunk
 * @param {number} soundEnd - the sound's length, for a phrase with no end of its own
 * @returns {HeardWord[]}
 */
function wordsOf(chunk, soundEnd) {
  const texts = String(chunk.text || "").split(/\s+/).filter(Boolean);
  const start = typeof chunk.start === "number" ? chunk.start : 0;
  const end = typeof chunk.end === "number" && chunk.end > start ? chunk.end : Math.max(start, soundEnd);
  const step = (end - start) / (texts.length || 1);
  return texts.map((w, i) => ({ w, s: start + step * i, e: start + step * (i + 1) }));
}

export class LocalTranscriber {
  running = $state(false);
  /** What the worker is doing, in its own words. */
  status = $state("");
  error = $state("");

  #worker = null;
  #stop = null;

  /**
   * Transcribes a file on this device.
   * @param {Blob} blob - the audio or video file
   * @param {string} name - its file name
   * @returns {Promise<HeardWord[] | null>} null when it failed or was stopped
   */
  async run(blob, name) {
    if (this.running) return null;
    this.running = true;
    this.error = "";
    this.status = STATUS_READING;
    try {
      const samples = await speechSamples(blob, name);
      const chunks = await this.#transcribe(samples);
      return chunks ? chunks.flatMap((chunk) => wordsOf(chunk, samples.length / SPEECH_RATE)) : null;
    } catch (error) {
      this.error = (error && error.message) || WORKER_FAILED;
      return null;
    } finally {
      this.#close();
      this.running = false;
      this.status = "";
    }
  }

  /** @returns {Promise<{ text: string, start: number, end: number | null }[] | null>} null when stopped */
  #transcribe(samples) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("../../../lib/transcriberWorker.js", import.meta.url), { type: "module" });
      this.#worker = worker;
      this.#stop = () => resolve(null);
      worker.onerror = () => reject(new Error(WORKER_FAILED));
      worker.onmessage = (event) => {
        const message = event.data;
        if (message.status === STATUS_ERROR) return reject(new Error(message.error));
        if (message.status === STATUS_COMPLETE) return resolve(message.chunks || []);
        this.status = message.text || this.status;
      };
      worker.postMessage({ type: "transcribe", pcmData: samples, timestamps: true }, [samples.buffer]);
    });
  }

  #close() {
    if (this.#worker) this.#worker.terminate();
    this.#worker = null;
  }

  /** Stops at once. The model stays downloaded for next time. */
  stop() {
    this.#close();
    if (this.#stop) this.#stop();
  }
}
