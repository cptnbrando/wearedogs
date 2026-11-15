const PROTOCOL_VERSION = 1;
const PEER_PREFIX = "dogs-train-";
const CHANNEL_LABEL = "dogs-data-train-v1";
const CODE_BYTES = 12;
const SECRET_BYTES = 16;
const ID_BYTES = 12;
const CHUNK_BYTES = 16 * 1024;
const WINDOW_BYTES = 256 * 1024;
const MAX_FILE_BYTES = 100 * 1024 * 1024;
const MAX_INBOX_BYTES = 200 * 1024 * 1024;
const MAX_TEXT_LENGTH = 16000;
const MAX_TEXT_BYTES = MAX_TEXT_LENGTH * 4;
const MAX_ITEMS = 200;
const MAX_QUEUE = 64;
const MAX_NAME_LENGTH = 255;
const MAX_DEVICE_LENGTH = 40;
const MAX_CONTROL_LENGTH = 4096;
const CONNECTION_TIMEOUT = 30000;
const APPROVAL_TIMEOUT = 120000;
const TRANSFER_TIMEOUT = 30000;
const CLOSE_DELAY = 150;
const TEXT_NAME = "Text note";
const TEXT_MIME = "text/plain;charset=utf-8";
const FILE_MIME = "application/octet-stream";
const CODE_PATTERN = /^[a-f0-9]{24}$/;
const SECRET_PATTERN = /^[a-f0-9]{32}$/;
const MIME_PATTERN = /^[\w.+-]+\/[\w.+-]+(?:;charset=[\w-]+)?$/;
const ACTIVE_STATUSES = ["queued", "waiting", "transferring"];
const ERRORS = {
  unsupported: "This browser cannot make a secure device connection. Try a current Chrome, Edge, Firefox or Safari browser.",
  invite: "This pairing link is incomplete or invalid. Scan a fresh QR code on the other device.",
  start: "Could not reach the pairing service. Check your internet connection and try again.",
  timeout: "Could not connect. Keep both pages open, try the same Wi-Fi network, and scan a fresh QR code.",
  approval: "Pairing approval timed out. Scan the QR code again and approve the device.",
  unavailable: "That device is no longer waiting. Keep its page open and scan a fresh QR code.",
  rejected: "The other device declined this connection. Scan a fresh QR code to try again.",
  closed: "The other device disconnected. Keep both pages open and pair again to continue.",
  protocol: "The other device sent an invalid transfer. Pair again to continue.",
  transfer: "This transfer stopped responding. Keep both pages awake and send it again.",
  read: "This file could not be read. Select it again and retry.",
  memory: "This device could not hold the received file. Remove saved items and try a smaller file.",
  size: "Files must be 100 MB or smaller. Choose a smaller file.",
  inbox: "The receiving device has 200 MB in its inbox. Save and remove received items before sending more.",
  items: "The transfer list is full. Remove finished items before sending more.",
  queue: "The send queue is full. Wait for some transfers to finish before adding more.",
  text: "Enter a text note of up to 16,000 characters.",
  disconnected: "Connect another device before sending files or text.",
};

/** Generate an unguessable identifier without relying on UUID or newer crypto APIs. */
function randomHex(length) {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  let result = "";
  for (let index = 0; index < bytes.length; index += 1) {
    result += (bytes[index] + 256).toString(16).slice(1);
  }
  return result;
}

/** Remove path separators and control characters from an untrusted display/download name. */
function safeName(name, fallback, limit = MAX_NAME_LENGTH) {
  if (typeof name !== "string") return fallback;
  const clean = name.replace(/[\x00-\x1f\x7f/\\]/g, "").trim().slice(0, limit);
  return clean && clean !== "." && clean !== ".." ? clean : fallback;
}

/**
 * One approved WebRTC connection with a bounded, acknowledged file/text queue.
 * PeerServer exchanges connection details; payloads travel over the data channel.
 * The invitation secret is sent only after that encrypted channel opens.
 */
export class TransferSession {
  /** @param {{onChange?: (state: object) => void}} options */
  constructor({ onChange } = {}) {
    this.onChange = onChange;
    this.peer = null;
    this.connection = null;
    this.role = null;
    this.generation = 0;
    this.destroyed = false;
    this.connectionTimer = null;
    this.closeTimers = [];
    this.queue = [];
    this.activeSend = null;
    this.activeReceive = null;
    this.state = {
      status: "idle", error: "", code: "", secret: "", peerName: "", pendingName: "",
      selfName: typeof navigator !== "undefined" && /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
        ? "Phone or tablet" : "Computer",
      items: [], busy: false,
    };
  }

