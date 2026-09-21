/**
 * Line keys for the blog's writing timeline.
 *
 * Every line of a post gets dated from git history by the build plugin
 * (scripts/vite-plugin-blog-timeline.js), and blogApi.js stamps those dates onto
 * the rendered HTML. The two run in different worlds — Node and the browser —
 * and must agree exactly on how a line is identified, so that logic lives here
 * and nowhere else. Pure JS: no DOM, no Node APIs.
 *
 * A line is keyed by its content, not its position, so a timeline that is a few
 * edits stale still dates every line it knows and simply misses the new ones.
 */

/** The post body exactly as blogApi.parseMarkdown extracts it (same frontmatter rule). */
export function postBody(rawMd) {
  if (rawMd.startsWith("---")) {
    const parts = rawMd.split("---");
    if (parts.length >= 3) return parts.slice(2).join("---").trim();
  }
  return rawMd;
}

/** Non-empty, trimmed body lines — the unit the markdown parser renders one block from. */
export function bodyLines(rawMd) {
  return postBody(rawMd)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Only prose gets a date. A rule of dashes is the same line wherever it appears,
 * so dating it would plant a stray "written back in August" mark inside new text.
 */
export function isDatable(text) {
  return /[\p{L}\p{N}]/u.test(text);
}

// cyrb53 (bryc, public domain): a 53-bit string hash, identical in Node and browsers.
function hash(str) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/**
 * Hands out a key per line. Feed it EVERY non-empty trimmed body line, in
 * order — a repeated line gets an occurrence suffix, and both sides only stay in
 * step if neither skips a line.
 */
export function createLineKeyer() {
  const seen = new Map();
  return {
    next(text) {
      const count = (seen.get(text) || 0) + 1;
      seen.set(text, count);
      const key = hash(text);
      return count === 1 ? key : `${key}.${count}`;
    },
  };
}
