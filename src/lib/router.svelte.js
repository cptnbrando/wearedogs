import { langs } from './langUtils.js';
import { CAMPAIGN_ALIASES } from './campaignAliases.js';

export { CAMPAIGN_ALIASES };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Panel names that map directly to activePage in TitlePage. */
const VALID_PANELS = new Set(['music', 'stats', 'map', 'store', 'networking']);

/** App slugs recognized by ToolboxPanel. */
export const VALID_APPS = new Set([
  'gopro', 'soundboard', 'snake', 'paint', 'stopwatch', 'dataflash', 'qrgenerator', 'rescue', 'memes',
  'worldcup', 'blog', 'settings', 'arcade', 'creatures', 'missingcreatures',
  'soundstripper', 'converter', 'reader', 'windshieldwiper', 'changelog', 'wiretap', 'frames',
  'passwords',
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

/**
 * Deep links straight into the Texas campaign map's stats sheet:
 * /stats/health, /stats/representation, /stats/money, /stats/why.
 *
 * Note `/stats` on its own is still the world-stats panel — only these four
 * slugs are claimed, so nothing that worked before changes.
 */
export const CAMPAIGN_STATS_TABS = {
  money: 'money',
  economy: 'money',
  representation: 'reps',
  reps: 'reps',
  health: 'health',
  why: 'why',
  timeline: 'why',
};

/** The campaign whose map those stats belong to. */
export const CAMPAIGN_STATS_ID = 'save-texas-hemp';

export const ARCADE_SLUGS = {
  'mario': 'mario64',
  'mario64': 'mario64',
  'mariods': 'mariods',
  'moonwalk': 'moonwalker',
  'moonwalker': 'moonwalker',
  'conker': 'conker',
  'goldeneye': 'goldeneye',
  'zelda': 'zelda',
  'nintendogs': 'nintendogs',
  'dkc': 'dkc',
  'dkc1': 'dkc',
  'dkc2': 'dkc2',
  'dkc3': 'dkc3'
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

  // /thc  /doja  /grass  … (campaign short urls). Checked before the lang
  // rule: 'za' is also Zhuang's ISO 639-1 code, and the campaign alias wins.
  if (parts.length === 1 && CAMPAIGN_ALIASES[s0]) {
    return { type: 'store-campaign', campaignId: CAMPAIGN_ALIASES[s0] };
  }

  // /en  /es  /fr  … (BCP 47 codes from worldwidedogs.json)
  if (parts.length === 1 && langs.includes(s0)) {
    return { type: 'lang', lang: s0 };
  }

  // /info
  if (parts.length === 1 && s0 === 'info') {
    return { type: 'info' };
  }

  // /music  (panel, no track)
  if (s0 === 'music' && parts.length === 1) {
    return { type: 'panel', panel: 'music' };
  }

  // /music/chicago  (panel + auto-select track)
  if (s0 === 'music' && parts.length === 2) {
    return { type: 'music-track', trackId: s1 };
  }

  // /store/campaign/c1
  if (s0 === 'store' && s1 === 'campaign' && parts.length === 3) {
    return { type: 'store-campaign', campaignId: s2 };
  }

  // /store/product/1
  if (s0 === 'store' && s1 === 'product' && parts.length === 3) {
    return { type: 'store-product', productId: s2 };
  }

  // /stats/health  /stats/representation  … (campaign map stats sheet).
  // Checked before the bare-panel rule below, which only matches length 1.
  if (s0 === 'stats' && parts.length === 2 && CAMPAIGN_STATS_TABS[s1]) {
    return { type: 'campaign-stats', tab: CAMPAIGN_STATS_TABS[s1] };
  }

  // /stats  /map  /store  /networking
  if (parts.length === 1 && VALID_PANELS.has(s0)) {
    return { type: 'panel', panel: s0 };
  }

  // /apps  (toolbox launcher grid)
  if (s0 === 'apps' && parts.length === 1) {
    return { type: 'panel', panel: 'toolbox' };
  }

  // /apps/arcade/zelda  (Arcade game deep link)
  if (s0 === 'apps' && s1 === 'arcade' && parts.length === 3 && ARCADE_SLUGS[s2]) {
    return { type: 'arcade-game', game: ARCADE_SLUGS[s2] };
  }

  // /arcade/zelda
  if (s0 === 'arcade' && parts.length === 2 && ARCADE_SLUGS[s1]) {
    return { type: 'arcade-game', game: ARCADE_SLUGS[s1] };
  }

  // /zelda  /mario  /conker … (Direct console game short url)
  if (parts.length === 1 && ARCADE_SLUGS[s0]) {
    return { type: 'arcade-game', game: ARCADE_SLUGS[s0] };
  }

  // /apps/gopro  /apps/snake  … (specific app)
  if (s0 === 'apps' && parts.length === 2 && VALID_APPS.has(s1)) {
    const resolvedApp = s1 === 'creatures' ? 'missingcreatures' : s1;
    return { type: 'app', app: resolvedApp };
  }

  // /apps/blog/hello-world  (Blog post deep link)
  if (s0 === 'apps' && s1 === 'blog' && parts.length === 3) {
    return { type: 'blog-post', slug: s2 };
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
  if (app === 'missingcreatures') return '/apps/creatures';
  return '/apps/' + app;
}
