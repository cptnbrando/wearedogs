/**
 * mp4Audio.js
 * Pulls the audio out of an MP4 / MOV / M4A of ANY size without ever loading
 * the file: the index (moov) is parsed from a few hundred KB, then only the
 * audio samples are read from disk, decoded with WebCodecs and encoded as a
 * stream. A 6 GB video that file.arrayBuffer() refuses converts fine.
 *
 * Everything reads through a tiny "source" ({ size, read(offset, length) }),
 * so the parser runs the same over a File, an HTTP range reader or Node fs.
 */
import { createMp3Encoder, nearestMp3Rate } from "./mp3Pool.js";

// ── Sources ──────────────────────────────────────────────────────────
export function fileSource(file) {
  return {
    size: file.size,
    read: async (offset, length) =>
      new Uint8Array(await file.slice(offset, offset + length).arrayBuffer()),
  };
}

function fail(name, message, cause) {
  const err = new Error(message, cause ? { cause } : undefined);
  err.name = name;
  return err;
}

// ── Box parsing ──────────────────────────────────────────────────────
const fourcc = (u8, o) => String.fromCharCode(u8[o], u8[o + 1], u8[o + 2], u8[o + 3]);
const u16 = (u8, o) => (u8[o] << 8) | u8[o + 1];
const u32 = (u8, o) => u8[o] * 0x1000000 + ((u8[o + 1] << 16) | (u8[o + 2] << 8) | u8[o + 3]);
const u64 = (u8, o) => u32(u8, o) * 0x100000000 + u32(u8, o + 4);

/** Child boxes of the byte range [start, end) of a buffer. */
function* boxes(u8, start, end) {
  let pos = start;
  while (pos + 8 <= end) {
    let size = u32(u8, pos);
    const type = fourcc(u8, pos + 4);
    let header = 8;
    if (size === 1) {
      size = u64(u8, pos + 8);
      header = 16;
    } else if (size === 0) size = end - pos;
    if (size < header || pos + size > end) return;
    yield { type, start: pos + header, end: pos + size };
    pos += size;
  }
}

const child = (u8, parent, type) => {
  for (const b of boxes(u8, parent.start, parent.end)) if (b.type === type) return b;
  return null;
};

/** True for the ISO-BMFF family: mp4, m4v, m4a, mov, 3gp. */
export async function isMp4Family(source) {
  if (source.size < 12) return false;
  const head = await source.read(0, 12);
  return ["ftyp", "moov", "mdat", "wide", "free", "skip", "pnot"].includes(fourcc(head, 4));
}

/** Finds and reads the moov box, hopping over mdat without touching it. */
async function readMoov(source) {
  let pos = 0;
  let fragmented = false;
  while (pos + 8 <= source.size) {
    const head = await source.read(pos, 16);
    let size = u32(head, 0);
    const type = fourcc(head, 4);
    if (size === 1) size = u64(head, 8);
    else if (size === 0) size = source.size - pos;
    if (size < 8) break;
    if (type === "moof") fragmented = true;
    if (type === "moov") {
      if (size > 512 * 1024 * 1024) throw fail("Mp4IndexTooLarge", "This file's index is too large to read in the browser.");
      return { moov: await source.read(pos, size), fragmented };
    }
    pos += size;
  }
  throw fail("Mp4NoIndex", "This file has no MP4 index (moov) — it may be incomplete or still recording.");
}

/** esds -> { objectType, config (AudioSpecificConfig bytes) } */
function parseEsds(u8, box) {
  let pos = box.start + 4; // version + flags
  const readLen = () => {
    let len = 0;
    for (let i = 0; i < 4; i++) {
      const b = u8[pos++];
      len = (len << 7) | (b & 0x7f);
      if (!(b & 0x80)) break;
    }
    return len;
  };
  let objectType = 0;
  let config = null;
  while (pos < box.end) {
    const tag = u8[pos++];
    const len = readLen();
    if (tag === 0x03) {
      const flags = u8[pos + 2];
      pos += 3;
      if (flags & 0x80) pos += 2;
      if (flags & 0x40) pos += 1 + u8[pos];
      if (flags & 0x20) pos += 2;
    } else if (tag === 0x04) {
      objectType = u8[pos];
      pos += 13;
    } else if (tag === 0x05) {
      config = u8.slice(pos, pos + len);
      pos += len;
    } else pos += len;
  }
  return { objectType, config };
}

