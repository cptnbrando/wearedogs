/**
 * mp3Frames.js
 * Just enough MPEG audio (Layer III) bitstream knowledge to cut an MP3 on a
 * frame boundary and splice two encodes of the same audio into one stream.
 *
 * Why this exists: MP3 encoding is the slow part of the converter, and it
 * parallelises — but only if the pieces can be joined without a click.
 * Two things stand in the way, and both are handled here:
 *
 *  1. Frames overlap their neighbours (MDCT), so each piece is encoded with a
 *     run-in of real audio before it and a lead-out after it, all on one
 *     global frame grid. The overlap frames are then thrown away.
 *  2. The "bit reservoir": a frame may keep part of its data in the unused
 *     tail of EARLIER frames (side-info field main_data_begin says how many
 *     bytes back). Cut a stream at such a frame and it loses that data.
 *     joinAt() moves those bytes into the free tail of the stream in front.
 */

const BITRATES_V1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const BITRATES_V2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

/** PCM samples per Layer III frame: 1152 at 32 kHz and up (MPEG-1), else 576. */
export const samplesPerFrame = (sampleRate) => (sampleRate >= 32000 ? 1152 : 576);

/**
 * Parses the frame header at `pos`. Returns null if there isn't one.
 * dataStart/dataLength locate the frame's main-data area (after the header,
 * optional CRC and side info); mainDataBegin is the reservoir back-pointer.
 */
export function parseFrame(u8, pos) {
  if (pos + 4 > u8.length || u8[pos] !== 0xff || (u8[pos + 1] & 0xe0) !== 0xe0) return null;
  const version = (u8[pos + 1] >> 3) & 3; // 3 = MPEG-1, 2 = MPEG-2, 0 = MPEG-2.5
  const layer = (u8[pos + 1] >> 1) & 3; // 1 = Layer III
  if (version === 1 || layer !== 1) return null;
  const hasCrc = (u8[pos + 1] & 1) === 0;
  const bitrateIndex = u8[pos + 2] >> 4;
  const rateIndex = (u8[pos + 2] >> 2) & 3;
  if (bitrateIndex === 0 || bitrateIndex === 15 || rateIndex === 3) return null;
  const padding = (u8[pos + 2] >> 1) & 1;
  const mono = u8[pos + 3] >> 6 === 3;
  const v1 = version === 3;
  const kbps = (v1 ? BITRATES_V1 : BITRATES_V2)[bitrateIndex];
  const sampleRate = RATES[version][rateIndex];
  const length = Math.floor(((v1 ? 144000 : 72000) * kbps) / sampleRate) + padding;
  const sideInfo = v1 ? (mono ? 17 : 32) : mono ? 9 : 17;
  const side = pos + 4 + (hasCrc ? 2 : 0);
  if (side + sideInfo > u8.length) return null;
  const mainDataBegin = v1 ? (u8[side] << 1) | (u8[side + 1] >> 7) : u8[side];
  const dataStart = side + sideInfo;
  return { pos, length, kbps, sampleRate, mono, mainDataBegin, dataStart, dataLength: pos + length - dataStart };
}

/** Every complete frame in the buffer, in order. Stops at the first gap. */
export function listFrames(u8) {
  const frames = [];
  let pos = 0;
  // tolerate leading junk (an ID3 tag would go here; LAME writes none)
  while (pos + 4 <= u8.length && !parseFrame(u8, pos)) pos++;
  while (pos + 4 <= u8.length) {
    const f = parseFrame(u8, pos);
    if (!f || f.pos + f.length > u8.length) break;
    frames.push(f);
    pos += f.length;
  }
  return frames;
}

/**
 * LAME may open a stream with a Xing/Info tag frame: metadata shaped like an
 * audio frame, holding no audio. It must not count toward the frame grid.
 */
export function isTagFrame(u8, frame) {
  const s = frame.dataStart;
  const tag = String.fromCharCode(u8[s], u8[s + 1], u8[s + 2], u8[s + 3]);
  return tag === "Xing" || tag === "Info";
}

/**
 * Can stream B take over from stream A at this frame? `a` is A's frame for
 * the slot, `b` is B's. B's frame needs b.mainDataBegin bytes of its own data
 * placed before it; A has exactly a.mainDataBegin spare bytes there (they
 * held A's own version of this frame, which is being discarded).
 */
export const canJoin = (a, b) => b.mainDataBegin <= a.mainDataBegin;

