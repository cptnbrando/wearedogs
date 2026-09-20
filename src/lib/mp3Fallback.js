/**
 * mp3Fallback.js
 * The original pure-JS MP3 encoder (lamejs), on the main thread. Only used
 * when the worker pool can't start: no Web Workers, no WebAssembly, or the
 * worker script failed to load. Roughly 15x realtime, against several
 * hundred for the pool — slow, but it always works.
 */
import { Mp3Encoder } from "@breezystack/lamejs";

// Fix for lamejs packaging bugs causing "MPEGMode is not defined"
if (typeof globalThis !== "undefined" && !globalThis.MPEGMode) {
  globalThis.MPEGMode = { STEREO: 0, JOINT_STEREO: 1, DUAL_CHANNEL: 2, SINGLE_CHANNEL: 3 };
}
if (typeof window !== "undefined" && !window.MPEGMode) {
  window.MPEGMode = globalThis.MPEGMode;
}

function toInt16(f32) {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const v = f32[i] < -1 ? -1 : f32[i] > 1 ? 1 : f32[i];
    out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  return out;
}

// Hands the main thread back to the browser between blocks. A MessageChannel
// task instead of setTimeout(0): timers are throttled to one per second (or
// per MINUTE) in a background tab, which made long encodes look frozen.
const breathe = () =>
  new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => resolve();
    port2.postMessage(0);
  });

/** Same interface as the pooled encoder in mp3Pool.js. */
export function createFallbackEncoder({ sampleRate, channels, kbps, totalSamples = 0, onProgress }) {
  if (!Mp3Encoder) throw new Error("lamejs Mp3Encoder is not loaded correctly. Please check module imports.");
  const enc = new Mp3Encoder(channels, sampleRate, kbps);
  const parts = [];
  let done = 0;
  const BLOCK = 1152 * 48; // ~1.1 s of audio between breaths

  return {
    parallel: false,
    async write(planes) {
      const n = planes[0].length;
      for (let i = 0; i < n; i += BLOCK) {
        const l = toInt16(planes[0].subarray(i, i + BLOCK));
        const buf = channels === 2 ? enc.encodeBuffer(l, toInt16(planes[1].subarray(i, i + BLOCK))) : enc.encodeBuffer(l);
        if (buf.length) parts.push(new Uint8Array(buf));
        done += l.length;
        if (onProgress && totalSamples) onProgress(Math.min(0.99, done / totalSamples));
        await breathe();
      }
    },
    async finish() {
      const tail = enc.flush();
      if (tail.length) parts.push(new Uint8Array(tail));
      return new Blob(parts, { type: "audio/mpeg" });
    },
    abort() {},
  };
}
