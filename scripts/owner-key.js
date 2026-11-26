/**
 * owner-key.js
 * Makes the owner's key, on the owner's own computer. This is the only way a
 * key comes to exist: the site has no set-up page and no password.
 *
 *   node scripts/owner-key.js --pin-file <file holding the PIN>
 *
 * It writes .owner/dogs-admin-key.json (git never sees that folder) and
 * prints the command that registers the key's public half with the API
 * Worker's database. Run that command yourself: it uses your own Cloudflare
 * login, which is what makes you the only one who can register a key.
 *
 * The key file holds the private half of a P-384 key pair, locked with the
 * PIN (PBKDF2 then AES-GCM, the same record src/lib/adminKey.js reads). Copy
 * the file to the devices that may sign in, and to nowhere else. A browser
 * takes it under Settings > Owner, "bring key file", with the PIN.
 *
 * The file is small. Its strength is the key inside it, which cannot be
 * guessed, not its length.
 */
import fs from "node:fs";
import path from "node:path";
import { webcrypto } from "node:crypto";

const OUT_DIR = ".owner";
const OUT_FILE = "dogs-admin-key.json";
const FILE_KIND = "dogs-admin-key";
const FILE_VERSION = 1;
const MIN_PIN_LENGTH = 6;
const MAX_PIN_LENGTH = 128;
/** Each guess at the PIN costs this much work. Must stay within what adminKey.js accepts. */
const STRETCH_ROUNDS = 600000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const WRAP_BITS = 256;
const KEY_ALGORITHM = { name: "ECDSA", namedCurve: "P-384" };
const PIN_FLAG = "--pin-file";
const USAGE = `Usage: node scripts/owner-key.js ${PIN_FLAG} <file holding the PIN>`;

const { subtle } = webcrypto;
const base64 = (bytes) => Buffer.from(bytes).toString("base64");

const flagAt = process.argv.indexOf(PIN_FLAG);
const pinPath = flagAt === -1 ? "" : process.argv[flagAt + 1] || "";
if (!pinPath || !fs.existsSync(pinPath)) {
  console.error(USAGE);
  process.exit(1);
}
const pin = fs.readFileSync(pinPath, "utf8").replace(/\r?\n$/, "");
if (pin.length < MIN_PIN_LENGTH || pin.length > MAX_PIN_LENGTH) {
  console.error(`The PIN must be ${MIN_PIN_LENGTH} to ${MAX_PIN_LENGTH} characters.`);
  process.exit(1);
}
const outPath = path.join(OUT_DIR, OUT_FILE);
if (fs.existsSync(outPath)) {
  console.error(`${outPath} already exists. Move it away first: this never overwrites a key.`);
  process.exit(1);
}

const pair = await subtle.generateKey(KEY_ALGORITHM, true, ["sign", "verify"]);
const salt = webcrypto.getRandomValues(new Uint8Array(SALT_BYTES));
const iv = webcrypto.getRandomValues(new Uint8Array(IV_BYTES));
const stretched = await subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
const wrappingKey = await subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: STRETCH_ROUNDS, hash: "SHA-256" },
  stretched,
  { name: "AES-GCM", length: WRAP_BITS },
  false,
  ["encrypt"],
);
const record = {
  kind: FILE_KIND,
  v: FILE_VERSION,
  rounds: STRETCH_ROUNDS,
  salt: base64(salt),
  iv: base64(iv),
  wrapped: base64(await subtle.encrypt({ name: "AES-GCM", iv }, wrappingKey, await subtle.exportKey("pkcs8", pair.privateKey))),
  publicKey: base64(await subtle.exportKey("spki", pair.publicKey)),
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(record, null, 2) + "\n", { flag: "wx" });
console.log(`Key file written: ${path.resolve(outPath)}`);
console.log("Register its public half (this replaces nothing: it fails if a key is already registered):");
console.log(
  `npx wrangler d1 execute sql --remote -c workers/api/wrangler.jsonc --command "INSERT INTO admin_keys (id, public_key, created_at) VALUES (1, '${record.publicKey}', ${Date.now()})"`,
);
