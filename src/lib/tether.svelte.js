/**
 * The tether: two of your own devices, paired in Air Train, sharing more than
 * files. Today that is the music player: play, pause, skip, seek, shuffle,
 * repeat and the VOX / INS switch stay in step, the device without the sound
 * works as a remote control for the one with it, and the visualizer shows the
 * same MilkDrop preset on both (lib/visualizer/presetDeck.svelte.js).
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
 *
 * A connection that drops by itself (a phone's screen turned off, the network
 * changed) is found again by the session (transferSession.js, "Holding on").
 * While that goes on the players are their own again; when the devices are
 * back together, a tether that was on comes back on without being asked.
 *
 * A tab that reloads keeps its connection: going away, it tells the other
 * device "be right back" (transferSession.stepAway) and leaves what it needs
 * in this tab's sessionStorage; loading again, it picks the connection up
 * (rejoin) and a tether that was on comes back on. A tab closed for good is
 * looked for by the other device for RETURN_WINDOW_MS, then let go.
 *
 * Once connected, each device tells the other where its ride bell is
 * (lib/rideBell.svelte.js), so next time either one can ring the other. A
 * device that accepts a ring joins the ride here, with Air Train closed.
 */
import { audioCore } from "./AudioCore.svelte.js";
import { TransferSession, RETURN_WINDOW_MS } from "../components/apps/datatrain/transferSession.js";
import { presetDeck } from "./visualizer/presetDeck.svelte.js";
import { deviceBellId, notePeerBell, listRides } from "../components/apps/datatrain/rides.js";
import { isLockupUrl } from "./musicLock.svelte.js";

