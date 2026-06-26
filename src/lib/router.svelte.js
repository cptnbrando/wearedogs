import { langs } from './langUtils.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Panel names that map directly to activePage in TitlePage. */
const VALID_PANELS = new Set(['music', 'stats', 'map', 'store', 'networking']);

/** App slugs recognized by ToolboxPanel. */
export const VALID_APPS = new Set([
  'gopro', 'soundboard', 'snake', 'paint', 'stopwatch', 'qrflash', 'rescue', 'memes',
  'worldcup',
]);

/**
 * Show slug → catalog key map used when resolving GoPro deep links.
 * Exported so GoPro.svelte can reference the same source of truth.
 */
export const SHOW_SLUGS = {
  'batman-beyond': 'Batman Beyond',
  'batman': 'Batman Beyond',
  'bean': 'Mr. Bean',
  'mr-bean': 'Mr. Bean',
  'dead': "The Walking Dead",
  'walking-dead': "The Walking Dead",
  'the-walking-dead': "The Walking Dead"
};

// ---------------------------------------------------------------------------
// Path Parser
// ---------------------------------------------------------------------------

/**
 * Parse a URL pathname into structured routing params.
 * Any unrecognized or malformed path returns null — the caller should treat
 * null as a silent home fallback (no panel opened, no error shown).
 *
 * @param {string} path - e.g. '/music/chicago' or '/apps/gopro/batman/s02e03'
 * @returns {{ type: string } | null}
 */
export function parsePath(path) {
  const parts = path.replace(/^\/+/, '').split('/').filter(Boolean);

  if (parts.length === 0) return { type: 'home' };

  const [s0, s1, s2, s3] = parts;

  // /en  /es  /fr  … (BCP 47 codes from worldwidedogs.json)
  if (parts.length === 1 && langs.includes(s0)) {
    return { type: 'lang', lang: s0 };
  }

  // /music  (panel, no track)
  if (s0 === 'music' && parts.length === 1) {
    return { type: 'panel', panel: 'music' };
  }

  // /music/chicago  (panel + auto-select track)
  if (s0 === 'music' && parts.length === 2) {
    return { type: 'music-track', trackId: s1 };
  }

  // /stats  /map  /store  /networking
  if (parts.length === 1 && VALID_PANELS.has(s0)) {
    return { type: 'panel', panel: s0 };
  }

  // /apps  (toolbox launcher grid)
  if (s0 === 'apps' && parts.length === 1) {
    return { type: 'panel', panel: 'toolbox' };
  }

  // /apps/gopro  /apps/snake  … (specific app)
  if (s0 === 'apps' && parts.length === 2 && VALID_APPS.has(s1)) {
    return { type: 'app', app: s1 };
  }

  // /apps/gopro/batman/s02e03  (GoPro show + episode deep link)
  if (s0 === 'apps' && s1 === 'gopro' && parts.length >= 3) {
    return { type: 'gopro-episode', show: s2, episode: s3 || null };
  }

  return null; // unrecognized → caller silently falls back to home
}

// ---------------------------------------------------------------------------
// URL Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a panel name to its canonical URL path.
 * @param {string} panel
 * @returns {string}
 */
export function panelToUrl(panel) {
  if (panel === 'toolbox') return '/apps';
  return '/' + panel;
}

/**
 * Convert an app slug to its canonical URL path.
 * @param {string} app
 * @returns {string}
 */
export function appToUrl(app) {
  return '/apps/' + app;
}
