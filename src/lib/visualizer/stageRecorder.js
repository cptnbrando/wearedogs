/**
 * stageRecorder.js
 * Records the visualizer, the lyric line and the song into one video file,
 * in the browser: nothing is uploaded.
 *
 * Each frame the visualizer has just drawn is copied onto a second canvas,
 * the lyric line is drawn over it (lib/lyricCanvas.js), and that canvas and
 * the player's sound are fed to the browser's own recorder. The video is as
 * large as the visualizer is on screen, so a tall frame gives a tall video.
 *
 * MP4 where the browser can write one (video editors and phones take it
 * anywhere), WebM otherwise.
 */

const FRAME_RATE = 30;
const VIDEO_BITS_PER_SECOND = 12000000;
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
 * @returns {{ type: string, extension: string } | null} the video format this browser records, or null when it cannot record a canvas at all
 */
export function recordingFormat() {
  if (typeof MediaRecorder === "undefined" || typeof HTMLCanvasElement.prototype.captureStream !== "function") return null;
  return FORMATS.find((format) => MediaRecorder.isTypeSupported(format.type)) || null;
}

export class StageRecorder {
  /**
   * @param {{
   *   source: HTMLCanvasElement,
   *   audioCtx: AudioContext,
   *   audioNode: AudioNode,
   *   audioGain: number,
   *   drawOverlay: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
   * }} parts - source: the visualizer's canvas; audioNode: where the song is tapped;
   *   audioGain: how much to turn the tap up so the video is at full level whatever the listener's volume
   */
  constructor(parts) {
    this.parts = parts;
    this.format = recordingFormat();
    this.frame = document.createElement("canvas");
    this.ctx = this.frame.getContext("2d");
    this.chunks = [];
    this.recorder = null;
    this.tap = null;
    this.sound = null;
  }

  /** Starts recording. Call drawFrame() after every frame the visualizer draws. */
  start() {
    const { source, audioCtx, audioNode, audioGain } = this.parts;
    this.frame.width = source.width;
    this.frame.height = source.height;
    this.drawFrame();
    this.tap = audioCtx.createGain();
    this.tap.gain.value = audioGain;
    this.sound = audioCtx.createMediaStreamDestination();
    audioNode.connect(this.tap);
    this.tap.connect(this.sound);
    const stream = this.frame.captureStream(FRAME_RATE);
    this.sound.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
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

  /** Copies the visualizer's newest frame and draws the lyric line over it. */
  drawFrame() {
    const { source, drawOverlay } = this.parts;
    // The visualizer was resized (the window, or the frame's shape): the video keeps its first size
    this.ctx.drawImage(source, 0, 0, this.frame.width, this.frame.height);
    drawOverlay(this.ctx, this.frame.width, this.frame.height);
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
        try {
          this.parts.audioNode.disconnect(this.tap);
        } catch {
          // The audio graph was rebuilt under the tap: nothing left to undo
        }
        recorder.stream.getTracks().forEach((track) => track.stop());
        resolve(this.chunks.length ? new Blob(this.chunks, { type: this.format.type.split(";")[0] }) : null);
      };
      recorder.stop();
    });
  }
}