/** The handful of AudioSpecificConfig fields an ADTS header needs. */
function parseAudioSpecificConfig(cfg) {
  let bit = 0;
  const bits = (n) => {
    let v = 0;
    for (let i = 0; i < n; i++, bit++) v = (v << 1) | ((cfg[bit >> 3] >> (7 - (bit & 7))) & 1);
    return v;
  };
  const readAot = () => {
    const a = bits(5);
    return a === 31 ? 32 + bits(6) : a;
  };
  const readFreq = () => {
    const i = bits(4);
    if (i === 15) bits(24);
    return i;
  };
  let aot = readAot();
  const freqIndex = readFreq();
  const channelConfig = bits(4);
  const signalled = aot;
  if (aot === 5 || aot === 29) {
    readFreq(); // SBR extension rate
    aot = readAot(); // the AAC underneath
  }
  return { aot, signalled, freqIndex, channelConfig };
}

/**
 * Reads the first audio track: codec, WebCodecs config and the position of
 * every sample. Returns null when the file has no audio track.
 */
export async function probeMp4Audio(source) {
  const { moov, fragmented } = await readMoov(source);
  const root = { start: 8, end: moov.length };
  if (u32(moov, 0) === 1) root.start = 16;
  if (fragmented || child(moov, root, "mvex")) {
    throw fail("FragmentedMp4", "This is a fragmented MP4 (streaming layout), which the large-file audio reader doesn't support yet.");
  }

  for (const trak of boxes(moov, root.start, root.end)) {
    if (trak.type !== "trak") continue;
    const mdia = child(moov, trak, "mdia");
    const hdlr = mdia && child(moov, mdia, "hdlr");
    if (!hdlr || fourcc(moov, hdlr.start + 8) !== "soun") continue;
    const mdhd = child(moov, mdia, "mdhd");
    const minf = child(moov, mdia, "minf");
    const stbl = minf && child(moov, minf, "stbl");
    if (!mdhd || !stbl) continue;

    const v1 = moov[mdhd.start] === 1;
    const timescale = u32(moov, mdhd.start + (v1 ? 20 : 12));
    const mediaDuration = v1 ? u64(moov, mdhd.start + 24) : u32(moov, mdhd.start + 16);

    // Sample description
    const stsd = child(moov, stbl, "stsd");
    const entry = boxes(moov, stsd.start + 8, stsd.end).next().value;
    if (!entry) continue;
    const e = entry.start; // 6 reserved + 2 data-ref, then the sound description
    const version = u16(moov, e + 8);
    let channels = u16(moov, e + 16);
    let sampleRate = u16(moov, e + 24); // 16.16 fixed, integer part
    let kids = e + 28;
    if (version === 1) kids += 16;
    else if (version === 2) {
      const dv = new DataView(moov.buffer, moov.byteOffset + e + 32, 12);
      sampleRate = Math.round(dv.getFloat64(0));
      channels = dv.getUint32(8);
      kids += 36;
    }
    const kidsBox = { start: kids, end: entry.end };
    let esds = child(moov, kidsBox, "esds");
    const wave = child(moov, kidsBox, "wave"); // QuickTime tucks esds in here
    if (!esds && wave) esds = child(moov, wave, "esds");

    let codec = null;
    let description;
    let asc = null;
    if (esds) {
      const { objectType, config } = parseEsds(moov, esds);
      if (objectType === 0x40 || objectType === 0x66 || objectType === 0x67 || objectType === 0x68) {
        if (!config) throw fail("Mp4BadAudioConfig", "The AAC track is missing its decoder config.");
        asc = parseAudioSpecificConfig(config);
        codec = `mp4a.40.${asc.signalled}`;
        description = config;
      } else if (objectType === 0x6b || objectType === 0x69) codec = "mp3";
    } else if (entry.type === ".mp3") codec = "mp3";
    else if (entry.type === "Opus") {
      const dops = child(moov, kidsBox, "dOps");
      if (dops) {
        // dOps is big-endian; the OpusHead WebCodecs wants is little-endian
        const d = moov.subarray(dops.start, dops.end);
        const head = new Uint8Array(11 + d.length);
        head.set([0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64, 1, d[1], d[3], d[2], d[7], d[6], d[5], d[4], d[9], d[8]]);
        head.set(d.subarray(10), 18);
        codec = "opus";
        description = head.subarray(0, 18 + Math.max(0, d.length - 10));
        sampleRate = 48000;
      }
    }

    // Sample sizes
    const stsz = child(moov, stbl, "stsz");
    const stz2 = child(moov, stbl, "stz2");
    let count;
    let sizes;
    if (stsz) {
      const fixed = u32(moov, stsz.start + 4);
      count = u32(moov, stsz.start + 8);
      sizes = new Uint32Array(count);
      if (fixed) sizes.fill(fixed);
      else for (let i = 0; i < count; i++) sizes[i] = u32(moov, stsz.start + 12 + i * 4);
    } else if (stz2) {
      const field = moov[stz2.start + 7];
      count = u32(moov, stz2.start + 8);
      sizes = new Uint32Array(count);
      for (let i = 0; i < count; i++) {
        const o = stz2.start + 12;
        sizes[i] = field === 16 ? u16(moov, o + i * 2) : field === 8 ? moov[o + i] : (moov[o + (i >> 1)] >> (i & 1 ? 0 : 4)) & 15;
      }
    } else continue;

    // Chunk offsets + samples-per-chunk runs -> one offset per sample
    const stco = child(moov, stbl, "stco");
    const co64 = child(moov, stbl, "co64");
    const stsc = child(moov, stbl, "stsc");
    if ((!stco && !co64) || !stsc) continue;
    const chunkBox = stco || co64;
    const chunkCount = u32(moov, chunkBox.start + 4);
    const chunkOffset = (i) => (stco ? u32(moov, stco.start + 8 + i * 4) : u64(moov, co64.start + 8 + i * 8));
    const runs = u32(moov, stsc.start + 4);
    const offsets = new Float64Array(count);
    let s = 0;
    for (let r = 0; r < runs && s < count; r++) {
      const o = stsc.start + 8 + r * 12;
      const firstChunk = u32(moov, o);
      const perChunk = u32(moov, o + 4);
      const lastChunk = r + 1 < runs ? u32(moov, o + 12) - 1 : chunkCount;
      for (let c = firstChunk; c <= lastChunk && s < count; c++) {
        let at = chunkOffset(c - 1);
        for (let k = 0; k < perChunk && s < count; k++, s++) {
          offsets[s] = at;
          at += sizes[s];
        }
      }
    }
    count = s;

    // Frames per sample, from the first stts run (constant for AAC/MP3/Opus)
    const stts = child(moov, stbl, "stts");
    const delta = stts && u32(moov, stts.start + 4) > 0 ? u32(moov, stts.start + 12) : 1024;

    return {
      format: entry.type,
      codec,
      description,
      asc,
      channels,
      sampleRate: sampleRate || timescale,
      timescale,
      delta,
      duration: timescale ? mediaDuration / timescale : 0,
      count,
      sizes,
      offsets,
    };
  }
  return null;
}

