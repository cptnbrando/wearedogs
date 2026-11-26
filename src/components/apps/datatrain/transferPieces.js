/**
 * Air Train: a file or a note on its way, in pieces (transferSession.js).
 *
 * The sender offers it, the receiver says ready, the pieces go, the receiver
 * says how far it has got (an "ack"), and once all of it is there the sender
 * says end and the receiver says complete. Only a bounded amount is ever in
 * flight without an ack, so a slow phone is never flooded.
 *
 * Two devices that both know "wide" (every current page) use big pieces:
 * 64 KB each, read from the file half a megabyte at a time, an ack every half
 * megabyte, and up to 4 MB in flight. A page from before keeps the old way:
 * 16 KB pieces, an ack for each, 256 KB in flight. The wide way is what makes
 * a big file go about as fast as a small photo.
 *
 * Plain functions over the session, which keeps the state.
 */
import { ERRORS, safeName } from "./sessionText.js";

export const WIDE_CAPABILITY = "wide";
const CHUNK_BYTES = 16 * 1024;
const WINDOW_BYTES = 256 * 1024;
const WIDE_CHUNK_BYTES = 64 * 1024;
const WIDE_WINDOW_BYTES = 4 * 1024 * 1024;
/** The wide way reads, and acks, this much at a time. */
const WIDE_BLOCK_BYTES = 512 * 1024;
export const MAX_FILE_BYTES = 100 * 1024 * 1024;
const MAX_INBOX_BYTES = 200 * 1024 * 1024;
export const MAX_TEXT_LENGTH = 16000;
const MAX_TEXT_BYTES = MAX_TEXT_LENGTH * 4;
export const MAX_ITEMS = 200;
const MAX_NAME_LENGTH = 255;
export const TEXT_NAME = "Text note";
export const TEXT_MIME = "text/plain;charset=utf-8";
export const FILE_MIME = "application/octet-stream";
export const MIME_PATTERN = /^[\w.+-]+\/[\w.+-]+(?:;charset=[\w-]+)?$/;
const MS_PER_SECOND = 1000;
const BYTES_PER_MB = 1024 * 1024;

/** @param {object} session @returns {number} the size of one piece on this connection */
export const chunkBytes = (session) => (session.wide ? WIDE_CHUNK_BYTES : CHUNK_BYTES);

/** "3.2 MB in 1.4 s (2.3 MB/s)" for the log. */
function speedText(bytes, startedAt) {
  const seconds = Math.max(0.001, (Date.now() - startedAt) / MS_PER_SECOND);
  const mb = bytes / BYTES_PER_MB;
  return `${mb.toFixed(1)} MB in ${seconds.toFixed(1)} s (${(mb / seconds).toFixed(1)} MB/s)`;
}

/** The other device offers a file or a note: take it, or say why not. */
export function receiveOffer(session, packet) {
  if (session.activeReceive || session.state.items.some((item) => item.id === packet.id)) {
    session._endConnection("error", ERRORS.protocol);
    return;
  }
  const validKind = packet.kind === "file" || packet.kind === "text";
  const sizeLimit = packet.kind === "text" ? MAX_TEXT_BYTES : MAX_FILE_BYTES;
  if (!validKind || !Number.isSafeInteger(packet.size) || packet.size < 0 || packet.size > sizeLimit || typeof packet.name !== "string" || packet.name.length > MAX_NAME_LENGTH || typeof packet.mime !== "string" || packet.mime.length > MAX_NAME_LENGTH) {
    session._send({ type: "transfer-error", id: packet.id, reason: ERRORS.size });
    return;
  }
  const usedBytes = session.state.items.reduce((sum, item) => sum + (item.direction === "received" && item.status === "complete" ? item.size : 0), 0);
  if (session.state.items.length >= MAX_ITEMS || usedBytes + packet.size > MAX_INBOX_BYTES) {
    session._send({ type: "transfer-error", id: packet.id, reason: session.state.items.length >= MAX_ITEMS ? ERRORS.items : ERRORS.inbox });
    return;
  }
  const item = {
    id: packet.id, direction: "received", kind: packet.kind,
    name: packet.kind === "text" ? TEXT_NAME : safeName(packet.name, "Shared file"),
    mime: packet.kind === "text" ? TEXT_MIME : (MIME_PATTERN.test(packet.mime) ? packet.mime : FILE_MIME),
    size: packet.size, text: "", url: "", progress: 0, status: "transferring",
  };
  session.state.items.push(item);
  session.activeReceive = { id: packet.id, size: packet.size, offset: 0, acked: 0, chunks: [], timer: null, reader: null, item, startedAt: Date.now() };
  session._transferDeadline(session.activeReceive);
  session._emit();
  session._send({ type: "ready", id: packet.id });
}

/**
 * Sends the next pieces of the file on its way, as far as the window allows.
 * Reads a block from the file when the last one is used up; called again by
 * each ack and each finished read.
 */
