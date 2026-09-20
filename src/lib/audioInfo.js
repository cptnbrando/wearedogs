/**
 * audioInfo.js
 * What a file's audio really is — sample rate, bitrate, channels — read from
 * its headers, a few KB at most.
 *
 * The browser can't tell us: decodeAudioData() resamples everything to the
 * audio device's rate, so a 44.1 kHz song "is" 48 kHz by the time it comes
 * back. Knowing the true rate lets the converter decode at it (so "keep the
 * input rate" really does), and lets the settings mark which sample rate and
 * bitrate are the input's.
 */
import { fileSource, isMp4Family, probeMp4Audio } from "./mp4Audio.js";
import { parseFrame, samplesPerFrame } from "./mp3Frames.js";

const ascii = (u8, o, n) => String.fromCharCode(...u8.subarray(o, o + n));
const u16le = (u8, o) => u8[o] | (u8[o + 1] << 8);
const u32le = (u8, o) => (u8[o] | (u8[o + 1] << 8) | (u8[o + 2] << 16)) + u8[o + 3] * 0x1000000;
const u32be = (u8, o) => u8[o] * 0x1000000 + ((u8[o + 1] << 16) | (u8[o + 2] << 8) | u8[o + 3]);

const read = async (file, offset, length) =>
  new Uint8Array(await file.slice(offset, Math.min(file.size, offset + length)).arrayBuffer());

const info = (codec, sampleRate, channels, kbps, extra = {}) => ({
  codec,
  sampleRate: sampleRate || undefined,
  channels: channels || undefined,
  kbps: kbps > 0 ? Math.round(kbps) : undefined,
  ...extra,
});

// WAVEFORMATEX, shared by .wav and .avi
function waveFormat(u8, o) {
  const tag = u16le(u8, o);
  const codec = tag === 1 || tag === 0xfffe ? "PCM" : tag === 3 ? "PCM float" : tag === 0x55 ? "MP3" : tag === 0xff ? "AAC" : "audio";
  return info(codec, u32le(u8, o + 4), u16le(u8, o + 2), (u32le(u8, o + 8) * 8) / 1000, { lossless: tag === 1 || tag === 3 || tag === 0xfffe });
}

function probeWav(u8) {
  let pos = 12;
  while (pos + 8 <= u8.length) {
    const size = u32le(u8, pos + 4);
    if (ascii(u8, pos, 4) === "fmt " && pos + 24 <= u8.length) return waveFormat(u8, pos + 8);
    pos += 8 + size + (size & 1);
  }
  return null;
}

function probeAvi(u8) {
  // the audio stream header ("strh" + "auds") is followed by its format chunk
  for (let i = 12; i + 12 < u8.length; i++) {
    if (u8[i] !== 0x73 || ascii(u8, i, 4) !== "strh" || ascii(u8, i + 8, 4) !== "auds") continue;
    for (let j = i + 8; j + 24 < u8.length; j++) {
      if (u8[j] === 0x73 && ascii(u8, j, 4) === "strf") return waveFormat(u8, j + 8);
    }
  }
  return null;
}

function probeFlac(u8, fileSize) {
  const d = 8; // "fLaC" + block header, then STREAMINFO
  if (u8.length < d + 18) return null;
  const sampleRate = (u8[d + 10] << 12) | (u8[d + 11] << 4) | (u8[d + 12] >> 4);
  const channels = ((u8[d + 12] >> 1) & 7) + 1;
  const totalSamples = (u8[d + 13] & 15) * 0x100000000 + u32be(u8, d + 14);
  const seconds = sampleRate ? totalSamples / sampleRate : 0;
  return info("FLAC", sampleRate, channels, seconds ? (fileSize * 8) / seconds / 1000 : 0, { lossless: true });
}

function probeOgg(u8) {
  const p = 27 + u8[26]; // page header + segment table -> first packet
  if (p + 30 > u8.length) return null;
  if (u8[p] === 1 && ascii(u8, p + 1, 6) === "vorbis") {
    const nominal = u32le(u8, p + 20) | 0;
    return info("Vorbis", u32le(u8, p + 12), u8[p + 11], nominal > 0 ? nominal / 1000 : 0);
  }
  // Opus is always decoded at 48 kHz, whatever the encoder was fed
  if (ascii(u8, p, 8) === "OpusHead") return info("Opus", 48000, u8[p + 9], 0);
  return null;
}

const ADTS_RATES = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
function probeAdts(u8) {
  if (u8.length < 7 || u8[0] !== 0xff || (u8[1] & 0xf6) !== 0xf0) return null;
  return info("AAC", ADTS_RATES[(u8[2] >> 2) & 15], ((u8[2] & 1) << 2) | (u8[3] >> 6), 0);
}

