/**
 * lyricVideoKeep.js
 * The Lyric Video app's work, kept in this browser so it is still there after
 * a trip to another app (Captions, to edit the words) or a reload: the sound
 * or video it was given, its lyrics, and how the video should look.
 *
 * The file goes in IndexedDB (localStorage cannot hold one); the settings,
 * which are small and read at once on open, in localStorage. Nothing here is
 * ever uploaded.
 */

const DB_NAME = "dogs-lyric-video";
const DB_VERSION = 1;
const STORE = "work";
const READ_ONLY = "readonly";
const READ_WRITE = "readwrite";
const SETTINGS_KEY = "lyric_video_settings_v1";
/** The IndexedDB keys: the file and where it came from, and its lyrics. */
export const KEEP_MEDIA = "media";
export const KEEP_LYRICS = "lyrics";

/** @type {Promise<IDBDatabase | null> | null} */
let opening = null;

/** @returns {Promise<IDBDatabase | null>} null where IndexedDB is missing or refused (private windows) */
function database() {
  if (opening) return opening;
  opening = new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (e) {
      return resolve(null);
    }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });
  return opening;
}

/**
 * Runs one request against the store.
 * @param {string} mode
 * @param {(store: IDBObjectStore) => IDBRequest} make
 * @returns {Promise<any>} the request's result, or null when it failed
 */
async function run(mode, make) {
  const db = await database();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const request = make(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result === undefined ? null : request.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

/** @param {string} key @returns {Promise<any>} what was kept under `key`, or null */
export function readKept(key) {
  return run(READ_ONLY, (store) => store.get(key));
}

/**
 * Keeps a value (a Blob may be part of it), or forgets it when `value` is null.
 * @param {string} key
 * @param {any} value
 * @returns {Promise<boolean>} false when the browser would not keep it
 */
export async function keep(key, value) {
  const done = await run(READ_WRITE, (store) => (value === null ? store.delete(key) : store.put(value, key)));
  return done !== null || value === null;
}

/** @returns {object} the kept settings, or {} */
export function readSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    return settings && typeof settings === "object" ? settings : {};
  } catch (e) {
    return {};
  }
}

/** @param {object} settings */
export function keepSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    // Storage blocked or full: the settings last until the page closes
  }
}
