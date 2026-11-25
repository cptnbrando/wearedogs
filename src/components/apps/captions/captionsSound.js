/**
 * captionsSound.js
 * Gets a file's sound ready for a speech-to-text model: one channel at 16 kHz,
 * cut into pieces at quiet moments, each piece shrunk to a small MP3 with the
 * site's own encoder. Everything here runs on the device.
 */
import { resampleAudioBuffer } from "../../../lib/convert.js";
import { encodeMp3 } from "../../../lib/mp3Pool.js";
import { videoToMp3 } from "../datatrain/shrinkVideo.js";
import { decodeSound } from "./captionsMedia.svelte.js";

/** What Whisper listens at. */
export const SPEECH_RATE = 16000;
/** A piece aims for this long; the cut lands on the quietest moment near it. */
const PIECE_SECONDS = 120;
/** How far either side of that the cut may move to find quiet. The API takes 150 seconds at most. */
const CUT_SEARCH_SECONDS = 20;
/** The loudness of the sound is measured over stretches this long when looking for quiet. */
const QUIET_FRAME_SECONDS = 0.05;
/** Speech survives this well, and a 150-second piece stays near 600 KB. */
const PIECE_KBPS = 32;
const DATA_URL_PREFIX = /^data:[^,]*,/;
const CANNOT_READ = "This browser could not read the sound in that file. Try converting it to MP3 in the Catalytic Converter first.";

/**
 * A file's sound as one channel at SPEECH_RATE.
 * @param {Blob} blob - the audio or video file
 * @param {string} name - its file name
 * @returns {Promise<Float32Array>} throws an Error with a message to show when the sound cannot be read
 */
export async function speechSamples(blob, name) {
  let buffer = await decodeSound(blob);
  if (!buffer) {
    // A video this browser cannot decode whole: its sound is pulled out piece by piece first
    try {
      buffer = await decodeSound(await videoToMp3(new File([blob], name, { type: blob.type })));
    } catch (e) {
      buffer = null;
    }
  }
  if (!buffer) throw new Error(CANNOT_READ);
  const resampled = await resampleAudioBuffer(buffer, SPEECH_RATE);
  const mono = new Float32Array(resampled.length);
  for (let channel = 0; channel < resampled.numberOfChannels; channel++) {
    const data = resampled.getChannelData(channel);
    for (let i = 0; i < mono.length; i++) mono[i] += data[i] / resampled.numberOfChannels;
  }
  return mono;
}

/** The start of the quietest stretch between two sample indexes. */
function quietestPoint(samples, from, to) {
  const frame = Math.round(QUIET_FRAME_SECONDS * SPEECH_RATE);
  let best = from;
  let bestEnergy = Infinity;
  for (let start = from; start + frame <= to; start += frame) {
    let energy = 0;
    for (let i = start; i < start + frame; i++) energy += samples[i] * samples[i];
    if (energy < bestEnergy) {
      bestEnergy = energy;
      best = start;
    }
  }
  return best;
}

/**
 * Where to cut the sound into pieces, each cut on a quiet moment so no word is split.
 * @param {Float32Array} samples - at SPEECH_RATE
 * @returns {{ from: number, to: number }[]} sample indexes; one piece when the sound is short
 */
export function cutPieces(samples) {
  const target = PIECE_SECONDS * SPEECH_RATE;
  const search = CUT_SEARCH_SECONDS * SPEECH_RATE;
  const pieces = [];
  let from = 0;
  while (samples.length - from > target + search) {
    const to = quietestPoint(samples, from + target - search, from + target + search);
    pieces.push({ from, to });
    from = to;
  }
  pieces.push({ from, to: samples.length });
  return pieces;
}

/**
 * One piece as a small MP3, as base64 text for a JSON request.
 * @param {Float32Array} samples - at SPEECH_RATE
 * @returns {Promise<string>}
 */
export async function pieceAsBase64Mp3(samples) {
  // The encoder takes its buffer for itself, so it is given a copy
  const mp3 = await encodeMp3([samples.slice()], SPEECH_RATE, PIECE_KBPS);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(DATA_URL_PREFIX, ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(mp3);
  });
}
