/**
 * The ride bell: one of your devices asks another to connect in Air Train,
 * and you open Air Train on just the one.
 *
 * Every page of dogs.red that has a saved ride (Air Train, previous rides)
 * keeps a bell open: a small listening line on the free PeerJS service Air
 * Train already uses, under an id only the devices it paired with know (they
 * learn it once connected, components/apps/datatrain/rides.js). Pressing
 * Reconnect on one device waits on the ride's code and rings the other's
 * bell. The other device, wherever it is on the site, shows "Connection
 * requested" from the top middle (components/RideRequest.svelte). Accept, and
 * it joins in the background (lib/tether.svelte.js holds the connection, so
 * the music keeps playing) and the device that rang lets it in without asking
 * again. Deny, and the device that rang is told so.
 *
 * A ring names its ride by a tag worked out from the ride's secret: a bell
 * answers only rings for rides it has, and it never sends a secret. The
 * secret goes only to the device waiting on the ride's code, as in any
 * reconnect.
 */
import { tether } from "./tether.svelte.js";
import { openDogsPage } from "./openDogsPage.js";
import { deviceBellId, findRideByTag, hasRingableRides, tagOldRides, openRide } from "../components/apps/datatrain/rides.js";

const BELL_PREFIX = "dogs-train-bell-";
const BELL_LABEL = "dogs-ride-bell-v1";
const PROTOCOL_VERSION = 1;
const TYPE_RING = "ring";
const TYPE_ANSWER = "answer";
const BELL_PATTERN = /^[a-f0-9]{24}$/;
const TAG_PATTERN = /^[a-f0-9]{32}$/;
const MAX_MESSAGE_LENGTH = 256;
/** How long a request waits for Accept or Deny. */
const ANSWER_WAIT_MS = 60000;
/** How long a ring may take to reach the other device's bell. */
const REACH_WAIT_MS = 15000;
/** The bell opens a moment after the page does, so the first paint waits for nothing. */
const START_DELAY_MS = 2500;
/** A bell whose line dropped tries again after this long. */
const RETRY_MS = 15000;
/** Long enough for an answer to leave before its line closes. */
const CLOSE_DELAY_MS = 300;
/** How long "Connected" or "Could not connect" stays up before it goes by itself. */
const SETTLED_SHOW_MS = 8000;
/** The Air Train app (ToolboxPanel's id for Data Train). */
const AIR_TRAIN_APP = "dataflash";
/** Air Train states in which this device is already busy with a connection. */
const BUSY_STATUSES = ["connected", "reconnecting", "pending", "connecting"];

export const ANSWER_YES = "yes";
export const ANSWER_NO = "no";
/** Nobody answered: the other device is not on dogs.red, or runs an older version. */
export const ANSWER_AWAY = "away";
/** The other device is busy with another connection or another request. */
export const ANSWER_BUSY = "busy";
const ANSWERS = [ANSWER_YES, ANSWER_NO, ANSWER_AWAY, ANSWER_BUSY];

export const STEP_ASKING = "asking";
export const STEP_CONNECTING = "connecting";
export const STEP_CONNECTED = "connected";
export const STEP_FAILED = "failed";

/** @param {any} data @returns {object | null} a bell message, or null */
function readMessage(data) {
  if (typeof data !== "string" || data.length > MAX_MESSAGE_LENGTH) return null;
  try {
    const message = JSON.parse(data);
    return message && message.v === PROTOCOL_VERSION ? message : null;
  } catch (e) {
    return null;
  }
}

/** @param {object} conn - a PeerJS DataConnection @param {string} answer */
function sendAnswer(conn, answer) {
  try {
    conn.send(JSON.stringify({ v: PROTOCOL_VERSION, type: TYPE_ANSWER, answer }));
  } catch (e) {
    // The caller hung up already: there is nobody left to tell
  }
  setTimeout(() => conn.close(), CLOSE_DELAY_MS);
}

class RideBell {
  /**
   * The request the drop-down shows, or null.
   * @type {{ peerName: string, sealed: boolean, step: string, error: string } | null}
   */
  request = $state(null);

  #peer = null;
  /** The ring being answered: its line, its ride, and the timer that lets it go. */
  #pending = null;
  #started = false;
  #hideTimer = null;

  /** Opens the bell on this page (components/RideRequest.svelte, once). */
  start() {
    if (this.#started || typeof window === "undefined") return;
    this.#started = true;
    setTimeout(() => this.#open(), START_DELAY_MS);
    // A phone's screen came back on: a line that dropped while it slept is opened again
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;
      const peer = this.#peer;
      if (!peer) this.#open();
      else if (peer.disconnected && !peer.destroyed) peer.reconnect();
    });
  }

