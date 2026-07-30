import fs from "node:fs";
import path from "node:path";

/**
 * Share cards for every deep-linkable item: campaigns, products and blog posts.
 *
 * Social crawlers (Facebook, iMessage, Discord, Slack, X, WhatsApp) never run
 * JavaScript, so a component setting og:* tags at runtime — the <svelte:head>
 * block in BlogApp, for instance — is invisible to them. It updates the browser
 * tab title, and Googlebot renders it, but a link unfurler sees none of it.
 *
 * On this static SPA the miss is total rather than partial: every unknown path
 * is served by 404.html, which carries no metadata and redirects to the root.
 * Verified against production — a crawler-agent fetch of /apps/blog/woof came
 * back HTTP 404 with no og: tags at all.
 *
 * So the tags have to exist in real HTML at the real URL. After the bundle is
 * written this emits an index.html per item: a byte-for-byte copy of the built
 * index.html with the title, description, canonical URL and image swapped for
 * that item's own. The static host serves it directly, the crawler reads the
 * right card, and the SPA boots exactly as it always did — parsePath() tolerates
 * the trailing slash a host adds for directory indexes.
 */

const DEFAULT_ORIGIN = "https://wearedogs.net";

/** Attribute-safe escaping for values dropped into content="…". */
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** og:image and og:url must be absolute; the data mixes CDN links and site paths. */
function absolute(url, origin) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return origin + (url.startsWith("/") ? url : `/${url}`);
}