/** Reads samples in order, a few MB of disk at a time. */
async function* readSamples(source, track, limit = track.count) {
  const MAX_SPAN = 4 * 1024 * 1024;
  // Audio is interleaved with video. Bridging a small gap saves a read; on a
  // high-bitrate video, bridging big ones reads 100x more disk than needed.
  const MAX_GAP = 64 * 1024;
  // In a high-bitrate video every audio frame is its own tiny read, and each
  // read is mostly latency. Keep several in flight; hand them out in order.
  const AHEAD = 12;

  // Plan every read up front (cheap: just the index)
  const plans = [];
  for (let i = 0; i < limit; ) {
    const start = track.offsets[i];
    let j = i;
    let end = start + track.sizes[i];
    while (j + 1 < limit) {
      const o = track.offsets[j + 1];
      const nextEnd = o + track.sizes[j + 1];
      if (o < end || o - end > MAX_GAP || nextEnd - start > MAX_SPAN) break;
      end = nextEnd;
      j++;
    }
    if (end > source.size) throw fail("Mp4Truncated", "The file ends before its audio does — it looks incomplete.");
    plans.push({ first: i, last: j, start, length: end - start });
    i = j + 1;
  }

  const inflight = [];
  let next = 0;
  const launch = () => {
    while (inflight.length < AHEAD && next < plans.length) {
      const plan = plans[next++];
      const promise = source.read(plan.start, plan.length);
      promise.catch(() => {}); // surfaced when awaited; don't also warn as unhandled
      inflight.push({ plan, promise });
    }
  };
  launch();
  while (inflight.length) {
    const { plan, promise } = inflight.shift();
    const buf = await promise;
    launch();
    for (let k = plan.first; k <= plan.last; k++) {
      const at = track.offsets[k] - plan.start;
      yield { index: k, data: buf.subarray(at, at + track.sizes[k]) };
    }
  }
}

