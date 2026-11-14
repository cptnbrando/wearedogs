// Drop Train: hands files and text to the operating system's share sheet (Web Share API).
// AirDrop and Quick Share then carry them device to device over Bluetooth and
// peer-to-peer Wi-Fi. No page, server or internet connection is involved in the transfer.
const KB = 1024;
const MB = KB * KB;
const PROBE_FILE_NAME = 'probe.txt';
const PROBE_MIME = 'text/plain';
const FALLBACK_MIME = 'application/octet-stream';
const IOS_PATTERN = /iPhone|iPad|iPod/;
const MAC_PATTERN = /Macintosh/;
const ANDROID_PATTERN = /Android/;
const CHROME_OS_PATTERN = /CrOS/;
const WINDOWS_PATTERN = /Windows/;
const PLATFORMS = {
  apple: { id: 'apple', service: 'AirDrop', target: 'Apple devices', receive: 'On the other iPhone, iPad or Mac, set AirDrop to Contacts Only or Everyone for 10 Minutes.' },
  android: { id: 'android', service: 'Quick Share', target: 'Android, Windows and Chromebooks', receive: 'On the other device, open Quick Share and set who can share with you to Everyone or Contacts.' },
  windows: { id: 'windows', service: 'Quick Share', target: 'Android, Windows and Chromebooks', receive: 'On the other device, open Quick Share and set who can share with you. Windows also offers Nearby Sharing to other PCs.' },
  other: { id: 'other', service: 'nearby sharing', target: 'nearby devices', receive: 'Make sure the other device is nearby and visible to your sharing app.' },
};
const SHARE_ERRORS = {
  NotAllowedError: 'The share sheet needs a fresh tap. Tap Send again.',
  InvalidStateError: 'A share sheet is already open. Finish or close it first.',
  DataError: 'This browser will not share these files. Send them with Air Train instead.',
  TypeError: 'This browser will not share these files. Send them with Air Train instead.',
};
const SHARE_FAILED = 'The share sheet could not open. Try again, or send with Air Train.';

/** @returns {typeof PLATFORMS.apple} Which nearby service this device's share sheet offers. */
export function detectPlatform() {
  if (typeof navigator === 'undefined') return PLATFORMS.other;
  const agent = navigator.userAgent;
  // iPadOS reports itself as a Mac, which is fine: both use AirDrop.
  if (IOS_PATTERN.test(agent) || MAC_PATTERN.test(agent)) return PLATFORMS.apple;
  if (ANDROID_PATTERN.test(agent) || CHROME_OS_PATTERN.test(agent)) return PLATFORMS.android;
  if (WINDOWS_PATTERN.test(agent)) return PLATFORMS.windows;
  return PLATFORMS.other;
}

/** True when this browser can hand files to the system share sheet. */
export function supportsFileShare() {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare || typeof File === 'undefined') return false;
  try {
    return navigator.canShare({ files: [new File([''], PROBE_FILE_NAME, { type: PROBE_MIME })] });
  } catch {
    return false;
  }
}

/** Browsers allow only some file types (images, audio, video, PDF, text...) through the share sheet. */
export function canShareFile(file) {
  try {
    return !!navigator.canShare && navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/** Wrap a received Blob as a named File so the share sheet keeps its name and type. */
export function toShareFile(blob, name, mime) {
  return new File([blob], name, { type: mime || FALLBACK_MIME });
}

/**
 * Open the share sheet. Must run straight from a tap: browsers drop the request otherwise.
 * @param {{files?: File[], text?: string}} payload
 * @returns {Promise<'shared'|'closed'>} 'closed' when the person dismissed the sheet.
 */
export async function shareNearby(payload) {
  try {
    await navigator.share(payload);
    return 'shared';
  } catch (error) {
    if (error && error.name === 'AbortError') return 'closed';
    throw new Error(SHARE_ERRORS[error && error.name] || SHARE_FAILED);
  }
}

export const formatBytes = (bytes) => bytes < KB ? bytes + ' B' : bytes < MB ? (bytes / KB).toFixed(1) + ' KB' : (bytes / MB).toFixed(1) + ' MB';
