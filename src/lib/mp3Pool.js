/**
 * mp3Pool.js
 * Fast MP3 encoding: WebAssembly LAME on a pool of workers, one SEGMENT of
 * the same file on each core, stitched back into a single seamless stream
 * (see mp3Frames.js for how the joins are made).
 *
 * MP3 was the converter's bottleneck: WAV is instant because it needs no
 * encoder, while the old pure-JS encoder managed ~15x realtime on one thread,
 * so an hour of audio cost four to five minutes. WASM alone is ~5x faster;
 * spread over the cores it is several hundred times realtime.
 *
 *   const enc = await createMp3Encoder({ sampleRate, channels, kbps, totalSamples });
 *   await enc.write([left, right]);   // planar Float32, any chunk size, in order
 *   const blob = await enc.finish();
 *
 * If workers or WebAssembly aren't available, the same interface is served
 * by the old main-thread encoder (mp3Fallback.js).
 */
import { Mp3Stitcher, samplesPerFrame, SPLICE } from "./mp3Frames.js";
import { createFallbackEncoder } from "./mp3Fallback.js";

/** Sample rates an MP3 can be written at. */
export const MP3_RATES = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];

/** The legal MP3 rate at or just under `rate` (96 kHz -> 48 kHz). */
export function nearestMp3Rate(rate) {
  const fits = MP3_RATES.filter((r) => r <= rate);
  return fits.length ? fits[fits.length - 1] : MP3_RATES[0];
}

// Segment length, in MP3 frames. Each join costs ~70 frames of duplicated
// encoding, so segments stay long enough for that to be noise — and short
// enough that a three-minute song still fans out over every core.
const MIN_SEG = 300; // ~7 s at 48 kHz
const MAX_SEG = 1000; // ~24 s: bounds the PCM held per in-flight segment
const MAX_WORKERS = 12;
const START_TIMEOUT_MS = 10000;
const IDLE_SHUTDOWN_MS = 45000;

// ── Worker pool ──────────────────────────────────────────────────────
class WorkerPool {
  constructor(size) {
    this.size = size;
    this.slots = [];
    this.idle = [];
    this.queue = [];
    this.jobs = new Map();
    this.nextId = 1;
    this.dead = null;
    this.idleTimer = null;
    this.ready = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
    this.ready.catch(() => {}); // callers await it; this just silences "unhandled"
    this.startTimer = setTimeout(() => this.fail(new Error("MP3 workers did not start in time")), START_TIMEOUT_MS);
    this.spawn();
  }

  spawn() {
    const worker = new Worker(new URL("./mp3Worker.js", import.meta.url), { type: "module" });
    const slot = { worker, job: null };
    worker.onmessage = (event) => this.onMessage(slot, event.data);
    worker.onerror = (event) => this.fail(new Error(`MP3 worker failed: ${event.message || "could not load"}`));
    worker.onmessageerror = () => this.fail(new Error("MP3 worker sent an unreadable message"));
    this.slots.push(slot);
  }

  onMessage(slot, msg) {
    if (msg.type === "ready") {
      clearTimeout(this.startTimer);
      this.idle.push(slot);
      this.resolveReady(this);
      this.pump();
    } else if (msg.type === "fatal") {
      this.fail(new Error(`MP3 encoder could not load: ${msg.error}`));
    } else {
      const job = this.jobs.get(msg.id);
      this.jobs.delete(msg.id);
      slot.job = null;
      this.idle.push(slot);
      if (job) {
        if (msg.type === "done") job.resolve({ bytes: msg.bytes, planes: msg.planes });
        else job.reject(new Error(`MP3 encode failed: ${msg.error}`));
      }
      this.pump();
    }
  }

  /** Encodes one segment. `urgent` jumps the queue (re-merges block the output). */
  run(planes, sampleRate, kbps, urgent = false) {
    if (this.dead) return Promise.reject(this.dead);
    return new Promise((resolve, reject) => {
      const job = { id: this.nextId++, planes, sampleRate, kbps, resolve, reject };
      if (urgent) this.queue.unshift(job);
      else this.queue.push(job);
      // grow only as far as there is work for
      const wanted = Math.min(this.size, this.jobs.size + this.queue.length);
      while (this.slots.length < wanted) this.spawn();
      this.pump();
    });
  }

  pump() {
    clearTimeout(this.idleTimer);
    while (this.idle.length && this.queue.length) {
      const slot = this.idle.pop();
      const job = this.queue.shift();
      slot.job = job;
      this.jobs.set(job.id, job);
      slot.worker.postMessage(
        { id: job.id, planes: job.planes, sampleRate: job.sampleRate, kbps: job.kbps },
        job.planes.map((p) => p.buffer),
      );
      job.planes = null; // transferred
    }
    if (this.jobs.size === 0 && this.queue.length === 0) {
      // Workers hold a WASM heap each; let them go once a batch is clearly over
      this.idleTimer = setTimeout(() => this.shutdown(), IDLE_SHUTDOWN_MS);
    }
  }

