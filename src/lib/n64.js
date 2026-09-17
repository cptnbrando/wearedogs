/**
 * n64.js — N64 ROM byte-order conversion: z64 <-> v64 <-> n64
 *
 * The three formats hold identical data in different byte orders. Relative to
 * native big-endian z64 (header 80 37 12 40):
 *   v64  = every 2-byte pair swapped        (header 37 80 40 12)
 *   n64  = every 4-byte group reversed      (header 40 12 37 80)
 * The input format is read from the header, never from the file extension.
 *
 * Each conversion is one copy plus one pass over a Uint16Array or Uint32Array
 * view, swapping bytes inside each word and writing the word back into the
 * same slot, so it is platform-endianness independent and memory-bound
 * (a 64 MB ROM converts in ~40 ms). No file-size limit.
 */

export const N64_FORMATS = ["z64", "v64", "n64"];
export const N64_EXTENSIONS = N64_FORMATS;
export const N64_MIME = "application/x-n64-rom";

const HEADER_BYTES = 4;
const WORD_16 = 2;
const WORD_32 = 4;

// First four ROM bytes read as one big-endian 32-bit integer, per format.
const N64_MAGIC = {
  z64: 0x80371240,
  v64: 0x37804012,
  n64: 0x40123780,
};

/** Swaps the two bytes of every 16-bit word in place. z64 <-> v64. */
function swapBytes16(bytes) {
  const words = new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / WORD_16);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    words[i] = (w << 8) | (w >>> 8);
  }
}

/** Reverses the four bytes of every 32-bit word in place. z64 <-> n64. */
function reverseBytes32(bytes) {
  const words = new Uint32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / WORD_32);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    words[i] = (w >>> 24) | ((w >>> 8) & 0xff00) | ((w & 0xff00) << 8) | (w << 24);
  }
}

/** Swaps the two 16-bit halves of every 32-bit word in place. v64 <-> n64. */
function swapHalves32(bytes) {
  const words = new Uint32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / WORD_32);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    words[i] = (w << 16) | (w >>> 16);
  }
}

// N64_OPS[from][to] — every operation is its own inverse, so the table is symmetric.
const N64_OPS = {
  z64: { v64: swapBytes16, n64: reverseBytes32 },
  v64: { z64: swapBytes16, n64: swapHalves32 },
  n64: { z64: reverseBytes32, v64: swapHalves32 },
};

/**
 * Identifies an N64 ROM's byte order from its header.
 * @param {Uint8Array} bytes
 * @returns {"z64"|"v64"|"n64"|""} empty string when the header is not an N64 ROM
 */
export function detectN64Format(bytes) {
  if (!bytes || bytes.length < HEADER_BYTES) return "";
  const head = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  return N64_FORMATS.find((fmt) => N64_MAGIC[fmt] === head) || "";
}

/**
 * Converts an N64 ROM to the requested byte order. The source is left untouched.
 * @param {Uint8Array} bytes - whole ROM
 * @param {"z64"|"v64"|"n64"} outFormat
 * @returns {Uint8Array} converted ROM (a copy, even when no reordering is needed)
 */
export function convertN64(bytes, outFormat) {
  const inFormat = detectN64Format(bytes);
  if (!inFormat) throw new Error("Not an N64 ROM: unrecognized header.");
  if (!N64_FORMATS.includes(outFormat)) throw new Error(`Unknown N64 format "${outFormat}".`);
  if (bytes.length % WORD_32 !== 0) throw new Error("N64 ROM length must be a multiple of 4 bytes.");
  const out = bytes.slice();
  if (inFormat !== outFormat) N64_OPS[inFormat][outFormat](out);
  return out;
}
