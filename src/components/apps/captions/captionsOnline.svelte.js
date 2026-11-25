/**
 * captionsOnline.svelte.js
 * Online transcription for the Captions app: the sound goes, in short pieces,
 * to the API Worker's /captions route (workers/api/src/routes/captions.js),
 * which runs Cloudflare's Whisper model on each piece and sends the words
 * back with their times. Nothing is sent until run() is called.
 *
 * One Turnstile check buys a pass for half an hour, so a long file is not
 * checked piece by piece. A day's free minutes are limited: the Worker says
 * how many are left with every answer.
 */
import { callApi } from "../../../lib/dogsApi.js";
import { getTurnstileToken } from "../../turnstileToken.js";
import { speechSamples, cutPieces, pieceAsBase64Mp3, SPEECH_RATE } from "./captionsSound.js";
import { hintFor } from "./captionsAlign.js";

const TURNSTILE_ACTION = "captions";
/** The model can take a while on a two-minute piece. */
const PIECE_TIMEOUT_MS = 180000;
const STATUS_PASS_EXPIRED = 401;
const MAX_PIECE_SECONDS = 150;
const NOT_HUMAN = "The check that you are a person did not finish. Try again.";
export const PHASE_READING = "reading";
export const PHASE_SENDING = "sending";

/** @typedef {{ w: string, s: number, e: number }} HeardWord - a word, when it starts and when it ends, in seconds */

/**
 * A segment's words. A segment that came back without word times has its
 * text spread evenly across it.
 * @param {any} segment
 * @param {number} offset - where the segment's piece starts in the whole file, in seconds
 * @returns {HeardWord[]}
 */
function wordsOf(segment, offset) {
  if (Array.isArray(segment.words) && segment.words.length) {
    return segment.words.map((word) => ({ w: word.w, s: word.s + offset, e: word.e + offset }));
  }
  const texts = String(segment.text || "").split(/\s+/).filter(Boolean);
  const step = (segment.end - segment.start) / (texts.length || 1);
  return texts.map((w, i) => ({ w, s: segment.start + step * i + offset, e: segment.start + step * (i + 1) + offset }));
}

export class OnlineTranscriber {
  running = $state(false);
  /** "" when idle, else PHASE_READING or PHASE_SENDING. */
  phase = $state("");
  /** Pieces finished, and how many there are. */
  done = $state(0);
  total = $state(0);
  error = $state("");
  /** @type {{ mine: number, all: number } | null} seconds left today, null until the Worker has said */
  left = $state(null);

  #pass = "";
  #stopped = false;

  /** Asks how many seconds are left today. @param {string} token - the owner's session, or "" */
  async refreshAllowance(token) {
    const answer = await callApi("GET", "/captions/allowance", { token });
    if (answer.ok && answer.data) this.left = { mine: answer.data.mine, all: answer.data.all };
  }

  async #newPass() {
    let turnstile = "";
    try {
      turnstile = await getTurnstileToken(TURNSTILE_ACTION);
    } catch (e) {
      throw new Error(NOT_HUMAN);
    }
    const answer = await callApi("POST", "/captions/pass", { body: { token: turnstile } });
    if (!answer.ok || !answer.data) throw new Error(answer.error);
    this.#pass = answer.data.pass;
  }

  /** Sends one piece, getting a new pass once if the old one ran out. */
  async #send(body, token) {
    if (!this.#pass) await this.#newPass();
    let answer = await callApi("POST", "/captions/transcribe", { body: { ...body, pass: this.#pass }, token, timeoutMs: PIECE_TIMEOUT_MS });
    if (answer.status === STATUS_PASS_EXPIRED) {
      await this.#newPass();
      answer = await callApi("POST", "/captions/transcribe", { body: { ...body, pass: this.#pass }, token, timeoutMs: PIECE_TIMEOUT_MS });
    }
    if (answer.data && typeof answer.data.mine === "number") this.left = { mine: answer.data.mine, all: answer.data.all };
    if (!answer.ok || !answer.data) throw new Error(answer.error);
    return answer.data;
  }

  /**
   * Transcribes a file. Progress shows in `phase`, `done` and `total`; a failure in `error`.
   * @param {Blob} blob - the audio or video file
   * @param {string} name - its file name
   * @param {{ lyrics?: string, language?: string, token?: string }} [options] lyrics: known words, for
   *   the hints; language: a two-letter code, or "" to let the model tell; token: the owner's session
   * @returns {Promise<HeardWord[] | null>} every word heard, in order (up to where it was stopped); null when it failed
   */
  async run(blob, name, options = {}) {
    if (this.running) return null;
    this.running = true;
    this.#stopped = false;
    this.error = "";
    this.done = 0;
    this.total = 0;
    this.phase = PHASE_READING;
    try {
      const samples = await speechSamples(blob, name);
      const pieces = cutPieces(samples);
      this.total = pieces.length;
      this.phase = PHASE_SENDING;
      const words = [];
      for (const piece of pieces) {
        // Stopped: what was already heard is kept, since its minutes are spent
        if (this.#stopped) break;
        const body = {
          audio: await pieceAsBase64Mp3(samples.subarray(piece.from, piece.to)),
          seconds: Math.min(MAX_PIECE_SECONDS, Math.max(1, Math.ceil((piece.to - piece.from) / SPEECH_RATE))),
        };
        if (options.language) body.language = options.language;
        const hint = hintFor(options.lyrics, piece.from / samples.length, piece.to / samples.length);
        if (hint) body.hint = hint;
        const data = await this.#send(body, options.token || "");
        for (const segment of data.segments || []) words.push(...wordsOf(segment, piece.from / SPEECH_RATE));
        this.done++;
      }
      return words;
    } catch (error) {
      this.error = (error && error.message) || "Something went wrong.";
      return null;
    } finally {
      this.running = false;
      this.phase = "";
    }
  }

  /** Stops after the piece being sent. Pieces already transcribed have used their minutes. */
  stop() {
    this.#stopped = true;
  }
}