  fail(err) {
    if (this.dead) return;
    this.dead = err;
    clearTimeout(this.startTimer);
    this.rejectReady(err);
    for (const job of [...this.jobs.values(), ...this.queue]) job.reject(err);
    this.jobs.clear();
    this.queue = [];
    this.shutdown();
    poolBroken = err; // don't keep retrying a browser that can't do this
  }

  shutdown() {
    clearTimeout(this.idleTimer);
    for (const slot of this.slots) slot.worker.terminate();
    this.slots = [];
    this.idle = [];
    if (sharedPool === this) sharedPool = null;
  }
}

let sharedPool = null;
let poolBroken = null;

function poolSize() {
  const cores = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4;
  // leave the page (and the decoder feeding us) some room
  return Math.max(1, Math.min(MAX_WORKERS, cores - (cores > 4 ? 2 : 1)));
}

/** The running pool, started on first use. null when this browser can't run one. */
async function getPool() {
  if (poolBroken) return null;
  if (typeof Worker === "undefined" || typeof WebAssembly === "undefined") return null;
  try {
    if (!sharedPool || sharedPool.dead) sharedPool = new WorkerPool(poolSize());
    return await sharedPool.ready;
  } catch (err) {
    console.warn("MP3 worker pool unavailable, using the single-thread encoder:", err);
    poolBroken = poolBroken || err;
    return null;
  }
}

// ── Pooled encoder ───────────────────────────────────────────────────
class PooledMp3Encoder {
  constructor(pool, { sampleRate, channels, kbps, totalSamples = 0, onProgress, segFrames }) {
    this.parallel = true;
    this.pool = pool;
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.kbps = kbps;
    this.totalSamples = totalSamples;
    this.onProgress = onProgress;
    this.spf = samplesPerFrame(sampleRate);

    const totalFrames = totalSamples ? Math.ceil(totalSamples / this.spf) : 0;
    this.segFrames =
      segFrames || (totalFrames ? Math.max(MIN_SEG, Math.min(MAX_SEG, Math.ceil(totalFrames / pool.size))) : MAX_SEG);

    this.chunks = []; // { start, planes } — PCM not yet fully handed to a job
    this.available = 0;
    this.nextK = 0;
    this.inFlight = 0;
    this.maxInFlight = pool.size + 2; // bounds memory: PCM is held per segment
    this.waiters = [];
    this.jobPromises = [];
    this.encodedSamples = 0;
    this.error = null;
    this.aborted = false;

    this.parts = [];
    this.partBytes = 0;
    this.blobs = [];
    this.stitcher = new Mp3Stitcher(
      this.segFrames,
      (bytes) => this.collect(bytes),
      (a, b) => this.remerge(a, b),
    );
  }

  get stats() {
    return { ...this.stitcher.stats, segFrames: this.segFrames, segments: this.nextK, workers: this.pool.slots.length };
  }

  /** Output is folded into Blobs as it grows, so the browser may spill it to disk. */
  collect(bytes) {
    this.parts.push(bytes);
    this.partBytes += bytes.byteLength;
    if (this.partBytes > 32 * 1024 * 1024) {
      this.blobs.push(new Blob(this.parts));
      this.parts = [];
      this.partBytes = 0;
    }
  }

  /** Planar Float32 PCM, one array per channel, in stream order. */
  async write(planes) {
    if (this.error) throw this.error;
    if (planes.length !== this.channels) throw new Error(`MP3 encoder expected ${this.channels} channel(s), got ${planes.length}`);
    if (planes[0].length === 0) return;
    this.chunks.push({ start: this.available, planes });
    this.available += planes[0].length;
    await this.cut(false);
  }

  /** Dispatches every segment whose audio (incl. lead-out) has fully arrived. */
  async cut(final) {
    for (;;) {
      if (this.error) throw this.error;
      const k = this.nextK;
      const startFrame = Math.max(0, k * this.segFrames - SPLICE.RUN_IN);
      const startSample = startFrame * this.spf;
      let endSample = ((k + 1) * this.segFrames + SPLICE.LEAD_OUT + SPLICE.TAIL) * this.spf;
      let last = false;
      if (this.available < endSample) {
        if (!final) return;
        endSample = this.available;
        last = true;
      }
      if (endSample <= startSample) return; // nothing at all was written

      const planes = this.extract(startSample, endSample);
      this.nextK = k + 1;
      // the next segment starts RUN_IN frames before its boundary: keep that much
      const keepFrom = Math.max(0, (k + 1) * this.segFrames - SPLICE.RUN_IN) * this.spf;
      while (this.chunks.length && this.chunks[0].start + this.chunks[0].planes[0].length <= keepFrom) this.chunks.shift();

      await this.slot();
      this.dispatch({ k, lastK: k, startFrame, startSample, endSample, last }, planes);
      if (last) return;
    }
  }

