/**
 * lyrics.svelte.js
 * The lyrics the music player shows for the song that is playing, and how the
 * listener likes to see them.
 *
 * A song's lyrics come from one of two places:
 *  - this device: lyrics made or imported in the Captions app and kept in
 *    localStorage. They win, so the owner can try a take before publishing it.
 *  - the API Worker's /lyrics route (workers/api/src/routes/lyrics.js): what
 *    the owner published, for everybody.
 *
 * Requests are kept few: the list of songs that have lyrics is asked for once
 * every LIST_FRESH_MS at most, a song's lyrics are asked for only when that
 * song is in the list, and each answer is kept in localStorage until the list
 * says it changed.
 */

import { callApi } from "./dogsApi.js";
import { cleanLyrics, splitLongLines } from "./lyricsFormat.js";

const LIST_KEY = "lyrics_list_v1";
const LOCAL_PREFIX = "lyrics_local_v1:";
const CACHE_PREFIX = "lyrics_cache_v1:";
const CACHE_ORDER_KEY = "lyrics_cache_order_v1";
const PREFS_KEY = "lyrics_prefs_v1";
const LIST_FRESH_MS = 10 * 60 * 1000;
/** How many published songs' lyrics this browser keeps; the oldest goes first. */
const MAX_CACHED = 40;
const SOURCE_LOCAL = "local";
const SOURCE_PUBLISHED = "published";