// ── Output ───────────────────────────────────────────────────────────
/** Collects output, folding it into (disk-backable) Blobs every 32 MB. */
function blobCollector(type) {
  let parts = [];
  let pending = 0;
  const blobs = [];
  return {
    push(chunk) {
      parts.push(chunk);
      pending += chunk.byteLength;
      if (pending > 32 * 1024 * 1024) {
        blobs.push(new Blob(parts));
        parts = [];
        pending = 0;
      }
    },
    finish: (prefix = []) => new Blob([...prefix, ...blobs, ...parts], { type }),
  };
}

function toInt16(f32) {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const v = f32[i] < -1 ? -1 : f32[i] > 1 ? 1 : f32[i];
    out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  return out;
}

function wavHeader(channels, sampleRate, dataBytes) {
  const h = new DataView(new ArrayBuffer(44));
  const text = (o, s) => [...s].forEach((c, i) => h.setUint8(o + i, c.charCodeAt(0)));
  const clamp = (n) => Math.min(n, 0xffffffff); // WAV tops out at 4 GB
  text(0, "RIFF");
  h.setUint32(4, clamp(36 + dataBytes), true);
  text(8, "WAVEfmt ");
  h.setUint32(16, 16, true);
  h.setUint16(20, 1, true);
  h.setUint16(22, channels, true);
  h.setUint32(24, sampleRate, true);
  h.setUint32(28, sampleRate * channels * 2, true);
  h.setUint16(32, channels * 2, true);
  h.setUint16(34, 16, true);
  text(36, "data");
  h.setUint32(40, clamp(dataBytes), true);
  return h.buffer;
}

/** Anything above stereo folds down: fronts, plus centre and surrounds at -3 dB. */
function downmix(planes) {
  if (planes.length <= 2) return planes;
  const n = planes[0].length;
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const c = planes[2];
  const sl = planes.length >= 6 ? planes[4] : planes[3];
  const sr = planes.length >= 6 ? planes[5] : planes[3];
  for (let i = 0; i < n; i++) {
    L[i] = (planes[0][i] + 0.707 * c[i] + 0.707 * (sl ? sl[i] : 0)) * 0.5;
    R[i] = (planes[1][i] + 0.707 * c[i] + 0.707 * (sr ? sr[i] : 0)) * 0.5;
  }
  return [L, R];
}

/**
 * Streaming sample-rate conversion. Audio is resampled in 8 s blocks by the
 * browser's own resampler; each block is rendered with a margin of real
 * audio on both sides, which is then thrown away, so block edges are clean.
 */
