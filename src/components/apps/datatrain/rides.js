/**
 * Air Train: previous rides. The devices this one has paired with, so they can
 * meet again without scanning a new QR code.
 *
 * A ride keeps the pairing's code and secret and which side this device was.
 * Reconnecting meets on the old code: the device that reconnects first waits
 * on it, the second one dials it.
 *
 * Ringing (lib/rideBell.svelte.js): a ride also keeps a tag, worked out from
 * the secret the same way on both devices so it names the ride without giving
 * the secret away, and the other device's bell, which it tells this one once
 * they are connected. Reconnect rings that bell; the other device, anywhere
 * on dogs.red, is asked to accept, and once it does nobody is asked again.
 * Without a bell (an older ride, or the other device runs an older version)
 * both devices press Reconnect and the waiting one still allows the other in.
 * Tag and bell stay readable when the PIN seals the rest.
 *
 * Rides are kept on this device only (localStorage) until they are forgotten
 * from the list, the newest MAX_RIDES of them.
 *
 * The PIN is optional. With one set (src/lib/pinVault.js), a ride's code and
 * secret are sealed and Reconnect asks for the PIN; the device's name stays
 * readable so the list can be shown. Without one, rides are kept as they are.
 */
import { hasVault, vaultSupported, createVault, removeVault, seal, open } from "../../../lib/pinVault.js";

const STORAGE_KEY = "datatrain_rides_v1";
const MAX_RIDES = 8;
const MAX_NAME_LENGTH = 40;
const ID_BYTES = 8;
const CODE_PATTERN = /^[a-f0-9]{24}$/;
const SECRET_PATTERN = /^[a-f0-9]{32}$/;
const ROLES = ["host", "guest"];
const GONE = "That ride is no longer in the list.";
const TAG_PATTERN = /^[a-f0-9]{32}$/;
const BELL_PATTERN = /^[a-f0-9]{24}$/;
const TAG_SALT = "dogs-ride-tag:";
const TAG_HEX_LENGTH = 32;
const BELL_STORAGE_KEY = "datatrain_bell_v1";
const BELL_BYTES = 12;
/** Bells heard before their ride was saved: tag -> bell. */
const heardBells = {};
/** This page's bell when storage is blocked: it lasts as long as the page. */
let pageBell = "";

/**
 * This device's bell: the id its pages listen on for rings (lib/rideBell),
 * told to each device it connects with. Made once and kept.
 * @returns {string}
 */
export function deviceBellId() {
  try {
    const kept = localStorage.getItem(BELL_STORAGE_KEY);
    if (BELL_PATTERN.test(kept)) return kept;
    const made = randomId(BELL_BYTES);
    localStorage.setItem(BELL_STORAGE_KEY, made);
    return made;
  } catch (e) {
    if (!pageBell) pageBell = randomId(BELL_BYTES);
    return pageBell;
  }
}

/**
 * The ride's name both devices give it, from the secret they share. Empty
 * where this page cannot hash (an insecure page): such a ride is not rung.
 * @param {string} secret
 * @returns {Promise<string>}
 */
export async function rideTag(secret) {
  if (!SECRET_PATTERN.test(secret) || !window.crypto || !crypto.subtle) return "";
  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(TAG_SALT + secret));
    let hex = "";
    new Uint8Array(digest).forEach((byte) => (hex += (byte + 256).toString(16).slice(1)));
    return hex.slice(0, TAG_HEX_LENGTH);
  } catch (e) {
    return "";
  }
}

/** A ride as stored: readable (code and secret) or sealed (one sealed string). */
function isRide(ride) {
  if (!ride || ROLES.indexOf(ride.role) === -1 || typeof ride.at !== "number") return false;
  if (ride.tag !== undefined && !TAG_PATTERN.test(ride.tag)) return false;
  if (ride.peerBell !== undefined && !BELL_PATTERN.test(ride.peerBell)) return false;
  if (typeof ride.sealed === "string") return true;
  return CODE_PATTERN.test(ride.code) && SECRET_PATTERN.test(ride.secret);
}

/** @param {number} [length] - in bytes */
function randomId(length = ID_BYTES) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let id = "";
  for (let i = 0; i < bytes.length; i += 1) id += (bytes[i] + 256).toString(16).slice(1);
  return id;
}

function read() {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    stored = [];
  }
  if (!Array.isArray(stored)) return [];
  return stored
    .filter(isRide)
    // A ride saved before rides had ids is known by its code
    .map((ride) => (ride.id ? ride : Object.assign({}, ride, { id: ride.code })))
    .sort((a, b) => b.at - a.at)
    .slice(0, MAX_RIDES);
}

function write(rides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
  } catch (e) {
    // Storage is blocked or full: there is simply nothing to reconnect to later
  }
}

/** True when this page can lock rides with a PIN (it needs a secure page). */
export const canLockRides = vaultSupported;
/** True when a PIN is set, so Reconnect will ask for it. */
export const ridesLocked = hasVault;

