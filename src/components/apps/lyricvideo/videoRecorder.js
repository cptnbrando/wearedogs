/**
 * videoRecorder.js
 * Records a canvas and a sound into one video file with the browser's own
 * recorder. Nothing is uploaded.
 *
 * MP4 where the browser can write one (video editors and phones take it
 * anywhere), WebM otherwise.
 */

const FRAME_RATE = 30;
/** Enough for MilkDrop's fine detail at 1080p without the file ballooning. */
const VIDEO_BITS_PER_SECOND = 16000000;
const AUDIO_BITS_PER_SECOND = 192000;
/** The recorder hands over what it has this often, so a long take is not one huge chunk. */
const CHUNK_MS = 2000;
/** Tried in order: the first the browser can write is used. */
const FORMATS = [
  { type: 'video/mp4;codecs="avc1.640028,mp4a.40.2"', extension: "mp4" },
  { type: "video/mp4", extension: "mp4" },
  { type: 'video/webm;codecs="vp9,opus"', extension: "webm" },
  { type: 'video/webm;codecs="vp8,opus"', extension: "webm" },
  { type: "video/webm", extension: "webm" },
];

/**
 * @returns {{ type: string, extension: string } | null} the video format this browser records, or null when it cannot record a canvas
 */
export function recordingFormat() {
  if (typeof MediaRecorder === "undefined" || typeof HTMLCanvasElement === "undefined") return null;
  if (typeof HTMLCanvasElement.prototype.captureStream !== "function") return null;
  return FORMATS.find((format) => MediaRecorder.isTypeSupported(format.type)) || null;
}

export class VideoRecorder {
  /**
   * @param {HTMLCanvasElement} canvas - the finished picture, drawn every frame
   * @param {MediaStream} sound - a stream with the sound's track
   */
  constructor(canvas, sound) {
    this.canvas = canvas;
    this.sound = sound;
    this.format = recordingFormat();
    this.chunks = [];
    this.recorder = null;
  }

  start() {
    const stream = this.canvas.captureStream(FRAME_RATE);
    this.sound.getAudioTracks().forEach((track) => stream.addTrack(track));
    this.recorder = new MediaRecorder(stream, {
      mimeType: this.format.type,
      videoBitsPerSecond: VIDEO_BITS_PER_SECOND,
      audioBitsPerSecond: AUDIO_BITS_PER_SECOND,
    });
    this.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size) this.chunks.push(e.data);
    };
    this.recorder.start(CHUNK_MS);
  }

  /**
   * Stops and hands over the video.
   * @returns {Promise<Blob | null>} null when nothing was recorded
   */
  stop() {
    const recorder = this.recorder;
    if (!recorder || recorder.state === "inactive") return Promise.resolve(null);
    return new Promise((resolve) => {
      recorder.onstop = () => {
        // Only the picture's track is ours to end: the sound's stream carries on for the next take
        recorder.stream.getVideoTracks().forEach((track) => track.stop());
        resolve(this.chunks.length ? new Blob(this.chunks, { type: this.format.type.split(";")[0] }) : null);
      };
      recorder.stop();
    });
  }
}
