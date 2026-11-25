/**
 * The PIN vault: a four-digit PIN that locks things this site keeps on the
 * device (today: Air Train's previous rides).
 *
 * How it works, so the PIN is only needed to read:
 *   - Setting a PIN makes a key pair. The public half is kept in the open; the
 *     private half is kept encrypted with a key stretched from the PIN.
 *   - Anything may be sealed with the public half at any time, with no PIN.
 *   - Opening a sealed thing needs the PIN, to unlock the private half.
 *
 * What it is worth: it stops someone who picks up the device, or reads this
 * site's storage, from using what is sealed. Four digits is ten thousand
 * guesses, so someone with a copy of the storage and time can run through
 * them. It is a lock on a drawer, not a safe.
 *
 * Everything is the browser's own Web Crypto. That only exists on secure
 * pages (https and localhost), so on a plain-http LAN address there is no
 * vault, and callers fall back to having no PIN.
 */

const STORAGE_KEY = "dogs_pin_vault_v1";
export const PIN_LENGTH = 4;
const PIN_PATTERN = /^[0-9]{4}$/;
/** Each wrong guess costs this much stretching work (PBKDF2-SHA256). */
const STRETCH_ROUNDS = 310000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const RSA_BITS = 2048;
const HASH = "SHA-256";
const SEAL = { name: "RSA-OAEP", hash: HASH };
const WRAP = "AES-GCM";
const WRAP_BITS = 256;
export const WRONG_PIN = "That PIN is not right.";
const BAD_PIN = "A PIN is four digits.";

/** True when this page can keep a vault at all. */
export function vaultSupported() {
  return typeof window !== "undefined" && !!(window.crypto && window.crypto.subtle) && typeof TextEncoder !== "undefined";
}

/** @param {Uint8Array|ArrayBuffer} bytes */
export function toBase64(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let text = "";
  for (let i = 0; i < view.length; i += 1) text += String.fromCharCode(view[i]);
  return btoa(text);
}

/** @param {string} text */
export function fromBase64(text) {
  const raw = atob(text);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function readVault() {
  try {
    const vault = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return vault && vault.publicKey && vault.wrapped && vault.salt && vault.iv ? vault : null;
  } catch (e) {
    return null;
  }
}

/** True when a PIN has been set on this device. */
export function hasVault() {
  return vaultSupported() && !!readVault();
}

/** The key that locks the private half: the PIN, stretched. Also wraps the owner's key (adminKey.js). */
export async function wrappingKey(pin, salt, rounds) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: rounds, hash: HASH },
    base,
    { name: WRAP, length: WRAP_BITS },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Sets the PIN on this device. Replaces any vault already there, so what was
 * sealed with the old one can no longer be opened: open it first.
 * @param {string} pin - four digits
 */
export async function createVault(pin) {
  if (!PIN_PATTERN.test(pin)) throw new Error(BAD_PIN);
  const pair = await crypto.subtle.generateKey(
    { name: SEAL.name, modulusLength: RSA_BITS, publicExponent: new Uint8Array([1, 0, 1]), hash: HASH },
    true,
    ["encrypt", "decrypt"],
  );
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await wrappingKey(pin, salt, STRETCH_ROUNDS);
  const privateBytes = await crypto.subtle.exportKey("pkcs8", pair.privateKey);
  const wrapped = await crypto.subtle.encrypt({ name: WRAP, iv }, key, privateBytes);
  const vault = {
    rounds: STRETCH_ROUNDS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    wrapped: toBase64(wrapped),
    publicKey: await crypto.subtle.exportKey("jwk", pair.publicKey),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
}

/**
 * Seals a small value so only the PIN can read it back. Needs no PIN.
 * @param {object} value - JSON-safe and small (a few short strings)
 * @returns {Promise<string>}
 */
export async function seal(value) {
  const vault = readVault();
  if (!vault) throw new Error("No PIN is set on this device.");
  const key = await crypto.subtle.importKey("jwk", vault.publicKey, SEAL, false, ["encrypt"]);
  const sealed = await crypto.subtle.encrypt({ name: SEAL.name }, key, new TextEncoder().encode(JSON.stringify(value)));
  return toBase64(sealed);
}

/** The private half, unlocked with the PIN. Throws WRONG_PIN when it is not the PIN. */
async function unlock(pin) {
  const vault = readVault();
  if (!vault) throw new Error("No PIN is set on this device.");
  if (!PIN_PATTERN.test(pin)) throw new Error(WRONG_PIN);
  const key = await wrappingKey(pin, fromBase64(vault.salt), vault.rounds || STRETCH_ROUNDS);
  let privateBytes;
  try {
    privateBytes = await crypto.subtle.decrypt({ name: WRAP, iv: fromBase64(vault.iv) }, key, fromBase64(vault.wrapped));
  } catch (e) {
    throw new Error(WRONG_PIN);
  }
  return crypto.subtle.importKey("pkcs8", privateBytes, SEAL, false, ["decrypt"]);
}

/**
 * Opens sealed values with the PIN.
 * @param {string} pin
 * @param {string[]} sealedValues - what seal() returned
 * @returns {Promise<object[]>} the values, in the same order
 */
export async function open(pin, sealedValues) {
  const key = await unlock(pin);
  const opened = [];
  for (const sealed of sealedValues) {
    const bytes = await crypto.subtle.decrypt({ name: SEAL.name }, key, fromBase64(sealed));
    opened.push(JSON.parse(new TextDecoder().decode(bytes)));
  }
  return opened;
}

/** Removes the PIN from this device. Whatever is still sealed is lost with it. */
export function removeVault() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Storage is blocked: there was no vault to remove
  }
}
