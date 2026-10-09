/**
 * Turns an MP3 blob into the bar heights drawn on the player's waveform.
 * Pure decoration: every failure resolves to null and never touches playback.
 * Kept out of AudioCore.svelte.js to hold that file under the line limit.
 */

const BAR_COUNT = 60;
// Bar heights are percentages: never shorter than MIN_BAR, the loudest bar
// reaches BAR_FLOOR + BAR_RANGE
const MIN_BAR = 10;
const BAR_FLOOR = 15;
const BAR_RANGE = 80;

/**
 * Decodes the audio and keeps the loudest sample of each of BAR_COUNT slices.
 * The decode context is always closed again, failures included: browsers cap
 * how many audio contexts a page may hold, and hours of play would otherwise
 * leak one per undecodable song.
 * @param {Blob} blob encoded audio
 * @returns {Promise<number[] | null>} bar heights, or null when it can't be decoded
 */
export async function decodePeaks(blob) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass || !blob || typeof blob.arrayBuffer !== "function") return null;
  let ctx = null;
  try {
    const arrayBuffer = await blob.arrayBuffer();
    ctx = new AudioContextClass();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / BAR_COUNT);
    const peaks = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      let max = 0;
      const end = Math.min((i + 1) * step, channelData.length);
      for (let j = i * step; j < end; j++) {
        const val = Math.abs(channelData[j]);
        if (val > max) max = val;
      }
      peaks.push(max);
    }
    const maxPeak = Math.max.apply(null, peaks) || 1;
    return peaks.map((p) => Math.max(MIN_BAR, Math.round((p / maxPeak) * BAR_RANGE + BAR_FLOOR)));
  } catch (err) {
    console.warn("Failed to decode audio for the waveform:", err);
    return null;
  } finally {
    // Old WebKit's close() returns nothing; newer ones return a promise
    const closing = ctx && typeof ctx.close === "function" ? ctx.close() : null;
    if (closing && typeof closing.catch === "function") closing.catch(() => {});
  }
}
