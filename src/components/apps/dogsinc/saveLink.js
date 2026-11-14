const SAVE_PATTERN = /^#save=([A-Za-z0-9_-]{8,2000})$/;
const APP_PATH = '/apps/dogsinc';
let pendingCode = null;

/**
 * Capture a "#save=" fragment before the site router normalizes its history stack.
 * Called by TitlePage on load; only the code is kept, never arbitrary URL content.
 * @param {string} path
 * @param {string} hash
 */
export function rememberSaveLink(path, hash) {
  if (path !== APP_PATH && path !== APP_PATH + '/') return;
  const match = SAVE_PATTERN.exec(String(hash || ''));
  pendingCode = match ? match[1] : null;
}

/** Consume once: reopening the game must not offer the same import again. */
export function takeSaveLink() {
  const code = pendingCode;
  pendingCode = null;
  return code;
}

/** @param {string} code @returns {string} a link that opens DOGS INC and offers this save */
export function createSaveLink(code) {
  return location.origin + APP_PATH + '#save=' + code;
}
