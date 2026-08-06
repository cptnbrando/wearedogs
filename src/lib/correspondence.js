/**
 * The correspondence shelf: every letter in public/correspondence/*.md,
 * imported at build time (scripts/vite-plugin-md-data.js).
 *
 * Each letter is ONE markdown file — its own frontmatter header (id, from,
 * office, topic, dateLabel) followed by the received letter and our reply,
 * together. The files stay in public/ so the deployed site keeps serving
 * them as standalone pages; this module just also compiles them into the
 * app so the popup never fetches anything.
 *
 * campaigns.json lists letters by id only; everything else lives in the
 * letter file itself.
 */

const SITE_ORIGIN = "https://www.wearedogs.net";

const modules = import.meta.glob("../../public/correspondence/*.md", {
  eager: true,
});

/** @type {Array<Record<string, string> & { slug: string, body: string, page: string }>} */
export const letters = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    return {
      slug,
      ...mod.default,
      body: mod.body,
      // Jekyll turns the frontmatter .md into a real page at this address.
      page: `${SITE_ORIGIN}/correspondence/${slug}.html`,
    };
  })
  // index.md is the shelf's own landing page, not a letter.
  .filter((l) => l.slug !== "index" && l.id);

/** Resolve one letter by its frontmatter id. */
export function getLetter(id) {
  return letters.find((l) => l.id === id) || null;
}

/**
 * Resolve a campaign's correspondence list (array of letter ids in
 * campaigns.json) to full letter objects, skipping unknown ids.
 */
export function lettersFor(ids) {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => getLetter(typeof id === "string" ? id : id?.id)).filter(Boolean);
}
