import fs from "node:fs";
import path from "node:path";
import { CAMPAIGN_ALIASES } from "../src/lib/campaignAliases.js";
import { APP_SHORT_URLS } from "../src/lib/appShortUrls.js";
import { fullLibrary, RENAMED_TRACK_IDS } from "../src/data/music/tracks.js";

/**
 * Share cards for every deep-linkable item: campaigns, products, blog posts,
 * the music player and each of its public songs.
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

const DEFAULT_ORIGIN = "https://dogs.red";

/**
 * Toolbox apps with a card of their own, keyed by app slug. Each is written at
 * /apps/<slug> and at every short url in APP_SHORT_URLS that opens that app
 * (dogs.red/d, dogs.red/data). Banner artwork lives in scripts/share-banners/.
 */
const APP_CARDS = {
  dataflash: {
    title: "Data Train",
    description:
      "Scan a QR code and send files and text between your devices. No account, no app to install, nothing to plug in.",
    image: "/share/datatrain.png",
  },
  // No banner of its own yet: the card shows the site's image
  captions: {
    title: "Captions",
    description:
      "Time captions and lyrics to any audio or video, word by word. Tap along, or let it transcribe, then export .srt for your video editor.",
  },
  // No banner of its own yet: the card shows the site's image
  lyricvideo: {
    title: "Lyric Video",
    description:
      "Turn any song into a MilkDrop visualizer video with its lyrics: vertical, horizontal or square, made in your browser.",
  },
};

/** The card for /music itself: what a link to the player shows. */
const MUSIC_CARD = {
  title: "DOGS MUSIC",
  description: "Songs by DOGS. Vocals or instrumentals, with a visualizer that moves to the music. Press play.",
};
const MUSIC_ROUTE = "music";
/** Songs added without a commit live in this file (src/lib/musicCatalog.svelte.js reads it too). */
const CATALOG_URL = "https://data.wearedogs.net/music/catalog.json";
const CATALOG_KIND = "dogs-music";
const CATALOG_TIMEOUT_MS = 8000;
const CATALOG_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
const CATALOG_MAX_TEXT = 200;
/** A catalog cover is only used from our own hosts. */
const CATALOG_IMAGE_PREFIXES = ["https://data.wearedogs.net/", "https://dogs.red/", "https://wearedogs.net/"];

/**
 * The catalog's public songs as they stand at build time, or none when the
 * file cannot be had: a build never fails for it. A song added later gets
 * its card with the next build.
 * @param {string} origin - the site's own address: the data host only answers requests that come from it
 * @param {(message: string) => void} say - where to note why the catalog was left out
 * @returns {Promise<object[]>}
 */