/**
 * Builds the joined bytes: A's frames [aFrom, aJoin) followed by nothing —
 * the caller appends B from bJoin on. Returns a copy of that part of A with
 * B's reservoir bytes written into its free tail.
 *
 * @param {Uint8Array} aBytes  stream A
 * @param {object[]} aFrames   listFrames(aBytes)
 * @param {number} aFrom       first A frame to keep
 * @param {number} aJoin       A frame index of the join slot (exclusive end)
 * @param {Uint8Array} bBytes  stream B
 * @param {object[]} bFrames   listFrames(bBytes)
 * @param {number} bJoin       B frame index of the same slot (B's first kept frame)
 */
export function spliceHead(aBytes, aFrames, aFrom, aJoin, bBytes, bFrames, bJoin) {
  const start = aFrames[aFrom].pos;
  const end = aFrames[aJoin].pos;
  const out = aBytes.slice(start, end);
  let need = bFrames[bJoin].mainDataBegin;
  if (need === 0) return out;
  if (need > aFrames[aJoin].mainDataBegin) throw new Error("mp3 splice: reservoir does not fit");

  // Walk both streams backwards through main-data areas only (headers and
  // side info don't count toward main_data_begin), copying B's last `need`
  // bytes over A's last `need` bytes.
  let ai = aJoin - 1;
  let aOff = aFrames[ai].dataLength; // bytes of this area still unwritten, from its end
  let bi = bJoin - 1;
  let bOff = bi >= 0 ? bFrames[bi].dataLength : 0;
  while (need > 0) {
    while (aOff === 0) {
      ai--;
      if (ai < aFrom) throw new Error("mp3 splice: ran out of room in stream A");
      aOff = aFrames[ai].dataLength;
    }
    while (bOff === 0) {
      bi--;
      if (bi < 0) throw new Error("mp3 splice: stream B is missing its reservoir bytes");
      bOff = bFrames[bi].dataLength;
    }
    const n = Math.min(need, aOff, bOff);
    const src = bFrames[bi].dataStart + bOff - n;
    const dst = aFrames[ai].dataStart + aOff - n - start;
    out.set(bBytes.subarray(src, src + n), dst);
    need -= n;
    aOff -= n;
    bOff -= n;
  }
  return out;
}

// ── Parallel encoding: planning and stitching ───────────────────────
/**
 * Overlap, in frames, around each segment boundary `b`:
 *   segment k   encodes up to   b + LEAD_OUT + TAIL   (TAIL keeps the frames
 *               we might use clear of the encoder's end-of-input padding)
 *   segment k+1 encodes from    b - RUN_IN            (and its first WARM_UP
 *               frames are never used: the encoder is still settling)
 * so both have a good frame for every slot in [b - RUN_IN + WARM_UP, b + LEAD_OUT]
 * and the join may land on any of them.
 */
export const SPLICE = Object.freeze({ RUN_IN: 40, WARM_UP: 12, LEAD_OUT: 24, TAIL: 4 });

/**
 * Splits `totalSamples` of audio into segment jobs of about `segFrames`
 * frames. The last segment absorbs the remainder, so it is never too short
 * to hold a join window.
 */
export function planSegments(totalSamples, sampleRate, segFrames) {
  const spf = samplesPerFrame(sampleRate);
  const totalFrames = Math.ceil(totalSamples / spf);
  const count = Math.max(1, Math.floor(totalFrames / segFrames));
  const plans = [];
  for (let k = 0; k < count; k++) {
    const last = k === count - 1;
    const startFrame = Math.max(0, k * segFrames - SPLICE.RUN_IN);
    const endSample = last
      ? totalSamples
      : Math.min(totalSamples, ((k + 1) * segFrames + SPLICE.LEAD_OUT + SPLICE.TAIL) * spf);
    plans.push({ k, startFrame, startSample: startFrame * spf, endSample, last });
  }
  return plans;
}

/**
 * Joins independently encoded segments back into one stream, in order,
 * emitting finished bytes as soon as each join is settled.
 *
 * Segments may be handed over in any order. If two neighbours have no slot
 * where the reservoir fits (rare), `remerge(a, b)` is asked to encode both
 * as ONE segment; the result replaces them and stitching carries on. Taken
 * to its limit that degrades to a plain sequential encode — never to a
 * broken file.
 */