export function createResampler(channels, fromRate, toRate) {
  const ratio = toRate / fromRate;
  const BLOCK = fromRate * 8;
  const PAD = 4096;
  let store = Array.from({ length: channels }, () => new Float32Array(0));
  let base = 0; // absolute source index of store[..][0]
  let done = 0; // absolute source index resampled so far
  const OfflineCtx = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  // Blocks may only start where the two rates line up exactly (every 160
  // source frames for 48k -> 44.1k). Anywhere else the block sits a fraction
  // of an output sample off the grid and the seam is audible.
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const grid = fromRate / gcd(fromRate, toRate);
  const marginStart = (at) => Math.max(0, Math.floor((at - PAD) / grid) * grid);

  async function render(to, isLast) {
    const avail = base + store[0].length;
    const ctxStart = Math.max(base, marginStart(done));
    const ctxEnd = Math.min(avail, to + PAD);
    const outStart = Math.round(done * ratio);
    const outEnd = Math.round(to * ratio);
    const skip = outStart - Math.round(ctxStart * ratio);
    const length = outEnd - outStart;
    const srcLen = ctxEnd - ctxStart;
    if (length <= 0 || srcLen <= 0) {
      done = to;
      return null;
    }
    const ctx = new OfflineCtx(channels, Math.ceil(srcLen * ratio) + 16, toRate);
    const buffer = ctx.createBuffer(channels, srcLen, fromRate);
    for (let ch = 0; ch < channels; ch++) {
      buffer.copyToChannel(store[ch].subarray(ctxStart - base, ctxEnd - base), ch);
    }
    const node = ctx.createBufferSource();
    node.buffer = buffer;
    node.connect(ctx.destination);
    node.start();
    const rendered = await ctx.startRendering();
    const out = [];
    for (let ch = 0; ch < channels; ch++) {
      const plane = new Float32Array(length);
      plane.set(rendered.getChannelData(ch).subarray(skip, Math.min(rendered.length, skip + length)));
      out.push(plane);
    }
    done = to;
    // keep only the margin the next block needs
    const keepFrom = Math.max(base, marginStart(done));
    if (!isLast && keepFrom > base) {
      store = store.map((p) => p.slice(keepFrom - base));
      base = keepFrom;
    }
    return out;
  }

  // Decoded frames arrive ~1024 at a time; queue them and only merge into the
  // store once a whole block is ready, instead of re-copying on every frame.
  let queue = [];
  let queued = 0;
  const merge = () => {
    if (!queued) return;
    store = store.map((p, ch) => {
      const next = new Float32Array(p.length + queued);
      next.set(p);
      let at = p.length;
      for (const planes of queue) {
        next.set(planes[ch], at);
        at += planes[ch].length;
      }
      return next;
    });
    queue = [];
    queued = 0;
  };

  return {
    async push(planes) {
      queue.push(planes);
      queued += planes[0].length;
      const out = [];
      if (base + store[0].length + queued < done + BLOCK + PAD) return out;
      merge();
      while (base + store[0].length >= done + BLOCK + PAD) {
        const block = await render(done + BLOCK, false);
        if (block) out.push(block);
      }
      return out;
    },
    async flush() {
      merge();
      const block = await render(base + store[0].length, true);
      return block ? [block] : [];
    },
  };
}

// ── The conversions ──────────────────────────────────────────────────
const adtsCompatible = (asc) =>
  !!asc && asc.aot >= 1 && asc.aot <= 4 && asc.channelConfig !== 0 && asc.freqIndex <= 12;

/** One AAC frame with its 7-byte ADTS header: a self-describing .aac frame. */
function adtsFrame(asc, data) {
  const len = data.length + 7;
  const frame = new Uint8Array(len);
  frame[0] = 0xff;
  frame[1] = 0xf1;
  frame[2] = ((asc.aot - 1) << 6) | (asc.freqIndex << 2) | (asc.channelConfig >> 2);
  frame[3] = ((asc.channelConfig & 3) << 6) | (len >> 11);
  frame[4] = (len >> 3) & 0xff;
  frame[5] = ((len & 7) << 5) | 0x1f;
  frame[6] = 0xfc;
  frame.set(data, 7);
  return frame;
}

function concatBytes(chunks) {
  let total = 0;
  for (const c of chunks) total += c.length;
  const joined = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    joined.set(c, at);
    at += c.length;
  }
  return joined;
}

/** AAC needs no decoding at all: each frame just gets a 7-byte ADTS header. */
async function extractAdts(source, track, onProgress, sampleLimit) {
  const { asc } = track;
  if (!adtsCompatible(asc)) {
    throw fail("AacNotAdtsCompatible", "This track's AAC profile can't be written as a raw .aac stream.");
  }
  const out = blobCollector("audio/aac");
  const limit = Math.min(track.count, sampleLimit ?? Infinity);
  let batch = [];
  let batchBytes = 0;
  const flushBatch = () => {
    out.push(concatBytes(batch));
    batch = [];
    batchBytes = 0;
  };
  for await (const { index, data } of readSamples(source, track, limit)) {
    const frame = adtsFrame(asc, data);
    batch.push(frame);
    batchBytes += frame.length;
    if (batchBytes > 1024 * 1024) flushBatch();
    if (onProgress && index % 512 === 0) onProgress(Math.round((index / limit) * 100));
  }
  if (batchBytes) flushBatch();
  return out.finish();
}

/**
 * Converts the audio track of an MP4-family file to mp3, wav or aac.
 * @param {{size:number, read:Function}} source  fileSource(file) in the app
 * @param {object} opts
 * @param {'mp3'|'wav'|'aac'} opts.format
 * @param {number} [opts.kbps]  MP3 bitrate (default 320)
 * @param {string|number} [opts.sampleRate]  'keep' or a target rate (mp3 / wav)
 * @param {(pct:number)=>void} [opts.onProgress]
 * @param {number} [opts.sampleLimit]  stop after this many source samples (tests)
 * @param {'webaudio'} [opts.decoder]  force the Web Audio path (tests)
 * @param {object} [opts.track]  a probeMp4Audio() result, to skip re-parsing
 * @returns {Promise<Blob>}
 */
