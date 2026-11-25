/**
 * captionsProject.svelte.js
 * The captions being worked on in the Captions app: the lines, which word is
 * selected, tap along's place, undo, and saving to the device as you go.
 *
 * Every change goes through a method here, so each one can be undone and each
 * one is saved (captionsStore.js) a moment later. The changes themselves are
 * the plain functions of captionsEdit.js.
 */
import * as edit from "./captionsEdit.js";
import { saveProject, loadProject, projectKey } from "./captionsStore.js";

const MAX_UNDO = 60;
const SAVE_DELAY_MS = 700;

export class CaptionsProject {
  /** What the captions belong to: a file's name or a song's title. */
  name = $state("");
  /** captionsStore.js KIND_FILE or KIND_TRACK. */
  kind = $state("");
  /** The song's id in the player, when the source is a song. */
  trackId = $state("");
  /** @type {import("./captionsEdit.js").Line[]} */
  lines = $state([]);
  /** @type {import("./captionsEdit.js").Spot | null} the selected word */
  sel = $state(null);
  /** Goes up with every change: the waveform redraws when it moves. */
  rev = $state(0);
  /** Tap along is listening for taps. */
  tapping = $state(false);
  /** @type {import("./captionsEdit.js").Spot | null} the word the next tap stamps */
  cursor = $state(null);
  canUndo = $state(false);
  /** False when the browser would not store the last change. */
  stored = $state(true);

  counts = $derived(edit.countWords(this.lines));
  selected = $derived(edit.wordAt(this.lines, this.sel));

  key = "";
  #undo = [];
  #saveTimer = null;
  #textSpot = "";

  /**
   * Starts on a source, bringing back what was saved for it on this device.
   * @param {{ kind: string, id: string, name: string, trackId?: string }} source
   */
  open(source) {
    this.flush();
    this.key = projectKey(source.kind, source.id);
    this.kind = source.kind;
    this.name = source.name;
    this.trackId = source.trackId || "";
    const kept = loadProject(this.key);
    this.lines = kept ? edit.linesFromStored(kept.lines) : [];
    this.sel = null;
    this.cursor = null;
    this.tapping = false;
    this.#undo = [];
    this.canUndo = false;
    this.rev++;
  }

  /** Saves now, if a save is waiting. */
  flush() {
    if (!this.#saveTimer) return;
    clearTimeout(this.#saveTimer);
    this.#save();
  }

  /** @returns {import("./captionsStore.js").StoredProject} the project as it is stored, on the device or in the cloud */
  snapshot() {
    return { key: this.key, name: this.name, kind: this.kind, trackId: this.trackId, at: Date.now(), lines: edit.linesToStored(this.lines) };
  }

  /** @param {any[]} stored - lines from a snapshot; they replace what is here (Undo brings it back) */
  useStoredLines(stored) {
    this.replaceLines(edit.linesFromStored(stored));
  }

  #save() {
    this.#saveTimer = null;
    if (!this.key) return;
    this.stored = saveProject(this.snapshot());
  }

  #touch() {
    this.rev++;
    clearTimeout(this.#saveTimer);
    this.#saveTimer = setTimeout(() => this.#save(), SAVE_DELAY_MS);
  }

  #remember() {
    this.#undo.push(JSON.stringify({ lines: edit.linesToStored(this.lines), sel: this.sel }));
    if (this.#undo.length > MAX_UNDO) this.#undo.shift();
    this.canUndo = true;
  }

  /** One undoable change. */
  #change(job) {
    this.#remember();
    this.#textSpot = "";
    job();
    this.sel = edit.clampSpot(this.lines, this.sel);
    this.#touch();
  }

  undo() {
    const last = this.#undo.pop();
    this.canUndo = this.#undo.length > 0;
    if (!last) return;
    const kept = JSON.parse(last);
    this.lines = edit.linesFromStored(kept.lines);
    this.sel = edit.clampSpot(this.lines, kept.sel);
    this.cursor = null;
    this.tapping = false;
    this.#textSpot = "";
    this.#touch();
  }

  /** @returns {import("../../../lib/lyricsFormat.js").Lyrics | null} what is timed so far, as lyrics */
  lyrics() {
    return edit.toLyrics(this.lines);
  }

  /** @param {import("./captionsEdit.js").Spot | null} spot */
  select(spot) {
    this.sel = edit.clampSpot(this.lines, spot);
    this.#textSpot = "";
  }

