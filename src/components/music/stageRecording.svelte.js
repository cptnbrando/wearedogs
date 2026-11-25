/**
 * stageRecording.svelte.js
 * The full-screen player's record button, and the shape of its picture.
 *
 * A take starts the song over and records the visualizer with the lyric line
 * and the sound (lib/visualizer/stageRecorder.js) until the song ends, is
 * paused, or the listener presses stop. The video is then saved to the
 * device. Nothing is uploaded.
 *
 * The picture's shape (the whole screen, tall, square or wide) is the shape
 * of the video: MusicPanel sizes the visualizer's frame from `frame`.
 */

import { audioCore } from "../../lib/AudioCore.svelte.js";
import { lyrics, LYRIC_FONTS, LYRIC_SIZES } from "../../lib/lyrics.svelte.js";
import { drawLyricLine } from "../../lib/lyricCanvas.js";
import { StageRecorder, recordingFormat } from "../../lib/visualizer/stageRecorder.js";

/** The shapes the stage's picture can take, in the order the button cycles them. */
export const STAGE_FRAMES = [
  { id: "full", name: "Whole screen" },
  { id: "tall", name: "Tall, 9:16" },
  { id: "square", name: "Square" },
  { id: "wide", name: "Wide, 16:9" },
];
/** A take is drawn sharp enough that the video's short side is at least this many pixels. */
const VIDEO_SHORT_SIDE_PX = 1080;
/** ...but never more than this many drawing pixels per page pixel: phones would crawl. */
const MAX_VIDEO_PIXEL_RATIO = 3;
/** Below this the sound would have to be turned up too far to be worth recording. */
const MIN_VOLUME = 0.2;
const TICK_MS = 500;
const MS_PER_SECOND = 1000;
/** The song jumped back this far: it started again (repeat), so the take is over. */
const RESTART_JUMP_S = 2;
/** How long the saved file's address stays alive for the browser to finish saving it. */
const SAVE_REVOKE_MS = 60000;
const UNSAFE_FILENAME_CHARS = /[\\/:*?"<>|]+/g;
const QUIET_NOTE = "Turn the volume up first: the video's sound is made from what the player plays.";
const EMPTY_NOTE = "That take came out empty. Try once more.";

class StageRecording {
  /** False where the browser cannot record a canvas. */
  supported = recordingFormat() !== null;
  /** One of STAGE_FRAMES' ids. */
  frame = $state(STAGE_FRAMES[0].id);
  active = $state(false);
  /** How long the take has run, in whole seconds. */
  seconds = $state(0);
  /** Something the listener should know (too quiet to record), or "". */
  note = $state("");

  #recorder = null;
  #engine = null;
  #track = null;
  #startedAt = 0;
  #lastTime = 0;
  #timer = null;

  /** Moves the picture to its next shape. Not during a take: the video keeps one size. */
  nextFrame() {
    if (this.active) return;
    const at = STAGE_FRAMES.findIndex((entry) => entry.id === this.frame);
    this.frame = STAGE_FRAMES[(at + 1) % STAGE_FRAMES.length].id;
  }

  /**
   * Starts a take of the song from its beginning.
   * @param {object | null} engine - the MilkdropEngine on screen
   * @param {{ id: string, title: string, artist?: string }} track - the song playing
   */
  start(engine, track) {
    if (this.active || !this.supported || !engine || !engine.canvas || !audioCore.analyser || !track) return;
    const volume = audioCore.isMuted ? 0 : audioCore.volume;
    if (volume < MIN_VOLUME) {
      this.note = QUIET_NOTE;
      return;
    }
    this.note = "";
    this.#engine = engine;
    this.#track = track;
    // The visualizer draws finer for the take than the screen needs
    const shortSide = Math.min(engine.canvas.clientWidth, engine.canvas.clientHeight) || VIDEO_SHORT_SIDE_PX;
    engine.pixelRatio = Math.min(MAX_VIDEO_PIXEL_RATIO, Math.max(window.devicePixelRatio || 1, VIDEO_SHORT_SIDE_PX / shortSide));
    engine.resize();
    this.#recorder = new StageRecorder({
      source: engine.canvas,
      audioCtx: audioCore.audioCtx,
      audioNode: audioCore.analyser,
      // The player turns the song down twice (the element, then the mix): undo both
      audioGain: 1 / (volume * volume),
      drawOverlay: (ctx, width, height) => this.#drawLyrics(ctx, width, height),
    });
    audioCore.play(0);
    this.#recorder.start();
    engine.onFrame = () => this.#recorder.drawFrame();
    this.active = true;
    this.seconds = 0;
    this.#lastTime = 0;
    this.#startedAt = Date.now();
    this.#timer = setInterval(() => this.#tick(), TICK_MS);
  }

  #drawLyrics(ctx, width, height) {
    if (!lyrics.shown || !lyrics.current || lyrics.trackId !== this.#track.id) return;
    drawLyricLine(ctx, width, height, {
      lines: lyrics.current.lines,
      seconds: audioCore.primaryAudio().currentTime,
      place: lyrics.place,
      fontStack: LYRIC_FONTS.find((font) => font.id === lyrics.font).stack,
      scale: LYRIC_SIZES.find((size) => size.id === lyrics.size).scale,
      ratio: width / (this.#engine.canvas.clientWidth || width),
    });
  }

  /** The take is over when the song ends, is paused, starts again, or another one comes on. */
  #tick() {
    this.seconds = Math.floor((Date.now() - this.#startedAt) / MS_PER_SECOND);
    const current = audioCore.library[audioCore.currentTrackIndex];
    const time = audioCore.primaryAudio().currentTime;
    const restarted = time < this.#lastTime - RESTART_JUMP_S;
    this.#lastTime = time;
    if (!audioCore.isPlaying || restarted || !current || current.id !== this.#track.id) this.stop();
  }

  /** Ends the take and saves the video. Safe to call when no take is running. */
  async stop() {
    if (!this.active) return;
    this.active = false;
    clearInterval(this.#timer);
    const recorder = this.#recorder;
    const track = this.#track;
    if (this.#engine) {
      this.#engine.onFrame = null;
      this.#engine.pixelRatio = 0;
    }
    this.#recorder = null;
    this.#engine = null;
    const video = await recorder.stop();
    if (!video) {
      this.note = EMPTY_NOTE;
      return;
    }
    const name = `${track.title}${track.artist ? ` - ${track.artist}` : ""} (lyric video)`.replace(UNSAFE_FILENAME_CHARS, " ");
    const url = URL.createObjectURL(video);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.${recorder.format.extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), SAVE_REVOKE_MS);
  }
}

export const stageRecording = new StageRecording();