/** How long a connection nobody is looking at may sit unused before it is closed. */
const IDLE_LIMIT_MS = 10 * 60 * 1000;
/** This tab's connection while it reloads (sessionStorage: this tab only, gone when it closes). */
const RETURN_STORAGE_KEY = "datatrain_return_v1";
const KIND_TETHER = "tether";
const KIND_MUSIC = "music";
const KIND_PRESET = "preset";
/** "Ring me here next time": this device's ride bell. */
const KIND_BELL = "bell";
const STATUS_CONNECTED = "connected";
/** The session is finding the other device again after a drop. */
const STATUS_RECONNECTING = "reconnecting";
/** A session in one of these is worth keeping when Air Train closes. */
const LIVE_STATUSES = [STATUS_CONNECTED, STATUS_RECONNECTING];
/** A ride joined in the background has got as far as it will in one of these. */
const SETTLED_STATUSES = [STATUS_CONNECTED, "disconnected", "error", "unsupported", "idle"];
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
  /** The connection dropped with the tether on, and is being found again. */
  holding = $state(false);
  /** This device has paired in Air Train before: the panel headers show the tether even while it is off (components/TetherIcon). */
  used = $state(false);

  session = null;
  lastState = null;
  /** The saved ride this session met on, when it was joined from a ring: Air Train must not save it again. */
  rideCode = "";
  /** A ride joined in the background is on its way; told how it went once. */
  onRideSettled = null;
  /** The open Air Train screen's listener, or null while the app is closed. */
  view = null;
  idleTimer = null;
  wasLinked = false;

  constructor() {
    if (typeof window === "undefined") return;
    this.used = listRides().length > 0;
    // A tab going away may be reloading: it says "be right back" and keeps what it needs to return
    window.addEventListener("pagehide", () => this.stepAway());
    // Back from the browser's page cache: the page lived on, its connection did not
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) this.returnAfterReload();
    });
    // A phone waking up: its timers slept, so the connection is looked at right away
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.session) this.session.wake();
    });
    this.returnAfterReload();
  }

  /** The tab is going away, maybe to reload. */
  stepAway() {
    // No connection here: nothing to keep, and nothing to clear (another copy of this module may hold one)
    if (!this.session) return;
    const saved = this.session.stepAway();
    try {
      if (!saved) sessionStorage.removeItem(RETURN_STORAGE_KEY);
      else sessionStorage.setItem(RETURN_STORAGE_KEY, JSON.stringify(Object.assign(saved, { tether: this.on || this.holding, at: Date.now() })));
    } catch (e) {
      // Storage is blocked: a reload starts over, as it used to
    }
  }

  /**
   * The tab reloaded with a connection: it is picked up again in the
   * background, before Air Train is even open (components/RideRequest loads this).
   */
  returnAfterReload() {
    let saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(RETURN_STORAGE_KEY));
      sessionStorage.removeItem(RETURN_STORAGE_KEY);
    } catch (e) {
      return;
    }
    if (!saved || typeof saved.at !== "number" || Date.now() - saved.at > RETURN_WINDOW_MS) return;
    const session = this.newSession();
    if (!session.rejoin(saved)) {
      this.end();
      return;
    }
    this.rideCode = saved.code;
    // A tether that was on comes back on once the devices are together (onState)
    this.holding = saved.tether === true;
    this.touch();
  }

  /** Both devices opted in and the connection is up: the players are in step. */
  get linked() {
    return this.on && this.peerOn && this.connected;
  }

  /** The song is heard on this device (the other one is the remote). */
  get soundHere() {
    return !audioCore.masterIsRemote;
  }

  /**
   * The sound can go across: not a lockup song, whose passcode never crosses
   * the tether, so the other device may not be able to open it.
   */
  get soundCanMove() {
    const track = audioCore.library[audioCore.currentTrackIndex];
    return this.linked && !!track && !isLockupUrl(track.src) && !isLockupUrl(track.instrumental);
  }

  /**
   * The speaker switch in the player: the sound goes to the other device, or
   * comes here, from where the song is, and plays. The device that hands it
   * over follows the other and goes quiet (lib/playerSync).
   */
  moveSound() {
    if (!this.soundCanMove || !audioCore.remoteLink) return;
    const at = audioCore.currentTime;
    if (!audioCore.masterIsRemote) {
      // First what is on here, so it plays this song and not the last one it had; then the
      // ask, to the tethered device only: this browser's other tabs keep following as they were
      audioCore.broadcastState("state_change");
      audioCore.remoteLink({ type: "cmd_play", uuid: audioCore.tabId, currentTime: at });
      return;
    }
    audioCore.masterIsRemote = false;
    audioCore.masterTabId = audioCore.tabId;
    audioCore.play(at);
  }

  /**
   * Air Train opens. Hands back the session still alive from last time, or a new one.
   * @param {(state: object) => void} onChange - the screen's listener
   * @returns {{ session: TransferSession, resumed: boolean }} resumed: it is already connected or holding files
   */
  open(onChange) {
    this.view = onChange;
    clearTimeout(this.idleTimer);
    const kept = this.session && this.lastState && (this.onRideSettled || LIVE_STATUSES.indexOf(this.lastState.status) !== -1 || this.lastState.items.length > 0);
    if (kept) {
      onChange(this.lastState);
      return { session: this.session, resumed: true };
    }
    return { session: this.newSession(), resumed: false };
  }

  /** A fresh session in place of any old one. */
  newSession() {
    if (this.session) this.session.destroy();
    const session = new TransferSession({ onChange: (state) => this.onState(session, state) });
    session.onApp = (payload) => this.onApp(session, payload);
    session.onActivity = () => this.touch();
    this.session = session;
    this.lastState = null;
    this.rideCode = "";
    return session;
  }

  /**
   * Join a saved ride the other device is waiting on, after this one said yes
   * to its ring (lib/rideBell). Works with Air Train closed; an open one sees it happen.
   * @param {string} code @param {string} secret
   * @param {(connected: boolean, error: string) => void} onSettled - told once: connected, or why not
   */
  joinRide(code, secret, onSettled) {
    const session = this.session || this.newSession();
    clearTimeout(this.idleTimer);
    this.rideCode = code;
    this.onRideSettled = onSettled;
    session.join(code, secret);
  }

  /** Air Train closes. A live connection (or received files) stays; anything else is dropped. */
  close() {
    this.view = null;
    const keep = this.lastState && (LIVE_STATUSES.indexOf(this.lastState.status) !== -1 || this.lastState.items.length > 0);
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
    this.rideCode = "";
    this.onRideSettled = null;
    this.connected = false;
    this.available = false;
    this.peerName = "";
    this.holding = false;
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
    const connected = state.status === STATUS_CONNECTED;
    const reconnecting = state.status === STATUS_RECONNECTING;
    const settled = this.onRideSettled;
    if (settled && SETTLED_STATUSES.indexOf(state.status) !== -1) {
      this.onRideSettled = null;
      settled(connected, state.error);
    }
    if (connected !== this.connected) {
      this.connected = connected;
      this.available = connected && session.canSendApp();
      // Ring me here next time (an older page never sends it, and drops it unread)
      if (this.available) session.sendApp({ k: KIND_BELL, id: deviceBellId() });
      if (!connected) {
        // A drop that is being mended remembers the switch; any other ending forgets it
        this.holding = reconnecting && (this.on || this.holding);
        this.drop();
      } else if (this.holding) {
        // Back together: the tether both sides had on comes back on. Each switches its own.
        this.holding = false;
        this.setOn(true);
      }
    } else if (!connected && !reconnecting) {
      this.holding = false;
    }
    this.peerName = state.peerName || "";
    if (connected) this.used = true;
    if (this.view) this.view(state);
    else if (!this.onRideSettled && !connected && !reconnecting && !state.items.length) this.end();
  }

  onApp(session, payload) {
    if (session !== this.session) return;
    if (payload.k === KIND_TETHER) {
      this.peerOn = payload.on === true;
      this.relink();
      return;
    }
    if (payload.k === KIND_BELL) {
      if (typeof payload.id === "string") notePeerBell(session.state.secret, payload.id);
      return;
    }
    if (!this.linked) return;
    // A device on an older version never sends this, and ignores it: the players still link
    if (payload.k === KIND_PRESET) {
      presetDeck.showFromPeer(payload.name);
      return;
    }
    if (payload.k !== KIND_MUSIC) return;
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
      presetDeck.setLink(null);
      audioCore.detachRemote();
      return;
    }
    const session = this.session;
    audioCore.attachRemote((msg) => session.sendApp({ k: KIND_MUSIC, msg }));
    presetDeck.setLink({
      send: (name) => session.sendApp({ k: KIND_PRESET, name }),
      // The device with the sound leads the show; the remote follows it
      leads: () => !audioCore.masterIsRemote,
    });
  }
}

export const tether = new Tether();
