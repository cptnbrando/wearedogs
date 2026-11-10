/**
 * Scrubber worker: runs the WebAssembly scrubber off the main thread, so the
 * page stays responsive while a recording is analysed or rewritten.
 *
 * Messages in:  { id, rewrite, channels, sampleRate, keepSteadyTones }
 * Messages out: { id, progress } while rewriting, then { id, result } or { id, error }
 */
import { createScrubber } from "scrubber-js";
import wasmUrl from "scrubber-js/scrubber.wasm?url";

let scrubber = null;

/** Looks for long tones and grid hum. Changes nothing. */
function inspect(engine, { channels, sampleRate }) {
  return { report: engine.check(channels, sampleRate), hum: engine.detectHum(channels, sampleRate) };
}

/** Rewrites the audio, then looks for grid hum again so the page can show it is gone. */
function rewrite(engine, { id, channels, sampleRate, keepSteadyTones }) {
  const { channels: cleaned, report } = engine.scrub(channels, sampleRate, {
    config: { keepSteadyTones },
    onProgress: (progress) => self.postMessage({ id, progress }),
  });
  return { channels: cleaned, report, hum: engine.detectHum(cleaned, sampleRate) };
}

self.onmessage = async ({ data }) => {
  try {
    scrubber = scrubber || (await createScrubber(wasmUrl));
    const result = data.rewrite ? rewrite(scrubber, data) : inspect(scrubber, data);
    // Hand the cleaned samples back without copying them
    self.postMessage({ id: data.id, result }, (result.channels || []).map((channel) => channel.buffer));
  } catch (error) {
    self.postMessage({ id: data.id, error: String((error && error.message) || error) });
  }
};
