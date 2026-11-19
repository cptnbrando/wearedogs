/** Response helpers shared by every route. */

export const JSON_TYPE = "application/json";
const PREFLIGHT_MAX_AGE_SECONDS = 7200;
const DEFAULT_METHODS = "GET, POST, OPTIONS";

/** JSON response, uncached unless the caller's headers say otherwise. */
export function reply(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": JSON_TYPE,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

/**
 * CORS headers for an origin that already passed the allowlist.
 * @param {string} origin
 * @param {{ methods?: string, credentials?: boolean }} [options] a route's own needs; /likes and /mail use the defaults
 */
export function corsHeaders(origin, options = {}) {
  const headers = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": options.methods || DEFAULT_METHODS,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": String(PREFLIGHT_MAX_AGE_SECONDS),
    Vary: "Origin",
  };
  // Lets the page send and receive that route's cookie; never with a wildcard origin
  if (options.credentials) headers["Access-Control-Allow-Credentials"] = "true";
  return headers;
}

/**
 * Reads no more than maxBytes from an untrusted request stream.
 * @param {Request} request
 * @param {number} maxBytes
 * @returns {Promise<string|null>} the body text, or null if it was too big or unreadable
 */
export async function readBoundedBody(request, maxBytes) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return new TextDecoder().decode(bytes);
}
