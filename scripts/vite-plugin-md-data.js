/**
 * Markdown-as-data: lets JS import a .md file as a module.
 *
 * The frontmatter becomes the default export (parsed with the same minimal
 * flat key: "value" rules as vite-plugin-share-cards.js — no YAML dependency),
 * and everything below it is exported as `body`. One file is both the
 * document and its metadata; no raw twins, no duplicated headers.
 *
 * Imports carrying a query (e.g. `?raw`, used by blogApi.js) are left alone.
 */

const FRONTMATTER_RE = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Flat frontmatter reader — matches share-cards/blogApi parsing of the same files. */
function readFrontmatter(block) {
  const meta = {};
  for (const line of block.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (!key || key.startsWith("#")) continue;
    meta[key] = line
      .slice(idx + 1)
      .trim()
      .replace(/\s+#.*$/, "") // trailing comments, e.g. `received: "2026-07" # TODO`
      .replace(/^['"]|['"]$/g, "");
  }
  return meta;
}

export default function markdownData() {
  return {
    name: "wad-md-data",
    transform(code, id) {
      if (!id.endsWith(".md")) return null;
      const match = FRONTMATTER_RE.exec(code);
      const frontmatter = match ? readFrontmatter(match[1]) : {};
      const body = (match ? code.slice(match[0].length) : code).trim();
      return {
        code:
          `export const body = ${JSON.stringify(body)};\n` +
          `export default ${JSON.stringify(frontmatter)};\n`,
        map: null,
      };
    },
  };
}
