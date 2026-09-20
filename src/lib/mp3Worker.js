/**
 * mp3Worker.js
 * One MP3 segment in, one MP3 segment out — LAME compiled to WebAssembly,
 * about five times faster than the pure-JS port and off the main thread.
 * mp3Pool.js runs a pool of these, one segment of a file on each core.
 */
import { createEncoder } from "wasm-media-encoders/esnext";
import wasmUrl from "wasm-media-encoders/wasm/mp3?url";

let encoder = null;
const ready = createEncoder("audio/mpeg", wasmUrl).then(
  (enc) => {
    encoder = enc;
    self.postMessage({ type: "ready" });
  },
  (err) => self.postMessage({ type: "fatal", error: String(err?.message || err) }),
);

self.onmessage = async (event) => {
  const { id, planes, sampleRate, kbps } = event.data;
  // The PCM goes back with the answer (zero-copy): the pool keeps it until
  // the segment is safely stitched, in case two segments must be re-encoded
  // as one.
  const giveBack = planes.map((p) => p.buffer);
  try {
    await ready;
    if (!encoder) throw new Error("MP3 encoder failed to load");
    // A fresh LAME state per segment. The output rate is pinned to the input
    // rate: left alone, LAME halves it at low bitrates, which would move the
    // frame grid the stitcher relies on.
    encoder.configure({ channels: planes.length, sampleRate, bitrate: kbps, outputSampleRate: sampleRate });

    const parts = [];
    let total = 0;
    const STEP = 1152 * 64;
    const n = planes[0].length;
    for (let i = 0; i < n; i += STEP) {
      const end = Math.min(n, i + STEP);
      // encode() returns a view into WASM memory, valid only until the next call
      const chunk = encoder.encode(planes.map((p) => p.subarray(i, end))).slice();
      parts.push(chunk);
      total += chunk.length;
    }
    const tail = encoder.finalize().slice();
    parts.push(tail);
    total += tail.length;

    const bytes = new Uint8Array(total);
    let at = 0;
    for (const p of parts) {
      bytes.set(p, at);
      at += p.length;
    }
    self.postMessage({ type: "done", id, bytes, planes }, [bytes.buffer, ...giveBack]);
  } catch (err) {
    self.postMessage({ type: "error", id, error: String(err?.message || err), planes }, giveBack);
  }
};
