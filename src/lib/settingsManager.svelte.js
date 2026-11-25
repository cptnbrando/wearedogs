import { LANDING_PHRASE_IDS, RANDOM_PHRASE_ID } from './landingPhrases.js';
import { MUSIC_PALETTE_IDS, DEFAULT_MUSIC_PALETTE } from './musicPalettes.js';

const MUSIC_DECK_STORAGE_KEY = 'wearedogs-music-deck';
const LANDING_PHRASE_STORAGE_KEY = 'wearedogs-landing-phrase';
const MUSIC_PALETTE_STORAGE_KEY = 'wearedogs-music-palette';
const DEFAULT_MUSIC_DECK = 'vinyl';
const VALID_DECKS = ['vinyl', 'cassette', 'floppy', 'musicbox'];
const VALID_LANDING_PHRASES = [RANDOM_PHRASE_ID, ...LANDING_PHRASE_IDS];

/** Read a LocalStorage value, returning the fallback when unset or not in the allowed list */
function readStoredChoice(key, allowed, fallback) {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  return saved && allowed.includes(saved) ? saved : fallback;
}

/**
 * Manage dynamic music player deck models and the landing-page phrase with LocalStorage persistence.
 */
class SettingsManager {
  musicDeckModel = $state(DEFAULT_MUSIC_DECK);
  landingPhrase = $state(RANDOM_PHRASE_ID);
  musicPalette = $state(DEFAULT_MUSIC_PALETTE);

  constructor() {
    this.init();
  }

  init() {
    this.musicDeckModel = readStoredChoice(MUSIC_DECK_STORAGE_KEY, VALID_DECKS, DEFAULT_MUSIC_DECK);
    this.landingPhrase = readStoredChoice(LANDING_PHRASE_STORAGE_KEY, VALID_LANDING_PHRASES, RANDOM_PHRASE_ID);
    this.musicPalette = readStoredChoice(MUSIC_PALETTE_STORAGE_KEY, MUSIC_PALETTE_IDS, DEFAULT_MUSIC_PALETTE);
  }

  /**
   * Update the music player's colours.
   * @param {string} id one of MUSIC_PALETTE_IDS (src/lib/musicPalettes.js)
   */
  setMusicPalette(id) {
    if (!MUSIC_PALETTE_IDS.includes(id)) return;
    this.musicPalette = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MUSIC_PALETTE_STORAGE_KEY, id);
    }
  }

  /**
   * Update the active music player deck model.
   * @param {'vinyl'|'cassette'|'floppy'|'musicbox'} model
   */
  setMusicDeckModel(model) {
    if (!VALID_DECKS.includes(model)) return;
    this.musicDeckModel = model;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MUSIC_DECK_STORAGE_KEY, model);
    }
  }

  /**
   * Update the landing-page phrase. `random` picks a fresh phrase on every page load.
   * @param {string} id one of LANDING_PHRASE_IDS or RANDOM_PHRASE_ID
   */
  setLandingPhrase(id) {
    if (!VALID_LANDING_PHRASES.includes(id)) return;
    this.landingPhrase = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANDING_PHRASE_STORAGE_KEY, id);
    }
  }
}

export const settingsManager = new SettingsManager();