async function loadCatalogTracks(origin, say) {
  try {
    const res = await fetch(CATALOG_URL, {
      headers: { Referer: `${origin}/`, Origin: origin },
      signal: AbortSignal.timeout(CATALOG_TIMEOUT_MS),
    });
    if (!res.ok) {
      say(`share cards: the music catalog answered ${res.status}; only the built-in songs get cards`);
      return [];
    }
    const catalog = await res.json();
    if (!catalog || catalog.kind !== CATALOG_KIND || !Array.isArray(catalog.tracks)) return [];
    const text = (value) => (typeof value === "string" ? value.slice(0, CATALOG_MAX_TEXT) : "");
    const image = (value) => (CATALOG_IMAGE_PREFIXES.some((prefix) => text(value).startsWith(prefix)) ? value : "");
    return catalog.tracks
      .filter((track) => track && CATALOG_ID_PATTERN.test(track.id) && text(track.title) && track.public !== false)
      .map((track) => ({
        id: track.id,
        title: text(track.title),
        artist: text(track.artist),
        album: text(track.album),
        year: Number(track.year) || 0,
        cover: image(track.cover),
        altCover: image(track.altCover),
      }));
  } catch (e) {
    say(`share cards: the music catalog could not be read (${e && e.message}); only the built-in songs get cards`);
    return [];
  }
}
/** An album cover is square: the small card shows all of it, the large one would crop it. */
const SQUARE_CARD = "summary";
const SONG_TYPE = "music.song";

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
    ["property", "og:type", card.type || "article"],
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
  if (card.twitterCard) tags.push(["property", "twitter:card", card.twitterCard]);
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
    async closeBundle() {
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
        const full = path.join(root, "src", "data", file);
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
        const dir = path.join(root, "src", "data", "blog");
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
        ...load("fundraiser/campaigns.json").map((entity) => ({
          route: ["store", "campaign"],
          entity,
        })),
        ...load("store/products.json").map((entity) => ({
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

        // Campaign short urls (/thc, /doja, …) get the same card at the top
        // level. The canonical/og:url baked in above still points at the
        // /store/campaign/<id> page, so crawlers consolidate the aliases onto
        // one URL instead of seeing ten duplicates.
        for (const [alias, campaignId] of Object.entries(CAMPAIGN_ALIASES)) {
          if (campaignId !== entity.id) continue;
          fs.mkdirSync(path.join(outDir, alias), { recursive: true });
          fs.writeFileSync(path.join(outDir, alias, "index.html"), html, "utf8");
          fs.writeFileSync(path.join(outDir, `${alias}.html`), html, "utf8");
          written.push(alias);
        }
      }

      // Toolbox apps: /apps/<slug> plus its short urls, all canonical to the
      // /apps/<slug> page for the same reason the campaign aliases are.
      for (const [app, card] of Object.entries(APP_CARDS)) {
        const html = renderCard(baseHtml, {
          title: `${card.title} — DOGS`,
          description: summarize(card.description),
          url: `${origin}/apps/${app}`,
          image: pickImage(card, origin, fallbackImage, hasLocalFile),
        });
        const aliases = Object.keys(APP_SHORT_URLS).filter(
          (alias) => APP_SHORT_URLS[alias] === app,
        );
        for (const routePath of [`apps/${app}`, ...aliases]) {
          const base = path.join(outDir, ...routePath.split("/"));
          fs.mkdirSync(base, { recursive: true });
          fs.writeFileSync(path.join(base, "index.html"), html, "utf8");
          fs.writeFileSync(`${base}.html`, html, "utf8");
          written.push(routePath);
        }
      }

      // The music player, and one card per public song: cover, title, artist.
      // A song that was renamed keeps a card at its old link, canonical to the new.
      const writeCard = (routePath, html) => {
        const base = path.join(outDir, ...routePath.split("/"));
        fs.mkdirSync(base, { recursive: true });
        fs.writeFileSync(path.join(base, "index.html"), html, "utf8");
        fs.writeFileSync(`${base}.html`, html, "utf8");
        written.push(routePath);
      };
      writeCard(MUSIC_ROUTE, renderCard(baseHtml, {
        title: MUSIC_CARD.title,
        description: MUSIC_CARD.description,
        url: `${origin}/${MUSIC_ROUTE}`,
        image: fallbackImage,
      }));
      // The catalog's songs join the built-in ones; one with a built-in id replaces it
      const catalogTracks = await loadCatalogTracks(origin, (message) => this.info(message));
      const catalogIds = catalogTracks.map((track) => track.id);
      const songs = fullLibrary.filter((track) => !catalogIds.includes(track.id)).concat(catalogTracks);
      for (const track of songs) {
        if (track.public === false || track.hidden) continue;
        const html = renderCard(baseHtml, {
          title: track.artist ? `${track.title} · ${track.artist}` : track.title,
          description: summarize(`${track.album ? `${track.album}${track.year ? ` (${track.year})` : ""}. ` : ""}Play it on DOGS.`),
          url: `${origin}/${MUSIC_ROUTE}/${track.id}`,
          image: pickImage({ images: [track.cover], image: track.altCover }, origin, fallbackImage, hasLocalFile),
          type: SONG_TYPE,
          twitterCard: SQUARE_CARD,
        });
        const oldIds = Object.keys(RENAMED_TRACK_IDS).filter((old) => RENAMED_TRACK_IDS[old] === track.id);
        for (const id of [track.id, ...oldIds]) writeCard(`${MUSIC_ROUTE}/${id}`, html);
      }

      this.info(
        `share cards prerendered: ${written.length}\n  ${written.join("\n  ")}`,
      );
    },
  };
}
