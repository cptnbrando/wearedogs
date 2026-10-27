/**
 * deviceSignals.js
 * Device traits for LikeButton's duplicate check, each hashed on its own so
 * the likes Worker (workers/api/src/routes/likes.js) can fuzzy-match them: a
 * phone in incognito, or a browser that scrambles canvas and audio, still
 * matches its earlier like on most signals. Raw values never leave the page,
 * and the Worker salts and re-hashes every hash it stores.
 *
 * A plain JS hash, because crypto.subtle is missing on the LAN dev origin
 * (not a secure context).
 */

// Same names as SIGNAL_KEYS in workers/api/src/routes/likes.js
const SIGNALS = ["ua", "platform", "lang", "tz", "screen", "hardware", "webgl", "canvas", "audio"];
const HASH_SEED = 0x9e3779b1;
const HASH_HEX_LENGTH = 14;
// Browser updates bump version numbers; dropping digits keeps the UA stable
const VERSION_DIGITS = /[\d._]+/g;

const CANVAS_WIDTH = 220;
const CANVAS_HEIGHT = 40;
const CANVAS_TEXT = "WEAREDOGS bark \u{1F415} 2026";
const CANVAS_FONT = "16px Arial, sans-serif";
const CANVAS_INK = "#f60";
const CANVAS_WASH = "rgba(102, 204, 0, 0.7)";
const CANVAS_BLOCK = [100, 1, 62, 20]; // x, y, w, h of the ink block under the text
const CANVAS_TEXT_AT = [4, 12];

const WEBGL_LIMITS = [
  "MAX_TEXTURE_SIZE",
  "MAX_RENDERBUFFER_SIZE",
  "MAX_VIEWPORT_DIMS",
  "ALIASED_LINE_WIDTH_RANGE",
  "MAX_VERTEX_ATTRIBS",
  "MAX_VARYING_VECTORS",
  "MAX_FRAGMENT_UNIFORM_VECTORS",
  "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
];
// Firefox already reports the real GPU through RENDERER, and logs a deprecation
// warning if the debug extension is requested
const FIREFOX = /firefox/i;

// A compressed triangle wave renders with tiny per-device float differences
const AUDIO_SAMPLE_RATE = 44100;
const AUDIO_FRAMES = 5000;
const AUDIO_SUM_FROM = 4500;
const AUDIO_TONE_HZ = 10000;
const AUDIO_TIMEOUT_MS = 1000;
const AUDIO_COMPRESSOR = { threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25 };

/**
 * @returns {Promise<Record<string, string>>} one hex hash per signal; "" when a browser can't provide it
 */
export function collectSignals() {
  return audioPrint().then((audio) => {
    const nav = navigator;
    const screenInfo = window.screen || {};
    // Phones swap width and height on rotation
    const sides = [screenInfo.width, screenInfo.height].sort((a, b) => a - b);
    const traits = {
      ua: (nav.userAgent || "").replace(VERSION_DIGITS, ""),
      platform: nav.platform || "",
      lang: [nav.language].concat(nav.languages || []).join(","),
      tz: timeZone(),
      screen: `${sides.join("x")}x${screenInfo.colorDepth}`,
      hardware: [nav.hardwareConcurrency, nav.deviceMemory, nav.maxTouchPoints].join(","),
      webgl: webglPrint(),
      canvas: canvasPrint(),
      audio,
    };
    const signals = {};
    SIGNALS.forEach((key) => {
      signals[key] = traits[key] ? cyrb53(traits[key], HASH_SEED).toString(16).padStart(HASH_HEX_LENGTH, "0") : "";
    });
    return signals;
  });
}

function timeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

/** GPU, font and anti-aliasing differences make the same drawing render slightly differently per device. */
function canvasPrint() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "top";
    ctx.font = CANVAS_FONT;
    ctx.fillStyle = CANVAS_INK;
    ctx.fillRect(CANVAS_BLOCK[0], CANVAS_BLOCK[1], CANVAS_BLOCK[2], CANVAS_BLOCK[3]);
    ctx.fillStyle = CANVAS_WASH;
    ctx.fillText(CANVAS_TEXT, CANVAS_TEXT_AT[0], CANVAS_TEXT_AT[1]);
    return canvas.toDataURL();
  } catch {
    return "";
  }
}

/** The GPU's name and limits. The context is released at once: the page's 3D view needs its own. */
function webglPrint() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "";
    const debug = FIREFOX.test(navigator.userAgent) ? null : gl.getExtension("WEBGL_debug_renderer_info");
    const parts = [
      gl.getParameter(gl.VERSION),
      gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      gl.getParameter(debug ? debug.UNMASKED_VENDOR_WEBGL : gl.VENDOR),
      gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
      (gl.getSupportedExtensions() || []).join(","),
    ].concat(WEBGL_LIMITS.map((name) => String(gl.getParameter(gl[name]))));
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
    return parts.join("~");
  } catch {
    return "";
  }
}

/** @returns {Promise<string>} a sum of rendered samples, or "" when audio is unavailable or slow */
function audioPrint() {
  return new Promise((resolve) => {
    const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Offline) return resolve("");
    const timer = setTimeout(() => resolve(""), AUDIO_TIMEOUT_MS);
    try {
      const ctx = new Offline(1, AUDIO_FRAMES, AUDIO_SAMPLE_RATE);
      const oscillator = ctx.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.value = AUDIO_TONE_HZ;
      const compressor = ctx.createDynamicsCompressor();
      Object.keys(AUDIO_COMPRESSOR).forEach((param) => {
        compressor[param].value = AUDIO_COMPRESSOR[param];
      });
      oscillator.connect(compressor);
      compressor.connect(ctx.destination);
      oscillator.start(0);
      // oncomplete rather than the promise: old WebKit only has the event
      ctx.oncomplete = (event) => {
        clearTimeout(timer);
        const samples = event.renderedBuffer.getChannelData(0);
        let sum = 0;
        for (let i = AUDIO_SUM_FROM; i < samples.length; i++) sum += Math.abs(samples[i]);
        resolve(String(sum));
      };
      const rendering = ctx.startRendering();
      if (rendering && rendering.catch) rendering.catch(() => resolve(""));
    } catch {
      clearTimeout(timer);
      resolve("");
    }
  });
}

/** cyrb53: small, fast 53-bit string hash with good spread. */
function cyrb53(str, seed) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
