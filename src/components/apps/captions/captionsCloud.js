/**
 * captionsCloud.js
 * The owner's caption projects, kept by the API Worker so they can be picked
 * up on another device (workers/api/src/routes/captions.js, /captions/projects).
 * Every call needs the owner's session token (src/lib/admin.svelte.js); for
 * everyone else the work stays on the device (captionsStore.js).
 */
import { callApi } from "../../../lib/dogsApi.js";

const PROJECTS_PATH = "/captions/projects";
const FNV_OFFSET = 2166136261;
const FNV_PRIME = 16777619;
const HEX = 16;
const ID_HALF_LENGTH = 8;

/** FNV-1a over a string, as eight hex characters. */
function hash(text, seed) {
  let value = seed;
  for (let i = 0; i < text.length; i++) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, FNV_PRIME);
  }
  return (value >>> 0).toString(HEX).padStart(ID_HALF_LENGTH, "0");
}

/**
 * A project's id on the Worker: always the same for the same source, so saving again replaces it.
 * @param {string} key - the project's key on the device (captionsStore.js projectKey)
 * @returns {string} sixteen hex characters
 */
export function cloudId(key) {
  return hash(key, FNV_OFFSET) + hash(key.split("").reverse().join(""), FNV_PRIME);
}

/**
 * @param {import("./captionsStore.js").StoredProject} snapshot - the project as it is stored
 * @param {string} token
 * @returns {Promise<import("../../../lib/dogsApi.js").ApiAnswer>}
 */
export function saveCloudProject(snapshot, token) {
  return callApi("PUT", `${PROJECTS_PATH}/${cloudId(snapshot.key)}`, { body: { name: snapshot.name, body: JSON.stringify(snapshot) }, token });
}

/**
 * @param {string} token
 * @returns {Promise<{ ok: boolean, error: string, projects: { id: string, name: string, updatedAt: number }[] }>}
 */
export async function listCloudProjects(token) {
  const answer = await callApi("GET", PROJECTS_PATH, { token });
  const projects = answer.ok && answer.data && Array.isArray(answer.data.projects) ? answer.data.projects : [];
  return { ok: answer.ok, error: answer.error, projects };
}

/**
 * @param {string} id
 * @param {string} token
 * @returns {Promise<{ ok: boolean, error: string, lines: any[] }>} lines as captionsEdit.js linesFromStored() reads them
 */
export async function loadCloudProject(id, token) {
  const answer = await callApi("GET", `${PROJECTS_PATH}/${id}`, { token });
  if (!answer.ok || !answer.data) return { ok: false, error: answer.error, lines: [] };
  try {
    const snapshot = JSON.parse(answer.data.body);
    return { ok: true, error: "", lines: Array.isArray(snapshot.lines) ? snapshot.lines : [] };
  } catch (e) {
    return { ok: false, error: "That project could not be read.", lines: [] };
  }
}

/** @param {string} id @param {string} token @returns {Promise<import("../../../lib/dogsApi.js").ApiAnswer>} */
export function deleteCloudProject(id, token) {
  return callApi("DELETE", `${PROJECTS_PATH}/${id}`, { token });
}
