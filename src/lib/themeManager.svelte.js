import themesData from './data/themes.json';
import { daylight } from './sunTimes.js';

const RANDOM_THEME_ID = 'random';
/** Follows the sun: Daylight by day, Default after sunset (see sunTimes.js). */
const AUTO_THEME_ID = 'auto';
const DAY_THEME_ID = 'daylight';
const NIGHT_THEME_ID = 'default';
const AUTO_THEME_NAME = 'Auto: day and night';
/** Re-check this long after the sun crosses the horizon, so the switch lands on the right side of it. */
const SUN_MARGIN_MS = 5000;
/** setTimeout cannot wait longer than this. */
const MAX_TIMER_MS = 2147000000;

/**
 * Themes that exist but are not offered: the light page is not good enough yet
 * (flag-colour letters vanish on it, and the paper wants to be pure white).
 * A browser that saved one of these gets Default. Empty this list to offer them again.
 */
const HIDDEN_THEME_IDS = [DAY_THEME_ID, AUTO_THEME_ID];

/** A theme id the manager can apply. */
const isThemeId = (id) =>
  HIDDEN_THEME_IDS.indexOf(id) === -1 && (!!themesData[id] || id === RANDOM_THEME_ID || id === AUTO_THEME_ID);

/**
 * Manage dynamic site-wide theme switching with LocalStorage persistence and random support.
 */
class ThemeManager {
  // Initialize directly to ensure it's never undefined
  currentThemeId = $state('default');
  sunTimer = null;
  /** The custom properties the theme on screen set, so the next one can clear what it does not set itself. */
  appliedKeys = [];

  constructor() {
    this.init();
  }

  init() {
    // Only run if we are in the browser
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wearedogs-theme');

      // Use logical OR to guarantee 'default' if saved is null/invalid
      this.currentThemeId = (saved && isThemeId(saved))
        ? saved
        : 'default';

      this.applyTheme();
      // A tab left open overnight, or a laptop waking up: the sun has moved
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.currentThemeId === AUTO_THEME_ID) this.applyTheme();
      });
    }
  }

  /**
   * Update the active theme site-wide.
   * @param {string} themeId
   */
  setTheme(themeId) {
    if (isThemeId(themeId)) {
      this.currentThemeId = themeId;
      if (typeof window !== 'undefined') {
        localStorage.setItem('wearedogs-theme', themeId);
      }
      this.applyTheme();
    }
  }

  /**
   * Retrieve theme names and IDs.
   * @returns {Array<{id: string, name: string}>}
   */
  getThemesList() {
    const list = Object.entries(themesData).map(([id, t]) => ({
      id,
      name: t.name
    }));
    list.push({ id: AUTO_THEME_ID, name: AUTO_THEME_NAME });
    list.push({ id: RANDOM_THEME_ID, name: 'Random' });
    return list.filter((theme) => isThemeId(theme.id));
  }

  /**
   * Apply current theme CSS variables to document root.
   */
  applyTheme() {
    if (typeof document === 'undefined') return;

    let activeId = this.currentThemeId;
    clearTimeout(this.sunTimer);
    if (activeId === RANDOM_THEME_ID) {
      const keys = Object.keys(themesData).filter(isThemeId);
      activeId = keys[Math.floor(Math.random() * keys.length)];
    }
    if (activeId === AUTO_THEME_ID) {
      const sun = daylight();
      activeId = sun.day ? DAY_THEME_ID : NIGHT_THEME_ID;
      // Come back when the sun next crosses the horizon
      if (sun.changesAt) {
        const wait = Math.min(sun.changesAt.getTime() - Date.now() + SUN_MARGIN_MS, MAX_TIMER_MS);
        this.sunTimer = setTimeout(() => this.applyTheme(), Math.max(wait, SUN_MARGIN_MS));
      }
    }

    const theme = themesData[activeId] || themesData['default'];
    const root = document.documentElement;

    // A theme may set variables the next one does not (Daylight's page colours): clear those first
    this.appliedKeys.forEach((key) => {
      if (!(key in theme.variables)) root.style.removeProperty(key);
    });
    this.appliedKeys = Object.keys(theme.variables);

    // Apply all variables from themes.json to the root style
    Object.entries(theme.variables).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Also set a data attribute on html for theme-specific styling overrides if needed
    document.documentElement.setAttribute('data-theme', activeId);
  }
}

export const themeManager = new ThemeManager();
