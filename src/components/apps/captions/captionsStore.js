/**
 * captionsStore.js
 * The Captions app's work, kept on the device so nothing is lost when the tab
 * closes. Only the captions and the name of what they belong to are kept: the
 * audio or video file itself is never stored.
 *
 * One project per source: a song from the player is keyed by its track id, a
 * file by its name. The newest MAX_PROJECTS are kept; the oldest goes first.
 */

const INDEX_KEY = "captions_projects_v1";
const PROJECT_PREFIX = "captions_project_v1:";
const MAX_PROJECTS = 12;
const MAX_NAME_LENGTH = 120;
export const KIND_FILE = "file";
export const KIND_TRACK = "track";

/**
 * @typedef {{ key: string, name: string, kind: string, trackId: string, at: number }} ProjectEntry
 * @typedef {ProjectEntry & { lines: any[] }} StoredProject - lines as captionsEdit.js linesToStored() gives them
 */

/** @param {string} kind @param {string} id - a track id or a file name @returns {string} */
export function projectKey(kind, id) {
  return `${kind}:${String(id).slice(0, MAX_NAME_LENGTH)}`;
}

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (e) {
    return null;
  }
}

/** @returns {boolean} false when storage is blocked or full */
function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

/** @returns {ProjectEntry[]} the kept projects, newest first */
export function listProjects() {
  const index = read(INDEX_KEY);
  if (!Array.isArray(index)) return [];
  return index.filter((entry) => entry && typeof entry.key === "string" && typeof entry.name === "string");
}

/** @param {string} key @returns {StoredProject | null} */
export function loadProject(key) {
  const project = read(PROJECT_PREFIX + key);
  return project && Array.isArray(project.lines) ? project : null;
}

/**
 * Keeps a project, newest first in the list.
 * @param {StoredProject} project
 * @returns {boolean} false when the browser would not store it
 */
export function saveProject(project) {
  const entry = { key: project.key, name: project.name, kind: project.kind, trackId: project.trackId || "", at: Date.now() };
  if (!write(PROJECT_PREFIX + project.key, { ...entry, lines: project.lines })) return false;
  const index = [entry].concat(listProjects().filter((other) => other.key !== project.key));
  for (const dropped of index.splice(MAX_PROJECTS)) write(PROJECT_PREFIX + dropped.key, null);
  return write(INDEX_KEY, index);
}

/** @param {string} key */
export function deleteProject(key) {
  write(PROJECT_PREFIX + key, null);
  write(INDEX_KEY, listProjects().filter((entry) => entry.key !== key));
}
