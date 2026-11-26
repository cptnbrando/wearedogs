/**
 * presetDeck.svelte.js
 * The listener's side of the MilkDrop show: which presets they love, which
 * they never want to see again, whether the show sticks to the loved ones,
 * and whether it shuffles. One deck for the whole
 * site, so the full-screen controls and the player's PRESETS tab agree.
 *
 * The engine (MilkdropEngine.js) does the drawing. It exists only while the
 * visualizer is on screen, so the deck is told when one arrives and leaves.
 *
 * Tethered to another device (lib/tether.svelte.js), the two show the same
 * preset: a change here is sent there and one from there is shown here. The
 * device with the sound leads the half-minute auto-advance; the other follows
 * it, so the two never pick different presets at the same moment.
 */

const STORAGE_KEY = "milkdrop_deck_v1";
const MAX_FAVORITES = 500;
/** More than there are presets, so a listener can turn down every one they like. */
const MAX_DISLIKED = 2000;
/** Preset names are at most this long: anything longer from another device is not one. */
const MAX_NAME_LENGTH = 300;

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {};
  } catch {
    // Storage blocked or corrupt: start with an empty deck
    return {};
  }
}

class PresetDeck {
  /** Every preset loaded so far, sorted. Empty until the visualizer has started once. */
  names = $state.raw([]);
  /** The preset on screen. */
  current = $state("");
  /** The presets the listener hearted, oldest first. */
  favorites = $state.raw([]);
  /** The presets the listener turned down, oldest first: the show never puts them on by itself. */
  disliked = $state.raw([]);
  /** The show plays only the hearted presets. */
  favoritesOnly = $state(false);
  /** Moving on picks at random; off, it goes down the list. */
  shuffle = $state(true);
  /** The show moves on by itself every half minute. */
  auto = $state(true);

  #engine = null;
  /** The tether's link while two devices are in step: { send(name), leads() }, else null. */
  #link = null;
  /** A preset another device asked for, until it is on screen here (it is not sent back). */
  #fromPeer = "";

  constructor() {
    const stored = readStored();
    if (Array.isArray(stored.favorites)) {
      this.favorites = stored.favorites.filter((name) => typeof name === "string").slice(0, MAX_FAVORITES);
    }
    if (Array.isArray(stored.disliked)) {
      this.disliked = stored.disliked.filter((name) => typeof name === "string").slice(0, MAX_DISLIKED);
    }
    this.favoritesOnly = stored.favoritesOnly === true;
    this.shuffle = stored.shuffle !== false;
    this.auto = stored.auto !== false;
  }

  #save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        favorites: this.favorites, disliked: this.disliked,
        favoritesOnly: this.favoritesOnly, shuffle: this.shuffle, auto: this.auto,
      }));
    } catch {
      // Not kept: the choices last until the page closes
    }
  }

  /** Hands the engine the listener's choices. */
  #apply() {
    const engine = this.#engine;
    if (!engine) return;
    engine.shuffle = this.shuffle;
    engine.setPool(this.favoritesOnly ? this.favorites : null);
    engine.setHidden(this.disliked);
    engine.setAuto(this.auto);
  }

  /** What a new MilkdropEngine should be built with, so the deck hears from it. */
  listeners() {
    return {
      onPreset: (name) => {
        this.current = name;
        if (name === this.#fromPeer) {
          this.#fromPeer = "";
          return;
        }
        if (this.#link) this.#link.send(name);
      },
      onNames: (names) => (this.names = names),
    };
  }

  /** @param {object} engine - the MilkdropEngine now on screen */
  attach(engine) {
    this.#engine = engine;
    // The show carries on from the preset the last engine left on
    engine.resume = this.current;
    engine.auto = this.auto;
    engine.shuffle = this.shuffle;
    engine.setPool(this.favoritesOnly ? this.favorites : null);
    engine.setHidden(this.disliked);
    engine.canAdvance = () => !this.#link || this.#link.leads();
  }

  /** @param {object} engine - the engine that is going away */
  detach(engine) {
    if (this.#engine === engine) this.#engine = null;
  }

  /**
   * The tether joined two devices, or parted them (null).
   * @param {{ send: (name: string) => void, leads: () => boolean } | null} link
   *   send: hands a preset name to the other device; leads: this device picks the next preset by itself
   */
  setLink(link) {
    this.#link = link;
    this.#fromPeer = "";
    // The device that leads tells the other where the show is, so both start in step
    if (link && link.leads() && this.current) link.send(this.current);
  }

  /**
   * The other device moved to a preset. Shown here at once, or as soon as
   * this device has it (presets arrive pack by pack), or when the visualizer
   * next starts.
   * @param {unknown} name
   */
  showFromPeer(name) {
    if (typeof name !== "string" || !name || name.length > MAX_NAME_LENGTH || name === this.current) return;
    const engine = this.#engine;
    if (engine && engine.presets[name]) {
      this.#fromPeer = name;
      engine.loadPreset(name);
      return;
    }
    // Not on screen, or its pack has not loaded yet: the engine puts it on when it can,
    // and that is not sent back either
    this.#fromPeer = name;
    this.current = name;
    if (engine) engine.resume = name;
  }

  /** True while a visualizer is running and can be told what to show. */
  get live() {
    return !!this.#engine;
  }

  /** @param {string} name @returns {boolean} */
  isFavorite(name) {
    return this.favorites.includes(name);
  }

  /** @param {string} name @returns {boolean} */
  isDisliked(name) {
    return this.disliked.includes(name);
  }

  /** Hearts a preset, or takes the heart back. With no name, the one on screen. A hearted preset is no longer turned down. */
  toggleFavorite(name = this.current) {
    if (!name) return;
    if (this.isFavorite(name)) {
      this.favorites = this.favorites.filter((favorite) => favorite !== name);
    } else {
      this.favorites = [...this.favorites, name].slice(-MAX_FAVORITES);
      this.disliked = this.disliked.filter((other) => other !== name);
    }
    this.#save();
    this.#apply();
  }

  /**
   * Turns a preset down so the show never puts it on again, or lets it back in.
   * With no name, the one on screen, which then gives way to the next.
   * Turning a preset down takes its heart off.
   */
  toggleDislike(name = this.current) {
    if (!name) return;
    if (this.isDisliked(name)) {
      this.disliked = this.disliked.filter((other) => other !== name);
      this.#save();
      this.#apply();
      return;
    }
    this.disliked = [...this.disliked, name].slice(-MAX_DISLIKED);
    this.favorites = this.favorites.filter((favorite) => favorite !== name);
    this.#save();
    this.#apply();
    if (name === this.current) this.next();
  }

  setFavoritesOnly(on) {
    this.favoritesOnly = !!on;
    this.#save();
    this.#apply();
  }

  setShuffle(on) {
    this.shuffle = !!on;
    this.#save();
    this.#apply();
  }

  setAuto(on) {
    this.auto = !!on;
    this.#save();
    this.#apply();
  }

  /** The next preset: random with shuffle on, else the next in the list. */
  next() {
    if (this.#engine) this.#engine.advance();
  }

  previous() {
    if (this.#engine) this.#engine.previous();
  }

  /** @param {string} name - puts that preset on screen */
  pick(name) {
    if (this.#engine) this.#engine.loadPreset(name);
  }
}

export const presetDeck = new PresetDeck();