async function probeMp3(file, head) {
  let offset = 0;
  if (ascii(head, 0, 3) === "ID3") {
    // tag size is "syncsafe": 7 bits per byte
    offset = 10 + ((head[6] & 127) << 21 | (head[7] & 127) << 14 | (head[8] & 127) << 7 | (head[9] & 127)) + (head[5] & 0x10 ? 10 : 0);
  }
  const u8 = offset ? await read(file, offset, 65536) : head;
  for (let i = 0; i + 4 < u8.length; i++) {
    const frame = parseFrame(u8, i);
    // a real frame is followed by another one; random 0xFFEx bytes are not
    if (!frame || (i + frame.length + 4 < u8.length && !parseFrame(u8, i + frame.length))) continue;
    let kbps = frame.kbps;
    const tag = ascii(u8, frame.dataStart, 4);
    if (tag === "Xing" && u32be(u8, frame.dataStart + 4) & 1) {
      // VBR: the header frame's own bitrate means nothing; average it out
      const frames = u32be(u8, frame.dataStart + 8);
      const seconds = (frames * samplesPerFrame(frame.sampleRate)) / frame.sampleRate;
      if (seconds > 0) kbps = ((file.size - offset) * 8) / seconds / 1000;
    }
    return info("MP3", frame.sampleRate, frame.mono ? 1 : 2, kbps);
  }
  return null;
}

// ── Matroska / WebM: a bounded walk of the EBML tree down to the audio track ──
function vint(u8, pos, keepMarker) {
  const first = u8[pos];
  let length = 1;
  while (length <= 8 && !(first & (0x80 >> (length - 1)))) length++;
  if (length > 8 || pos + length > u8.length) return null;
  let value = keepMarker ? first : first & (0xff >> length);
  let unknown = !keepMarker && value === 0xff >> length;
  for (let i = 1; i < length; i++) {
    value = value * 256 + u8[pos + i];
    if (u8[pos + i] !== 0xff) unknown = false;
  }
  return { value, length, unknown };
}

function probeMatroska(u8) {
  const CONTAINERS = new Set([0x18538067, 0x1654ae6b, 0xae, 0xe1]); // Segment, Tracks, TrackEntry, Audio
  let best = null;
  const walk = (start, end, track) => {
    let pos = start;
    while (pos < end && pos < u8.length) {
      const id = vint(u8, pos, true);
      if (!id) return;
      const size = vint(u8, pos + id.length, false);
      if (!size) return;
      const data = pos + id.length + size.length;
      const dataEnd = size.unknown ? end : Math.min(end, data + size.value);
      if (id.value === 0x1f43b675) return "stop"; // first Cluster: the headers are over
      if (CONTAINERS.has(id.value)) {
        const entry = id.value === 0xae ? {} : track;
        if (walk(data, dataEnd, entry) === "stop") return "stop";
        if (id.value === 0xae && entry.type === 2 && !best) best = entry;
      } else if (track && dataEnd <= u8.length) {
        const dv = new DataView(u8.buffer, u8.byteOffset + data, dataEnd - data);
        if (id.value === 0x83) track.type = u8[data];
        else if (id.value === 0x86) track.codec = ascii(u8, data, dataEnd - data);
        else if (id.value === 0xb5) track.rate = dv.byteLength === 8 ? dv.getFloat64(0) : dv.getFloat32(0);
        else if (id.value === 0x9f) track.channels = u8[dataEnd - 1];
      }
      pos = dataEnd;
    }
  };
  walk(0, u8.length, null);
  if (!best) return null;
  const codec = (best.codec || "").replace(/^A_/, "").split("/")[0];
  // Opus decodes at 48 kHz regardless of what the header records
  return info(codec || "audio", /OPUS/i.test(codec) ? 48000 : Math.round(best.rate || 0), best.channels, 0);
}

/**
 * @param {File|Blob} file
 * @returns {Promise<{codec:string, sampleRate?:number, channels?:number, kbps?:number, lossless?:boolean}|null>}
 *   null when the container isn't recognised (or has no audio track).
 */
export async function probeAudioInfo(file) {
  try {
    if (!file || typeof file.slice !== "function" || file.size < 12) return null;
    const head = await read(file, 0, 65536);
    const magic = ascii(head, 0, 4);

    if ((magic === "RIFF" || magic === "RF64") && ascii(head, 8, 4) === "WAVE") return probeWav(head);
    if (magic === "RIFF" && ascii(head, 8, 4) === "AVI ") return probeAvi(await read(file, 0, 262144));
    if (magic === "fLaC") return probeFlac(head, file.size);
    if (magic === "OggS") return probeOgg(head);
    if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) {
      return probeMatroska(await read(file, 0, 1048576));
    }

    const source = fileSource(file);
    if (await isMp4Family(source)) {
      const track = await probeMp4Audio(source).catch(() => null);
      if (!track) return null;
      let bytes = 0;
      for (let i = 0; i < track.count; i++) bytes += track.sizes[i];
      const seconds = (track.count * track.delta) / track.timescale;
      const codec = track.asc ? "AAC" : track.codec === "mp3" ? "MP3" : track.codec === "opus" ? "Opus" : track.format.trim();
      return info(codec, track.sampleRate, track.channels, seconds ? (bytes * 8) / seconds / 1000 : 0);
    }

    // No magic number for these two: sync words only
    return probeAdts(head) || (await probeMp3(file, head));
  } catch (err) {
    console.warn("Couldn't read this file's audio details:", err);
    return null;
  }
}