  /** Selects the word before (-1) or after (1) the selected one. */
  step(direction) {
    if (!this.lines.length) return;
    if (!this.sel) return this.select({ li: 0, wi: 0 });
    const next = direction < 0 ? edit.spotBefore(this.lines, this.sel) : edit.spotAfter(this.lines, this.sel);
    if (next) this.select(next);
  }

  /**
   * Replaces everything: an import, pasted words, or a transcription.
   * @param {import("./captionsEdit.js").Line[]} lines
   */
  replaceLines(lines) {
    this.#change(() => {
      this.lines = lines;
      this.sel = null;
      this.cursor = null;
      this.tapping = false;
    });
  }

  /** @param {string} text - the selected word's new text */
  setText(text) {
    if (!this.selected) return;
    // Typing a word is one change to undo, not one per letter
    const spot = `${this.sel.li}:${this.sel.wi}`;
    if (this.#textSpot !== spot) this.#remember();
    this.#textSpot = spot;
    this.selected.x = text;
    this.#touch();
  }

  /** @param {number} delta - seconds to move the selected word by */
  nudge(delta) {
    if (!this.selected || this.selected.t === null) return;
    this.#change(() => edit.setWordTime(this.lines, this.sel, this.selected.t + delta));
  }

  /**
   * @param {number} seconds - the selected word's new time
   * @param {boolean} [continued] - part of a drag already under way: nothing new to undo
   */
  setTime(seconds, continued = false) {
    if (!this.selected) return;
    if (continued) {
      edit.setWordTime(this.lines, this.sel, seconds);
      return this.#touch();
    }
    this.#change(() => edit.setWordTime(this.lines, this.sel, seconds));
  }

  /** @param {number} delta - seconds to move every word by */
  shiftAll(delta) {
    this.#change(() => edit.shiftAll(this.lines, delta));
  }

  /** The selected word starts a new line. */
  split() {
    if (!this.sel) return;
    this.#change(() => {
      if (edit.splitLine(this.lines, this.sel)) this.sel = { li: this.sel.li + 1, wi: 0 };
    });
  }

  /** The selected word's line takes the next line's words. */
  join() {
    if (this.sel) this.#change(() => edit.joinLines(this.lines, this.sel.li));
  }

  addWord() {
    if (!this.sel) return;
    this.#change(() => {
      this.sel = edit.addWordAfter(this.lines, this.sel);
    });
  }

  removeWord() {
    if (this.sel) this.#change(() => edit.deleteWord(this.lines, this.sel));
  }

  /** @param {number | null} seconds - when the new line is said (the playhead), null for no time yet */
  addLine(seconds) {
    this.#change(() => {
      this.sel = edit.addLineAfter(this.lines, this.sel ? this.sel.li : this.lines.length - 1, seconds);
    });
  }

  removeLine() {
    if (!this.sel) return;
    this.#change(() => {
      this.lines.splice(this.sel.li, 1);
      this.sel = { li: this.sel.li, wi: 0 };
    });
  }

  /**
   * Tap along starts listening. The first tap stamps the selected word, or the
   * first word still waiting for a time, or the very first word.
   * @param {boolean} [fromTop] - forget every time and start at the first word
   */
  startTap(fromTop = false) {
    if (!this.lines.length) return;
    this.#remember();
    if (fromTop) {
      for (const line of this.lines) {
        line.e = null;
        for (const word of line.words) word.t = null;
      }
    }
    this.cursor = fromTop ? { li: 0, wi: 0 } : this.sel || edit.firstUntimed(this.lines) || { li: 0, wi: 0 };
    this.sel = this.cursor;
    this.tapping = true;
    this.#touch();
  }

  stopTap() {
    this.tapping = false;
  }

  /**
   * One tap: the word under the cursor is said now.
   * @param {number} seconds - the audio's own clock at the tap
   */
  tap(seconds) {
    if (!this.tapping || !this.cursor) return;
    edit.setWordTime(this.lines, this.cursor, seconds);
    // The line's old end no longer fits its new words: it follows them again
    this.lines[this.cursor.li].e = null;
    this.cursor = edit.spotAfter(this.lines, this.cursor);
    if (this.cursor) this.sel = this.cursor;
    else this.tapping = false;
    this.#touch();
  }

  /** Steps tap along back one word, taking that word's time away. */
  tapBack() {
    if (!this.lines.length) return;
    const last = this.lines.length - 1;
    const back = this.cursor ? edit.spotBefore(this.lines, this.cursor) : { li: last, wi: this.lines[last].words.length - 1 };
    if (!back) return;
    edit.wordAt(this.lines, back).t = null;
    this.cursor = back;
    this.sel = back;
    this.tapping = true;
    this.#touch();
  }
}
