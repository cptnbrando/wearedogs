/**
 * livePhoto.js
 * Finds the video hidden inside a "motion photo" / live photo.
 *
 * Pixel, Samsung and most Android cameras store a live photo as ONE file: an
 * ordinary JPEG (or HEIC) with a complete MP4 appended after the picture.
 * Image viewers stop at the end of the picture and never see it. Getting the
 * clip out is therefore not a conversion at all — it is a byte range of the
 * file, returned as a Blob slice without copying anything.
 *
 * (An iPhone Live Photo is a different thing: two separate files, a HEIC and
 * a MOV. There is nothing to extract — the MOV already is the video.)
 *
 * Detection doesn't trust metadata, which differs per vendor and is often
 * stripped: it looks for an MP4 header ("ftyp" box with a video brand) past
 * the start of the file, then walks the MP4's own box structure to prove it
 * is real and to find exactly where it ends — Samsung writes a trailer after
 * the video that must not end up in the .mp4.
 */

// Major brands a camera writes for video. HEIC stills also open with an
// "ftyp" box, but with image brands (heic, heix, mif1, msf1, avif) — those
// are deliberately absent.
const VIDEO_BRANDS = new Set([
  "mp42", "mp41", "isom", "iso2", "iso4", "iso5", "iso6", "avc1", "mp4v",
  "M4V ", "qt  ", "3gp4", "3gp5", "3gp6", "3g2a", "MSNV", "hvc1", "hev1",
]);

const MAX_SCAN_BYTES = 256 * 1024 * 1024; // photos are a few MB; never crawl a huge file
const WINDOW = 8 * 1024 * 1024;

const u32 = (u8, o) => u8[o] * 0x1000000 + ((u8[o + 1] << 16) | (u8[o + 2] << 8) | u8[o + 3]);
const ascii = (u8, o, n) => String.fromCharCode(...u8.subarray(o, o + n));
const read = async (file, offset, length) =>
  new Uint8Array(await file.slice(offset, Math.min(file.size, offset + length)).arrayBuffer());

/** Walks top-level MP4 boxes from `start`. Returns where they stop, and the moov box. */
async function walkBoxes(file, start) {
  let pos = start;
  let moov = null;
  let sawMedia = false;
  while (pos + 8 <= file.size) {
    const head = await read(file, pos, 16);
    if (head.length < 8) break;
    let size = u32(head, 0);
    const type = ascii(head, 4, 4);
    if (!/^[A-Za-z0-9 ©_-]{4}$/.test(type)) break; // the trailer, or garbage: the video is over
    if (size === 1 && head.length >= 16) size = u32(head, 8) * 0x100000000 + u32(head, 12);
    else if (size === 0) size = file.size - pos; // "runs to the end of the file"
    if (size < 8 || pos + size > file.size) break;
    if (type === "moov") moov = { pos, size };
    if (type === "mdat" || type === "moof") sawMedia = true;
    pos += size;
  }
  return { end: pos, moov, sawMedia };
}

/** Clip length in seconds, from the movie header. */
async function readDuration(file, moov) {
  if (!moov || moov.size > 16 * 1024 * 1024) return 0;
  const u8 = await read(file, moov.pos, moov.size);
  for (let pos = 8; pos + 8 <= u8.length; ) {
    const size = u32(u8, pos);
    if (size < 8) break;
    if (ascii(u8, pos + 4, 4) === "mvhd") {
      const v1 = u8[pos + 8] === 1;
      const timescale = u32(u8, pos + (v1 ? 28 : 20));
      const duration = v1 ? u32(u8, pos + 32) * 0x100000000 + u32(u8, pos + 36) : u32(u8, pos + 24);
      return timescale ? duration / timescale : 0;
    }
    pos += size;
  }
  return 0;
}

/**
 * @param {File|Blob} file  an image file
 * @returns {Promise<{blob: Blob, offset: number, size: number, seconds: number}|null>}
 *   the embedded video, or null when this is an ordinary photo.
 */
export async function findLivePhotoVideo(file) {
  try {
    if (!file || typeof file.slice !== "function" || file.size < 64 || file.size > MAX_SCAN_BYTES) return null;

    // Scan in windows that overlap by a header's worth, so a match can't hide on a seam
    for (let base = 0; base < file.size; base += WINDOW - 16) {
      const u8 = await read(file, base, WINDOW);
      for (let i = 4; i + 8 <= u8.length; i++) {
        // "ftyp"
        if (u8[i] !== 0x66 || u8[i + 1] !== 0x74 || u8[i + 2] !== 0x79 || u8[i + 3] !== 0x70) continue;
        const offset = base + i - 4;
        if (offset === 0) continue; // the file's own header (a HEIC), not something inside it
        const boxSize = u32(u8, i - 4);
        if (boxSize < 16 || boxSize > 512 || !VIDEO_BRANDS.has(ascii(u8, i + 4, 4))) continue;

        const { end, moov, sawMedia } = await walkBoxes(file, offset);
        if (!moov || !sawMedia) continue; // looked like a header, isn't a playable movie
        return {
          blob: file.slice(offset, end, "video/mp4"),
          offset,
          size: end - offset,
          seconds: await readDuration(file, moov),
        };
      }
      if (u8.length < WINDOW) break;
    }
    return null;
  } catch (err) {
    console.warn("Live photo check failed:", err);
    return null;
  }
}