/** Flatten to one line and trim to what a share card will actually display. */
function summarize(text, limit = 200) {
  const flat = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (flat.length <= limit) return flat;
  const cut = flat.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  const body = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${body.replace(/[,;:.\s]+$/, "")}…`;
}

/**
 * Aim at the size cards actually render: 1200x630 is the Open Graph reference,
 * and anything under it gets upscaled and looks soft. Deliberately not larger —
 * no unfurler displays more than that, so extra pixels are bytes nobody sees.
 */
const OG_TARGET_WIDTH = 1200;

function upgradeResolution(url) {
  if (!url) return url;

  // Unsplash serves arbitrary sizes from query params; the data asks for w=800
  // in places, which is under the card size. Only ever raises, never lowers.
  if (/(^|\.)unsplash\.com\//i.test(url)) {
    try {
      const u = new URL(url);
      const width = Number(u.searchParams.get("w") || 0);
      if (width < OG_TARGET_WIDTH) {
        u.searchParams.set("w", String(OG_TARGET_WIDTH));
      }
      // q=80 is the quality/size sweet spot; leave anything higher alone.
      const quality = Number(u.searchParams.get("q") || 0);
      if (quality && quality < 80) u.searchParams.set("q", "80");
      return u.toString();
    } catch {
      return url;
    }
  }

  // YouTube's default/0.jpg thumbnails are 120x90 and 480x360. hqdefault is
  // the largest size guaranteed to exist for every video — maxresdefault is
  // bigger but 404s on plenty of them, and a broken image is worse than a
  // small one.
  const yt = url.match(/^(https?:\/\/[^/]*(?:ytimg\.com|youtube\.com)\/vi\/[^/]+\/)(\w+)\.jpg/i);
  if (yt && /^(default|0|1|2|3|sddefault|mqdefault)$/i.test(yt[2])) {
    return `${yt[1]}hqdefault.jpg`;
  }

  return url;
}

/**
 * Pick the best usable image, walking candidates in preference order rather
 * than trusting the first one:
 *  - a real image beats a video's thumbnail, which is the smallest thing on offer
 *  - SVG is skipped; most unfurlers reject it (the blog default is /favicon.svg)
 *  - a site-relative path is only used if that file actually ships, since a
 *    404 og:image renders as a card with a blank slot
 * Falls back to the site image when nothing qualifies.
 *
 * @param {(p: string) => boolean} [hasLocalFile]
 */
function pickImage(entity, origin, fallback, hasLocalFile) {
  const media = Array.isArray(entity.media) ? entity.media : [];
  const candidates = [
    media.find((m) => m?.type === "image" && m.url)?.url,
    Array.isArray(entity.images) ? entity.images[0] : null,
    entity.image,
    entity.coverImage,
    entity.bodyImage,
    media.find((m) => m?.thumbnail)?.thumbnail,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (/\.svg(\?|#|$)/i.test(candidate)) continue;
    if (/^https?:\/\//i.test(candidate)) return upgradeResolution(candidate);
    if (hasLocalFile && !hasLocalFile(candidate)) continue;
    return absolute(candidate, origin);
  }
  return fallback;
}

/**
 * First real image used inside a post body. Blog frontmatter often leaves
 * coverImage at the /favicon.svg placeholder while the post itself contains
 * perfectly good pictures, so this is what lets a post's card show the post's
 * own artwork instead of the site logo. Handles both markdown ![](…) and the
 * raw <img> tags these posts use inside <figure>; <video> is ignored because a
 * card can't display one.
 */
function firstBodyImage(raw) {
  const body = raw.startsWith("---")
    ? raw.split("---").slice(2).join("---")
    : raw;
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /!\[[^\]]*\]\(\s*([^)\s]+)/g,
  ];
  for (const re of patterns) {
    for (const m of body.matchAll(re)) {
      const url = m[1];
      if (/\.svg(\?|#|$)/i.test(url)) continue;
      return url;
    }
  }
  return null;
}

/** Minimal frontmatter reader — matches how blogApi.js parses the same files. */
function readFrontmatter(raw) {
  if (!raw.startsWith("---")) return {};
  const parts = raw.split("---");
  if (parts.length < 3) return {};
  const meta = {};
  for (const line of parts[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line
      .slice(idx + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
  }
  return meta;
}

/** Replace a meta tag in place, or append it if the base HTML lacks it. */
function setMeta(html, attr, key, value) {
  const pattern = new RegExp(
    `<meta\\s+${attr}=(["'])${key}\\1\\s+content=(["'])[\\s\\S]*?\\2\\s*/?>`,
    "i",
  );
  const tag = `<meta ${attr}="${key}" content="${value}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function renderCard(baseHtml, card) {
  let html = baseHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${esc(card.title)}</title>`,
  );
  html = html.replace(
    /<link\s+rel=(["'])canonical\1\s+href=(["'])[\s\S]*?\2\s*\/?>/i,
    `<link rel="canonical" href="${esc(card.url)}" />`,
  );

  html = setMeta(html, "name", "description", esc(card.description));

  // The base template writes the twitter:* tags with property= rather than
  // name=; keep that spelling so these overwrite instead of duplicating.
  const tags = [
    ["property", "og:type", "article"],
    ["property", "og:site_name", "DOGS"],
    ["property", "og:url", esc(card.url)],
    ["property", "og:title", esc(card.title)],
    ["property", "og:description", esc(card.description)],
    ["property", "og:image", esc(card.image)],
    ["property", "og:image:alt", esc(card.title)],
    ["property", "twitter:url", esc(card.url)],
    ["property", "twitter:title", esc(card.title)],
    ["property", "twitter:description", esc(card.description)],
    ["property", "twitter:image", esc(card.image)],
  ];
  for (const [attr, key, value] of tags) html = setMeta(html, attr, key, value);

  return html;
}

/**
 * @param {{ origin?: string }} [options]
 */
export default function shareCards(options = {}) {
  const origin = (options.origin || DEFAULT_ORIGIN).replace(/\/+$/, "");
  let outDir = "dist";
  let publicDir = "public";
  let root = process.cwd();

  return {
    name: "wad-share-cards",
    apply: "build",

    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
      publicDir = config.publicDir;
    },

    // closeBundle: index.html and the public/ copy are both on disk by now.
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const baseHtml = fs.readFileSync(indexPath, "utf8");
      // Largest raster the site ships — apple-touch-icon is only 180x180.
      const fallbackImage = `${origin}/android-chrome-512x512.png`;

      /** Does a site-relative image path actually exist in the output? */
      const hasLocalFile = (p) => {
        const rel = p.split(/[?#]/)[0].replace(/^\/+/, "");
        if (!rel) return false;
        return (
          fs.existsSync(path.join(publicDir, rel)) ||
          fs.existsSync(path.join(outDir, rel))
        );
      };

      // Read from the source data, not dist, so this never races the copy.
      const load = (file) => {
        const full = path.join(publicDir, "data", file);
        if (!fs.existsSync(full)) return [];
        const parsed = JSON.parse(fs.readFileSync(full, "utf8"));
        if (Array.isArray(parsed)) return parsed;
        return parsed.campaigns || parsed.products || [];
      };

      /**
       * Blog posts are markdown on disk rather than JSON, and blogApi.js builds
       * its manifest the same way: frontmatter for the metadata, filename for
       * the slug, leading underscore means template.
       */
      const loadBlogPosts = () => {
        const dir = path.join(root, "src", "blog");
        if (!fs.existsSync(dir)) return [];
        return fs
          .readdirSync(dir)
          .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
          .map((f) => {
            const raw = fs.readFileSync(path.join(dir, f), "utf8");
            const meta = readFrontmatter(raw);
            const slug = f.replace(/\.md$/, "");
            return {
              ...meta,
              id: slug,
              title: meta.title || slug,
              bodyImage: firstBodyImage(raw),
            };
          });
      };

      // route: the URL segments under the origin; entity supplies the content.
      const targets = [
        ...load("campaigns.json").map((entity) => ({
          route: ["store", "campaign"],
          entity,
        })),
        ...load("products.json").map((entity) => ({
          route: ["store", "product"],
          entity,
        })),
        ...loadBlogPosts().map((entity) => ({
          route: ["apps", "blog"],
          entity,
          suffix: " | DOG BLOG",
        })),
      ];

      const written = [];
      for (const { route, entity, suffix = " — DOGS" } of targets) {
        if (!entity || !entity.id) continue;
        const routePath = `${route.join("/")}/${entity.id}`;
        const html = renderCard(baseHtml, {
          title: `${entity.title}${suffix}`,
          description: summarize(entity.description),
          url: `${origin}/${routePath}`,
          image: pickImage(entity, origin, fallbackImage, hasLocalFile),
        });
        // Written twice on purpose. The share links carry no trailing slash, and
        // static hosts disagree about how to resolve that: some 301 to the
        // directory index, some look for a sibling .html. Both files exist so the
        // bare URL resolves either way and never falls through to 404.html,
        // which would hand the crawler no metadata at all.
        const base = path.join(outDir, ...route);
        fs.mkdirSync(path.join(base, entity.id), { recursive: true });
        fs.writeFileSync(path.join(base, entity.id, "index.html"), html, "utf8");
        fs.writeFileSync(path.join(base, `${entity.id}.html`), html, "utf8");
        written.push(routePath);
      }

      this.info(
        `share cards prerendered: ${written.length}\n  ${written.join("\n  ")}`,
      );
    },
  };
}
