/**
 * Air Train: previous rides. The devices this one paired with lately, so they
 * can meet again without scanning a new QR code.
 *
 * A ride keeps the pairing's code and secret and which side this device was.
 * Reconnecting replays the same meeting: the device that showed the QR code
 * waits on the old code, the other one dials it. Nothing about consent
 * changes. Both devices have to press Reconnect, and the waiting one still
 * gets the "Let this device aboard?" question and has to allow it.
 *
 * Rides are kept on this device only (localStorage) until they are forgotten
 * from the list, the newest MAX_RIDES of them.
 */

const STORAGE_KEY = "datatrain_rides_v1";
const MAX_RIDES = 8;
const MAX_NAME_LENGTH = 40;
const CODE_PATTERN = /^[a-f0-9]{24}$/;
const SECRET_PATTERN = /^[a-f0-9]{32}$/;
const ROLES = ["host", "guest"];

/** @param {any} ride */
function isRide(ride) {
  return !!ride && CODE_PATTERN.test(ride.code) && SECRET_PATTERN.test(ride.secret) &&
    ROLES.indexOf(ride.role) !== -1 && typeof ride.at === "number";
}

function write(rides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
  } catch (e) {
    // Storage is blocked or full: there is simply nothing to reconnect to later
  }
}

/**
 * The remembered rides, newest first.
 * @returns {{ code: string, secret: string, role: 'host'|'guest', peerName: string, at: number }[]}
 */
export function listRides() {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    stored = [];
  }
  if (!Array.isArray(stored)) return [];
  return stored.filter(isRide).sort((a, b) => b.at - a.at).slice(0, MAX_RIDES);
}

/**
 * Remember a pairing that just connected. One ride per device name: pairing
 * with the same device again replaces its old ride.
 * @param {{ code: string, secret: string, role: string, peerName: string }} ride
 */
export function saveRide(ride) {
  const next = { code: ride.code, secret: ride.secret, role: ride.role, peerName: String(ride.peerName || "Other device").slice(0, MAX_NAME_LENGTH), at: Date.now() };
  if (!isRide(next)) return;
  const others = listRides().filter((old) => old.code !== next.code && old.peerName !== next.peerName);
  write([next, ...others].slice(0, MAX_RIDES));
}

/** @param {string} code */
export function forgetRide(code) {
  write(listRides().filter((ride) => ride.code !== code));
}