export function pump(session) {
  const job = session.activeSend;
  if (!job || job.reader || job.phase !== "chunks" || session.state.status !== "connected") return;
  const chunk = chunkBytes(session);
  const window = session.wide ? WIDE_WINDOW_BYTES : WINDOW_BYTES;
  if (!job.startedAt) job.startedAt = Date.now();
  while (job.offset < job.file.size) {
    if (job.offset - job.acknowledged >= window) return;
    const blockEnd = job.block ? job.blockStart + job.block.byteLength : 0;
    if (!job.block || job.offset >= blockEnd) {
      readBlock(session, job, chunk);
      return;
    }
    const from = job.offset - job.blockStart;
    const piece = job.block.slice(from, Math.min(from + chunk, job.block.byteLength));
    job.offset += piece.byteLength;
    if (!session._send(piece)) return;
  }
  if (job.acknowledged !== job.offset) return;
  job.block = null;
  job.phase = "end";
  session._transferDeadline(job);
  session._log("out", "transfer", `${job.name || "file"}: all there, ${speedText(job.offset, job.startedAt)}`);
  session._send({ type: "end", id: job.id, size: job.offset });
}

/** Reads the file's next block (a piece's worth on an old connection, half a megabyte on a wide one). */
function readBlock(session, job, chunk) {
  const size = session.wide ? WIDE_BLOCK_BYTES : chunk;
  const reader = new FileReader();
  job.reader = reader;
  reader.onload = () => {
    if (session.activeSend !== job || session.state.status !== "connected") return;
    job.reader = null;
    const buffer = reader.result;
    if (!(buffer instanceof ArrayBuffer) || !buffer.byteLength || buffer.byteLength > size) {
      session._transferFailure(job.id, ERRORS.read);
      return;
    }
    job.block = buffer;
    job.blockStart = job.offset;
    pump(session);
  };
  reader.onerror = () => {
    if (session.activeSend === job) session._transferFailure(job.id, ERRORS.read);
  };
  try {
    reader.readAsArrayBuffer(job.file.slice(job.offset, job.offset + size));
  } catch {
    session._transferFailure(job.id, ERRORS.read);
  }
}

/** A piece arrived. The wide way acks every block, and at the end; the old way acks each piece. */
export function receiveChunk(session, buffer) {
  const chunk = chunkBytes(session);
  if (session.state.status !== "connected" || buffer.byteLength > chunk || !buffer.byteLength) {
    session._endConnection("error", ERRORS.protocol);
    return;
  }
  // A cancelled transfer can still have up to one bounded window in flight.
  const job = session.activeReceive;
  if (!job) return;
  if (job.reader || buffer.byteLength !== Math.min(chunk, job.size - job.offset)) {
    session._transferFailure(job.id, ERRORS.protocol);
    return;
  }
  job.chunks.push(buffer);
  job.offset += buffer.byteLength;
  session._transferDeadline(job);
  session._progress(job.id, job.offset, job.size);
  if (session.wide && job.offset < job.size && job.offset - job.acked < WIDE_BLOCK_BYTES) return;
  job.acked = job.offset;
  session._send({ type: "ack", id: job.id, offset: job.offset });
}

/** The receiver says how far it has got: more can go. */
export function acknowledge(session, packet) {
  const job = session.activeSend;
  if (!job || job.id !== packet.id || job.phase !== "chunks") return;
  if (!Number.isSafeInteger(packet.offset) || packet.offset <= job.acknowledged || packet.offset > job.offset || (packet.offset !== job.file.size && packet.offset % chunkBytes(session) !== 0)) {
    session._endConnection("error", ERRORS.protocol);
    return;
  }
  job.acknowledged = packet.offset;
  session._transferDeadline(job);
  session._progress(job.id, job.acknowledged, job.file.size);
  pump(session);
}

/** The sender says that was all of it: the pieces become the file (or the note's text). */
export function receiveEnd(session, packet) {
  const job = session.activeReceive;
  if (!job || job.id !== packet.id) return;
  if (job.reader || packet.size !== job.size || job.offset !== job.size) {
    session._transferFailure(job.id, ERRORS.protocol);
    return;
  }
  let blob;
  try {
    blob = new Blob(job.chunks, { type: job.item.mime });
    if (job.item.kind === "file") {
      job.item.url = URL.createObjectURL(blob);
      // Kept so the share sheet (AirDrop / Quick Share) can open from a tap without an async fetch.
      job.item.blob = blob;
    }
  } catch {
    session._transferFailure(job.id, ERRORS.memory);
    return;
  }
  job.chunks = [];
  session._log("in", "transfer", `${job.item.name}: arrived, ${speedText(job.size, job.startedAt)}`);
  if (job.item.kind === "file") {
    session._finishTransfer(job.id, "complete");
    session._send({ type: "complete", id: job.id });
    return;
  }
  const reader = new FileReader();
  job.reader = reader;
  reader.onload = () => {
    if (session.activeReceive !== job || session.state.status !== "connected") return;
    if (typeof reader.result !== "string" || reader.result.length > MAX_TEXT_LENGTH) {
      session._transferFailure(job.id, ERRORS.text);
      return;
    }
    job.item.text = reader.result;
    session._finishTransfer(job.id, "complete");
    session._send({ type: "complete", id: job.id });
  };
  reader.onerror = () => {
    if (session.activeReceive === job) session._transferFailure(job.id, ERRORS.read);
  };
  reader.readAsText(blob);
}
