/**
 * fingerprintCollectors.js
 * Raw device and browser readings for the Fingerprint app. Runs only after the
 * visitor accepts the consent banner (FingerprintApp.svelte).
 *
 * Every reader is guarded: a missing API gives "" or null, never a throw, so
 * Chrome 40 and locked-down browsers still get every reading they allow.
 * Async readers race a timeout so one slow API cannot stall the whole report.
 */

import { canvasPrint, audioPrint, hashTrait } from "../../deviceSignals.js";
import META from "./fingerprintSignals.json";

const ASYNC_TIMEOUT_MS = 1500;
const VOICES_WAIT_MS = 800;
const FONT_TEST_TEXT = "mmmmmmmmmmlli1WwQ@#é中";
const FONT_TEST_SIZE = "72px";
const FONT_BASES = ["monospace", "sans-serif", "serif"];
const INTL_SAMPLE_NUMBER = 1234567.891;
// A fixed instant, so only the locale changes the formatted text
const INTL_SAMPLE_DATE = Date.UTC(2026, 0, 31, 15, 4, 5);
const BYTES_PER_GB = 1024 * 1024 * 1024;
const PERCENT = 100;
// Firefox already reports the real GPU, and warns when the debug extension is requested
const FIREFOX = /firefox/i;
const WEBGL_LIMITS = [
  "MAX_TEXTURE_SIZE", "MAX_RENDERBUFFER_SIZE", "MAX_VIEWPORT_DIMS", "ALIASED_LINE_WIDTH_RANGE",
  "ALIASED_POINT_SIZE_RANGE", "MAX_VERTEX_ATTRIBS", "MAX_VARYING_VECTORS", "MAX_VERTEX_UNIFORM_VECTORS",
  "MAX_FRAGMENT_UNIFORM_VECTORS", "MAX_COMBINED_TEXTURE_IMAGE_UNITS", "MAX_TEXTURE_IMAGE_UNITS",
  "MAX_CUBE_MAP_TEXTURE_SIZE", "RED_BITS", "DEPTH_BITS", "STENCIL_BITS",
];

/**
 * Resolves with the promise's value, or `fallback` once ASYNC_TIMEOUT_MS passes or it fails.
 * @template T
 * @param {() => Promise<T>} start
 * @param {T} fallback
 * @returns {Promise<T>}
 */
function settle(start, fallback) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ASYNC_TIMEOUT_MS);
    const done = (value) => {
      clearTimeout(timer);
      resolve(value);
    };
    try {
      start().then(done, () => done(fallback));
    } catch {
      done(fallback);
    }
  });
}

/** @returns {Object<string, any>} synchronous browser readings */
export function readBrowser() {
  const nav = navigator;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  return {
    ua: nav.userAgent || "",
    platform: [nav.platform, nav.vendor, nav.productSub].filter(Boolean).join(" / "),
    languages: (nav.languages && nav.languages.length ? Array.prototype.slice.call(nav.languages) : [nav.language]).join(", "),
    timezone: readTimeZone(),
    intl: readIntl(),
    privacy: `DNT ${nav.doNotTrack || window.doNotTrack || nav.msDoNotTrack || "unset"} · GPC ${nav.globalPrivacyControl === undefined ? "unsupported" : nav.globalPrivacyControl ? "on" : "off"}`,
    storageApis: readStorageApis(),
    plugins: Array.prototype.map.call(nav.plugins || [], (plugin) => plugin.name).join(", "),
    mimeTypes: `${(nav.mimeTypes || []).length} types · PDF viewer ${nav.pdfViewerEnabled === undefined ? "unknown" : nav.pdfViewerEnabled ? "yes" : "no"}`,
    automation: nav.webdriver ? "webdriver: true (automated)" : "webdriver: false",
    connection: connection
      ? [connection.effectiveType, connection.downlink && `${connection.downlink} Mb/s`, connection.rtt && `${connection.rtt} ms`, connection.saveData && "data saver"].filter(Boolean).join(" · ")
      : "",
    features: readFeatures(),
    codecs: readCodecs(),
    prefs: readPreferences(),
  };
}

