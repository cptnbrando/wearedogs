/**
 * MilkDrop visuals for the music player, through Butterchurn: the open-source
 * WebGL 2 build of Winamp's MilkDrop 2, with the community presets its authors
 * converted (butterchurn-presets, 395 of them across four packs).
 *
 * Nothing here is downloaded until MilkDrop is switched on: the engine and
 * each preset pack are separate chunks, fetched on first use. The first pack
 * starts the show; the rest arrive behind it and join the list.
 *
 * Same shape as VisualizerEngine (start / destroy), so the music panel can
 * swap one for the other. It needs its own canvas: a canvas that has given
 * out a WebGL 1 context can never give a WebGL 2 one.
 */

/** Seconds one preset takes to melt into the next. */
const BLEND_SECONDS = 2.7;
/** How long a preset plays before the next random one, with auto-advance on. */
const AUTO_ADVANCE_MS = 30000;
/** Phones report 3x and more: MilkDrop at that size cooks them for no visible gain. */
const MAX_PIXEL_RATIO = 2;
/** How many presets "previous" can walk back through. */
const MAX_HISTORY = 50;
const WEBGL2 = "webgl2";

/** The preset packs, smallest wait first. Each is its own chunk. */
const PACKS = [
  () => import("butterchurn-presets/lib/butterchurnPresets.min.js"),
  () => import("butterchurn-presets/lib/butterchurnPresetsExtra.min.js"),
  () => import("butterchurn-presets/lib/butterchurnPresetsExtra2.min.js"),
  () => import("butterchurn-presets/lib/butterchurnPresetsMD1.min.js"),
];

/** How deep a bundler may nest a UMD bundle's export under "default". */
const MAX_WRAPS = 3;

/**
 * A UMD bundle's export, whichever way the bundler wrapped it: the first
 * level that has the function we came for.
 * @param {any} module
 * @param {string} method
 */
function unwrap(module, method) {
  let found = module;
  for (let depth = 0; depth < MAX_WRAPS && found && typeof found[method] !== "function"; depth += 1) {
    found = found.default;
  }
  if (!found || typeof found[method] !== "function") throw new Error("MilkDrop bundle has no " + method);
  return found;
}

/** True when this browser can run MilkDrop at all (it needs WebGL 2). */
export function milkdropSupported() {
  if (typeof document === "undefined" || typeof window.WebGL2RenderingContext === "undefined") return false;
  try {
    return !!document.createElement("canvas").getContext(WEBGL2);
  } catch (e) {
    return false;
  }
}

export class MilkdropEngine {
  canvas = null;
  analyser = null;
  audioCtx = null;
  visualizer = null;
  animationFrameId = null;
  autoTimer = null;
  destroyed = false;
  /** name -> preset, filled pack by pack */
  presets = {};
  names = [];
  current = "";
  history = [];
  auto = true;
  width = 0;
  height = 0;

  /**
   * @param {HTMLCanvasElement} canvas - one that has never given out a context
   * @param {AnalyserNode} analyser - the player's audio, tapped after its mix
   * @param {AudioContext} audioCtx
   * @param {{ onPreset?: (name: string) => void, onNames?: (names: string[]) => void }} [listeners]
   *   onPreset: the preset on screen changed; onNames: more presets arrived
   */
  constructor(canvas, analyser, audioCtx, listeners = {}) {
    this.canvas = canvas;
    this.analyser = analyser;
    this.audioCtx = audioCtx;
    this.onPreset = listeners.onPreset || (() => {});
    this.onNames = listeners.onNames || (() => {});
  }

  /** Fetches the engine and the first pack, then starts drawing. Safe to call once. */
  async start() {
    try {
      const [engine, firstPack] = await Promise.all([import("butterchurn/lib/butterchurn.min.js"), PACKS[0]()]);
      if (this.destroyed) return;
      this.resize();
      this.visualizer = unwrap(engine, "createVisualizer").createVisualizer(this.audioCtx, this.canvas, {
        width: this.width,
        height: this.height,
        pixelRatio: 1,
      });
      this.visualizer.connectAudio(this.analyser);
      this.addPack(firstPack);
      this.random(0);
      this.draw();
      this.loadRemainingPacks();
    } catch (e) {
      console.warn("MilkDrop could not start:", e);
    }
  }

  async loadRemainingPacks() {
    for (const load of PACKS.slice(1)) {
      try {
        const pack = await load();
        if (this.destroyed) return;
        this.addPack(pack);
      } catch (e) {
        // A pack that will not load (offline) leaves the ones that did
      }
    }
  }

  addPack(module) {
    const pack = unwrap(module, "getPresets").getPresets();
    for (const name of Object.keys(pack)) this.presets[name] = pack[name];
    this.names = Object.keys(this.presets).sort((a, b) => a.localeCompare(b));
    this.onNames(this.names);
  }

  /** Matches the drawing size to the canvas's size on the page. */
  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const width = Math.max(1, Math.round(this.canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(this.canvas.clientHeight * ratio));
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    if (this.visualizer) this.visualizer.setRendererSize(width, height);
  }

  draw() {
    if (this.destroyed) return;
    this.resize();
    this.visualizer.render();
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Puts a preset on screen.
   * @param {string} name
   * @param {number} [blend] seconds to melt into it
   * @param {boolean} [remember] false when stepping back through history
   */
  loadPreset(name, blend = BLEND_SECONDS, remember = true) {
    const preset = this.presets[name];
    if (!preset || !this.visualizer) return;
    if (remember && this.current) {
      this.history.push(this.current);
      if (this.history.length > MAX_HISTORY) this.history.shift();
    }
    this.current = name;
    this.visualizer.loadPreset(preset, blend);
    this.onPreset(name);
    this.restartAuto();
  }

  /** A different preset, picked at random. */
  random(blend = BLEND_SECONDS) {
    if (!this.names.length) return;
    let name = this.current;
    while (name === this.current && this.names.length > 1) {
      name = this.names[Math.floor(Math.random() * this.names.length)];
    }
    this.loadPreset(name || this.names[0], blend);
  }

  /** The next preset in the list, wrapping round. */
  next() {
    if (!this.names.length) return;
    const at = this.names.indexOf(this.current);
    this.loadPreset(this.names[(at + 1) % this.names.length]);
  }

  /** The preset that was on before this one; with none, the one before it in the list. */
  previous() {
    if (!this.names.length) return;
    const last = this.history.pop();
    if (last) {
      this.loadPreset(last, BLEND_SECONDS, false);
      return;
    }
    const at = this.names.indexOf(this.current);
    this.loadPreset(this.names[(at - 1 + this.names.length) % this.names.length], BLEND_SECONDS, false);
  }

  /** Auto-advance: a new random preset every AUTO_ADVANCE_MS. */
  setAuto(on) {
    this.auto = !!on;
    this.restartAuto();
  }

  restartAuto() {
    clearTimeout(this.autoTimer);
    if (!this.auto || this.destroyed) return;
    this.autoTimer = setTimeout(() => this.random(), AUTO_ADVANCE_MS);
  }

  destroy() {
    this.destroyed = true;
    clearTimeout(this.autoTimer);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.visualizer) {
      try {
        this.visualizer.disconnectAudio(this.analyser);
      } catch (e) {
        // Already disconnected: the audio graph was rebuilt under it
      }
    }
    this.visualizer = null;
    this.presets = {};
  }
}
