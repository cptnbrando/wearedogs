/**
 * Manage dynamic music player deck models with LocalStorage persistence.
 */
class SettingsManager {
  musicDeckModel = $state('vinyl');

  constructor() {
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      const savedDeck = localStorage.getItem('wearedogs-music-deck');
      const validDecks = ['vinyl', 'cassette', 'floppy', 'musicbox'];
      this.musicDeckModel = (savedDeck && validDecks.includes(savedDeck))
        ? savedDeck
        : 'vinyl';
    }
  }

  /**
   * Update the active music player deck model.
   * @param {'vinyl'|'cassette'|'floppy'|'musicbox'} model
   */
  setMusicDeckModel(model) {
    const validDecks = ['vinyl', 'cassette', 'floppy', 'musicbox'];
    if (validDecks.includes(model)) {
      this.musicDeckModel = model;
      if (typeof window !== 'undefined') {
        localStorage.setItem('wearedogs-music-deck', model);
      }
    }
  }
}

export const settingsManager = new SettingsManager();
