/**
 * The owner's sign-in, for routes only the owner may use.
 *
 * The owner holds a key: a P-384 private key made on their own computer
 * (scripts/owner-key.js) and kept in a key file, locked with a PIN, on the
 * owner's devices and nowhere else (src/lib/adminKey.js reads it in the
 * browser). This Worker holds only the public half, in admin_keys. To sign
 * in, the browser asks for a challenge, signs it with the key, and gets a
 * session token back. The private key and the PIN never leave the owner's
 * devices, and nothing kept here can be used to sign in.
 *
 * There is no password and no way to register a key through the site. The
 * one row of admin_keys is written from the owner's computer, with the
 * owner's own Cloudflare login (scripts/owner-key.js prints the command).
 * To replace the key, delete the row and register the new one the same way:
 *   npx wrangler d1 execute sql --remote -c workers/api/wrangler.jsonc --command "DELETE FROM admin_keys"
 *
 * A session token is an expiry time signed with a key made from HASH_SALT and
 * the public key, so registering a new key signs every browser out. The page
 * sends it back as "Authorization: Bearer <token>".
 */

const SESSION_HOURS = 12;
const HOUR_MS = 60 * 60 * 1000;
const CHALLENGE_SECONDS = 120;
const SECOND_MS = 1000;
const NONCE_BYTES = 16;
const BEARER_PREFIX = "Bearer ";
const TOKEN_PATTERN = /^(\d{13})\.([0-9a-f]{64})$/;
const CHALLENGE_PATTERN = /^(\d{13})\.([0-9a-f]{32})\.([0-9a-f]{64})$/;
const BASE64_PATTERN = /^[A-Za-z0-9+/]+=*$/;
/** A P-384 public key is 120 bytes of SPKI, 160 characters of base64; a signature is 96 bytes, 128 characters. */
const MAX_PUBLIC_KEY_LENGTH = 400;
const MAX_SIGNATURE_LENGTH = 200;
const SESSION_LABEL = "admin-session:";
const CHALLENGE_LABEL = "admin-challenge:";
/** What the browser signs is this and the challenge, so a signature made for anything else is no use here. */
const LOGIN_LABEL = "dogs-admin-login:";
const KEY_ALGORITHM = { name: "ECDSA", namedCurve: "P-384" };
const SIGN_ALGORITHM = { name: "ECDSA", hash: "SHA-384" };
const KEY_FORMAT = "spki";
const READ_KEY_SQL = "SELECT public_key FROM admin_keys WHERE id = 1";
/** What a route's cors option needs so the page may send the token and use every method. */
export const ADMIN_CORS = { methods: "GET, POST, PUT, DELETE, OPTIONS", headers: "Content-Type, Authorization" };

const encoder = new TextEncoder();

const hex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

function fromBase64(text) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** HMAC-SHA-256 as lowercase hex. */
async function sign(secret, message) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

/**
 * The owner's public key, as base64 SPKI, or "" before one is registered.
 * @param {{ DB: D1Database }} env
 * @returns {Promise<string>}
 */
export async function registeredKey(env) {
  const row = await env.DB.prepare(READ_KEY_SQL).first();
  return row ? row.public_key : "";
}

/** @returns {Promise<CryptoKey | null>} null when the text is not a P-384 public key */
async function importPublicKey(publicKey) {
  if (typeof publicKey !== "string" || publicKey.length > MAX_PUBLIC_KEY_LENGTH || !BASE64_PATTERN.test(publicKey)) return null;
  try {
    return await crypto.subtle.importKey(KEY_FORMAT, fromBase64(publicKey), KEY_ALGORITHM, false, ["verify"]);
  } catch {
    return null;
  }
}

/**
 * Something fresh for the browser to sign. Nothing is stored: the challenge
 * carries its own expiry and this Worker's signature over it.
 * @returns {Promise<string>}
 */
export async function newChallenge(env) {
  const expires = Date.now() + CHALLENGE_SECONDS * SECOND_MS;
  const nonce = hex(crypto.getRandomValues(new Uint8Array(NONCE_BYTES)));
  return `${expires}.${nonce}.${await sign(env.HASH_SALT, `${CHALLENGE_LABEL}${expires}.${nonce}`)}`;
}

/**
 * True when `signature` is the owner's key signing a challenge this Worker gave out and that is still fresh.
 * @param {object} env
 * @param {string} publicKey the registered key
 * @param {string} challenge
 * @param {string} signature base64, r and s side by side
 * @returns {Promise<boolean>}
 */
export async function challengeSigned(env, publicKey, challenge, signature) {
  const match = typeof challenge === "string" ? CHALLENGE_PATTERN.exec(challenge) : null;
  if (!match || Number(match[1]) < Date.now()) return false;
  const expected = await sign(env.HASH_SALT, `${CHALLENGE_LABEL}${match[1]}.${match[2]}`);
  if (!crypto.subtle.timingSafeEqual(encoder.encode(expected), encoder.encode(match[3]))) return false;
  if (typeof signature !== "string" || signature.length > MAX_SIGNATURE_LENGTH || !BASE64_PATTERN.test(signature)) return false;
  const key = await importPublicKey(publicKey);
  if (!key) return false;
  try {
    return await crypto.subtle.verify(SIGN_ALGORITHM, key, fromBase64(signature), encoder.encode(LOGIN_LABEL + challenge));
  } catch {
    return false;
  }
}

/**
 * A fresh session for a browser that just proved it holds the key.
 * @param {object} env
 * @param {string} publicKey the registered key
 * @returns {Promise<{ token: string, expires: number }>}
 */
export async function issueSession(env, publicKey) {
  const expires = Date.now() + SESSION_HOURS * HOUR_MS;
  return { token: `${expires}.${await sign(`${env.HASH_SALT}:${publicKey}`, SESSION_LABEL + expires)}`, expires };
}

/**
 * True when the request carries a live session token.
 * @param {Request} request
 * @param {object} env
 * @returns {Promise<boolean>}
 */
export async function isAdmin(request, env) {
  if (!env.HASH_SALT) return false;
  const header = request.headers.get("Authorization") || "";
  if (header.indexOf(BEARER_PREFIX) !== 0) return false;
  const match = TOKEN_PATTERN.exec(header.slice(BEARER_PREFIX.length));
  if (!match || Number(match[1]) < Date.now()) return false;
  const publicKey = await registeredKey(env);
  if (!publicKey) return false;
  const expected = await sign(`${env.HASH_SALT}:${publicKey}`, SESSION_LABEL + match[1]);
  return crypto.subtle.timingSafeEqual(encoder.encode(expected), encoder.encode(match[2]));
}
