const INVITE_PATTERN = /^#train=([a-f0-9]{24})\.([a-f0-9]{32})$/;
const APP_PATH = '/apps/dataflash';
/** Every path that opens Data Train, so a short link keeps its invitation too. */
const APP_PATHS = [APP_PATH, '/d', '/data'];
let pendingInvite = null;

/** Validate an invitation without retaining arbitrary URL content. */
export function parsePairingLink(value) {
  const hash = String(value || '').trim().split('#')[1];
  const match = INVITE_PATTERN.exec('#' + (hash || ''));
  if (!match) return null;
  return { code: match[1], secret: match[2] };
}

/** Capture the fragment before the site router normalizes its history stack. */
export function rememberPairingLink(path, hash) {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  if (APP_PATHS.indexOf(clean) === -1) return;
  pendingInvite = parsePairingLink(hash);
}

/** Consume once: closing and reopening the app must not rejoin an old session. */
export function takePairingLink() {
  const invite = pendingInvite;
  pendingInvite = null;
  return invite;
}

export function createPairingLink(code, secret) {
  if (!code || !secret) return '';
  return location.origin + APP_PATH + '#train=' + code + '.' + secret;
}
