/**
 * presetDeck.svelte.js
 * The listener's side of the MilkDrop show: which presets they love, whether
 * the show sticks to those, and whether it shuffles. One deck for the whole
 * site, so the full-screen controls and the player's PRESETS tab agree.
 *
 * The engine (MilkdropEngine.js) does the drawing. It exists only while the
 * visualizer is on screen, so the deck is told when one arrives and leaves.
 */

const STORAGE_KEY = "milkdrop_deck_v1";
const MAX_FAVORITES = 500;

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
  /** The show plays only the hearted presets. */
  favoritesOnly = $state(false);
  /** Moving on picks at random; off, it goes down the list. */
  shuffle = $state(true);
  /** The show moves on by itself every half minute. */
  auto = $state(true);

  #engine = null;

  constructor() {
    const stored = readStored();
    if (Array.isArray(stored.favorites)) {
      this.favorites = stored.favorites.filter((name) => typeof name === "string").slice(0, MAX_FAVORITES);
    }
    this.favoritesOnly = stored.favoritesOnly === true;
    this.shuffle = stored.shuffle !== false;
    this.auto = stored.auto !== false;
  }

  #save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        favorites: this.favorites, favoritesOnly: this.favoritesOnly, shuffle: this.shuffle, auto: this.auto,
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
    engine.setAuto(this.auto);
  }

  /** What a new MilkdropEngine should be built with, so the deck hears from it. */
  listeners() {
    return {
      onPreset: (name) => (this.current = name),
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
  }

  /** @param {object} engine - the engine that is going away */
  detach(engine) {
    if (this.#engine === engine) this.#engine = null;
  }

  /** True while a visualizer is running and can be told what to show. */
  get live() {
    return !!this.#engine;
  }

  /** @param {string} name @returns {boolean} */
  isFavorite(name) {
    return this.favorites.includes(name);
  }

  /** Hearts a preset, or takes the heart back. With no name, the one on screen. */
  toggleFavorite(name = this.current) {
    if (!name) return;
    this.favorites = this.isFavorite(name)
      ? this.favorites.filter((favorite) => favorite !== name)
      : [...this.favorites, name].slice(-MAX_FAVORITES);
    this.#save();
    this.#apply();
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
