/**
 * Air Train session: what it says when something goes wrong, and two small
 * helpers it shares (transferSession.js).
 */
const MAX_NAME_LENGTH = 255;

export const ERRORS = {
  unsupported: "This browser cannot make a secure device connection. Try a current Chrome, Edge, Firefox or Safari browser.",
  invite: "This pairing link is incomplete or invalid. Scan a fresh QR code on the other device.",
  start: "Could not reach the pairing service. Check your internet connection and try again.",
  timeout: "Could not connect. Keep both pages open, try the same Wi-Fi network, and scan a fresh QR code.",
  approval: "Pairing approval timed out. Scan the QR code again and approve the device.",
  unavailable: "That device is no longer waiting. Keep its page open and scan a fresh QR code.",
  rejected: "The other device declined this connection. Scan a fresh QR code to try again.",
  closed: "The other device disconnected. Keep both pages open and pair again to continue.",
  held: "The connection dropped while this was on its way. Send it again once the devices are back together.",
  protocol: "The other device sent an invalid transfer. Pair again to continue.",
  transfer: "This transfer stopped responding. Keep both pages awake and send it again.",
  read: "This file could not be read. Select it again and retry.",
  memory: "This device could not hold the received file. Remove saved items and try a smaller file.",
  size: "Files must be 100 MB or smaller. Choose a smaller file.",
  inbox: "The receiving device has 200 MB in its inbox. Save and remove received items before sending more.",
  items: "The transfer list is full. Remove finished items before sending more.",
  queue: "The send queue is full. Wait for some transfers to finish before adding more.",
  text: "Enter a text note of up to 16,000 characters.",
  disconnected: "Connect another device before sending files or text.",
};

/** Generate an unguessable identifier without relying on UUID or newer crypto APIs. */
export function randomHex(length) {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  let result = "";
  for (let index = 0; index < bytes.length; index += 1) {
    result += (bytes[index] + 256).toString(16).slice(1);
  }
  return result;
}

/** Remove path separators and control characters from an untrusted display/download name. */
export function safeName(name, fallback, limit = MAX_NAME_LENGTH) {
  if (typeof name !== "string") return fallback;
  const clean = name.replace(/[\x00-\x1f\x7f/\\]/g, "").trim().slice(0, limit);
  return clean && clean !== "." && clean !== ".." ? clean : fallback;
}