  /** Create an invitation that stays valid while this page waits for a device. */
  async host() {
    return this._start("host");
  }

  /** @param {string} code @param {string} secret @param {string} [deviceName] */
  async join(code, secret, deviceName) {
    if (!CODE_PATTERN.test(code) || !SECRET_PATTERN.test(secret)) {
      this.state.error = ERRORS.invite;
      this.state.status = "error";
      this._emit();
      return false;
    }
    return this._start("guest", code, secret, deviceName);
  }

  /** Approve the authenticated invitation holder before accepting any payloads. */
  acceptPeer() {
    if (this.role !== "host" || this.state.status !== "pending" || !this.connection?.open) return false;
    clearTimeout(this.connectionTimer);
    this.state.peerName = this.state.pendingName;
    this.state.pendingName = "";
    this.state.status = "connected";
    this.state.error = "";
    if (!this._send({ type: "welcome", name: this.state.selfName })) return false;
    this._emit();
    return true;
  }

  /** Decline one candidate while keeping this invitation available. */
  rejectPeer() {
    if (this.role !== "host" || this.state.status !== "pending") return;
    this._send({ type: "reject" });
    this._releaseCandidate();
  }

  /** Queue files without reading their contents into memory until their turn. */
  sendFiles(files) {
    if (!this._canSend()) return false;
    let accepted = false;
    this.state.error = "";
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (!file || typeof file.slice !== "function" || !Number.isSafeInteger(file.size) || file.size < 0 || file.size > MAX_FILE_BYTES) {
        this.state.error = ERRORS.size;
        continue;
      }
      accepted = this._enqueue(file, {
        kind: "file", name: safeName(file.name, "Shared file"),
        mime: MIME_PATTERN.test(file.type) ? file.type : FILE_MIME,
      }) || accepted;
    }
    this._emit();
    this._next();
    return accepted;
  }

  /** Queue Unicode text through the same bounded binary transport as files. */
  sendText(text) {
    if (!this._canSend()) return false;
    if (typeof text !== "string" || !text.trim() || text.length > MAX_TEXT_LENGTH) {
      this.state.error = ERRORS.text;
      this._emit();
      return false;
    }
    this.state.error = "";
    const accepted = this._enqueue(new Blob([text], { type: TEXT_MIME }), {
      kind: "text", name: TEXT_NAME, mime: TEXT_MIME, text,
    });
    this._emit();
    this._next();
    return accepted;
  }

  /** Stop an outgoing or incoming transfer and notify the other device. */
  cancelTransfer(id) {
    const item = this.state.items.find((entry) => entry.id === id);
    if (!item || ACTIVE_STATUSES.indexOf(item.status) === -1) return;
    if (this.state.status === "connected") this._send({ type: "cancel", id });
    this._finishTransfer(id, "cancelled");
  }

  /** Release a finished item's Blob URL and reclaim its inbox allowance. */
  removeItem(id) {
    const item = this.state.items.find((entry) => entry.id === id);
    if (!item) return;
    if (ACTIVE_STATUSES.indexOf(item.status) !== -1) this.cancelTransfer(id);
    if (item.url) URL.revokeObjectURL(item.url);
    this.state.items = this.state.items.filter((entry) => entry.id !== id);
    this._emit();
  }

  /** End pairing while retaining finished files and the UI subscription. */
  disconnect() {
    this._endConnection("disconnected", "");
  }

  /** Close all network activity, cancel readers/timers and release received files. */
  destroy() {
    this.destroyed = true;
    this.generation += 1;
    this._dispose();
    this.state.items.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    this.state.items = [];
    this.onChange = null;
  }

  async _start(role, code, secret, deviceName) {
    this.generation += 1;
    const generation = this.generation;
    this._dispose();
    this.destroyed = false;
    this.role = role;
    this.state.items.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    Object.assign(this.state, { status: "starting", error: "", code: "", secret: "", peerName: "", pendingName: "", items: [] });
    if (typeof window === "undefined" || !window.RTCPeerConnection || !window.crypto?.getRandomValues || typeof FileReader === "undefined") {
      this.state.status = "unsupported";
      this.state.error = ERRORS.unsupported;
      this._emit();
      return false;
    }
    this.state.code = code || randomHex(CODE_BYTES);
    this.state.secret = secret || randomHex(SECRET_BYTES);
    this.state.selfName = safeName(deviceName, this.state.selfName, MAX_DEVICE_LENGTH);
    this._emit();
    this._connectionDeadline(CONNECTION_TIMEOUT, ERRORS.start);
    try {
      const { Peer } = await import("peerjs");
      if (generation !== this.generation || this.destroyed || this.state.status !== "starting") return false;
      const peer = new Peer(PEER_PREFIX + (role === "host" ? this.state.code : randomHex(CODE_BYTES)), { debug: 0 });
      this.peer = peer;
      peer.on("open", () => {
        if (this.peer !== peer) return;
        clearTimeout(this.connectionTimer);
        if (role === "host") {
          this.state.status = "waiting";
          this._emit();
          return;
        }
        this.state.status = "connecting";
        this._attach(peer.connect(PEER_PREFIX + code, { label: CHANNEL_LABEL, reliable: true, serialization: "raw" }));
        this._emit();
      });
      peer.on("connection", (connection) => {
        if (this.peer !== peer || role !== "host" || this.connection || connection.label !== CHANNEL_LABEL || connection.serialization !== "raw") {
          connection.close();
          return;
        }
        this._attach(connection);
      });
      peer.on("error", (error) => {
        if (this.peer !== peer) return;
        if (this.state.status === "connected" && this.connection?.open && ["network", "socket-error", "server-error"].indexOf(error.type) !== -1) return;
        this._endConnection("error", error.type === "peer-unavailable" ? ERRORS.unavailable : ERRORS.start);
      });
      peer.on("disconnected", () => {
        if (this.peer !== peer || this.state.status === "connected") return;
        this._endConnection("error", ERRORS.start);
      });
      peer.on("close", () => {
        if (this.peer === peer) this._endConnection("disconnected", ERRORS.closed);
      });
      return true;
    } catch {
      if (generation === this.generation && !this.destroyed) this._endConnection("error", ERRORS.start);
      return false;
    }
  }

  _attach(connection) {
    if (!connection) {
      this._endConnection("error", ERRORS.timeout);
      return;
    }
    this.connection = connection;
    this._connectionDeadline(CONNECTION_TIMEOUT, ERRORS.timeout);
    connection.on("open", () => {
      if (this.connection !== connection) return;
      if (this.role === "guest") {
        this._send({ type: "hello", secret: this.state.secret, name: this.state.selfName });
        this._connectionDeadline(APPROVAL_TIMEOUT, ERRORS.approval);
      }
    });
    connection.on("data", (data) => {
      if (this.connection === connection) this._receive(data);
    });
    connection.on("error", () => {
      if (this.connection !== connection) return;
      this._endConnection("error", ERRORS.timeout);
    });
    connection.on("close", () => {
      if (this.connection !== connection) return;
      if (this.role === "host" && this.state.status !== "connected") {
        this._releaseCandidate();
        return;
      }
      this._endConnection("disconnected", ERRORS.closed);
    });
  }

  _receive(data) {
    if (data instanceof ArrayBuffer) {
      this._receiveChunk(data);
      return;
    }
    if (typeof data !== "string" || data.length > MAX_CONTROL_LENGTH) {
      this._endConnection("error", ERRORS.protocol);
      return;
    }
    let packet;
    try {
      packet = JSON.parse(data);
    } catch {
      this._endConnection("error", ERRORS.protocol);
      return;
    }
    if (!packet || packet.v !== PROTOCOL_VERSION || typeof packet.type !== "string") {
      this._endConnection("error", ERRORS.protocol);
      return;
    }
    if (this.state.status !== "connected") {
      this._handshake(packet);
      return;
    }
    if (!CODE_PATTERN.test(packet.id)) {
      this._endConnection("error", ERRORS.protocol);
      return;
    }
    switch (packet.type) {
      case "offer": this._receiveOffer(packet); break;
      case "ready":
        if (this.activeSend?.id !== packet.id || this.activeSend.phase !== "offer") break;
        this.activeSend.phase = "chunks";
        this._patchItem(packet.id, { status: "transferring" });
        this._pump();
        break;
      case "ack": this._acknowledge(packet); break;
      case "end": this._receiveEnd(packet); break;
      case "complete":
        if (this.activeSend?.id === packet.id && this.activeSend.phase === "end") this._finishTransfer(packet.id, "complete");
        break;
      case "cancel": this._finishTransfer(packet.id, "cancelled"); break;
      case "transfer-error":
        this._finishTransfer(packet.id, "error", typeof packet.reason === "string" ? packet.reason.slice(0, MAX_NAME_LENGTH) : ERRORS.transfer);
        break;
      default: this._endConnection("error", ERRORS.protocol);
    }
  }

  _handshake(packet) {
    if (this.role === "host" && this.state.status === "waiting" && packet.type === "hello") {
      if (packet.secret !== this.state.secret || typeof packet.name !== "string" || packet.name.length > MAX_DEVICE_LENGTH) {
        this._releaseCandidate();
        return;
      }
      this.state.pendingName = safeName(packet.name, "Other device", MAX_DEVICE_LENGTH);
      this.state.status = "pending";
      this._connectionDeadline(APPROVAL_TIMEOUT, ERRORS.approval);
      this._emit();
      return;
    }
    if (this.role === "guest" && this.state.status === "connecting" && packet.type === "welcome") {
      clearTimeout(this.connectionTimer);
      this.state.peerName = safeName(packet.name, "Other device", MAX_DEVICE_LENGTH);
      this.state.status = "connected";
      this.state.error = "";
      this._emit();
      return;
    }
    if (this.role === "guest" && packet.type === "reject") {
      this._endConnection("disconnected", ERRORS.rejected);
      return;
    }
    this._endConnection("error", ERRORS.protocol);
  }

  _enqueue(file, fields) {
    if (this.queue.length >= MAX_QUEUE || this.state.items.length >= MAX_ITEMS) {
      this.state.error = this.queue.length >= MAX_QUEUE ? ERRORS.queue : ERRORS.items;
      return false;
    }
    const id = randomHex(ID_BYTES);
    this.state.items.push({ id, direction: "sent", name: "", mime: "", text: "", url: "", size: file.size, progress: 0, status: "queued", ...fields });
    this.queue.push({ id, file, ...fields, offset: 0, acknowledged: 0, reader: null, timer: null, phase: "offer" });
    return true;
  }

  _next() {
    if (this.activeSend || !this.queue.length || this.state.status !== "connected") return;
    const job = this.queue.shift();
    this.activeSend = job;
    this._patchItem(job.id, { status: "waiting" });
    this._transferDeadline(job);
    this._send({ type: "offer", id: job.id, kind: job.kind, name: job.name, size: job.file.size, mime: job.mime });
  }

  _receiveOffer(packet) {
    if (this.activeReceive || this.state.items.some((item) => item.id === packet.id)) {
      this._endConnection("error", ERRORS.protocol);
      return;
    }
    const validKind = packet.kind === "file" || packet.kind === "text";
    const sizeLimit = packet.kind === "text" ? MAX_TEXT_BYTES : MAX_FILE_BYTES;
    if (!validKind || !Number.isSafeInteger(packet.size) || packet.size < 0 || packet.size > sizeLimit || typeof packet.name !== "string" || packet.name.length > MAX_NAME_LENGTH || typeof packet.mime !== "string" || packet.mime.length > MAX_NAME_LENGTH) {
      this._send({ type: "transfer-error", id: packet.id, reason: ERRORS.size });
      return;
    }
    const usedBytes = this.state.items.reduce((sum, item) => sum + (item.direction === "received" && item.status === "complete" ? item.size : 0), 0);
    if (this.state.items.length >= MAX_ITEMS || usedBytes + packet.size > MAX_INBOX_BYTES) {
      this._send({ type: "transfer-error", id: packet.id, reason: this.state.items.length >= MAX_ITEMS ? ERRORS.items : ERRORS.inbox });
      return;
    }
    const item = {
      id: packet.id, direction: "received", kind: packet.kind,
      name: packet.kind === "text" ? TEXT_NAME : safeName(packet.name, "Shared file"),
      mime: packet.kind === "text" ? TEXT_MIME : (MIME_PATTERN.test(packet.mime) ? packet.mime : FILE_MIME),
      size: packet.size, text: "", url: "", progress: 0, status: "transferring",
    };
    this.state.items.push(item);
    this.activeReceive = { id: packet.id, size: packet.size, offset: 0, chunks: [], timer: null, reader: null, item };
    this._transferDeadline(this.activeReceive);
    this._emit();
    this._send({ type: "ready", id: packet.id });
  }

  _pump() {
    const job = this.activeSend;
    if (!job || job.reader || job.phase !== "chunks" || this.state.status !== "connected") return;
    if (job.offset === job.file.size) {
      if (job.acknowledged !== job.offset) return;
      job.phase = "end";
      this._transferDeadline(job);
      this._send({ type: "end", id: job.id, size: job.offset });
      return;
    }
    if (job.offset - job.acknowledged >= WINDOW_BYTES) return;
    const reader = new FileReader();
    job.reader = reader;
    reader.onload = () => {
      if (this.activeSend !== job || this.state.status !== "connected") return;
      job.reader = null;
      const buffer = reader.result;
      if (!(buffer instanceof ArrayBuffer) || !buffer.byteLength || buffer.byteLength > CHUNK_BYTES) {
        this._transferFailure(job.id, ERRORS.read);
        return;
      }
      job.offset += buffer.byteLength;
      if (!this._send(buffer)) return;
      this._pump();
    };
    reader.onerror = () => {
      if (this.activeSend === job) this._transferFailure(job.id, ERRORS.read);
    };
    try {
      reader.readAsArrayBuffer(job.file.slice(job.offset, job.offset + CHUNK_BYTES));
    } catch {
      this._transferFailure(job.id, ERRORS.read);
    }
  }

  _receiveChunk(buffer) {
    if (this.state.status !== "connected" || buffer.byteLength > CHUNK_BYTES || !buffer.byteLength) {
      this._endConnection("error", ERRORS.protocol);
      return;
    }
    // A cancelled transfer can still have up to one bounded window in flight.
    const job = this.activeReceive;
    if (!job) return;
    if (job.reader || buffer.byteLength !== Math.min(CHUNK_BYTES, job.size - job.offset)) {
      this._transferFailure(job.id, ERRORS.protocol);
      return;
    }
    job.chunks.push(buffer);
    job.offset += buffer.byteLength;
    this._transferDeadline(job);
    this._progress(job.id, job.offset, job.size);
    this._send({ type: "ack", id: job.id, offset: job.offset });
  }

  _acknowledge(packet) {
    const job = this.activeSend;
    if (!job || job.id !== packet.id || job.phase !== "chunks") return;
    if (!Number.isSafeInteger(packet.offset) || packet.offset <= job.acknowledged || packet.offset > job.offset || (packet.offset !== job.file.size && packet.offset % CHUNK_BYTES !== 0)) {
      this._endConnection("error", ERRORS.protocol);
      return;
    }
    job.acknowledged = packet.offset;
    this._transferDeadline(job);
    this._progress(job.id, job.acknowledged, job.file.size);
    this._pump();
  }

  _receiveEnd(packet) {
    const job = this.activeReceive;
    if (!job || job.id !== packet.id) return;
    if (job.reader || packet.size !== job.size || job.offset !== job.size) {
      this._transferFailure(job.id, ERRORS.protocol);
      return;
    }
    let blob;
    try {
      blob = new Blob(job.chunks, { type: job.item.mime });
      if (job.item.kind === "file") job.item.url = URL.createObjectURL(blob);
    } catch {
      this._transferFailure(job.id, ERRORS.memory);
      return;
    }
    job.chunks = [];
    if (job.item.kind === "file") {
      this._finishTransfer(job.id, "complete");
      this._send({ type: "complete", id: job.id });
      return;
    }
    const reader = new FileReader();
    job.reader = reader;
    reader.onload = () => {
      if (this.activeReceive !== job || this.state.status !== "connected") return;
      if (typeof reader.result !== "string" || reader.result.length > MAX_TEXT_LENGTH) {
        this._transferFailure(job.id, ERRORS.text);
        return;
      }
      job.item.text = reader.result;
      this._finishTransfer(job.id, "complete");
      this._send({ type: "complete", id: job.id });
    };
    reader.onerror = () => {
      if (this.activeReceive === job) this._transferFailure(job.id, ERRORS.read);
    };
    reader.readAsText(blob);
  }

  _finishTransfer(id, status, error = "") {
    const item = this.state.items.find((entry) => entry.id === id);
    if (!item || ACTIVE_STATUSES.indexOf(item.status) === -1) return;
    if (this.activeSend?.id === id) {
      this._disposeJob(this.activeSend);
      this.activeSend = null;
    }
    if (this.activeReceive?.id === id) {
      this._disposeJob(this.activeReceive);
      this.activeReceive = null;
    }
    this.queue = this.queue.filter((job) => job.id !== id);
    this._patchItem(id, { status, error, progress: status === "complete" ? 100 : item.progress });
    this._next();
  }

  _transferFailure(id, reason) {
    this._send({ type: "transfer-error", id, reason });
    this._finishTransfer(id, "error", reason);
  }

  _transferDeadline(job) {
    clearTimeout(job.timer);
    job.timer = setTimeout(() => {
      if (this.activeSend === job || this.activeReceive === job) this._transferFailure(job.id, ERRORS.transfer);
    }, TRANSFER_TIMEOUT);
  }

  _connectionDeadline(duration, reason) {
    clearTimeout(this.connectionTimer);
    this.connectionTimer = setTimeout(() => {
      if (this.role === "host" && this.connection && this.state.status !== "connected") {
        this._releaseCandidate();
        return;
      }
      this._endConnection("error", reason);
    }, duration);
  }

  _send(packet) {
    if (!this.connection?.open) {
      this._endConnection("disconnected", ERRORS.closed);
      return false;
    }
    try {
      this.connection.send(packet instanceof ArrayBuffer ? packet : JSON.stringify({ v: PROTOCOL_VERSION, ...packet }));
      return true;
    } catch {
      this._endConnection("error", ERRORS.closed);
      return false;
    }
  }

  _canSend() {
    if (this.state.status === "connected" && this.connection?.open) return true;
    this.state.error = ERRORS.disconnected;
    this._emit();
    return false;
  }

  _progress(id, count, total) {
    const progress = total ? Math.min(99, Math.floor(count / total * 100)) : 0;
    const item = this.state.items.find((entry) => entry.id === id);
    if (item && item.progress !== progress) this._patchItem(id, { progress });
  }

  _patchItem(id, changes) {
    const item = this.state.items.find((entry) => entry.id === id);
    if (!item) return;
    Object.assign(item, changes);
    this._emit();
  }

  _emit() {
    if (this.destroyed) return;
    this.state.busy = !!this.activeSend || !!this.activeReceive || !!this.queue.length;
    if (this.onChange) this.onChange({ ...this.state, items: this.state.items.map((item) => ({ ...item })) });
  }

  _releaseCandidate() {
    clearTimeout(this.connectionTimer);
    const connection = this.connection;
    this.connection = null;
    this.state.pendingName = "";
    this.state.status = "waiting";
    if (connection) {
      const timer = setTimeout(() => {
        connection.close();
        this.closeTimers = this.closeTimers.filter((entry) => entry.timer !== timer);
      }, CLOSE_DELAY);
      this.closeTimers.push({ connection, timer });
    }
    this._emit();
  }

  _endConnection(status, error) {
    this._dispose();
    this.state.items.forEach((item) => {
      if (ACTIVE_STATUSES.indexOf(item.status) !== -1) {
        item.status = "error";
        item.error = error;
      }
    });
    this.state.status = status;
    this.state.error = error;
    this.state.pendingName = "";
    this._emit();
  }

  _disposeJob(job) {
    if (!job) return;
    clearTimeout(job.timer);
    if (job.reader?.readyState === 1) job.reader.abort();
    job.reader = null;
    job.file = null;
    job.chunks = null;
  }

  _dispose() {
    clearTimeout(this.connectionTimer);
    this._disposeJob(this.activeSend);
    this._disposeJob(this.activeReceive);
    this.activeSend = null;
    this.activeReceive = null;
    this.queue = [];
    const connection = this.connection;
    const peer = this.peer;
    this.connection = null;
    this.peer = null;
    if (connection) connection.close();
    if (peer) peer.destroy();
    this.closeTimers.forEach((entry) => {
      clearTimeout(entry.timer);
      entry.connection.close();
    });
    this.closeTimers = [];
  }
}
