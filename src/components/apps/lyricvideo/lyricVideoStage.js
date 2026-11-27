/**
 * lyricVideoStage.js
 * The picture and the sound of the Lyric Video app, apart from the music
 * player's: an audio graph of its own for the file being made into a video, a
 * MilkDrop engine drawing to a canvas the size of the video, and the finished
 * frame (visualizer plus lyric line) on a second canvas. The finished frame
 * is both the preview on the page and what the recorder records.
 *
 *   media element -> analyser -> monitor (the speakers; muted if asked)
 *                             -> record (a stream for the recorder, always at full level)
 *                             -> MilkDrop
 */

import { MilkdropEngine } from "../../../lib/visualizer/MilkdropEngine.js";

const ANALYSER_FFT_SIZE = 2048;
const CANVAS = "canvas";
const CONTEXT_2D = "2d";
const RUNNING = "running";

export class LyricVideoStage {
  /** @type {AudioContext | null} */
  ctx = null;
  /** @type {AnalyserNode | null} */
  analyser = null;
  /** @type {GainNode | null} */
  monitor = null;
  /** @type {MediaStreamAudioDestinationNode | null} */
  record = null;
  /** @type {MilkdropEngine | null} */
  engine = null;
  /** The finished frame: shown on the page and recorded. */
  output = document.createElement(CANVAS);
  /** @type {CanvasRenderingContext2D} */
  out = this.output.getContext(CONTEXT_2D);
  width = 0;
  height = 0;
  /** @type {HTMLMediaElement | null} the element whose sound is in the graph */
  #el = null;
  /** @type {MediaElementAudioSourceNode | null} */
  #source = null;

  /**
   * @param {(ctx: CanvasRenderingContext2D, width: number, height: number) => void} drawOverlay - the lyric line, every frame
   * @param {{ onPreset?: (name: string) => void, onNames?: (names: string[]) => void }} listeners - for the engine
   */
  constructor(drawOverlay, listeners) {
    this.drawOverlay = drawOverlay;
    this.listeners = listeners;
  }

  /** @returns {boolean} false where the browser has no Web Audio */
  #ensureGraph() {
    if (this.ctx) return true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    this.ctx = new AudioContextClass();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = ANALYSER_FFT_SIZE;
    this.monitor = this.ctx.createGain();
    this.record = this.ctx.createMediaStreamDestination();
    this.analyser.connect(this.monitor);
    this.analyser.connect(this.record);
    this.monitor.connect(this.ctx.destination);
    return true;
  }

  /**
   * Puts a media element's sound into the graph. An element can only ever be
   * tapped once, so each newly opened file brings its own element.
   * @param {HTMLMediaElement} el
   * @returns {boolean}
   */
  connect(el) {
    if (!this.#ensureGraph()) return false;
    if (this.#el === el) return true;
    if (this.#source) this.#source.disconnect();
    this.#source = this.ctx.createMediaElementSource(el);
    this.#source.connect(this.analyser);
    this.#el = el;
    return true;
  }

  /** Browsers start sound only after a tap: call from one. */
  wake() {
    if (this.ctx && this.ctx.state !== RUNNING) this.ctx.resume().catch(() => {});
  }

  /** @param {boolean} on - whether the sound comes out of the speakers too */
  hear(on) {
    if (this.monitor) this.monitor.gain.value = on ? 1 : 0;
  }

  /**
   * Sets the video's size. The engine draws at exactly this size.
   * @param {number} width
   * @param {number} height
   */
  setSize(width, height) {
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.output.width = width;
    this.output.height = height;
    if (!this.engine) return;
    this.engine.size = { width, height };
    this.engine.resize();
  }

  /**
   * Starts the visualizer if it is not running.
   * @param {(engine: MilkdropEngine) => void} setUp - choices to hand the engine before it starts
   */
  start(setUp) {
    if (this.engine || !this.#ensureGraph()) return;
    // A canvas that has given out a context can never give a WebGL 2 one: a new one each time
    const engine = new MilkdropEngine(document.createElement(CANVAS), this.analyser, this.ctx, this.listeners);
    engine.size = { width: this.width, height: this.height };
    engine.onFrame = () => this.#compose();
    setUp(engine);
    this.engine = engine;
    engine.start();
  }

  /** Stops the visualizer (the app was left with no take running). The sound graph stays. */
  stop() {
    if (!this.engine) return;
    this.engine.destroy();
    this.engine = null;
  }

  #compose() {
    this.out.drawImage(this.engine.canvas, 0, 0, this.width, this.height);
    this.drawOverlay(this.out, this.width, this.height);
  }
}