export async function convertMp4Audio(source, opts) {
  const { format, kbps = 320, sampleRate = "keep", onProgress, sampleLimit } = opts;
  const track = opts.track || (await probeMp4Audio(source));
  if (!track) throw fail("NoAudioTrack", "No audio track detected in this video file.");
  if (track.count === 0) throw fail("NoAudioTrack", "This file's audio track is empty.");

  // A raw .aac out of an AAC track is a straight copy — lossless and fast.
  // (Nothing is re-encoded, so the bitrate and sample-rate settings don't apply.)
  if (format === "aac" && track.asc) {
    return extractAdts(source, track, onProgress, sampleLimit);
  }
  if (format !== "mp3" && format !== "wav") {
    throw fail("UnsupportedStreamTarget", `Large-file audio extraction can write mp3, wav and aac — not ${format}.`);
  }
  if (!track.codec) {
    throw fail("UnsupportedAudioCodec", `This file's audio is "${track.format.trim()}", which the browser's decoder can't read.`);
  }

  // Two decoders. WebCodecs is exact and frame-by-frame, but browsers only
  // expose it on secure pages (https / localhost) — not on a LAN dev URL.
  // Web Audio works everywhere and gets the audio in overlapping chunks.
  const limit = Math.min(track.count, sampleLimit ?? Infinity);
  let decode = null;
  if (opts.decoder !== "webaudio" && typeof AudioDecoder !== "undefined") {
    const config = { codec: track.codec, sampleRate: track.sampleRate, numberOfChannels: track.channels };
    if (track.description) config.description = track.description;
    const support = await AudioDecoder.isConfigSupported(config).catch(() => ({ supported: false }));
    if (support.supported) decode = (emit) => decodeWithWebCodecs(source, track, config, limit, emit, onProgress);
  }
  if (!decode && (adtsCompatible(track.asc) || track.codec === "mp3")) {
    decode = (emit) => decodeWithWebAudio(source, track, limit, emit, onProgress);
  }
  if (!decode) {
    throw fail("UnsupportedAudioCodec", `This browser can't decode this file's audio (${track.codec}).`);
  }

  // Output stage is set up on the first decoded audio: only then are the
  // real rate and channel count known (HE-AAC decodes at twice its header rate).
  let stage = null;

  async function makeStage(rate, channels) {
    const outChannels = Math.min(2, channels);
    let target = sampleRate === "keep" ? rate : +sampleRate;
    // MP3 exists at a handful of rates, 48 kHz at most: a 96 kHz track drops to 48
    if (format === "mp3") target = nearestMp3Rate(target);
    const resampler = target !== rate ? createResampler(outChannels, rate, target) : null;
    let write;
    let finish;
    if (format === "mp3") {
      // Encoded in parallel on the worker pool, a segment of the track per core
      const totalSamples = Math.round(((limit * track.delta) / track.timescale) * target);
      const enc = await createMp3Encoder({ sampleRate: target, channels: outChannels, kbps, totalSamples });
      write = (planes) => enc.write(planes);
      finish = () => enc.finish();
    } else {
      const out = blobCollector("audio/wav");
      let bytes = 0;
      write = (planes) => {
        const n = planes[0].length;
        const pcm = new Int16Array(n * outChannels);
        for (let ch = 0; ch < outChannels; ch++) {
          const p = toInt16(planes[ch]);
          for (let i = 0; i < n; i++) pcm[i * outChannels + ch] = p[i];
        }
        bytes += pcm.byteLength;
        out.push(pcm);
      };
      finish = () => out.finish([wavHeader(outChannels, target, bytes)]);
    }
    return {
      async consume(planes) {
        const stereo = downmix(planes);
        if (!resampler) return write(stereo);
        for (const block of await resampler.push(stereo)) await write(block);
      },
      async end() {
        if (resampler) for (const block of await resampler.flush()) await write(block);
        return finish();
      },
    };
  }

  // Decoders hand over planar float audio, in order, one call at a time
  await decode(async (planes, rate) => {
    if (!stage) stage = await makeStage(rate, planes.length);
    await stage.consume(planes);
  });
  if (!stage) throw fail("AudioDecodeFailed", "The decoder produced no audio from this file.");
  return stage.end();
}