  extract(start, end) {
    const out = Array.from({ length: this.channels }, () => new Float32Array(end - start));
    for (const chunk of this.chunks) {
      const cStart = chunk.start;
      const cEnd = cStart + chunk.planes[0].length;
      if (cEnd <= start || cStart >= end) continue;
      const from = Math.max(start, cStart);
      const to = Math.min(end, cEnd);
      for (let ch = 0; ch < this.channels; ch++) {
        out[ch].set(chunk.planes[ch].subarray(from - cStart, to - cStart), from - start);
      }
    }
    return out;
  }

  /** Resolves when another segment may be put in flight. */
  slot() {
    if (this.inFlight < this.maxInFlight) return Promise.resolve();
    return new Promise((resolve) => this.waiters.push(resolve));
  }

  dispatch(seg, planes) {
    this.inFlight++;
    const promise = this.pool
      .run(planes, this.sampleRate, this.kbps)
      .then(({ bytes, planes: pcm }) => {
        if (this.aborted) return;
        seg.bytes = bytes;
        seg.planes = pcm; // kept until stitched, in case of a re-merge
        seg.done = () => {
          seg.planes = null;
          seg.bytes = null;
        };
        this.encodedSamples += Math.min(this.segFrames * this.spf, seg.endSample - seg.startSample);
        if (this.onProgress && this.totalSamples) this.onProgress(Math.min(0.99, this.encodedSamples / this.totalSamples));
        return this.stitcher.add(seg);
      })
      .catch((err) => {
        this.error = this.error || err;
      })
      .finally(() => {
        this.inFlight--;
        const next = this.waiters.shift();
        if (next) next();
      });
    this.jobPromises.push(promise);
  }

  /** Two neighbours with no workable join: encode both as one segment. */
  async remerge(a, b) {
    const overlap = a.endSample - b.startSample;
    const aLen = a.planes[0].length;
    const planes = a.planes.map((pa, ch) => {
      const merged = new Float32Array(aLen + b.planes[ch].length - overlap);
      merged.set(pa);
      merged.set(b.planes[ch].subarray(overlap), aLen);
      return merged;
    });
    const { bytes, planes: pcm } = await this.pool.run(planes, this.sampleRate, this.kbps, true);
    const seg = {
      k: a.k, lastK: b.lastK, startFrame: a.startFrame,
      startSample: a.startSample, endSample: b.endSample, last: b.last,
      bytes, planes: pcm,
    };
    seg.done = () => {
      seg.planes = null;
      seg.bytes = null;
    };
    return seg;
  }

  async finish() {
    await this.cut(true);
    await Promise.all(this.jobPromises);
    if (this.error) throw this.error;
    await this.stitcher.chain;
    if (this.error) throw this.error;
    this.chunks = [];
    if (this.onProgress) this.onProgress(1);
    return new Blob([...this.blobs, ...this.parts], { type: "audio/mpeg" });
  }

  abort() {
    this.aborted = true;
    this.error = this.error || new Error("MP3 encode aborted");
    this.chunks = [];
    for (const w of this.waiters.splice(0)) w();
  }
}

/**
 * @param {object} opts
 * @param {number} opts.sampleRate   must be one of MP3_RATES (see nearestMp3Rate)
 * @param {1|2} opts.channels
 * @param {number} opts.kbps         constant bitrate, e.g. 320
 * @param {number} [opts.totalSamples]  per channel, if known: sizes segments and drives progress
 * @param {(fraction:number)=>void} [opts.onProgress]
 * @param {boolean} [opts.forceFallback]  use the single-thread encoder (tests)
 * @param {number} [opts.segFrames]       override the segment length (tests)
 */
export async function createMp3Encoder(opts) {
  if (!MP3_RATES.includes(opts.sampleRate)) throw new Error(`MP3 can't be written at ${opts.sampleRate} Hz`);
  if (opts.channels !== 1 && opts.channels !== 2) throw new Error("MP3 takes one or two channels");
  const pool = opts.forceFallback ? null : await getPool();
  return pool ? new PooledMp3Encoder(pool, opts) : createFallbackEncoder(opts);
}

/** Whole-buffer convenience: planar Float32 in, MP3 Blob out. */
export async function encodeMp3(planes, sampleRate, kbps, onProgress, extra = {}) {
  const opts = { sampleRate, channels: planes.length, kbps, totalSamples: planes[0].length, onProgress, ...extra };
  let encoder = await createMp3Encoder(opts);
  try {
    await encoder.write(planes);
    return await encoder.finish();
  } catch (err) {
    if (!encoder.parallel) throw err;
    // The whole buffer is still here, so a pool failure costs time, not the file
    console.warn("Parallel MP3 encode failed, retrying on the single-thread encoder:", err);
    encoder.abort();
    encoder = createFallbackEncoder(opts);
    await encoder.write(planes);
    return encoder.finish();
  }
}
