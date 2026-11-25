/**
 * admin.svelte.js
 * The owner's sign-in: who this browser is to the API Worker's owner-only
 * routes (workers/api/src/routes/admin.js). Settings has the card for it
 * (src/components/apps/settings/AdminCard.svelte); the Captions app reads
 * `unlocked` and `token` to publish lyrics.
 *
 * The owner holds a key (adminKey.js) behind a PIN. Unlocking signs a
 * challenge with it and gets a session token good for twelve hours. The token
 * is kept in memory and in sessionStorage only, so closing the browser signs
 * out. The PIN is never stored and never sent.
 *
 * A visitor's browser asks the Worker nothing: `check()` runs only when
 * somebody opens the owner's card on purpose, or a session is already held.
 */
import { callApi } from "./dogsApi.js";
import { getTurnstileToken } from "../components/turnstileToken.js";
import {
  adminKeySupported, hasAdminKey, createAdminKey, unlockAdminKey, signChallenge,
  exportAdminKeyFile, importAdminKeyFile, forgetAdminKey, pinIsLongEnough, SHORT_PIN,
} from "./adminKey.js";

const SESSION_KEY = "dogs_admin_session_v1";
const TURNSTILE_ACTION = "admin";
const TOKEN_PATTERN = /^\d{13}\.[0-9a-f]{64}$/;
/** setTimeout cannot wait longer than this. */
const MAX_TIMER_MS = 2147483647;
const STATUS_REFUSED = 401;
const STATUS_NOT_SET_UP = 409;
const NO_SECURE_PAGE = "This needs a secure page (https).";
const NOT_HUMAN = "The check that you are a person did not finish. Try again.";
const KEY_REFUSED = "The site did not accept this key. It is not the registered one, so it was removed from this device.";

/** @typedef {{ ok: boolean, error: string }} Outcome */

const done = () => ({ ok: true, error: "" });
const failed = (error) => ({ ok: false, error: error || "Something went wrong." });

function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    const live = session && TOKEN_PATTERN.test(session.token) && session.expires > Date.now();
    return live ? session : null;
  } catch (e) {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // Storage is blocked: the session lasts until the page is closed
  }
}

class Admin {
  /** This page can hold a key at all (Web Crypto: https or localhost). */
  supported = adminKeySupported();
  /** A key is registered with the Worker. null until check() has asked. */
  enrolled = $state(null);
  /** This device holds a key, locked behind its PIN. */
  hasKey = $state(false);
  /** The session token for "Authorization: Bearer", or "" when locked. */
  token = $state("");
  /** When the session ends, in ms since 1970. */
  expires = $state(0);
  /** A request to the Worker is under way. */
  busy = $state(false);
  unlocked = $derived(!!this.token);

  #expiryTimer = null;

  constructor() {
    if (typeof window === "undefined" || !this.supported) return;
    this.hasKey = hasAdminKey();
    const session = readSession();
    if (session) this.#open(session);
  }

  #open(session) {
    this.token = session.token;
    this.expires = session.expires;
    writeSession({ token: session.token, expires: session.expires });
    clearTimeout(this.#expiryTimer);
    this.#expiryTimer = setTimeout(() => this.lock(), Math.min(MAX_TIMER_MS, Math.max(0, session.expires - Date.now())));
  }

  /** Signs out of this browser. The key stays on the device, behind its PIN. */
  lock() {
    clearTimeout(this.#expiryTimer);
    this.token = "";
    this.expires = 0;
    writeSession(null);
  }

  /**
   * Asks the Worker whether a key is registered and whether the session still holds.
   * @returns {Promise<Outcome>}
   */
  async check() {
    const answer = await callApi("GET", "/admin/session", { token: this.token });
    if (!answer.ok || !answer.data) return failed(answer.error);
    this.enrolled = !!answer.data.enrolled;
    if (this.token && !answer.data.admin) this.lock();
    return done();
  }

  /** Runs one piece of work with `busy` set, turning a thrown error into an Outcome. */
  async #work(job) {
    if (!this.supported) return failed(NO_SECURE_PAGE);
    if (this.busy) return failed("Still working on the last request.");
    this.busy = true;
    try {
      return await job();
    } catch (error) {
      return failed(error && error.message);
    } finally {
      this.busy = false;
    }
  }

  /** Challenge, signature, session: the whole sign-in with an opened key. */
  async #signIn(signingKey) {
    const asked = await callApi("POST", "/admin/challenge");
    // The Worker holds no key at all (it was reset): this one is of no use, and setting up is open again
    if (asked.status === STATUS_NOT_SET_UP) this.enrolled = false;
    if (!asked.ok || !asked.data) return asked;
    this.enrolled = true;
    const signature = await signChallenge(signingKey, asked.data.challenge);
    const answer = await callApi("POST", "/admin/login", { body: { challenge: asked.data.challenge, signature } });
    if (answer.ok && answer.data) this.#open(answer.data);
    return answer;
  }

  /**
   * The first set-up: makes the key on this device, behind `pin`, and registers
   * its public half with the setup password. Works once, while no key is registered.
   * @param {string} password - the setup password (a Worker secret)
   * @param {string} pin
   * @returns {Promise<Outcome>}
   */
  setUp(password, pin) {
    return this.#work(async () => {
      if (!pinIsLongEnough(pin)) return failed(SHORT_PIN);
      let turnstile = "";
      try {
        turnstile = await getTurnstileToken(TURNSTILE_ACTION);
      } catch (e) {
        return failed(NOT_HUMAN);
      }
      // The key is stored before it is registered: a registered key that was lost could not be replaced from here
      const { publicKey } = await createAdminKey(pin);
      const answer = await callApi("POST", "/admin/enroll", { body: { password, token: turnstile, publicKey } });
      if (!answer.ok || !answer.data) {
        forgetAdminKey();
        return failed(answer.error);
      }
      this.hasKey = true;
      this.enrolled = true;
      this.#open(answer.data);
      return done();
    });
  }

  /**
   * Opens this device's key with the PIN and signs in.
   * @param {string} pin
   * @returns {Promise<Outcome>}
   */
  unlock(pin) {
    return this.#work(async () => {
      const answer = await this.#signIn(await unlockAdminKey(pin));
      return answer.ok ? done() : failed(answer.error);
    });
  }

  /**
   * Brings a key file to this device and signs in with it.
   * @param {string} text - the key file's contents
   * @param {string} pin - the PIN the key was made with
   * @returns {Promise<Outcome>}
   */
  importKey(text, pin) {
    return this.#work(async () => {
      const answer = await this.#signIn(await importAdminKeyFile(text, pin));
      if (answer.ok) {
        this.hasKey = true;
        return done();
      }
      // A key the Worker refuses outright is not the registered one: no use keeping it
      const refused = answer.status === STATUS_REFUSED;
      if (refused) forgetAdminKey();
      this.hasKey = hasAdminKey();
      return failed(refused ? KEY_REFUSED : answer.error);
    });
  }

  /** @returns {string} the key file's contents (still locked behind the PIN); throws when this device holds no key */
  exportKey() {
    return exportAdminKeyFile();
  }

  /** Removes the key from this device and signs out. The key file still works. */
  forget() {
    forgetAdminKey();
    this.hasKey = false;
    this.lock();
  }
}

export const admin = new Admin();