  /** A ride was saved or learned its bell: the bell may be worth opening now. */
  refresh() {
    if (this.#started) this.#open();
  }

  async #open() {
    if (this.#peer || !window.RTCPeerConnection) return;
    await tagOldRides();
    if (!hasRingableRides()) return;
    const { Peer } = await import("peerjs");
    if (this.#peer) return;
    const peer = new Peer(BELL_PREFIX + deviceBellId(), { debug: 0 });
    this.#peer = peer;
    peer.on("connection", (conn) => this.#heard(conn));
    peer.on("error", (error) => {
      // Another tab of this browser has the bell already: that one answers
      if (error.type === "unavailable-id") this.#close(peer);
    });
    peer.on("disconnected", () => {
      setTimeout(() => {
        if (this.#peer === peer && !peer.destroyed && peer.disconnected && !document.hidden) peer.reconnect();
      }, RETRY_MS);
    });
    peer.on("close", () => {
      if (this.#peer === peer) this.#peer = null;
    });
  }

  #close(peer) {
    if (this.#peer === peer) this.#peer = null;
    peer.destroy();
  }

  /** Someone is on the line: only a ring for one of this device's rides is answered. */
  #heard(conn) {
    if (conn.label !== BELL_LABEL) {
      conn.close();
      return;
    }
    const silent = setTimeout(() => conn.close(), REACH_WAIT_MS);
    conn.on("data", (data) => {
      clearTimeout(silent);
      this.#ringArrived(conn, readMessage(data));
    });
    conn.on("close", () => {
      clearTimeout(silent);
      // The device that rang gave up: its request goes too
      if (this.#pending && this.#pending.conn === conn) this.#forget();
    });
  }

  #ringArrived(conn, message) {
    if (this.#pending && this.#pending.conn === conn) return;
    const ride = message && message.type === TYPE_RING && TAG_PATTERN.test(message.tag) ? findRideByTag(message.tag) : null;
    if (!ride) {
      conn.close();
      return;
    }
    const status = tether.lastState ? tether.lastState.status : "";
    if (this.#pending || BUSY_STATUSES.indexOf(status) !== -1) {
      sendAnswer(conn, ANSWER_BUSY);
      return;
    }
    clearTimeout(this.#hideTimer);
    this.#pending = { conn, rideId: ride.id, timer: setTimeout(() => this.#letGo(ANSWER_AWAY), ANSWER_WAIT_MS) };
    this.request = { peerName: ride.peerName, sealed: ride.sealed, step: STEP_ASKING, error: "" };
  }

  /**
   * Yes: the device that rang is told, and this one joins it in the background.
   * @param {string} [pin] - for a ride the PIN seals
   */
  async accept(pin) {
    const pending = this.#pending;
    if (!pending) return;
    let opened;
    try {
      opened = await openRide(pending.rideId, pin);
    } catch (error) {
      if (this.#pending === pending) this.request = Object.assign({}, this.request, { error: error.message });
      return;
    }
    if (this.#pending !== pending) return;
    clearTimeout(pending.timer);
    this.#pending = null;
    sendAnswer(pending.conn, ANSWER_YES);
    this.request = Object.assign({}, this.request, { step: STEP_CONNECTING, error: "" });
    tether.joinRide(opened.code, opened.secret, (connected, error) => this.#settled(connected, error));
  }

  /** No: the device that rang is told so. */
  deny() {
    this.#letGo(ANSWER_NO);
  }

  /** The drop-down is closed by hand. */
  dismiss() {
    if (this.#pending) {
      this.deny();
      return;
    }
    clearTimeout(this.#hideTimer);
    this.request = null;
  }

  #letGo(answer) {
    const pending = this.#pending;
    if (!pending) return;
    sendAnswer(pending.conn, answer);
    this.#forget();
  }

  #forget() {
    if (this.#pending) clearTimeout(this.#pending.timer);
    this.#pending = null;
    this.request = null;
  }

  #settled(connected, error) {
    if (!this.request) return;
    this.request = Object.assign({}, this.request, { step: connected ? STEP_CONNECTED : STEP_FAILED, error: connected ? "" : error });
    // On the landing page Air Train opens by itself; anywhere else the drop-down offers it
    if (connected) openDogsPage({ app: AIR_TRAIN_APP });
    clearTimeout(this.#hideTimer);
    this.#hideTimer = setTimeout(() => (this.request = null), SETTLED_SHOW_MS);
  }

  /** Air Train, from the drop-down: it opens over whatever page is showing. */
  openAirTrain() {
    openDogsPage({ app: AIR_TRAIN_APP, force: true });
    clearTimeout(this.#hideTimer);
    this.request = null;
  }

  /**
   * Ring the other device of a ride, from this device's Air Train. Resolves
   * with its answer; ANSWER_AWAY when it never picked up.
   * @param {string} peerBell - its bell (rides.js)
   * @param {string} tag - the ride's tag
   * @returns {Promise<string>}
   */
  async ring(peerBell, tag) {
    if (!BELL_PATTERN.test(peerBell) || !TAG_PATTERN.test(tag) || !window.RTCPeerConnection) return ANSWER_AWAY;
    const { Peer } = await import("peerjs");
    return new Promise((resolve) => {
      const peer = new Peer({ debug: 0 });
      let done = false;
      let timer = setTimeout(() => finish(ANSWER_AWAY), REACH_WAIT_MS);
      function finish(answer) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        setTimeout(() => peer.destroy(), CLOSE_DELAY_MS);
        resolve(answer);
      }
      peer.on("open", () => {
        const conn = peer.connect(BELL_PREFIX + peerBell, { label: BELL_LABEL, reliable: true, serialization: "raw" });
        if (!conn) {
          finish(ANSWER_AWAY);
          return;
        }
        conn.on("open", () => {
          // It picked up: now the person on the other side has a minute to answer
          clearTimeout(timer);
          timer = setTimeout(() => finish(ANSWER_AWAY), ANSWER_WAIT_MS + REACH_WAIT_MS);
          conn.send(JSON.stringify({ v: PROTOCOL_VERSION, type: TYPE_RING, tag }));
        });
        conn.on("data", (data) => {
          const message = readMessage(data);
          if (message && message.type === TYPE_ANSWER && ANSWERS.indexOf(message.answer) !== -1) finish(message.answer);
        });
        conn.on("close", () => finish(ANSWER_AWAY));
      });
      peer.on("error", () => finish(ANSWER_AWAY));
    });
  }
}

export const rideBell = new RideBell();
