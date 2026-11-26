import { ERRORS, randomHex, safeName } from "./sessionText.js";

const PROTOCOL_VERSION = 1;
const PEER_PREFIX = "dogs-train-";
const CHANNEL_LABEL = "dogs-data-train-v1";
const CODE_BYTES = 12;
const SECRET_BYTES = 16;
const ID_BYTES = 12;
const CHUNK_BYTES = 16 * 1024;
const WINDOW_BYTES = 256 * 1024;
export const MAX_FILE_BYTES = 100 * 1024 * 1024;
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
/** What this page can do beyond transfers, told to the other device while pairing. */
/** "hold": this page sends heartbeats and goodbyes, and can pick a dropped connection back up. */
const HOLD_CAPABILITY = "hold";
const CAPABILITIES = ["app", HOLD_CAPABILITY];
/** App messages the session keeps for itself (they never reach onApp). */
const BEAT_KIND = "beat";
const BYE_KIND = "bye";
/** "Be right back": this page is reloading (or closing) and may come straight back. */
const AWAY_KIND = "brb";
/** How long a device that said "be right back" is looked for. Long enough for a reload on a slow phone. */
export const RETURN_WINDOW_MS = 90 * 1000;
const ROLES = ["host", "guest"];
/** The answer to a heartbeat. It is sent on arrival, not on a timer, so a page whose timers the browser has slowed still answers. */
const ECHO_KIND = "beat-back";
const BEAT_EVERY_MS = 4000;
/** This many heartbeats in a row with nothing heard back: the other device is gone, whatever the browser still says. */
const MAX_MISSED_BEATS = 3;
/** A page that wakes having heard nothing for this long was asleep, and the other device has given up on it. */
const BEAT_TIMEOUT_MS = 13000;
/** How long a dropped connection is looked for again before giving up. */
const RESUME_WINDOW_MS = 10 * 60 * 1000;
/** Waits between tries; the last one repeats. */
const RESUME_WAITS_MS = [600, 1500, 3000, 6000];
/** What the screen is told while a dropped connection is being found again. */
const STATUS_RECONNECTING = "reconnecting";
const MAX_CAPABILITIES = 8;
const TEXT_NAME = "Text note";
const TEXT_MIME = "text/plain;charset=utf-8";
const FILE_MIME = "application/octet-stream";
const CODE_PATTERN = /^[a-f0-9]{24}$/;
const SECRET_PATTERN = /^[a-f0-9]{32}$/;
const MIME_PATTERN = /^[\w.+-]+\/[\w.+-]+(?:;charset=[\w-]+)?$/;
const ACTIVE_STATUSES = ["queued", "waiting", "transferring"];

/**
 * One approved WebRTC connection with a bounded, acknowledged file/text queue.
 * PeerServer exchanges connection details; payloads travel over the data channel.
 * The invitation secret is sent only after that encrypted channel opens.
 *
 * Small "app" messages ride the same channel for features that work across the
 * two devices (the tether, src/lib/tether.svelte.js). They go only to a device
 * that said it understands them while pairing: an older page would treat one
 * as a broken transfer and hang up.
 *
 * Holding on: a phone whose screen turns off, or a network that changes, kills
 * the connection without telling anyone. Two devices that both know "hold"
 * send each other a heartbeat; when it stops, each looks for the other again
 * on the same invitation for RESUME_WINDOW_MS. The host lets the guest back in
 * without asking only when it shows the resume key the host gave it over the
 * approved connection, a key that lives in the two pages' memory and nowhere
 * else. A page that is closed or disconnects on purpose says goodbye first, so
 * the other one stops at once and does not wait for it.
 */
