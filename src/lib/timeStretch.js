/**
 * WSOLA time-stretch: changes an AudioBuffer's length without changing its pitch.
 * Used by the soundboard's "keep pitch" mode so speed and pitch knobs act independently.
 */

const FRAME_SECONDS = 0.025; // analysis window length
const SEARCH_DECIMATION = 4; // coarse similarity search reads every Nth sample
const SEARCH_COARSE_STEP = 4; // coarse candidate spacing, refined afterwards
const UNITY_TOLERANCE = 0.01; // stretch factors this close to 1 are skipped

/**
 * Mixes every channel to mono so frame alignment is chosen once for all channels.
 * @param {AudioBuffer} buffer
 * @returns {Float32Array}
 */
function mixToMono(buffer) {
  const mono = new Float32Array(buffer.length);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) mono[i] += data[i] / buffer.numberOfChannels;
  }
  return mono;
}

/**
 * Cross-correlation of two equal-length windows of `signal`.
 * @param {Float32Array} signal
 * @param {number} a - start of the first window
 * @param {number} b - start of the second window
 * @param {number} length
 * @param {number} step - sample stride
 * @returns {number}
 */
function similarity(signal, a, b, length, step) {
  let sum = 0;
  for (let i = 0; i < length; i += step) sum += signal[a + i] * signal[b + i];
  return sum;
}

/**
 * Finds the input frame start near `nominal` that best continues the previous frame.
 * @param {Float32Array} mono
 * @param {number} natural - where the previous frame's continuation begins
 * @param {number} nominal - ideal frame start for this output position
 * @param {number} radius - search tolerance either side of nominal
 * @param {number} overlap - samples compared
 * @returns {number}
 */
function bestFrameStart(mono, natural, nominal, radius, overlap) {
  const last = mono.length - overlap;
  const lo = Math.max(0, nominal - radius);
  const hi = Math.min(last, nominal + radius);
  if (hi <= lo || natural > last) return Math.max(0, Math.min(nominal, last));

  let best = lo;
  let bestScore = -Infinity;
  for (let x = lo; x <= hi; x += SEARCH_COARSE_STEP) {
    const score = similarity(mono, natural, x, overlap, SEARCH_DECIMATION);
    if (score > bestScore) { bestScore = score; best = x; }
  }
  const refineLo = Math.max(lo, best - SEARCH_COARSE_STEP);
  const refineHi = Math.min(hi, best + SEARCH_COARSE_STEP);
  for (let x = refineLo; x <= refineHi; x++) {
    const score = similarity(mono, natural, x, overlap, 1);
    if (score > bestScore) { bestScore = score; best = x; }
  }
  return best;
}

/**
 * Returns a copy of `buffer` that lasts `factor` times as long at the same pitch.
 * @param {BaseAudioContext} ctx - used to allocate the output buffer
 * @param {AudioBuffer} buffer
 * @param {number} factor - output duration / input duration (2 = twice as long)
 * @returns {AudioBuffer}
 */
export function timeStretch(ctx, buffer, factor) {
  if (Math.abs(factor - 1) < UNITY_TOLERANCE) return buffer;

  const frame = 2 * Math.round((buffer.sampleRate * FRAME_SECONDS) / 2);
  const synthHop = frame / 2;
  const analysisHop = synthHop / factor;
  const radius = Math.round(synthHop / 2);
  const outLength = Math.max(1, Math.ceil(buffer.length * factor));
  if (buffer.length <= frame * 2) return buffer;

  const window = new Float32Array(frame);
  for (let i = 0; i < frame; i++) window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / frame);

  const mono = mixToMono(buffer);
  const channels = buffer.numberOfChannels;
  const inputs = [];
  const outputs = [];
  for (let c = 0; c < channels; c++) {
    inputs.push(buffer.getChannelData(c));
    outputs.push(new Float32Array(outLength + frame));
  }

  let prevStart = 0;
  for (let outPos = 0, k = 0; outPos < outLength; outPos += synthHop, k++) {
    const nominal = Math.round(k * analysisHop);
    const start = k === 0 ? 0 : bestFrameStart(mono, prevStart + synthHop, nominal, radius, synthHop);
    for (let c = 0; c < channels; c++) {
      const src = inputs[c];
      const dst = outputs[c];
      const n = Math.min(frame, src.length - start);
      for (let i = 0; i < n; i++) dst[outPos + i] += src[start + i] * window[i];
    }
    prevStart = start;
  }

  const result = ctx.createBuffer(channels, outLength, buffer.sampleRate);
  for (let c = 0; c < channels; c++) result.getChannelData(c).set(outputs[c].subarray(0, outLength));
  return result;
}
