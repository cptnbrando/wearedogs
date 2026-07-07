import themesData from './themes.json';

/**
 * Manage dynamic site-wide theme switching with LocalStorage persistence and random support.
 */
class ThemeManager {
  // Initialize directly to ensure it's never undefined
  currentThemeId = $state('default');

  constructor() {
    this.init();
  }

  init() {
    // Only run if we are in the browser
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wearedogs-theme');

      // Use logical OR to guarantee 'default' if saved is null/invalid
      this.currentThemeId = (saved && (themesData[saved] || saved === 'random'))
        ? saved
        : 'default';

      this.applyTheme();
    }
  }

  /**
   * Update the active theme site-wide.
   * @param {string} themeId
   */
  setTheme(themeId) {
    if (themesData[themeId] || themeId === 'random') {
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
    list.push({ id: 'random', name: 'Random' });
    return list;
  }

  /**
   * Apply current theme CSS variables to document root.
   */
  applyTheme() {
    if (typeof document === 'undefined') return;

    let activeId = this.currentThemeId;
    if (activeId === 'random') {
      const keys = Object.keys(themesData).filter(k => k !== 'random');
      activeId = keys[Math.floor(Math.random() * keys.length)];
    }

    const theme = themesData[activeId] || themesData['default'];
    const root = document.documentElement;

    // Apply all variables from themes.json to the root style
    Object.entries(theme.variables).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Also set a data attribute on html for theme-specific styling overrides if needed
    document.documentElement.setAttribute('data-theme', activeId);
  }
}

export const themeManager = new ThemeManager();
