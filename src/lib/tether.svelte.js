/**
 * The tether: two of your own devices, paired in Air Train, sharing more than
 * files. Today that is the music player: play, pause, skip, seek, shuffle,
 * repeat and the VOX / INS switch stay in step, and the device without the
 * sound works as a remote control for the one with it.
 *
 * It rides the Air Train connection (WebRTC, straight between the devices)
 * and nothing else, so only a device you paired and approved can join, and
 * anyone else on the same network keeps their own player. It is opt-in on
 * both devices: each turns Tether on in Air Train.
 *
 * This module also keeps the Air Train session itself. The session used to
 * end when the app closed; now it lives here, so you can leave Air Train, use
 * the rest of the site and come back to the same connection and files. It
 * ends when the window closes, when either device disconnects, or when
 * nothing has crossed it for IDLE_LIMIT_MS while Air Train is closed.
 */
import { audioCore } from "./AudioCore.svelte.js";
import { TransferSession } from "../components/apps/datatrain/transferSession.js";

/** How long a connection nobody is looking at may sit unused before it is closed. */
const IDLE_LIMIT_MS = 10 * 60 * 1000;
const KIND_TETHER = "tether";
const KIND_MUSIC = "music";
const MAX_ID_LENGTH = 80;
/** The player's sync messages a tethered device may send (see AudioCore.handleSyncMessage). */
const SYNC_TYPES = [
  "ping", "pong", "state_change", "time_update",
  "cmd_play", "cmd_pause", "cmd_seek", "cmd_next", "cmd_prev", "cmd_track",
];
const TEXT_FIELDS = ["uuid", "masterTabId", "trackId"];
const FLAG_FIELDS = ["isPlaying", "isInstrumental", "isShuffled"];
const TIME_FIELDS = ["currentTime", "duration"];
const COUNT_FIELDS = ["trackIndex", "repeatMode"];

/**
 * A sync message from the other device, rebuilt field by field so the player
 * only ever sees the shapes it expects. Null when it is not one.
 * @param {any} raw
 * @returns {object | null}
 */
export function cleanSyncMessage(raw) {
  if (!raw || SYNC_TYPES.indexOf(raw.type) === -1) return null;
  const msg = { type: raw.type };
  for (const field of TEXT_FIELDS) {
    if (typeof raw[field] === "string" && raw[field].length <= MAX_ID_LENGTH) msg[field] = raw[field];
  }
  for (const field of FLAG_FIELDS) {
    if (typeof raw[field] === "boolean") msg[field] = raw[field];
  }
  for (const field of TIME_FIELDS) {
    msg[field] = Number.isFinite(raw[field]) && raw[field] >= 0 ? raw[field] : 0;
  }
  for (const field of COUNT_FIELDS) {
    if (Number.isInteger(raw[field]) && raw[field] >= 0) msg[field] = raw[field];
  }
  // A message with no sender cannot be told from our own
  return msg.uuid ? msg : null;
}

class Tether {
  /** This device has Tether switched on. */
  on = $state(false);
  /** The other device has Tether switched on. */
  peerOn = $state(false);
  /** An Air Train connection is up. */
  connected = $state(false);
  /** The other device can tether at all (it runs a version of the site that knows how). */
  available = $state(false);
  peerName = $state("");

  session = null;
  lastState = null;
  /** The open Air Train screen's listener, or null while the app is closed. */
  view = null;
  idleTimer = null;
  wasLinked = false;

  /** Both devices opted in and the connection is up: the players are in step. */
  get linked() {
    return this.on && this.peerOn && this.connected;
  }

  /**
   * Air Train opens. Hands back the session still alive from last time, or a new one.
   * @param {(state: object) => void} onChange - the screen's listener
   * @returns {{ session: TransferSession, resumed: boolean }} resumed: it is already connected or holding files
   */
  open(onChange) {
    this.view = onChange;
    clearTimeout(this.idleTimer);
    const kept = this.session && this.lastState && (this.lastState.status === "connected" || this.lastState.items.length > 0);
    if (kept) {
      onChange(this.lastState);
      return { session: this.session, resumed: true };
    }
    if (this.session) this.session.destroy();
    const session = new TransferSession({ onChange: (state) => this.onState(session, state) });
    session.onApp = (payload) => this.onApp(session, payload);
    session.onActivity = () => this.touch();
    this.session = session;
    this.lastState = null;
    return { session, resumed: false };
  }

  /** Air Train closes. A live connection (or received files) stays; anything else is dropped. */
  close() {
    this.view = null;
    const keep = this.lastState && (this.lastState.status === "connected" || this.lastState.items.length > 0);
    if (keep) {
      this.touch();
      return;
    }
    this.end();
  }

  /** Close the connection and forget the session. */
  end() {
    clearTimeout(this.idleTimer);
    if (this.session) this.session.destroy();
    this.session = null;
    this.lastState = null;
    this.connected = false;
    this.available = false;
    this.peerName = "";
    this.drop();
  }

  /** Something crossed the connection: the idle clock starts over. */
  touch() {
    clearTimeout(this.idleTimer);
    if (this.view) return;
    this.idleTimer = setTimeout(() => this.end(), IDLE_LIMIT_MS);
  }

  /** The switch in Air Train. Tells the other device, which has to switch its own on. */
  setOn(value) {
    if (value && !(this.session && this.session.canSendApp())) return;
    this.on = !!value;
    if (this.session) this.session.sendApp({ k: KIND_TETHER, on: this.on });
    this.relink();
  }

  onState(session, state) {
    if (session !== this.session) return;
    this.lastState = state;
    const connected = state.status === "connected";
    if (connected !== this.connected) {
      this.connected = connected;
      this.available = connected && session.canSendApp();
      // A new connection starts untethered on both sides: opting in is per pairing
      if (!connected) this.drop();
    }
    this.peerName = state.peerName || "";
    if (this.view) this.view(state);
    else if (!connected && !state.items.length) this.end();
  }

  onApp(session, payload) {
    if (session !== this.session) return;
    if (payload.k === KIND_TETHER) {
      this.peerOn = payload.on === true;
      this.relink();
      return;
    }
    if (payload.k !== KIND_MUSIC || !this.linked) return;
    const msg = cleanSyncMessage(payload.msg);
    if (msg) audioCore.handleSyncMessage(msg, true);
  }

  /** Both switches go back to off and the player is this device's own again. */
  drop() {
    this.on = false;
    this.peerOn = false;
    this.relink();
  }

  /** Joins or parts the two players when the tether comes up or goes down. */
  relink() {
    const linked = this.linked;
    if (linked === this.wasLinked) return;
    this.wasLinked = linked;
    if (!linked) {
      audioCore.detachRemote();
      return;
    }
    const session = this.session;
    audioCore.attachRemote((msg) => session.sendApp({ k: KIND_MUSIC, msg }));
  }
}

export const tether = new Tether();
