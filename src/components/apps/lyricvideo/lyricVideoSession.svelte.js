/**
 * lyricVideoSession.svelte.js
 * Everything the Lyric Video app is working on, in one place that outlives
 * the app's window: open Captions to fix a word and come back, and the file,
 * its lyrics, the look and a take that is still recording are all where they
 * were. The file, the lyrics and the settings are also kept in the browser
 * (lyricVideoKeep.js), so a reload brings them back too.
 *
 * A take plays the sound once from `from` to `to` (the end when 0) and
 * records the finished frame and the sound into a video, kept here until it
 * is saved or replaced.
 */

import { CaptionsMedia } from "../captions/captionsMedia.svelte.js";
import { KIND_FILE, KIND_TRACK } from "../captions/captionsStore.js";
import { askCaptionsFor } from "../captions/captionsSongs.js";
import { lyrics as playerLyrics, LYRIC_FONTS, LYRIC_SIZES } from "../../../lib/lyrics.svelte.js";
import { splitLongLines } from "../../../lib/lyricsFormat.js";
import { milkdropSupported } from "../../../lib/visualizer/MilkdropEngine.js";
import { presetDeck } from "../../../lib/visualizer/presetDeck.svelte.js";
import { openDogsPage } from "../../../lib/openDogsPage.js";
import { LyricVideoStage } from "./lyricVideoStage.js";
import { VideoRecorder, recordingFormat } from "./videoRecorder.js";
import { drawLyrics, MODE_WORDS } from "./lyricDraw.js";
import { readKept, keep, readSettings, keepSettings, KEEP_MEDIA, KEEP_LYRICS } from "./lyricVideoKeep.js";
import { newerCaptions, songLyrics, readCaptionFile, seedCaptions, FROM_FILE } from "./lyricVideoLyrics.js";

