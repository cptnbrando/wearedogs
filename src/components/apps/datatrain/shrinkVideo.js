/**
 * Air Train: a big video sent as its sound only.
 *
 * A phone video is often more than the connection will carry in reasonable
 * time, and what is wanted on the other device is usually the audio. This
 * turns a video into an MP3 on the device, before anything is sent, with the
 * Catalytic Converter's own engine (src/lib/mp4Audio.js and convert.js):
 * MP4-family files (mp4, mov, m4v) are read a piece at a time, so their size
 * does not matter; anything else, and an MP4 laid out in a way that reader
 * cannot follow, is decoded in memory and has a size limit.
 *
 * Re-encoding the picture to a smaller video is not offered: in a browser it
 * runs at playback speed at best, so a ten-minute video takes ten minutes.
 */
import { fileSource, isMp4Family, convertMp4Audio } from "../../../lib/mp4Audio.js";
import { convertAudio } from "../../../lib/convert.js";

/** A video over this is offered as an MP3 instead. */
export const BIG_VIDEO_BYTES = 20 * 1024 * 1024;
/** Plenty for speech and music from a phone, at about 1.4 MB a minute. */
const MP3_KBPS = 192;
/** The most a video may weigh to be decoded in memory. */
const DECODE_MAX_BYTES = 150 * 1024 * 1024;
const MP3_MIME = "audio/mpeg";
const MP3_EXTENSION = ".mp3";
const PERCENT = 100;
const VIDEO_PREFIX = "video/";
const VIDEO_EXTENSIONS = /\.(mp4|mov|m4v|webm|mkv|avi)$/i;
/** What the piece-by-piece reader says when a file is one it cannot follow (mp4Audio.js). */
const READER_DECLINED = ["UnsupportedAudioCodec", "NoWebCodecs", "FragmentedMp4", "AacNotAdtsCompatible"];
const TOO_BIG_TO_DECODE = "This video is laid out in a way that needs it all in memory, and it is too big for that. Try a shorter clip.";
const NO_DECODER = "This browser cannot read the sound in that video.";

/** @param {File} file */
export function isBigVideo(file) {
  const isVideo = (file.type || "").indexOf(VIDEO_PREFIX) === 0 || VIDEO_EXTENSIONS.test(file.name || "");
  return isVideo && file.size > BIG_VIDEO_BYTES;
}

/** "holiday.final.mov" -> "holiday.final.mp3" */
function mp3Name(name) {
  const base = String(name || "video").replace(/\.[^.]+$/, "");
  return (base || "video") + MP3_EXTENSION;
}

/**
 * Decodes the whole file's sound in memory, then encodes it.
 * @param {File} file
 * @param {(percent: number) => void} onProgress
 * @returns {Promise<Blob>}
 */
async function decodeInMemory(file, onProgress) {
  if (file.size > DECODE_MAX_BYTES) throw new Error(TOO_BIG_TO_DECODE);
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) throw new Error(NO_DECODER);
  const context = new AudioCtx();
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    return await convertAudio(file, buffer, "mp3", "keep", MP3_KBPS, (fraction) => onProgress(Math.round(fraction * PERCENT)));
  } finally {
    if (context.close) context.close();
  }
}

/**
 * The sound of a video as an MP3 file.
 * @param {File} file
 * @param {(percent: number) => void} [onProgress] - 0 to 100
 * @returns {Promise<File>}
 */
export async function videoToMp3(file, onProgress = () => {}) {
  const source = fileSource(file);
  let blob = null;
  if (await isMp4Family(source)) {
    try {
      blob = await convertMp4Audio(source, { format: "mp3", kbps: MP3_KBPS, onProgress });
    } catch (error) {
      // A layout or codec that reader cannot follow: the in-memory decoder has a go
      if (READER_DECLINED.indexOf(error && error.name) === -1) throw error;
    }
  }
  if (!blob) blob = await decodeInMemory(file, onProgress);
  onProgress(PERCENT);
  return new File([blob], mp3Name(file.name), { type: MP3_MIME });
}