export class TransferSession {
  /** @param {{onChange?: (state: object) => void}} options */
  constructor({ onChange } = {}) {
    this.onChange = onChange;
    /** Called with each app message from the other device. */
    this.onApp = null;
    /** Called when anything crosses the connection, either way. */
    this.onActivity = null;
    this.peerCapabilities = [];
    this.peer = null;
    this.connection = null;
    this.role = null;
    this.generation = 0;
    this.destroyed = false;
    this.connectionTimer = null;
    /** A saved ride's reconnect: when the other device already waits on the code, this one dials it instead. */
    this.orJoin = false;
    /** The other device accepted this device's ring (lib/rideBell): its hello is let in without asking. */
    this.trusted = false;
    /** Proves to the host that a returning guest is the one it approved. Empty: nothing to come back to. */
    this.resumeKey = "";
    this.resumeUntil = 0;
    this.resumeTries = 0;
    this.resumeTimer = null;
    this.resumeDeadline = null;
    /** The next search for the other device lasts this long instead of RESUME_WINDOW_MS. 0: the usual. */
    this.resumeWindow = 0;
    this.beatTimer = null;
    this.missedBeats = 0;
    this.lastHeard = 0;
    this.closeTimers = [];
    this.queue = [];
    /** Sent item id -> what it was made from, so a failed one can be sent again. */
    this.sources = new Map();
    this.activeSend = null;
    this.activeReceive = null;
    this.state = {
      status: "idle", error: "", code: "", secret: "", peerName: "", pendingName: "", resuming: false,
      selfName: typeof navigator !== "undefined" && /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
        ? "Phone or tablet" : "Computer",
      items: [], busy: false,
    };
  }

  /**
   * Create an invitation that stays valid while this page waits for a device.
   * Given the code and secret of an earlier pairing (rides.js), it waits on
   * that one again, so the same two devices can meet without a new QR code.
   * With orJoin, a code the other device is already waiting on is dialled
   * instead: whichever device reconnects first waits, the second one joins.
   * @param {string} [code] @param {string} [secret] @param {{ orJoin?: boolean }} [options]
   */
  async host(code, secret, options) {
    this.orJoin = !!(options && options.orJoin);
    if (code && CODE_PATTERN.test(code) && SECRET_PATTERN.test(secret)) return this._start("host", code, secret);
    return this._start("host");
  }

  /**
   * The other device said yes to this one's ring: the hello that comes with
   * the invitation's secret is let in without asking again here.
   */
  trustNext() {
    if (this.role !== "host") return;
    this.trusted = true;
    if (this.state.status === "pending") this.acceptPeer();
  }