/** The video's shapes: vertical for phones and stories, horizontal for screens, square for feeds. */
export const SHAPES = [
  { id: "vertical", name: "Vertical", ratio: "9:16", width: 9, height: 16 },
  { id: "horizontal", name: "Horizontal", ratio: "16:9", width: 16, height: 9 },
  { id: "square", name: "Square", ratio: "1:1", width: 1, height: 1 },
];
/** Sharpness: the video's short side in pixels. */
export const QUALITIES = [
  { id: "720", name: "720p", short: 720 },
  { id: "1080", name: "1080p", short: 1080 },
];
/** How long each preset plays before the next, with presets on auto. */
export const AUTO_SECONDS = [10, 20, 30, 60];
/** Where the line sits: quick picks for the position slider. */
export const PLACES = [
  { id: "top", name: "Top", y: 0.14 },
  { id: "middle", name: "Middle", y: 0.5 },
  { id: "bottom", name: "Bottom", y: 0.8 },
];
export const PRESETS_AUTO = "auto";
export const PRESETS_ONE = "one";
const MS_PER_SECOND = 1000;
const TICK_MS = 200;
/** Within this of the end counts as the end: a take never waits on the last few samples. */
const END_SLACK_S = 0.05;
const FIRST_FRAME_TIMEOUT_MS = 4000;
const UNSAFE_FILENAME_CHARS = /[\\/:*?"<>|]+/g;
const EXTENSION = /\.[^.]+$/;
const CAPTIONS_APP = "captions";
export const APP_ID = "lyricvideo";
const DEFAULT_LOOK = { y: 0.8, font: LYRIC_FONTS[0].id, scale: 1, color: "#ffffff", mode: MODE_WORDS, caps: false, shadow: true, shown: true };
const DEFAULT_SETTINGS = {
  shape: SHAPES[0].id,
  quality: QUALITIES[1].id,
  presets: PRESETS_AUTO,
  preset: "",
  autoSeconds: 30,
  hear: true,
};
const NO_VIDEO_HERE = "This browser can't make videos. Try a recent Chrome, Edge, Firefox or Safari.";
const NO_MILKDROP = "This browser can't run the visualizer (it needs WebGL 2).";
const CANNOT_READ_CAPTIONS = "Nothing timed could be read from that file. Captions takes .srt, .vtt, .lrc or Captions' own .json.";
const NOT_KEPT = "Your browser wouldn't keep this file, so it will be gone after a reload.";
const EMPTY_TAKE = "That take came out empty. Try once more, with this tab in front while it records.";
const PULLED = "Lyrics updated from Captions.";

/** First visit: the line looks the way the listener set it for the player (Settings, Lyrics). */
function lookFromPlayer() {
  const place = PLACES.find((entry) => entry.id === playerLyrics.place);
  const size = LYRIC_SIZES.find((entry) => entry.id === playerLyrics.size);
  return { y: place ? place.y : DEFAULT_LOOK.y, font: playerLyrics.font, scale: size ? size.scale : 1 };
}

class LyricVideoSession {
  media = new CaptionsMedia();
  /** @type {import("./lyricVideoLyrics.js").VideoSource | null} */
  source = $state(null);
  /** @type {import("../../../lib/lyricsFormat.js").Lyrics | null} the lyrics as given: for Captions and saving */
  lyrics = $state.raw(null);
  /** @type {import("../../../lib/lyricsFormat.js").LyricLine[]} the same, cut into one-row lines: what is drawn */
  rows = $state.raw([]);
  /** FROM_FILE, FROM_CAPTIONS or FROM_PUBLISHED; "" without lyrics. */
  lyricsFrom = $state("");
  look = $state({ ...DEFAULT_LOOK });
  settings = $state({ ...DEFAULT_SETTINGS });
  /** Where the take starts and ends, in seconds; `to` 0 means the end. */
  from = $state(0);
  to = $state(0);
  recording = $state(false);
  /** 0 to 1: how far through the take. */
  progress = $state(0);
  /** @type {{ url: string, name: string, size: number, blob: Blob } | null} the last take */
  result = $state(null);
  note = $state("");
  error = $state("");
  /** The presets that have loaded, for the picker. */
  presetNames = $state.raw([]);
  presetOn = $state("");
  /** The file and lyrics kept from last time are back (or there were none). */
  ready = $state(false);
  canRecord = recordingFormat() !== null;
  canVisualize = milkdropSupported();

  lyricsAt = 0;
  /** @type {LyricVideoStage | null} */
  stage = null;
  /** @type {VideoRecorder | null} */
  #recorder = null;
  #timer = null;
  #restoring = null;

  constructor() {
    const kept = readSettings();
    if (kept.look && typeof kept.look === "object") this.look = { ...DEFAULT_LOOK, ...kept.look };
    else this.look = { ...DEFAULT_LOOK, ...lookFromPlayer() };
    if (kept.settings && typeof kept.settings === "object") this.settings = { ...DEFAULT_SETTINGS, ...kept.settings };
  }

  /** @returns {{ width: number, height: number }} the video's size in pixels, even numbers (encoders want them) */
  get size() {
    const shape = SHAPES.find((entry) => entry.id === this.settings.shape) || SHAPES[0];
    const quality = QUALITIES.find((entry) => entry.id === this.settings.quality) || QUALITIES[1];
    const unit = quality.short / Math.min(shape.width, shape.height);
    const even = (value) => Math.round(value / 2) * 2;
    return { width: even(shape.width * unit), height: even(shape.height * unit) };
  }

  /** @returns {number} where the take ends */
  get end() {
    return this.to > this.from ? this.to : this.media.duration;
  }

  /** Brings back last time's file and lyrics, once. */
  restore() {
    if (!this.#restoring) this.#restoring = this.#restore();
    return this.#restoring;
  }

  async #restore() {
    const [media, kept] = await Promise.all([readKept(KEEP_MEDIA), readKept(KEEP_LYRICS)]);
    if (media && media.blob && media.source) {
      const opened = await this.media.openBlob(media.blob, media.source.name);
      if (opened) {
        this.source = media.source;
        this.from = media.from || 0;
        this.to = media.to || 0;
      }
    }
    if (this.source && kept && kept.lyrics) this.#setLyrics(kept.lyrics, kept.from, kept.at, false);
    this.ready = true;
    this.pullFromCaptions();
  }

  /** The stage, made on first use: it needs the page's document. */
  #stage() {
    if (this.stage) return this.stage;
    this.stage = new LyricVideoStage((ctx, width, height) => this.#drawOverlay(ctx, width, height), {
      onPreset: (name) => (this.presetOn = name),
      onNames: (names) => (this.presetNames = names),
    });
    return this.stage;
  }

  /** @returns {HTMLCanvasElement} the finished frame, to put on the page */
  canvas() {
    return this.#stage().output;
  }

  /** The app is on screen with a file open: the visualizer runs. */
  show() {
    if (!this.media.el || !this.canVisualize) return;
    const stage = this.#stage();
    const { width, height } = this.size;
    stage.setSize(width, height);
    stage.connect(this.media.el);
    stage.hear(this.settings.hear || !this.recording);
    stage.start((engine) => this.#setUpEngine(engine));
  }

  /** The app was left: the visualizer stops, unless a take is recording. Playing sound pauses. */
  hide() {
    if (this.recording) return;
    this.media.pause();
    if (this.stage) this.stage.stop();
  }

  #setUpEngine(engine) {
    const { presets, preset, autoSeconds } = this.settings;
    engine.resume = preset || presetDeck.current;
    this.#applyDeck(engine);
    engine.autoMs = autoSeconds * MS_PER_SECOND;
    engine.auto = presets === PRESETS_AUTO;
  }

  /** The player's preset choices, shared with it both ways: hearts, presets turned down, favourites only, shuffle. */
  #applyDeck(engine) {
    engine.shuffle = presetDeck.shuffle;
    engine.setHidden(presetDeck.disliked);
    engine.setPool(presetDeck.favoritesOnly ? presetDeck.favorites : null);
  }

  /** Hearts the preset on screen, or takes the heart back. The player's list is the same list. */
  likePreset() {
    if (!this.presetOn) return;
    presetDeck.toggleFavorite(this.presetOn);
    if (this.stage && this.stage.engine) this.#applyDeck(this.stage.engine);
  }

  /** Turns the preset on screen down (the show moves on and never comes back to it), or lets it back in. */
  dislikePreset() {
    const engine = this.stage && this.stage.engine;
    if (!this.presetOn || !engine) return;
    const turningDown = !presetDeck.isDisliked(this.presetOn);
    presetDeck.toggleDislike(this.presetOn);
    this.#applyDeck(engine);
    if (turningDown) this.stepPreset("next");
  }

  /** @param {boolean} on - only the hearted presets, here and in the player */
  setFavoritesOnly(on) {
    presetDeck.setFavoritesOnly(on);
    if (this.stage && this.stage.engine) this.#applyDeck(this.stage.engine);
  }

  #drawOverlay(ctx, width, height) {
    if (!this.look.shown || !this.rows.length) return;
    const font = LYRIC_FONTS.find((entry) => entry.id === this.look.font) || LYRIC_FONTS[0];
    const look = { ...this.look, fontStack: font.stack };
    drawLyrics(ctx, width, height, this.rows, this.media.now(), look, !this.media.playing && !this.recording);
  }

  #saveSettings() {
    keepSettings({ look: this.look, settings: this.settings });
  }

  /** @param {Partial<typeof DEFAULT_LOOK>} patch */
  setLook(patch) {
    this.look = { ...this.look, ...patch };
    this.#saveSettings();
  }

  /** @param {Partial<typeof DEFAULT_SETTINGS>} patch */
  setSettings(patch) {
    this.settings = { ...this.settings, ...patch };
    this.#saveSettings();
    const engine = this.stage && this.stage.engine;
    if (this.stage) {
      const { width, height } = this.size;
      this.stage.setSize(width, height);
      this.stage.hear(this.settings.hear || !this.recording);
    }
    if (!engine) return;
    engine.autoMs = this.settings.autoSeconds * MS_PER_SECOND;
    engine.setAuto(this.settings.presets === PRESETS_AUTO);
    if ("preset" in patch && patch.preset) engine.loadPreset(patch.preset);
  }

  /** The visualizer's next or previous preset, or a random one. @param {"next" | "previous" | "random"} step */
  stepPreset(step) {
    const engine = this.stage && this.stage.engine;
    if (!engine) return;
    if (step === "random") engine.random();
    else engine[step]();
    this.setSettings({ preset: engine.current });
  }

  /** @param {number} from @param {number} to - 0 for the end */
  setRange(from, to) {
    this.from = Math.max(0, from);
    this.to = to > this.from ? to : 0;
    if (this.source) this.#keepMedia();
  }

  #keepMedia() {
    return keep(KEEP_MEDIA, { blob: this.media.blob, source: $state.snapshot(this.source), from: this.from, to: this.to });
  }

  /**
   * @param {import("../../../lib/lyricsFormat.js").Lyrics | null} lyrics
   * @param {string} from
   * @param {number} at - when they last changed
   * @param {boolean} [store]
   */
  #setLyrics(lyrics, from, at, store = true) {
    this.lyrics = lyrics;
    this.rows = lyrics ? splitLongLines(lyrics).lines : [];
    this.lyricsFrom = lyrics ? from : "";
    this.lyricsAt = at;
    if (store) keep(KEEP_LYRICS, lyrics ? { lyrics, from, at } : null);
  }

  /** Lets go of the file, its lyrics and the last take. */
  clear() {
    if (this.recording) return;
    this.media.close();
    if (this.stage) this.stage.stop();
    this.source = null;
    this.from = 0;
    this.to = 0;
    this.#setLyrics(null, "", 0);
    this.#dropResult();
    this.note = "";
    this.error = "";
    keep(KEEP_MEDIA, null);
  }

  /**
   * @param {Blob} blob
   * @param {import("./lyricVideoLyrics.js").VideoSource} source
   * @returns {Promise<boolean>}
   */
  async #open(blob, source) {
    if (this.recording) return false;
    this.clear();
    if (!(await this.media.openBlob(blob, source.name))) return false;
    this.source = source;
    this.note = (await this.#keepMedia()) ? "" : NOT_KEPT;
    return true;
  }

  /** Any audio file, or a video whose sound is used. @param {File} file */
  async openFile(file) {
    if (!(await this.#open(file, { kind: KIND_FILE, name: file.name, trackId: "" }))) return;
    this.pullFromCaptions();
  }

  /** A song from the music player (the owner's). @param {{ id: string, title: string, src?: string, instrumental?: string }} track */
  async openTrack(track) {
    if (this.recording) return;
    this.clear();
    this.media.loading = true;
    let blob = null;
    try {
      const response = await fetch(track.src || track.instrumental);
      if (response.ok) blob = await response.blob();
    } catch (e) {
      blob = null;
    }
    this.media.loading = false;
    if (!blob) {
      this.media.error = "Could not load that song's audio. Check the connection and try again.";
      return;
    }
    const source = { kind: KIND_TRACK, name: track.title, trackId: track.id };
    if (!(await this.#open(blob, source))) return;
    if (this.pullFromCaptions()) return;
    const found = await songLyrics(track.id);
    if (found && this.source && this.source.trackId === track.id) this.#setLyrics(found.lyrics, found.from, found.at);
  }

  /** A caption file's words become the lyrics. @param {File} file */
  async importCaptions(file) {
    const lyrics = await readCaptionFile(file);
    if (!lyrics) {
      this.error = CANNOT_READ_CAPTIONS;
      return;
    }
    this.error = "";
    this.#setLyrics(lyrics, FROM_FILE, Date.now());
  }

  removeLyrics() {
    this.#setLyrics(null, "", Date.now());
  }

  /** @returns {boolean} true when Captions had newer words for this file, now taken */
  pullFromCaptions() {
    if (!this.source) return false;
    const found = newerCaptions(this.source, this.lyricsAt);
    if (!found) return false;
    this.#setLyrics(found.lyrics, found.from, found.at);
    this.note = PULLED;
    return true;
  }

  /** Opens this file in Captions to edit its words; Captions offers the way back. */
  editInCaptions() {
    if (!this.source || this.recording) return;
    seedCaptions(this.source, this.lyrics, this.lyricsAt);
    this.media.pause();
    if (this.source.kind === KIND_TRACK) askCaptionsFor(this.source.trackId, APP_ID);
    else askCaptionsFor("", APP_ID, { blob: this.media.blob, name: this.source.name });
    openDogsPage({ app: CAPTIONS_APP, force: true });
  }

  /** Starts a take: the sound from `from` to the end (or `to`), recorded with the picture. */
  async startTake() {
    if (this.recording || !this.canRecord || !this.media.el || !this.stage || !this.stage.engine) return;
    const stage = this.stage;
    const el = this.media.el;
    stage.wake();
    this.#dropResult();
    this.error = "";
    this.recording = true;
    this.progress = 0;
    stage.hear(this.settings.hear);
    if (this.settings.presets === PRESETS_ONE && this.settings.preset) stage.engine.loadPreset(this.settings.preset, 0);
    this.media.pause();
    this.media.seek(this.from);
    const playing = new Promise((resolve) => {
      el.addEventListener("playing", resolve, { once: true });
      setTimeout(resolve, FIRST_FRAME_TIMEOUT_MS);
    });
    this.media.play();
    await playing;
    if (!this.recording) return;
    this.#recorder = new VideoRecorder(stage.output, stage.record.stream);
    this.#recorder.start();
    this.#timer = setInterval(() => this.#tick(), TICK_MS);
  }

  /** The take is over at its end, when the sound ends, or when it is paused. */
  #tick() {
    const end = this.end;
    const now = this.media.now();
    this.progress = end > this.from ? Math.min(1, (now - this.from) / (end - this.from)) : 0;
    if (now >= end - END_SLACK_S || !this.media.playing) this.stopTake();
  }

  /** Ends the take and keeps the video. Safe to call when no take is running. */
  async stopTake() {
    if (!this.recording) return;
    this.recording = false;
    clearInterval(this.#timer);
    this.media.pause();
    if (this.stage) this.stage.hear(true);
    const recorder = this.#recorder;
    this.#recorder = null;
    const video = recorder ? await recorder.stop() : null;
    if (!video) {
      this.error = EMPTY_TAKE;
      return;
    }
    const base = (this.source ? this.source.name.replace(EXTENSION, "") : "lyric video").replace(UNSAFE_FILENAME_CHARS, " ").trim();
    this.result = { url: URL.createObjectURL(video), name: `${base} (lyric video).${recorder.format.extension}`, size: video.size, blob: video };
  }

  #dropResult() {
    if (this.result) URL.revokeObjectURL(this.result.url);
    this.result = null;
  }

  /** Why nothing can be made here, or "". */
  get unsupported() {
    if (!this.canVisualize) return NO_MILKDROP;
    return this.canRecord ? "" : NO_VIDEO_HERE;
  }
}

export const session = new LyricVideoSession();
