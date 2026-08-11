/**
 * Browser capability probes + per-app requirements.
 *
 * Plain module, no runes: computed once at import. On every modern browser
 * every probe is true, so gated UIs render identically — the gates only
 * engage where a capability is genuinely absent (old TVs, mid-old Chrome).
 *
 * Whole-app requirements list only CERTAINTIES — APIs without which the
 * app's core purpose cannot function at all. Feature-level degradation
 * (e.g. Wiretap's waveform or transcription) lives inside the app,
 * reading the same `caps` object.
 */

function probe(fn) {
  try {
    return !!fn();
  } catch {
    return false;
  }
}

/** Module-worker support: the options object getter trick (no worker spawned). */
function probeModuleWorker() {
  let supports = false;
  try {
    const opts = {
      get type() {
        supports = true;
        return "module";
      },
    };
    new Worker("data:,", opts).terminate();
  } catch {
    // Constructor may throw on data: URLs in some engines even with support
  }
  return supports;
}

let webgl2Cache = null;

export const caps = {
  proxy: typeof Proxy === "function",
  wasm: typeof WebAssembly === "object" && WebAssembly !== null,
  moduleWorker: probe(probeModuleWorker),
  audioContext: probe(
    () => window.AudioContext || window.webkitAudioContext,
  ),
  mediaRecorder: typeof MediaRecorder !== "undefined",
  getUserMedia: probe(
    () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
  ),
  clipboard: probe(() => navigator.clipboard && navigator.clipboard.writeText),
  clipboardItem: typeof ClipboardItem !== "undefined",
  idb: typeof indexedDB !== "undefined",
  resizeObserver: typeof ResizeObserver !== "undefined",

  /** Lazy: creating a GL context is expensive, probe only when asked. */
  get webgl2() {
    if (webgl2Cache === null) {
      webgl2Cache = probe(() =>
        document.createElement("canvas").getContext("webgl2"),
      );
    }
    return webgl2Cache;
  },
};

/** Human names for the missing-capability message. */
const CAP_LABELS = {
  wasm: "WebAssembly",
  moduleWorker: "module workers",
  audioContext: "Web Audio",
  mediaRecorder: "audio recording",
  getUserMedia: "microphone access",
  idb: "IndexedDB storage",
  webgl2: "WebGL 2 graphics",
};

/**
 * App id → capabilities its CORE purpose requires. Apps not listed are
 * ungated (they degrade internally or need nothing special).
 */
export const APP_REQUIREMENTS = {
  // Recording is the whole point; waveform (audioContext) and
  // transcription (moduleWorker + wasm) degrade inside the app instead
  wiretap: ["getUserMedia", "mediaRecorder"],
  // OCR runs tesseract WASM
  reader: ["wasm"],
  // Emulator cores are WASM, saves live in IndexedDB
  arcade: ["wasm", "idb"],
  // Sound apps are silent without Web Audio
  soundboard: ["audioContext"],
  soundstripper: ["audioContext"],
  converter: ["audioContext"],
};

/**
 * null if the app can run here; otherwise a short human explanation of
 * what's missing.
 */
export function unsupportedReason(appId) {
  const needs = APP_REQUIREMENTS[appId];
  if (!needs) return null;
  const missing = needs.filter((c) => !caps[c]);
  if (missing.length === 0) return null;
  const names = missing.map((c) => CAP_LABELS[c] || c).join(", ");
  return `Needs ${names} — not available in this browser`;
}
