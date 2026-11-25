/**
 * Air Train: previous rides. The devices this one has paired with, so they can
 * meet again without scanning a new QR code.
 *
 * A ride keeps the pairing's code and secret and which side this device was.
 * Reconnecting replays the same meeting: the device that showed the QR code
 * waits on the old code, the other one dials it. Nothing about consent
 * changes. Both devices have to press Reconnect, and the waiting one still
 * gets the "Let this device aboard?" question and has to allow it.
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

/** A ride as stored: readable (code and secret) or sealed (one sealed string). */
function isRide(ride) {
  if (!ride || ROLES.indexOf(ride.role) === -1 || typeof ride.at !== "number") return false;
  if (typeof ride.sealed === "string") return true;
  return CODE_PATTERN.test(ride.code) && SECRET_PATTERN.test(ride.secret);
}

function randomId() {
  const bytes = crypto.getRandomValues(new Uint8Array(ID_BYTES));
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
 * @returns {{ id: string, role: 'host'|'guest', peerName: string, at: number, sealed: boolean }[]}
 */
export function listRides() {
  return read().map((ride) => ({ id: ride.id, role: ride.role, peerName: ride.peerName, at: ride.at, sealed: typeof ride.sealed === "string" }));
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
  if (hasVault()) next.sealed = await seal({ code: ride.code, secret: ride.secret });
  else Object.assign(next, { code: ride.code, secret: ride.secret });
  const others = read().filter((old) => old.peerName !== peerName);
  write([next, ...others].slice(0, MAX_RIDES));
}

/**
 * What a ride needs to reconnect. A sealed ride needs the PIN.
 * @param {string} id
 * @param {string} [pin]
 * @returns {Promise<{ code: string, secret: string, role: 'host'|'guest' }>}
 */
export async function openRide(id, pin) {
  const ride = read().find((entry) => entry.id === id);
  if (!ride) throw new Error(GONE);
  if (typeof ride.sealed !== "string") return { code: ride.code, secret: ride.secret, role: ride.role };
  const [inside] = await open(pin, [ride.sealed]);
  return { code: inside.code, secret: inside.secret, role: ride.role };
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
