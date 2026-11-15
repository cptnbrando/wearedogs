import { SHOP_ITEMS, SLOTS_PER_FLOOR, DAY_LENGTH_SEC, SAVE_VERSION } from './dogsIncConfig.js';

/**
 * Save transfer codes: the whole company packed into a short URL-safe string, so it fits a
 * QR code (`/apps/dogsinc#save=<code>`) or a copy/paste. No server involved.
 *
 * Layout (a JSON array, base64url): [format, cash, lifetimeCash, clicks, nights, clock,
 * goalsDone, bones, ...owned counts in SHOP_ITEMS order].
 */
const FORMAT = 1;
const FIELDS = ['cash', 'lifetimeCash', 'clicks', 'nights', 'clock', 'goalsDone', 'bones'];
const WHOLE_FIELDS = ['clicks', 'nights', 'goalsDone', 'bones'];
const HEADER_LENGTH = 1 + FIELDS.length;
const CENTS = 100;
const MAX_CODE_LENGTH = 2000;
const MAX_MONEY = 1e300;
const MAX_COUNT = 1e9;
const CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

/** @param {number} value @returns {number} value rounded to cents, to keep codes short */
const toCents = (value) => Math.round(value * CENTS) / CENTS;

/** @param {string} text @returns {string} base64url without padding */
function toBase64Url(text) {
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** @param {string} code @returns {string} decoded text (throws on bad input) */
function fromBase64Url(code) {
  const base64 = code.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
}

/**
 * @param {{cash:number,lifetimeCash:number,clicks:number,nights:number,clock:number,goalsDone:number,bones:number,owned:Object<string,number>}} state
 * @returns {string} transfer code
 */
export function encodeSave(state) {
  const values = [FORMAT].concat(
    FIELDS.map((key) => (WHOLE_FIELDS.indexOf(key) === -1 ? toCents(state[key]) : state[key])),
    SHOP_ITEMS.map((item) => state.owned[item.id]),
  );
  return toBase64Url(JSON.stringify(values));
}

/**
 * Checks that counts respect the building: desks cap employees, one janitor per floor,
 * one cafe and one restroom per floor above the lobby.
 * @param {Object<string, number>} owned
 * @returns {boolean}
 */
function withinLimits(owned) {
  const floors = 1 + owned.floor;
  return owned.hire <= floors * SLOTS_PER_FLOOR && owned.janitor <= floors
    && owned.cafe <= floors - 1 && owned.restroom <= floors - 1;
}

/** @param {unknown} value @param {number} max @returns {boolean} */
const isAmount = (value, max) => typeof value === 'number' && isFinite(value) && value >= 0 && value <= max;

/**
 * Turns a code (or a full save link) back into a game state. Anything malformed, from a
 * different format, or impossible for the building returns null: a bad code can never
 * break the game.
 * @param {string} input
 * @returns {object|null} a state ready for DogsIncEngine.importState
 */
export function decodeSave(input) {
  const text = String(input || '').trim();
  const code = text.indexOf('#save=') === -1 ? text : text.slice(text.indexOf('#save=') + 6);
  if (!code || code.length > MAX_CODE_LENGTH || !CODE_PATTERN.test(code)) return null;
  let values;
  try {
    values = JSON.parse(fromBase64Url(code));
  } catch (err) {
    return null; // not a save code
  }
  if (!Array.isArray(values) || values.length !== HEADER_LENGTH + SHOP_ITEMS.length || values[0] !== FORMAT) return null;
  const state = { v: SAVE_VERSION, savedAt: 0, owned: {} };
  for (let i = 0; i < FIELDS.length; i += 1) {
    const key = FIELDS[i];
    const value = values[i + 1];
    const whole = WHOLE_FIELDS.indexOf(key) !== -1;
    if (!isAmount(value, whole ? MAX_COUNT : MAX_MONEY) || (whole && value % 1 !== 0)) return null;
    state[key] = value;
  }
  if (state.clock >= DAY_LENGTH_SEC) return null;
  for (let i = 0; i < SHOP_ITEMS.length; i += 1) {
    const count = values[HEADER_LENGTH + i];
    if (!isAmount(count, MAX_COUNT) || count % 1 !== 0) return null;
    state.owned[SHOP_ITEMS[i].id] = count;
  }
  return withinLimits(state.owned) ? state : null;
}

/**
 * The few numbers a player recognizes their company by, for the "load this company?" check.
 * @param {{cash:number,goalsDone:number,owned:Object<string,number>}} state
 * @returns {{cash:number,floors:number,employees:number,missions:number}}
 */
export function summarizeSave(state) {
  return { cash: state.cash, floors: 1 + state.owned.floor, employees: state.owned.hire, missions: state.goalsDone };
}
