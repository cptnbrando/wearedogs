/**
 * The music catalog: songs the player lists that are not in the site's own
 * code. It is one small JSON file on the data host
 * (https://data.wearedogs.net/music/catalog.json), so a new song goes live by
 * uploading it and saving the catalog. No commit, no deploy.
 *
 * The built-in list (src/data/music/tracks.js) is always there; the catalog
 * adds to it, and a catalog track with a built-in track's id replaces it.
 *
 * Requests are kept few (the data host's free tier is the budget): the last
 * catalog is kept in localStorage and shown at once, and the file is fetched
 * again only when the music panel opens and the copy is older than
 * CATALOG_FRESH_MS. The data host refuses localhost, so on a dev server only
 * the built-in list (and any stored copy) shows.
 */

const CATALOG_URL = "https://data.wearedogs.net/music/catalog.json";
const CATALOG_KIND = "dogs-music";
const STORAGE_KEY = "music_catalog_v1";
/** How long a stored catalog is trusted before the file is fetched again. */
const CATALOG_FRESH_MS = 5 * 60 * 1000;
const MAX_TRACKS = 500;
const MAX_TEXT_LENGTH = 200;
const MAX_URL_LENGTH = 500;
const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
/** A catalog may only point at our own hosts, or at a file of the site itself. */
const TRUSTED_URL_PREFIXES = [
  "https://data.wearedogs.net/",
  "https://wearedogs.net/",
  "https://www.wearedogs.net/",
  "https://dogs.red/",
];
const TEXT_FIELDS = ["title", "artist", "album", "genre", "dateAdded"];
const URL_FIELDS = ["cover", "altCover", "src", "instrumental", "attrib"];
/** `attrib` links to the artist's own site, so any https address is allowed there. */
const ANY_HTTPS_FIELDS = ["attrib"];

/**
 * @param {unknown} value
 * @param {boolean} anyHttps - accept any https address, not only our hosts
 * @returns {string} the address, or "" when it is not one we would load
 */
function cleanUrl(value, anyHttps) {
  if (typeof value !== "string" || value.length > MAX_URL_LENGTH) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (anyHttps) return value.startsWith("https://") ? value : "";
  return TRUSTED_URL_PREFIXES.some((prefix) => value.startsWith(prefix)) ? value : "";
}

/**
 * One catalog entry as a player track, or null when it is not usable. Only
 * the fields the player knows are kept: a catalog cannot mark a track hidden
 * or hand the player anything else.
 * @param {any} raw
 * @returns {object | null}
 */
export function cleanCatalogTrack(raw) {
  if (!raw || typeof raw.id !== "string" || !ID_PATTERN.test(raw.id)) return null;
  const track = { id: raw.id };
  for (const field of TEXT_FIELDS) {
    track[field] = typeof raw[field] === "string" ? raw[field].slice(0, MAX_TEXT_LENGTH) : "";
  }
  for (const field of URL_FIELDS) {
    track[field] = cleanUrl(raw[field], ANY_HTTPS_FIELDS.indexOf(field) !== -1);
  }
  if (!track.title || !track.artist) return null;
  if (!track.src && !track.instrumental) return null;
  if (!track.attrib) delete track.attrib;
  track.year = Number.isFinite(raw.year) ? Math.round(raw.year) : new Date().getFullYear();
  track.public = raw.public !== false;
  return track;
}

/**
 * @param {any} raw - the catalog file, parsed
 * @returns {object[]} its usable tracks; none when the file is not a catalog
 */
export function catalogTracks(raw) {
  if (!raw || raw.kind !== CATALOG_KIND || !Array.isArray(raw.tracks)) return [];
  const seen = {};
  const tracks = [];
  for (const entry of raw.tracks.slice(0, MAX_TRACKS)) {
    const track = cleanCatalogTrack(entry);
    if (!track || seen[track.id]) continue;
    seen[track.id] = true;
    tracks.push(track);
  }
  return tracks;
}

/**
 * The built-in library with the catalog's tracks: a catalog track replaces
 * the built-in one with its id, and the rest are added after.
 * @param {object[]} builtIn
 * @param {object[]} extra
 * @returns {object[]}
 */
export function mergeLibrary(builtIn, extra) {
  if (!extra || !extra.length) return builtIn;
  const byId = {};
  for (const track of extra) byId[track.id] = track;
  const merged = builtIn.map((track) => {
    const replacement = byId[track.id];
    if (!replacement) return track;
    delete byId[track.id];
    return replacement;
  });
  return merged.concat(extra.filter((track) => byId[track.id]));
}

function readStored() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && Array.isArray(stored.tracks)) return stored;
  } catch (e) {
    // No stored catalog, or storage is blocked: the built-in list stands
  }
  return { at: 0, tracks: [] };
}

class MusicCatalog {
  /** The catalog's tracks, already cleaned. Empty until one is stored or fetched. */
  tracks = $state([]);
  checkedAt = 0;
  loading = false;

  constructor() {
    if (typeof window === "undefined") return;
    const stored = readStored();
    // Stored tracks are cleaned again: the rules may have changed since
    this.tracks = catalogTracks({ kind: CATALOG_KIND, tracks: stored.tracks });
    this.checkedAt = stored.at || 0;
  }

  /**
   * Fetches the catalog if the stored copy is stale. Safe to call on every
   * open of the music panel; a failure keeps what is already shown.
   * @returns {Promise<void>}
   */
  async refresh() {
    if (this.loading || Date.now() - this.checkedAt < CATALOG_FRESH_MS) return;
    this.loading = true;
    try {
      const res = await fetch(CATALOG_URL, { cache: "no-cache" });
      // No catalog on the host is an answer too: wait before asking again
      this.checkedAt = Date.now();
      if (!res.ok) return;
      this.tracks = catalogTracks(await res.json());
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: this.checkedAt, tracks: this.tracks }));
    } catch (e) {
      // Offline, blocked (localhost), or storage is full: keep the last catalog
    } finally {
      this.loading = false;
    }
  }
}

export const musicCatalog = new MusicCatalog();

/**
 * The library the player runs on: the built-in tracks plus the catalog's.
 * A catalog track that is not public stays out until the lockup is open,
 * like the built-in ones.
 * @param {object[]} builtIn - playerLibrary(unlocked) from src/data/music/tracks.js
 * @param {boolean} unlocked - musicLock.unlocked
 * @returns {object[]}
 */
export function libraryWithCatalog(builtIn, unlocked) {
  const extra = unlocked ? musicCatalog.tracks : musicCatalog.tracks.filter((t) => t.public !== false);
  return mergeLibrary(builtIn, extra);
}
