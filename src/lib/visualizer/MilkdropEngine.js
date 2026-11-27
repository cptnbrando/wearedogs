/**
 * MilkDrop visuals for the music player, through Butterchurn: the open-source
 * WebGL 2 build of Winamp's MilkDrop 2, with the community presets its authors
 * converted (butterchurn-presets, 395 of them across four packs) and our own
 * pack of the most realistic ones they left out (realismPack.js).
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
/** How long a preset plays before the next one, with auto-advance on. */
export const AUTO_ADVANCE_MS = 30000;
/** Phones report 3x and more: MilkDrop at that size cooks them for no visible gain. */
const MAX_PIXEL_RATIO = 2;
/** How many presets "previous" can walk back through. */
const MAX_HISTORY = 50;
const WEBGL2 = "webgl2";

/** The preset packs, smallest wait first, then the realistic ones. Each is its own chunk. */
const PACKS = [
  () => import("butterchurn-presets/lib/butterchurnPresets.min.js"),
  () => import("./realismPack.js"),
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
  /** Auto-advance and "next" pick at random; off, they walk the list in order. */
  shuffle = true;
  /** The listener's own list of preset names (their favourites), or null for every preset. */
  pool = null;
  /** Presets the listener turned down: the show never moves on to them by itself. */
  hidden = new Set();
  /** The preset the last engine was showing: put back on as soon as its pack has loaded. */
  resume = "";
  /** Asked before auto-advance moves on: false while another device leads the show (presetDeck's tether link). */
  canAdvance = null;
  width = 0;
  height = 0;
  /** A drawing size of its own ({ width, height }), whatever the canvas's size on the page: a video's frame. */
  size = null;
  /** How long a preset plays before auto-advance moves on. */
  autoMs = AUTO_ADVANCE_MS;
  /** Called after every frame is drawn: a recorder copies it from here. */
  onFrame = null;

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
      if (!this.resumePreset()) this.random(0);
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
        this.resumePreset();
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

  /** @returns {boolean} true once the preset to resume is on screen */
  resumePreset() {
    const name = this.resume;
    if (!name || !this.presets[name]) return false;
    this.resume = "";
    this.loadPreset(name, 0, false);
    return true;
  }

  /** Matches the drawing size to the canvas's size on the page, or to `size` when it has one. */
  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const width = this.size ? this.size.width : Math.max(1, Math.round(this.canvas.clientWidth * ratio));
    const height = this.size ? this.size.height : Math.max(1, Math.round(this.canvas.clientHeight * ratio));
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
    if (this.onFrame) this.onFrame();
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

  /**
   * Narrows the show to the listener's own presets, or widens it back to all.
   * @param {string[] | null} names
   */
  setPool(names) {
    this.pool = names && names.length ? names : null;
  }

  /** @param {string[]} names - the presets the listener turned down */
  setHidden(names) {
    this.hidden = new Set(names);
  }

  /**
   * The presets the show moves through: the listener's list once any of it has
   * loaded, else all, less the ones they turned down (unless that leaves none).
   */
  list() {
    const loaded = this.pool ? this.pool.filter((name) => this.presets[name]) : [];
    const source = loaded.length ? loaded : this.names;
    if (!this.hidden.size) return source;
    const shown = source.filter((name) => !this.hidden.has(name));
    return shown.length ? shown : source;
  }

  /** A different preset, picked at random. */
  random(blend = BLEND_SECONDS) {
    const list = this.list();
    if (!list.length) return;
    let name = this.current;
    while (name === this.current && list.length > 1) {
      name = list[Math.floor(Math.random() * list.length)];
    }
    this.loadPreset(list.indexOf(name) === -1 ? list[0] : name, blend);
  }

  /** The next preset in the list, wrapping round. One just turned down is no longer in it: the next name after it is. */
  next() {
    const list = this.list();
    if (!list.length) return;
    const at = list.indexOf(this.current);
    if (at !== -1) {
      this.loadPreset(list[(at + 1) % list.length]);
      return;
    }
    this.loadPreset(list.find((name) => name.localeCompare(this.current) > 0) || list[0]);
  }

  /** Moves on the way the listener set it: a random preset, or the next in order. */
  advance() {
    if (this.shuffle) this.random();
    else this.next();
  }

  /** The preset that was on before this one; with none, the one before it in the list. */
  previous() {
    const list = this.list();
    if (!list.length) return;
    let last = this.history.pop();
    while (last && this.hidden.has(last)) last = this.history.pop();
    if (last) {
      this.loadPreset(last, BLEND_SECONDS, false);
      return;
    }
    const at = Math.max(0, list.indexOf(this.current));
    this.loadPreset(list[(at - 1 + list.length) % list.length], BLEND_SECONDS, false);
  }

  /** Auto-advance: another preset every AUTO_ADVANCE_MS. */
  setAuto(on) {
    this.auto = !!on;
    this.restartAuto();
  }

  restartAuto() {
    clearTimeout(this.autoTimer);
    if (!this.auto || this.destroyed) return;
    this.autoTimer = setTimeout(() => {
      // A device following another waits for that one's choice instead of picking its own
      if (this.canAdvance && !this.canAdvance()) this.restartAuto();
      else this.advance();
    }, this.autoMs);
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