  /** @param {string} code @param {string} secret @param {string} [deviceName] */
  async join(code, secret, deviceName) {
    this.orJoin = false;
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
    // Only a guest that can hold on gets a key to come back with
    if (this.peerCapabilities.indexOf(HOLD_CAPABILITY) === -1) this.resumeKey = "";
    else if (!this.resumeKey) this.resumeKey = randomHex(SECRET_BYTES);
    if (!this._send({ type: "welcome", name: this.state.selfName, caps: CAPABILITIES, resume: this.resumeKey })) return false;
    this._linkUp();
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

  /** True for something this device sent that failed or was cancelled and can go again. */
  canRetry(id) {
    const item = this.state.items.find((entry) => entry.id === id);
    return !!item && item.direction === "sent" && (item.status === "error" || item.status === "cancelled") && this.sources.has(id);
  }

  /** Send a failed or cancelled item again, as a new transfer in the old one's place. */
  retryTransfer(id) {
    if (!this.canRetry(id) || !this._canSend()) return false;
    const source = this.sources.get(id);
    this.state.error = "";
    this.sources.delete(id);
    this.state.items = this.state.items.filter((entry) => entry.id !== id);
    const accepted = this._enqueue(source.file, source.fields);
    this._emit();
    this._next();
    return accepted;
  }

  /** Release a finished item's Blob URL and reclaim its inbox allowance. */
  removeItem(id) {
    const item = this.state.items.find((entry) => entry.id === id);
    if (!item) return;
    if (ACTIVE_STATUSES.indexOf(item.status) !== -1) this.cancelTransfer(id);
    this.sources.delete(id);
    if (item.url) URL.revokeObjectURL(item.url);
    this.state.items = this.state.items.filter((entry) => entry.id !== id);
    this._emit();
  }

  /** True when the other device is connected and understands app messages. */
  canSendApp() {
    return this.state.status === "connected" && !!this.connection?.open && this.peerCapabilities.indexOf("app") !== -1;
  }

  /**
   * Send one small app message. Dropped (false) when the other device cannot
   * take it or it is too big to be a control message.
   * @param {object} payload - JSON-safe
   */
  sendApp(payload) {
    if (!this.canSendApp()) return false;
    const packet = JSON.stringify({ v: PROTOCOL_VERSION, type: "app", payload });
    if (packet.length > MAX_CONTROL_LENGTH) return false;
    try {
      this.connection.send(packet);
    } catch {
      return false;
    }
    if (this.onActivity) this.onActivity();
    return true;
  }

  /** End pairing while retaining finished files and the UI subscription. */
  disconnect() {
    this.leave();
    this._endConnection("disconnected", "");
  }

  /**
   * This page is going away or hanging up on purpose: the other device is told
   * now, so it stops at once and does not look for this one.
   */
  leave() {
    const said = this._sayBye();
    this.resumeKey = "";
    if (said) this._closeSoon();
  }

  /**
   * This page is going away and may be back in a moment: a reload looks just
   * like a close from here. The other device is told to look for it for
   * RETURN_WINDOW_MS instead of hanging up.
   * @returns {{ role: string, code: string, secret: string, resumeKey: string, peerName: string } | null}
   *   what this page needs to come back with rejoin(), or null when it cannot come back (it said goodbye)
   */
  stepAway() {
    const canReturn = this.state.status === "connected" && !!this.resumeKey && this.peerCapabilities.indexOf(HOLD_CAPABILITY) !== -1;
    if (!canReturn) {
      this.leave();
      return null;
    }
    const saved = { role: this.role, code: this.state.code, secret: this.state.secret, resumeKey: this.resumeKey, peerName: this.state.peerName };
    if (this._sendKind(AWAY_KIND)) this._closeSoon();
    return saved;
  }

  /**
   * Come back to the connection this tab had before it reloaded (stepAway):
   * the same invitation and resume key, so the other device, which is looking
   * for this one, lets it straight back in.
   * @param {{ role: string, code: string, secret: string, resumeKey: string, peerName?: string }} saved
   * @returns {boolean} false when there is nothing to come back to
   */
  rejoin(saved) {
    if (!saved || ROLES.indexOf(saved.role) === -1 || !CODE_PATTERN.test(saved.code) || !SECRET_PATTERN.test(saved.secret) || !SECRET_PATTERN.test(saved.resumeKey)) return false;
    if (typeof window === "undefined" || !window.RTCPeerConnection) return false;
    this.generation += 1;
    this._dispose();
    this.destroyed = false;
    this.role = saved.role;
    this.orJoin = false;
    this.trusted = false;
    this.resumeKey = saved.resumeKey;
    this.resumeWindow = RETURN_WINDOW_MS;
    Object.assign(this.state, {
      status: "connected", error: "", code: saved.code, secret: saved.secret,
      peerName: safeName(saved.peerName, "", MAX_DEVICE_LENGTH), pendingName: "", resuming: false, items: [],
    });
    // Picked up as a connection that dropped: the search is the usual one, shorter
    return this._resume();
  }

  /** The page is in front again: timers may have slept, so look at the connection now. */
  wake() {
    if (this.state.resuming) {
      this.resumeTries = 0;
      this._resume();
    } else if (this.state.status === "connected" && this.peerCapabilities.indexOf(HOLD_CAPABILITY) !== -1) {
      if (Date.now() - this.lastHeard > BEAT_TIMEOUT_MS) this._endConnection("disconnected", ERRORS.closed);
      else this._beat();
    }
  }

  /** Close all network activity, cancel readers/timers and release received files. */
  destroy() {
    this.leave();
    this.destroyed = true;
    this.generation += 1;
    clearTimeout(this.resumeDeadline);
    this._dispose();
    this.state.items.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    this.state.items = [];
    this.sources.clear();
    this.onChange = null;
    this.onApp = null;
    this.onActivity = null;
  }

  async _start(role, code, secret, deviceName) {
    this.generation += 1;
    const generation = this.generation;
    this._dispose();
    this.destroyed = false;
    this.role = role;
    this.trusted = false;
    this.state.items.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    this.sources.clear();
    this.resumeKey = "";
    clearTimeout(this.resumeDeadline);
    Object.assign(this.state, { status: "starting", error: "", code: "", secret: "", peerName: "", pendingName: "", resuming: false, items: [] });
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
    return this._open(role, generation);
  }

  /** Reach the pairing service as host or guest of the invitation in this.state. */
  async _open(role, generation) {
    const code = this.state.code;
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
        // The other device is already waiting on this ride's code: dial it
        if (error.type === "unavailable-id" && role === "host" && this.orJoin && !this.state.resuming) {
          this._start("guest", code, this.state.secret);
          return;
        }
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
        this._send({ type: "hello", secret: this.state.secret, name: this.state.selfName, caps: CAPABILITIES, resume: this.resumeKey });
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
    this.lastHeard = Date.now();
    this.missedBeats = 0;
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
    const kind = packet.type === "app" && packet.payload ? packet.payload.k : "";
    // A heartbeat only says "still here": it is not use, and must not hold the idle clock back
    if (kind === ECHO_KIND) return;
    if (kind === BEAT_KIND) {
      this._sendKind(ECHO_KIND);
      return;
    }
    if (kind === BYE_KIND) {
      this.resumeKey = "";
      this._endConnection("disconnected", ERRORS.closed);
      return;
    }
    // The other page is reloading: it is looked for, but not for as long as a sleeping phone
    if (kind === AWAY_KIND) {
      this.resumeWindow = RETURN_WINDOW_MS;
      this._endConnection("disconnected", ERRORS.closed);
      return;
    }
    if (this.onActivity) this.onActivity();
    if (packet.type === "app") {
      if (this.onApp && packet.payload && typeof packet.payload === "object") this.onApp(packet.payload);
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
      // Coming back after a drop: only the guest that was approved, shown by its key. Nobody is asked.
      const returning = this.state.resuming;
      if (returning && (!this.resumeKey || packet.resume !== this.resumeKey)) {
        this._releaseCandidate();
        return;
      }
      this.state.pendingName = safeName(packet.name, "Other device", MAX_DEVICE_LENGTH);
      this._noteCapabilities(packet.caps);
      this.state.status = "pending";
      if (returning || this.trusted) {
        this.acceptPeer();
        return;
      }
      this._connectionDeadline(APPROVAL_TIMEOUT, ERRORS.approval);
      this._emit();
      return;
    }
    if (this.role === "guest" && this.state.status === "connecting" && packet.type === "welcome") {
      clearTimeout(this.connectionTimer);
      this.state.peerName = safeName(packet.name, "Other device", MAX_DEVICE_LENGTH);
      this._noteCapabilities(packet.caps);
      this.state.status = "connected";
      this.state.error = "";
      this.resumeKey = SECRET_PATTERN.test(packet.resume) ? packet.resume : "";
      this._linkUp();
      this._emit();
      return;
    }
    if (this.role === "guest" && packet.type === "reject") {
      this.resumeKey = "";
      this._endConnection("disconnected", ERRORS.rejected);
      return;
    }
    this._endConnection("error", ERRORS.protocol);
  }

  /** Keep what the other device says it can do: a short list of short words, or nothing. */
  _noteCapabilities(caps) {
    this.peerCapabilities = Array.isArray(caps)
      ? caps.filter((cap) => typeof cap === "string" && cap.length <= MAX_DEVICE_LENGTH).slice(0, MAX_CAPABILITIES)
      : [];
  }

  _enqueue(file, fields) {
    if (this.queue.length >= MAX_QUEUE || this.state.items.length >= MAX_ITEMS) {
      this.state.error = this.queue.length >= MAX_QUEUE ? ERRORS.queue : ERRORS.items;
      return false;
    }
    const id = randomHex(ID_BYTES);
    this.state.items.push({ id, direction: "sent", name: "", mime: "", text: "", url: "", size: file.size, progress: 0, status: "queued", ...fields });
    this.queue.push({ id, file, ...fields, offset: 0, acknowledged: 0, reader: null, timer: null, phase: "offer" });
    this.sources.set(id, { file, fields });
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
      if (job.item.kind === "file") {
        job.item.url = URL.createObjectURL(blob);
        // Kept so the share sheet (AirDrop / Quick Share) can open from a tap without an async fetch.
        job.item.blob = blob;
      }
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
    // A delivered file needs no second try: let go of it
    if (status === "complete") this.sources.delete(id);
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
    // The screen sees one "reconnecting" for every step of finding the other device again
    const status = this.state.resuming ? STATUS_RECONNECTING : this.state.status;
    if (this.onChange) this.onChange({ ...this.state, status, items: this.state.items.map((item) => ({ ...item })) });
  }

  /** The two devices are together: the heartbeat starts and any search for each other stops. */
  _linkUp() {
    this.state.resuming = false;
    this.resumeTries = 0;
    clearTimeout(this.resumeTimer);
    clearTimeout(this.resumeDeadline);
    clearInterval(this.beatTimer);
    this.lastHeard = Date.now();
    this.missedBeats = 0;
    if (this.peerCapabilities.indexOf(HOLD_CAPABILITY) !== -1) this.beatTimer = setInterval(() => this._beat(), BEAT_EVERY_MS);
  }

  /** One heartbeat out, and a look at when the other device was last heard. */
  _beat() {
    if (this.state.status !== "connected" || this.peerCapabilities.indexOf(HOLD_CAPABILITY) === -1) return;
    if (this.missedBeats >= MAX_MISSED_BEATS || !this._sendKind(BEAT_KIND)) {
      this._endConnection("disconnected", ERRORS.closed);
      return;
    }
    this.missedBeats += 1;
  }

  /** A message of the session's own, straight onto the channel. False when it could not go. */
  _sendKind(kind) {
    if (!this.connection?.open) return false;
    try {
      this.connection.send(JSON.stringify({ v: PROTOCOL_VERSION, type: "app", payload: { k: kind } }));
      return true;
    } catch {
      return false;
    }
  }

  _sayBye() {
    return this.state.status === "connected" && this.peerCapabilities.indexOf(HOLD_CAPABILITY) !== -1 && this._sendKind(BYE_KIND);
  }

  /** Lets go of the connection but closes it a moment later, so a goodbye just sent can leave first. */
  _closeSoon() {
    const connection = this.connection;
    const peer = this.peer;
    this.connection = null;
    this.peer = null;
    setTimeout(() => {
      if (connection) connection.close();
      if (peer) peer.destroy();
    }, CLOSE_DELAY);
  }

  /**
   * A connection that dropped by itself is looked for again, on the same
   * invitation, until RESUME_WINDOW_MS has passed.
   * @returns {boolean} true when the search is on, so the caller must not end the session
   */
  _resume() {
    const live = this.state.status === "connected" || this.state.resuming;
    if (!live || !this.resumeKey || this.destroyed) return false;
    if (!this.state.resuming) {
      const searchMs = this.resumeWindow || RESUME_WINDOW_MS;
      this.resumeWindow = 0;
      this.resumeUntil = Date.now() + searchMs;
      this.resumeTries = 0;
      clearTimeout(this.resumeDeadline);
      this.resumeDeadline = setTimeout(() => this._endConnection("disconnected", ERRORS.closed), searchMs);
    }
    if (Date.now() >= this.resumeUntil) return false;
    this.generation += 1;
    const generation = this.generation;
    this._dispose();
    this._failActive(ERRORS.held);
    this.state.resuming = true;
    this.state.status = "starting";
    this.state.error = "";
    this.state.pendingName = "";
    this._emit();
    const wait = RESUME_WAITS_MS[Math.min(this.resumeTries, RESUME_WAITS_MS.length - 1)];
    this.resumeTries += 1;
    this.resumeTimer = setTimeout(() => {
      if (generation === this.generation && !this.destroyed) this._open(this.role, generation);
    }, wait);
    return true;
  }

  _failActive(error) {
    this.state.items.forEach((item) => {
      if (ACTIVE_STATUSES.indexOf(item.status) !== -1) {
        item.status = "error";
        item.error = error;
      }
    });
  }

  _releaseCandidate() {
    clearTimeout(this.connectionTimer);
    const connection = this.connection;
    this.connection = null;
    this.peerCapabilities = [];
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
    if (this._resume()) return;
    this._dispose();
    this._failActive(error);
    clearTimeout(this.resumeDeadline);
    this.resumeKey = "";
    this.state.resuming = false;
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
    clearTimeout(this.resumeTimer);
    clearInterval(this.beatTimer);
    this._disposeJob(this.activeSend);
    this._disposeJob(this.activeReceive);
    this.activeSend = null;
    this.activeReceive = null;
    this.queue = [];
    const connection = this.connection;
    const peer = this.peer;
    this.connection = null;
    this.peer = null;
    this.peerCapabilities = [];
    if (connection) connection.close();
    if (peer) peer.destroy();
    this.closeTimers.forEach((entry) => {
      clearTimeout(entry.timer);
      entry.connection.close();
    });
    this.closeTimers = [];
  }
}
