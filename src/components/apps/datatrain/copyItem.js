/**
 * copyItem.js
 * Copying a received Data Train file straight to the clipboard: pictures as PNG, and short text
 * files as their text. Anything else is saved or shared instead.
 */

/** Text files copy only below this many characters; longer ones are for saving. */
export const COPY_TEXT_MAX_CHARS = 500;
// A character is at most four UTF-8 bytes, so a larger file can't be under the limit and is never read.
const COPY_TEXT_MAX_BYTES = COPY_TEXT_MAX_CHARS * 4;
const IMAGE_PREFIX = 'image/';
const TEXT_PREFIX = 'text/';
// The one image type every clipboard accepts.
const CLIPBOARD_IMAGE_MIME = 'image/png';
const ERROR_IMAGE = 'This picture could not be copied. Save it instead.';

/** Whether this browser can put a picture on the clipboard (needs https). */
export function supportsImageCopy() {
  return !!(navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== 'undefined');
}

/** @param {{mime: string}} item */
export function isImageItem(item) {
  return item.mime.indexOf(IMAGE_PREFIX) === 0;
}

/** A text file small enough that it might be under the character limit. @param {{mime: string, blob?: Blob}} item */
export function isShortTextCandidate(item) {
  return !!item.blob && item.mime.indexOf(TEXT_PREFIX) === 0 && item.blob.size <= COPY_TEXT_MAX_BYTES;
}

/**
 * The file's text when it is under the limit, otherwise null.
 * @param {Blob} blob
 * @returns {Promise<string|null>}
 */
export function readShortText(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' && reader.result.length < COPY_TEXT_MAX_CHARS ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsText(blob);
  });
}

/** Redraw a picture as PNG. @param {string} url an object URL @returns {Promise<Blob>} */
function toPng(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error(ERROR_IMAGE));
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) throw new Error(ERROR_IMAGE);
        context.drawImage(image, 0, 0);
        canvas.toBlob((png) => (png ? resolve(png) : reject(new Error(ERROR_IMAGE))), CLIPBOARD_IMAGE_MIME);
      } catch {
        reject(new Error(ERROR_IMAGE));
      }
    };
    image.src = url;
  });
}

/**
 * Copy a picture to the clipboard. Call it from a tap: the clipboard item is created at once and
 * given the PNG as a promise, which is what Safari needs to still count it as the user's action.
 * @param {string} url the picture's object URL
 */
export async function copyImage(url) {
  try {
    await navigator.clipboard.write([new ClipboardItem({ [CLIPBOARD_IMAGE_MIME]: toPng(url) })]);
  } catch {
    throw new Error(ERROR_IMAGE);
  }
}
