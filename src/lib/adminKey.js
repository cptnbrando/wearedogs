/**
 * adminKey.js
 * The owner's key: what proves to the API Worker (workers/api/src/lib/admin.js)
 * that the browser in front of it is the owner's.
 *
 * The key is a P-384 key pair made on the owner's own computer
 * (scripts/owner-key.js), never here: this page cannot make or register one.
 * The Worker holds the public half and nothing else. The private half lives
 * in the key file, encrypted with a key stretched from the owner's PIN, the
 * way pinVault.js does it. A browser the owner hands the file to keeps that
 * same encrypted record in this site's storage and opens it only in memory,
 * to sign a sign-in challenge. The PIN and the private half never leave the
 * owner's devices.
 *
 * The file alone opens nothing: it takes the PIN as well. A short PIN can be
 * guessed by someone who has the file, so the PIN has a minimum length and
 * every guess costs the file's stretching rounds of work.
 *
 * Web Crypto only exists on secure pages (https and localhost).
 */
import { vaultSupported, toBase64, fromBase64, wrappingKey } from "./pinVault.js";

const STORAGE_KEY = "dogs_admin_key_v1";
const FILE_KIND = "dogs-admin-key";
const FILE_VERSION = 1;
export const ADMIN_KEY_FILE_NAME = "dogs-admin-key.json";
export const MIN_PIN_LENGTH = 6;
export const MAX_PIN_LENGTH = 128;
const MIN_ROUNDS = 100000;
const MAX_ROUNDS = 5000000;
const WRAP = "AES-GCM";
const KEY_ALGORITHM = { name: "ECDSA", namedCurve: "P-384" };
const SIGN_ALGORITHM = { name: "ECDSA", hash: "SHA-384" };
/** What is signed is this and the challenge (the Worker checks the same label). */
const LOGIN_LABEL = "dogs-admin-login:";
const BASE64_PATTERN = /^[A-Za-z0-9+/]+=*$/;
const MAX_FIELD_LENGTH = 2000;
const MAX_FILE_LENGTH = 8000;

export const WRONG_PIN = "That PIN is not right.";
export const NO_KEY_HERE = "This device does not hold the key.";
export const BAD_KEY_FILE = "That is not a DOGS key file.";
const STORAGE_REFUSED = "This browser would not store the key. Check that site storage is allowed.";

/**
 * @typedef {{ kind: string, v: number, rounds: number, salt: string, iv: string, wrapped: string, publicKey: string }} AdminKeyRecord
 * The private half encrypted with the PIN, and the public half in the open (base64 SPKI).
 */

/** True when this page can make and use a key at all. */
export function adminKeySupported() {
  return vaultSupported();
}

const isBase64 = (value) => typeof value === "string" && !!value && value.length <= MAX_FIELD_LENGTH && BASE64_PATTERN.test(value);

/** @param {any} raw @returns {AdminKeyRecord | null} the record, rebuilt from only its own fields */
function cleanRecord(raw) {
  if (!raw || raw.kind !== FILE_KIND || raw.v !== FILE_VERSION) return null;
  if (![raw.salt, raw.iv, raw.wrapped, raw.publicKey].every(isBase64)) return null;
  if (!Number.isInteger(raw.rounds) || raw.rounds < MIN_ROUNDS || raw.rounds > MAX_ROUNDS) return null;
  return { kind: FILE_KIND, v: FILE_VERSION, rounds: raw.rounds, salt: raw.salt, iv: raw.iv, wrapped: raw.wrapped, publicKey: raw.publicKey };
}

/** @returns {AdminKeyRecord | null} */
function readRecord() {
  try {
    return cleanRecord(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch (e) {
    return null;
  }
}

function writeRecord(record) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (e) {
    throw new Error(STORAGE_REFUSED);
  }
  if (!readRecord()) throw new Error(STORAGE_REFUSED);
}

/** True when this device holds the key (still locked behind its PIN). */
export function hasAdminKey() {
  return adminKeySupported() && !!readRecord();
}

/** @param {string} pin @returns {boolean} */
export function pinIsLongEnough(pin) {
  return typeof pin === "string" && pin.length >= MIN_PIN_LENGTH && pin.length <= MAX_PIN_LENGTH;
}

/**
 * The private half of a record, opened with the PIN, ready to sign with.
 * @param {AdminKeyRecord} record
 * @param {string} pin
 * @returns {Promise<CryptoKey>} throws WRONG_PIN when it is not the PIN
 */
async function openRecord(record, pin) {
  if (!pinIsLongEnough(pin)) throw new Error(WRONG_PIN);
  const key = await wrappingKey(pin, fromBase64(record.salt), record.rounds);
  let privateBytes;
  try {
    privateBytes = await crypto.subtle.decrypt({ name: WRAP, iv: fromBase64(record.iv) }, key, fromBase64(record.wrapped));
  } catch (e) {
    throw new Error(WRONG_PIN);
  }
  return crypto.subtle.importKey("pkcs8", privateBytes, KEY_ALGORITHM, false, ["sign"]);
}

/**
 * Opens this device's key with the PIN.
 * @param {string} pin
 * @returns {Promise<CryptoKey>} throws WRONG_PIN, or NO_KEY_HERE
 */
export async function unlockAdminKey(pin) {
  const record = readRecord();
  if (!record) throw new Error(NO_KEY_HERE);
  return openRecord(record, pin);
}

/**
 * Signs a sign-in challenge from the Worker.
 * @param {CryptoKey} signingKey - from unlockAdminKey() or importAdminKeyFile()
 * @param {string} challenge
 * @returns {Promise<string>} the signature, base64 (r and s side by side)
 */
export async function signChallenge(signingKey, challenge) {
  const signature = await crypto.subtle.sign(SIGN_ALGORITHM, signingKey, new TextEncoder().encode(LOGIN_LABEL + challenge));
  return toBase64(signature);
}

/**
 * The key file: this device's record as text. Still locked behind the PIN.
 * @returns {string} throws NO_KEY_HERE
 */
export function exportAdminKeyFile() {
  const record = readRecord();
  if (!record) throw new Error(NO_KEY_HERE);
  return JSON.stringify(record, null, 2) + "\n";
}

/**
 * Brings a key file to this device. The PIN must open it, or nothing is kept.
 * @param {string} text - the file's contents
 * @param {string} pin
 * @returns {Promise<CryptoKey>} the opened key; throws BAD_KEY_FILE or WRONG_PIN
 */
export async function importAdminKeyFile(text, pin) {
  let record = null;
  try {
    record = typeof text === "string" && text.length <= MAX_FILE_LENGTH ? cleanRecord(JSON.parse(text)) : null;
  } catch (e) {
    record = null;
  }
  if (!record) throw new Error(BAD_KEY_FILE);
  const signingKey = await openRecord(record, pin);
  writeRecord(record);
  return signingKey;
}

/** Removes the key from this device. The key file, if one was saved, still works. */
export function forgetAdminKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Storage is blocked: there was no key to remove
  }
}