/**
 * The remembered rides, newest first, without their secrets.
 * @returns {{ id: string, role: 'host'|'guest', peerName: string, at: number, sealed: boolean, rings: boolean }[]}
 */
export function listRides() {
  return read().map((ride) => ({
    id: ride.id, role: ride.role, peerName: ride.peerName, at: ride.at,
    sealed: typeof ride.sealed === "string", rings: !!(ride.tag && ride.peerBell),
  }));
}

/**
 * The ride a ring names, for the request it shows. Null when none does.
 * @param {string} tag
 * @returns {{ id: string, peerName: string, sealed: boolean } | null}
 */
export function findRideByTag(tag) {
  if (!TAG_PATTERN.test(tag)) return null;
  const ride = read().find((entry) => entry.tag === tag);
  return ride ? { id: ride.id, peerName: ride.peerName, sealed: typeof ride.sealed === "string" } : null;
}

/** True when some ride could be rung, so this device's bell is worth keeping open. */
export function hasRingableRides() {
  return read().some((ride) => !!ride.tag);
}

/** Rides kept before tags existed get theirs, where they can still be read. */
export async function tagOldRides() {
  const rides = read();
  let changed = false;
  for (const ride of rides) {
    if (ride.tag || typeof ride.sealed === "string") continue;
    const tag = await rideTag(ride.secret);
    if (!tag) return;
    ride.tag = tag;
    changed = true;
  }
  if (changed) write(rides);
}

/**
 * The other device told this one where its bell is. Kept on the ride now, or
 * when the ride is saved, whichever comes second.
 * @param {string} secret - the connection's
 * @param {string} bell
 */
export async function notePeerBell(secret, bell) {
  if (!BELL_PATTERN.test(bell)) return;
  const tag = await rideTag(secret);
  if (!tag) return;
  heardBells[tag] = bell;
  const rides = read();
  const ride = rides.find((entry) => entry.tag === tag);
  if (!ride || ride.peerBell === bell) return;
  ride.peerBell = bell;
  write(rides);
}

/**
 * Remember a pairing that just connected. One ride per device name: pairing
 * with the same device again replaces its old ride. Sealed when a PIN is set.
 * @param {{ code: string, secret: string, role: string, peerName: string }} ride
 */
export async function saveRide(ride) {
  if (!CODE_PATTERN.test(ride.code) || !SECRET_PATTERN.test(ride.secret) || ROLES.indexOf(ride.role) === -1) return;
  const peerName = String(ride.peerName || "Other device").slice(0, MAX_NAME_LENGTH);
  const next = { id: randomId(), role: ride.role, peerName, at: Date.now() };
  const tag = await rideTag(ride.secret);
  if (tag) next.tag = tag;
  if (tag && heardBells[tag]) next.peerBell = heardBells[tag];
  if (hasVault()) next.sealed = await seal({ code: ride.code, secret: ride.secret });
  else Object.assign(next, { code: ride.code, secret: ride.secret });
  const others = read().filter((old) => old.peerName !== peerName);
  write([next, ...others].slice(0, MAX_RIDES));
}

/**
 * What a ride needs to reconnect, and to ring the other device. A sealed ride needs the PIN.
 * @param {string} id
 * @param {string} [pin]
 * @returns {Promise<{ code: string, secret: string, role: 'host'|'guest', tag: string, peerBell: string }>}
 */
export async function openRide(id, pin) {
  const ride = read().find((entry) => entry.id === id);
  if (!ride) throw new Error(GONE);
  const ring = { role: ride.role, tag: ride.tag || "", peerBell: ride.peerBell || "" };
  if (typeof ride.sealed !== "string") return Object.assign({ code: ride.code, secret: ride.secret }, ring);
  const [inside] = await open(pin, [ride.sealed]);
  return Object.assign({ code: inside.code, secret: inside.secret }, ring);
}

/** @param {string} id */
export function forgetRide(id) {
  write(read().filter((ride) => ride.id !== id));
}

/**
 * Turns the PIN on: from now on rides are sealed, and the ones already kept
 * are sealed too.
 * @param {string} pin - four digits
 */
export async function lockRides(pin) {
  await createVault(pin);
  const rides = read();
  for (const ride of rides) {
    if (typeof ride.sealed === "string") continue;
    ride.sealed = await seal({ code: ride.code, secret: ride.secret });
    delete ride.code;
    delete ride.secret;
  }
  write(rides);
}

/**
 * Turns the PIN off, which takes the PIN: every ride is opened and kept
 * readable again.
 * @param {string} pin
 */
export async function unlockRides(pin) {
  const rides = read();
  const sealed = rides.filter((ride) => typeof ride.sealed === "string");
  const opened = await open(pin, sealed.map((ride) => ride.sealed));
  sealed.forEach((ride, i) => {
    ride.code = opened[i].code;
    ride.secret = opened[i].secret;
    delete ride.sealed;
  });
  write(rides.filter(isRide));
  removeVault();
}

/** The PIN is forgotten: it goes, and so do the rides only it could open. */
export function resetLockedRides() {
  write(read().filter((ride) => typeof ride.sealed !== "string"));
  removeVault();
}