export class Mp3Stitcher {
  /**
   * @param {number} segFrames  nominal segment length used by the planner
   * @param {(bytes: Uint8Array) => void} emit  receives the stream, in order
   * @param {(a: object, b: object) => Promise<object>} remerge  see above
   */
  constructor(segFrames, emit, remerge) {
    this.segFrames = segFrames;
    this.emit = emit;
    this.remerge = remerge;
    this.waiting = new Map();
    this.nextIndex = 0;
    this.cur = null; // the segment whose tail is not settled yet
    this.curFrom = 0; // its first frame that belongs in the output
    this.chain = Promise.resolve();
    this.stats = { joins: 0, remerges: 0, minCandidates: Infinity, slots: [] };
  }

  /**
   * @param {object} seg { k, lastK, startFrame, bytes, last, ...anything the
   *   caller wants back in remerge() } — lastK is the last plan index it covers
   */
  add(seg) {
    seg.frames = listFrames(seg.bytes);
    seg.lastK = seg.lastK ?? seg.k;
    this.waiting.set(seg.k, seg);
    this.chain = this.chain.then(() => this.drain());
    return this.chain;
  }

  async drain() {
    while (this.waiting.has(this.nextIndex)) {
      let nxt = this.waiting.get(this.nextIndex);
      this.waiting.delete(this.nextIndex);
      if (!this.cur) {
        this.cur = nxt;
        this.curFrom = 0;
      } else {
        for (;;) {
          const slot = this.findJoin(this.cur, nxt);
          if (slot >= 0) {
            this.emit(
              spliceHead(
                this.cur.bytes, this.cur.frames, this.curFrom, slot - this.cur.startFrame,
                nxt.bytes, nxt.frames, slot - nxt.startFrame,
              ),
            );
            this.stats.joins++;
            this.stats.slots.push(slot);
            this.cur.done?.();
            this.cur = nxt;
            this.curFrom = slot - nxt.startFrame;
            break;
          }
          // No slot fits: encode both as one. Same input from the same start
          // gives the same leading frames, so curFrom stays valid.
          this.stats.remerges++;
          const merged = await this.remerge(this.cur, nxt);
          merged.frames = listFrames(merged.bytes);
          this.cur.done?.();
          nxt.done?.();
          this.cur = merged;
          if (merged.last) break;
          // the merged segment now needs ITS right-hand neighbour
          const after = merged.lastK + 1;
          if (!this.waiting.has(after)) {
            this.nextIndex = after;
            return; // resume when it arrives
          }
          nxt = this.waiting.get(after);
          this.waiting.delete(after);
          this.nextIndex = after;
        }
      }
      this.nextIndex = this.cur.lastK + 1;
      if (this.cur.last) {
        const first = this.cur.frames[this.curFrom];
        this.emit(this.cur.bytes.slice(first ? first.pos : 0));
        this.cur.done?.();
        this.cur = null;
        this.finished = true;
      }
    }
  }

  /** Best join slot (global frame index) between neighbours, or -1. */
  findJoin(a, b) {
    const boundary = (a.lastK + 1) * this.segFrames;
    if (this.forceFailAt?.(boundary)) return -1; // test hook
    let best = -1;
    let candidates = 0;
    for (let slot = boundary - SPLICE.RUN_IN + SPLICE.WARM_UP; slot <= boundary + SPLICE.LEAD_OUT; slot++) {
      const fa = a.frames[slot - a.startFrame];
      const fb = b.frames[slot - b.startFrame];
      // A must keep at least one frame, and both must really have this slot
      if (!fa || !fb || slot - a.startFrame <= this.curFrom) continue;
      if (!canJoin(fa, fb)) continue;
      candidates++;
      if (best < 0 || Math.abs(slot - boundary) < Math.abs(best - boundary)) best = slot;
    }
    this.stats.minCandidates = Math.min(this.stats.minCandidates, candidates);
    return best;
  }
}

/**
 * Sanity check of a finished stream: every frame's back-pointer must land on
 * bytes that exist. Returns the index of the first broken frame, or -1.
 */
export function firstBrokenFrame(u8) {
  const frames = listFrames(u8);
  let available = 0;
  for (let i = 0; i < frames.length; i++) {
    if (frames[i].mainDataBegin > available) return i;
    // a decoder keeps at most 511 bytes of history
    available = Math.min(511, available + frames[i].dataLength);
  }
  return -1;
}
