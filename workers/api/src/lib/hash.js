/** Salted hashing, so no raw IPs, IDs or device traits are ever stored. */

const DEFAULT_HEX_LENGTH = 32;
const IPV6_GROUPS = 8;
const IPV6_PREFIX_GROUPS = 4;

/**
 * Truncated SHA-256 of `salt:kind:value`. `kind` keeps equal values in
 * different roles (an IP and a signal, say) from producing equal hashes.
 * @returns {Promise<string>} lowercase hex
 */
export async function hash(salt, kind, value, length = DEFAULT_HEX_LENGTH) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${kind}:${value}`));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
}

/** Collapses IPv6 to its /64: one subscriber owns the whole block. IPv4 passes through. */
export function ipKey(ip) {
  if (!ip.includes(":")) return ip;
  const [head, tail] = ip.split("::");
  const headGroups = head ? head.split(":") : [];
  const tailGroups = tail ? tail.split(":") : [];
  const fill = tail === undefined ? [] : Array(IPV6_GROUPS - headGroups.length - tailGroups.length).fill("0");
  return [...headGroups, ...fill, ...tailGroups].slice(0, IPV6_PREFIX_GROUPS).join(":") + "::/64";
}