/** WebCodecs: every compressed frame in, every PCM frame out, gapless. */
async function decodeWithWebCodecs(source, track, config, limit, emit, onProgress) {
  const usPerSample = (track.delta / track.timescale) * 1e6;
  let failure = null;
  let pendingFrames = 0;
  let chain = Promise.resolve();
  let wake = null;

  const decoder = new AudioDecoder({
    output(audio) {
      try {
        const n = audio.numberOfFrames;
        const rate = audio.sampleRate;
        const planes = [];
        for (let ch = 0; ch < audio.numberOfChannels; ch++) {
          const plane = new Float32Array(n);
          audio.copyTo(plane, { planeIndex: ch, format: "f32-planar" });
          planes.push(plane);
        }
        pendingFrames += n;
        // strictly in order, even when a resample block is still rendering
        chain = chain
          .then(() => emit(planes, rate))
          .then(() => (pendingFrames -= n))
          .catch((err) => (failure = failure || err));
      } catch (err) {
        failure = failure || err;
      } finally {
        audio.close();
      }
    },
    error(err) {
      failure = failure || fail("AudioDecodeFailed", `The browser's decoder gave up on this audio: ${err.message}`, err);
      wake?.();
    },
  });
  decoder.configure(config);

  try {
    for await (const { index, data } of readSamples(source, track, limit)) {
      if (failure) throw failure;
      decoder.decode(
        new EncodedAudioChunk({
          type: "key",
          timestamp: Math.round(index * usPerSample),
          duration: Math.round(usPerSample),
          data,
        }),
      );
      // Don't outrun the decoder or the encoder: memory stays flat. Waits are
      // event-driven — timers are throttled to 1 s in a background tab, which
      // would turn a 10 s conversion into minutes.
      while (!failure && decoder.decodeQueueSize > 96) {
        await new Promise((r) => {
          wake = r; // the error callback wakes us too: a dead decoder never dequeues
          decoder.addEventListener("dequeue", r, { once: true });
        });
      }
      if (pendingFrames > 48000 * 30) await chain;
      if (onProgress && index % 256 === 0) onProgress(Math.min(99, Math.round((index / limit) * 100)));
    }
    if (failure) throw failure;
    await decoder.flush();
    await chain;
    if (failure) throw failure;
  } finally {
    if (decoder.state !== "closed") decoder.close();
  }
}

/**
 * Web Audio: ~9 s of frames at a time are wrapped as a tiny standalone .aac
 * (or raw .mp3) and handed to decodeAudioData. Each chunk is decoded with a
 * few frames of run-in from the previous chunk, and that run-in is cut off
 * the front of the result — AAC and MP3 frames overlap their neighbours, so
 * a cold start would click at every chunk edge.
 */
async function decodeWithWebAudio(source, track, limit, emit, onProgress) {
  const OfflineCtx = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!OfflineCtx) throw fail("NoAudioDecoder", "This browser has no audio decoder the converter can use.");
  const CHUNK = 420;
  const RUN_IN = 8;
  const wrap = track.asc ? (data) => adtsFrame(track.asc, data) : (data) => data;
  // Decoding on a context at the track's own rate means no hidden resample
  const ctx = new OfflineCtx(Math.max(1, Math.min(2, track.channels)), 1, track.sampleRate);
  const framesPerSample = Math.round((track.delta * track.sampleRate) / track.timescale) || 1024;

  let runIn = [];
  let main = [];

  async function flushChunk() {
    if (main.length === 0) return;
    const bytes = concatBytes([...runIn, ...main].map(wrap));
    let decoded;
    try {
      decoded = await ctx.decodeAudioData(bytes.buffer);
    } catch (err) {
      throw fail("AudioDecodeFailed", "The browser couldn't decode this file's audio.", err);
    }
    // Keep the tail: whatever a decoder trims or pads, it does at the front
    const keep = Math.min(decoded.length, main.length * framesPerSample);
    const planes = [];
    for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
      planes.push(decoded.getChannelData(ch).slice(decoded.length - keep));
    }
    runIn = [...runIn, ...main].slice(-RUN_IN);
    main = [];
    await emit(planes, decoded.sampleRate);
  }

  for await (const { index, data } of readSamples(source, track, limit)) {
    main.push(data);
    if (main.length >= CHUNK) {
      await flushChunk();
      if (onProgress) onProgress(Math.min(99, Math.round((index / limit) * 100)));
    }
  }
  await flushChunk();
}