/** Where the line sits on the full-screen visualizer. */
export const LYRIC_PLACES = ["top", "middle", "bottom"];
/** Fonts every device already has: nothing is downloaded for these. */
export const LYRIC_FONTS = [
  { id: "site", name: "DOGS", stack: "inherit" },
  { id: "block", name: "Block", stack: "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Franklin Gothic Bold', sans-serif" },
  { id: "mono", name: "Mono", stack: "ui-monospace, 'Cascadia Mono', Consolas, 'Courier New', monospace" },
  { id: "serif", name: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  { id: "round", name: "Round", stack: "ui-rounded, 'Arial Rounded MT Bold', 'Varela Round', 'Trebuchet MS', sans-serif" },
  { id: "hand", name: "Hand", stack: "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive" },
];
export const LYRIC_SIZES = [
  { id: "s", name: "Small", scale: 0.75 },
  { id: "m", name: "Medium", scale: 1 },
  { id: "l", name: "Large", scale: 1.4 },
];
const DEFAULT_PREFS = { shown: true, place: "bottom", font: "site", size: "m" };

/** @returns {any} the stored value, or null when missing, unreadable or storage is blocked */
function readStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

/** @returns {boolean} false when storage is blocked or full */
function writeStored(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

class LyricsStore {
  /** The lyrics button: whether the line shows at all. */
  shown = $state(DEFAULT_PREFS.shown);
  /** One of LYRIC_PLACES. */
  place = $state(DEFAULT_PREFS.place);
  /** An id from LYRIC_FONTS. */
  font = $state(DEFAULT_PREFS.font);
  /** An id from LYRIC_SIZES. */
  size = $state(DEFAULT_PREFS.size);
  /** The song the lyrics below belong to. */
  trackId = $state(null);
  /** That song's lyrics cut into one-row lines, or null when it has none (yet). */
  current = $state.raw(null);
  /** "local", "published" or "": where `current` came from. */
  source = $state("");
  /** Track id → when its published lyrics were last saved. */
  published = $state.raw({});
  /** Track ids with lyrics kept on this device. */
  localIds = $state.raw([]);

  #listAt = 0;
  #listRequest = null;

  constructor() {
    const prefs = readStored(PREFS_KEY) || {};
    if (typeof prefs.shown === "boolean") this.shown = prefs.shown;
    if (LYRIC_PLACES.includes(prefs.place)) this.place = prefs.place;
    if (LYRIC_FONTS.some((font) => font.id === prefs.font)) this.font = prefs.font;
    if (LYRIC_SIZES.some((size) => size.id === prefs.size)) this.size = prefs.size;
    const list = readStored(LIST_KEY);
    if (list && list.ids && typeof list.ids === "object") {
      this.published = list.ids;
      this.#listAt = Number(list.at) || 0;
    }
    this.#readLocalIds();
  }

  #readLocalIds() {
    const ids = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        if (key.indexOf(LOCAL_PREFIX) === 0) ids.push(key.slice(LOCAL_PREFIX.length));
      }
    } catch {
      // Storage blocked: nothing is kept on this device
    }
    this.localIds = ids;
  }

  /**
   * Remembers how the listener wants the line shown.
   * @param {{ shown?: boolean, place?: string, font?: string, size?: string }} patch
   */
  setPrefs(patch) {
    if (typeof patch.shown === "boolean") this.shown = patch.shown;
    if (LYRIC_PLACES.includes(patch.place)) this.place = patch.place;
    if (LYRIC_FONTS.some((font) => font.id === patch.font)) this.font = patch.font;
    if (LYRIC_SIZES.some((size) => size.id === patch.size)) this.size = patch.size;
    writeStored(PREFS_KEY, { shown: this.shown, place: this.place, font: this.font, size: this.size });
  }

  /** @param {string} trackId @returns {boolean} whether that song has lyrics to show */
  has(trackId) {
    return !!this.published[trackId] || this.localIds.includes(trackId);
  }

  /**
   * Asks which songs have published lyrics, unless the last answer is fresh.
   * Safe to call whenever the player opens.
   * @param {boolean} [force] - ask even so (the owner's Admin app, which must see the truth)
   */
  async refreshList(force = false) {
    if (this.#listRequest || (!force && Date.now() - this.#listAt < LIST_FRESH_MS)) return;
    this.#listRequest = callApi("GET", "/lyrics");
    const answer = await this.#listRequest;
    this.#listRequest = null;
    // An error still counts as an answer: wait before asking again
    this.#listAt = Date.now();
    if (!answer.ok || !answer.data || !Array.isArray(answer.data.lyrics)) return;
    const ids = {};
    for (const row of answer.data.lyrics) {
      if (row && typeof row.id === "string" && typeof row.updatedAt === "number") ids[row.id] = row.updatedAt;
    }
    this.published = ids;
    writeStored(LIST_KEY, { at: this.#listAt, ids });
    // The list may have brought lyrics for the song already playing, or a newer take
    if (this.trackId && this.source !== SOURCE_LOCAL) this.load(this.trackId);
  }

  #show(trackId, lyrics, source) {
    if (this.trackId !== trackId) return;
    this.current = lyrics ? splitLongLines(lyrics) : null;
    this.source = lyrics ? source : "";
  }

  /**
   * Makes `current` the lyrics of a song: this device's own, else the published ones.
   * @param {string | null} trackId
   */
  async load(trackId) {
    this.trackId = trackId;
    if (!trackId) return this.#show(trackId, null, "");
    const local = cleanLyrics(readStored(LOCAL_PREFIX + trackId));
    if (local) return this.#show(trackId, local, SOURCE_LOCAL);
    const updatedAt = this.published[trackId];
    if (!updatedAt) return this.#show(trackId, null, "");
    const cached = readStored(CACHE_PREFIX + trackId);
    const kept = cached && cached.updatedAt === updatedAt ? cleanLyrics(cached.lyrics) : null;
    if (kept) return this.#show(trackId, kept, SOURCE_PUBLISHED);

    this.#show(trackId, null, "");
    const answer = await callApi("GET", `/lyrics/${encodeURIComponent(trackId)}?v=${updatedAt}`);
    const lyrics = answer.ok && answer.data ? cleanLyrics(answer.data.lyrics) : null;
    if (!lyrics) return;
    this.#keep(trackId, { updatedAt: answer.data.updatedAt, lyrics });
    this.#show(trackId, lyrics, SOURCE_PUBLISHED);
  }

  /** Stores one published song's lyrics, dropping the oldest once there are too many. */
  #keep(trackId, entry) {
    const order = (readStored(CACHE_ORDER_KEY) || []).filter((id) => id !== trackId);
    order.push(trackId);
    while (order.length > MAX_CACHED) writeStored(CACHE_PREFIX + order.shift(), null);
    writeStored(CACHE_PREFIX + trackId, entry);
    writeStored(CACHE_ORDER_KEY, order);
  }

  /**
   * The lyrics as they were saved, before cutting into rows: for editing.
   * @param {string} trackId
   * @returns {import("./lyricsFormat.js").Lyrics | null} this device's copy, else the kept published one
   */
  stored(trackId) {
    const cached = readStored(CACHE_PREFIX + trackId);
    return cleanLyrics(readStored(LOCAL_PREFIX + trackId)) || cleanLyrics(cached && cached.lyrics);
  }

  /**
   * Keeps lyrics for a song on this device. They show at once and win over the published ones.
   * @param {string} trackId
   * @param {any} lyrics
   * @returns {boolean} false when they are not lyrics, or storage refused them
   */
  saveLocal(trackId, lyrics) {
    const clean = cleanLyrics(lyrics);
    if (!clean || !writeStored(LOCAL_PREFIX + trackId, clean)) return false;
    this.#readLocalIds();
    if (this.trackId === trackId) this.#show(trackId, clean, SOURCE_LOCAL);
    return true;
  }

  /** Forgets this device's lyrics for a song; the published ones show again. */
  removeLocal(trackId) {
    writeStored(LOCAL_PREFIX + trackId, null);
    this.#readLocalIds();
    if (this.trackId === trackId) this.load(trackId);
  }

  /**
   * Publishes lyrics for everybody. Only the owner's session can.
   * @param {string} trackId
   * @param {any} lyrics
   * @param {string} token - the owner's session token
   * @returns {Promise<import("./dogsApi.js").ApiAnswer>}
   */
  async publish(trackId, lyrics, token) {
    const clean = cleanLyrics(lyrics);
    if (!clean) return { ok: false, status: 0, data: null, error: "Those lyrics have no timed words." };
    const answer = await callApi("PUT", `/lyrics/${encodeURIComponent(trackId)}`, { body: { lyrics: clean }, token });
    if (!answer.ok) return answer;
    this.published = { ...this.published, [trackId]: answer.data.updatedAt };
    writeStored(LIST_KEY, { at: this.#listAt, ids: this.published });
    this.#keep(trackId, { updatedAt: answer.data.updatedAt, lyrics: clean });
    // The published take is now the same as this device's: drop the local copy
    this.removeLocal(trackId);
    return answer;
  }

  /**
   * Takes a song's published lyrics down.
   * @param {string} trackId
   * @param {string} token - the owner's session token
   * @returns {Promise<import("./dogsApi.js").ApiAnswer>}
   */
  async unpublish(trackId, token) {
    const answer = await callApi("DELETE", `/lyrics/${encodeURIComponent(trackId)}`, { token });
    if (!answer.ok) return answer;
    const ids = { ...this.published };
    delete ids[trackId];
    this.published = ids;
    writeStored(LIST_KEY, { at: this.#listAt, ids });
    writeStored(CACHE_PREFIX + trackId, null);
    if (this.trackId === trackId) this.load(trackId);
    return answer;
  }
}

export const lyrics = new LyricsStore();