/** @returns {Object<string, any>} synchronous hardware readings */
export function readHardware() {
  const nav = navigator;
  const scr = window.screen || {};
  const orientation = scr.orientation && scr.orientation.type ? ` · ${scr.orientation.type}` : "";
  return {
    screen: `${scr.width}×${scr.height} · avail ${scr.availWidth}×${scr.availHeight} · ${scr.colorDepth}-bit${orientation}`,
    viewport: `${window.devicePixelRatio || 1}× · window ${window.innerWidth}×${window.innerHeight}`,
    cpu: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} threads` : "",
    memory: nav.deviceMemory ? `${nav.deviceMemory} GB (rounded)` : "",
    touch: nav.maxTouchPoints !== undefined ? `${nav.maxTouchPoints} points` : "",
    webglInfo: readWebgl(),
    canvas: hashTrait(canvasPrint()),
    fonts: readFonts(),
    math: readMath(),
  };
}

/**
 * Readings that need a promise: client hints, permissions, battery, devices,
 * voices, storage quota and the audio render.
 * @returns {Promise<Object<string, any>>}
 */
export function readAsync() {
  const jobs = {
    uaHints: settle(readUaHints, ""),
    permissions: settle(readPermissions, ""),
    battery: settle(readBattery, ""),
    mediaDevices: settle(readMediaDevices, ""),
    voices: settle(readVoices, null),
    storageQuota: settle(readQuota, ""),
    audio: settle(audioPrint, ""),
  };
  const keys = Object.keys(jobs);
  return Promise.all(keys.map((key) => jobs[key])).then((values) => {
    const out = {};
    keys.forEach((key, i) => {
      out[key] = values[i];
    });
    return out;
  });
}

function readTimeZone() {
  const offset = -new Date().getTimezoneOffset() / 60;
  const sign = offset >= 0 ? "+" : "";
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return { zone, label: `${zone || "unknown"} (UTC${sign}${offset})` };
  } catch {
    return { zone: "", label: `UTC${sign}${offset}` };
  }
}

function readIntl() {
  if (typeof Intl === "undefined") return "";
  try {
    const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
    const options = dateFormat.resolvedOptions();
    const clock = options.hourCycle || (options.hour12 ? "12h" : "24h");
    return [
      new Intl.NumberFormat().format(INTL_SAMPLE_NUMBER),
      dateFormat.format(INTL_SAMPLE_DATE),
      options.locale,
      options.calendar,
      options.numberingSystem,
      clock,
    ].filter(Boolean).join(" · ");
  } catch {
    return "";
  }
}

function readStorageApis() {
  const works = (name) => {
    try {
      const store = window[name];
      const key = "wad-fp-probe";
      store.setItem(key, "1");
      store.removeItem(key);
      return true;
    } catch {
      return false;
    }
  };
  const parts = [
    `cookies ${navigator.cookieEnabled ? "on" : "off"}`,
    `localStorage ${works("localStorage") ? "on" : "off"}`,
    `sessionStorage ${works("sessionStorage") ? "on" : "off"}`,
    `IndexedDB ${window.indexedDB ? "on" : "off"}`,
  ];
  return parts.join(" · ");
}

/** @returns {{ present: string[], total: number }} */
function readFeatures() {
  const present = META.features
    .filter(([scope, name]) => {
      const host = scope === "navigator" ? navigator : window;
      try {
        return name in host;
      } catch {
        return false;
      }
    })
    .map(([, name]) => name);
  return { present, total: META.features.length };
}

function readCodecs() {
  try {
    const video = document.createElement("video");
    if (!video.canPlayType) return "";
    return META.codecs
      .filter(([, type]) => video.canPlayType(type) !== "")
      .map(([name]) => name)
      .join(", ");
  } catch {
    return "";
  }
}

function readPreferences() {
  if (!window.matchMedia) return "";
  return META.mediaQueries
    .filter(([, query]) => {
      try {
        return window.matchMedia(query).matches;
      } catch {
        return false;
      }
    })
    .map(([name]) => name)
    .join(", ") || "none";
}

/** @returns {{ vendor: string, renderer: string, limits: string, extensions: string[], version: string }|null} */
function readWebgl() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return null;
    const debug = FIREFOX.test(navigator.userAgent) ? null : gl.getExtension("WEBGL_debug_renderer_info");
    const info = {
      vendor: String(gl.getParameter(debug ? debug.UNMASKED_VENDOR_WEBGL : gl.VENDOR) || ""),
      renderer: String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || ""),
      version: `${gl.getParameter(gl.VERSION)} · ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`,
      limits: WEBGL_LIMITS.map((name) => `${name}=${gl.getParameter(gl[name])}`).join(";"),
      extensions: gl.getSupportedExtensions() || [],
    };
    // Release the context at once: the page's own 3D views need theirs
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
    return info;
  } catch {
    return null;
  }
}

/**
 * Text measured in each candidate font against the generic fallbacks: a width
 * that differs from every fallback means the font is installed. Canvas only, so
 * nothing is added to the page layout.
 * @returns {{ found: string[], total: number }|null}
 */
function readFonts() {
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx || !ctx.measureText) return null;
    const widthIn = (family) => {
      ctx.font = `${FONT_TEST_SIZE} ${family}`;
      return ctx.measureText(FONT_TEST_TEXT).width;
    };
    const baseWidths = FONT_BASES.map(widthIn);
    const found = META.fonts.filter((font) =>
      FONT_BASES.some((base, i) => widthIn(`"${font}", ${base}`) !== baseWidths[i]),
    );
    return { found, total: META.fonts.length };
  } catch {
    return null;
  }
}

/** @returns {{ values: string, count: number }} */
function readMath() {
  const values = META.math.map(([name, arg]) => {
    const fn = Math[name];
    if (typeof fn !== "function") return "-";
    // pow takes two arguments: a fixed base and the listed exponent
    return String(name === "pow" ? fn(Math.PI, arg) : fn(arg));
  });
  return { values: values.join(","), count: values.filter((value) => value !== "-").length };
}

function readUaHints() {
  const data = navigator.userAgentData;
  if (!data) return Promise.resolve("");
  const low = `${(data.brands || []).map((b) => `${b.brand} ${b.version}`).join(", ")} · ${data.platform}${data.mobile ? " · mobile" : ""}`;
  if (!data.getHighEntropyValues) return Promise.resolve(low);
  return data.getHighEntropyValues(META.uaHints).then((high) => {
    const versions = (high.fullVersionList || []).map((b) => `${b.brand} ${b.version}`).join(", ");
    const extra = [
      high.platformVersion && `${data.platform} ${high.platformVersion}`,
      high.architecture && `${high.architecture}${high.bitness ? `-${high.bitness}` : ""}`,
      high.model && `model ${high.model}`,
      high.wow64 && "WoW64",
      high.formFactors && high.formFactors.length && high.formFactors.join("/"),
    ].filter(Boolean);
    return [versions || low].concat(extra).join(" · ");
  });
}

function readPermissions() {
  const permissions = navigator.permissions;
  if (!permissions || !permissions.query) return Promise.resolve("");
  const ask = (name) => {
    try {
      return permissions.query({ name }).then((status) => `${name}: ${status.state}`, () => "");
    } catch {
      return Promise.resolve("");
    }
  };
  return Promise.all(META.permissions.map(ask)).then((states) => states.filter(Boolean).join(" · "));
}

function readBattery() {
  if (!navigator.getBattery) return Promise.resolve("");
  return navigator.getBattery().then((battery) =>
    `${Math.round(battery.level * PERCENT)}%${battery.charging ? " · charging" : " · on battery"}`,
  );
}

function readMediaDevices() {
  const devices = navigator.mediaDevices;
  if (!devices || !devices.enumerateDevices) return Promise.resolve("");
  return devices.enumerateDevices().then((list) => {
    const counts = {};
    list.forEach((device) => {
      counts[device.kind] = (counts[device.kind] || 0) + 1;
    });
    return Object.keys(counts).sort().map((kind) => `${counts[kind]} ${kind}`).join(" · ") || "none listed";
  });
}

/** @returns {Promise<{ names: string[], local: number, preferred: string }|null>} */
function readVoices() {
  const synth = window.speechSynthesis;
  if (!synth || !synth.getVoices) return Promise.resolve(null);
  const summarise = () => {
    const voices = synth.getVoices() || [];
    const preferred = voices.filter((voice) => voice.default)[0];
    return {
      names: voices.map((voice) => `${voice.name} (${voice.lang})`),
      local: voices.filter((voice) => voice.localService).length,
      preferred: preferred ? preferred.name : "",
    };
  };
  if (synth.getVoices().length) return Promise.resolve(summarise());
  // Chrome fills the list a moment later
  return new Promise((resolve) => {
    const finish = () => {
      synth.onvoiceschanged = null;
      resolve(summarise());
    };
    synth.onvoiceschanged = finish;
    setTimeout(finish, VOICES_WAIT_MS);
  });
}

function readQuota() {
  const storage = navigator.storage;
  if (!storage || !storage.estimate) return Promise.resolve("");
  return storage.estimate().then((estimate) => {
    const gb = (bytes) => (bytes / BYTES_PER_GB).toFixed(2);
    return `${gb(estimate.quota || 0)} GB allowed · ${gb(estimate.usage || 0)} GB used`;
  });
}
