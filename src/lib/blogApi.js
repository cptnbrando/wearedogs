/**
 * @typedef {Object} BlogPost
 * @property {string} slug
 * @property {string} title
 * @property {string} date
 * @property {string} description
 * @property {string} author
 * @property {string} coverImage
 * @property {string} [body]
 */

// ---------------------------------------------------------------------------
// Eager Directory Glob Imports (No manifest.json required)
// ---------------------------------------------------------------------------

const modules = import.meta.glob("/public/blog/*.md", { query: "?raw", eager: true });

// Process modules and build sorted blog posts manifest in-memory
const postsManifest = Object.keys(modules).map((key) => {
  // Key format: "/public/blog/hello-world.md"
  const rawMd = modules[key].default || modules[key];
  const slug = key.split("/").pop().replace(".md", "");

  // Extract frontmatter
  let metadata = {};
  let mdContent = rawMd;

  if (rawMd.startsWith("---")) {
    const parts = rawMd.split("---");
    if (parts.length >= 3) {
      const fmText = parts[1];
      mdContent = parts.slice(2).join("---").trim();

      const lines = fmText.split("\n");
      for (const line of lines) {
        const idx = line.indexOf(":");
        if (idx !== -1) {
          const k = line.substring(0, idx).trim();
          const v = line.substring(idx + 1).trim();
          metadata[k] = v.replace(/^['"]|['"]$/g, "");
        }
      }
    }
  }

  return {
    slug,
    title: metadata.title || slug,
    date: metadata.date || new Date().toISOString().split("T")[0],
    description: metadata.description || "",
    author: metadata.author || "Anonymous",
    coverImage: metadata.coverImage || "/favicon.svg",
    rawContent: rawMd
})
.filter((post) => !post.slug.startsWith("_"))
.sort((a, b) => new Date(b.date) - new Date(a.date));

// Cache storage for parsed markdown body structures
const apiCache = {};

// ---------------------------------------------------------------------------
// Markdown Parser
// ---------------------------------------------------------------------------

/**
 * Parses markdown body and frontmatter header into structured HTML.
 * @param {string} rawMd - Raw markdown text
 * @returns {{ metadata: Record<string, string>, bodyHtml: string }}
 */
export function parseMarkdown(rawMd) {
  let metadata = {};
  let mdContent = rawMd;

  // Extract frontmatter
  if (rawMd.startsWith("---")) {
    const parts = rawMd.split("---");
    if (parts.length >= 3) {
      const fmText = parts[1];
      mdContent = parts.slice(2).join("---").trim();
      
      const lines = fmText.split("\n");
      for (const line of lines) {
        const idx = line.indexOf(":");
        if (idx !== -1) {
          const key = line.substring(0, idx).trim();
          const val = line.substring(idx + 1).trim();
          metadata[key] = val.replace(/^['"]|['"]$/g, "");
        }
      }
    }
  }

  const lines = mdContent.split("\n");
  let html = "";
  let inList = false;
  let inCode = false;

  for (let line of lines) {
    let trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith("```")) {
      if (inCode) {
        html += "</pre>";
        inCode = false;
      } else {
        html += '<pre class="bg-[#0b0c10] p-4 rounded-lg overflow-x-auto text-[#00d75f] font-mono text-xs border border-white/5 my-4">';
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      html += trimmed.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n";
      continue;
    }

    // List handling
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        html += '<ul class="list-disc list-inside my-4 pl-2 space-y-2">';
        inList = true;
      }
      line = trimmed.substring(2);
    } else if (inList && (trimmed === "" || (!trimmed.startsWith("- ") && !trimmed.startsWith("* ")))) {
      html += "</ul>";
      inList = false;
    }

    if (trimmed === "") {
      if (!inList && !inCode) {
        html += '<div class="h-4"></div>';
      }
      continue;
    }

    let processed = line;

    // Headers
    let headerLevel = 0;
    if (line.startsWith("#")) {
      while (line.charAt(headerLevel) === "#") {
        headerLevel++;
      }
      if (headerLevel > 0 && line.charAt(headerLevel) === " ") {
        const titleText = line.substring(headerLevel + 1);
        const sizes = {
          1: "text-2xl font-extrabold tracking-tight text-white mb-4 mt-6",
          2: "text-xl font-bold tracking-tight text-white/90 mb-3 mt-5 border-b border-white/10 pb-1.5",
          3: "text-lg font-semibold text-white/85 mb-2 mt-4",
          4: "text-base font-medium text-white/80 mb-2 mt-3"
        };
        const classStr = sizes[headerLevel] || "text-base font-bold text-white";
        html += `<h${headerLevel} class="${classStr}">${titleText}</h${headerLevel}>`;
        continue;
      }
    }

    // Bold
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    processed = processed.replace(/__(.*?)__/g, '<strong class="font-bold text-white">$1</strong>');

    // Italic
    processed = processed.replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>');
    processed = processed.replace(/_(.*?)_/g, '<em class="italic text-white/90">$1</em>');

    // Links
    processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#ff3344] hover:underline">$1</a>');

    if (inList) {
      html += `<li class="text-white/85 leading-relaxed">${processed}</li>`;
    } else {
      html += `<p class="text-white/85 leading-relaxed mb-4 text-justify">${processed}</p>`;
    }
  }

  if (inList) html += "</ul>";
  if (inCode) html += "</pre>";

  return { metadata, bodyHtml: html };
}

// ---------------------------------------------------------------------------
// API Library Accessors
// ---------------------------------------------------------------------------

/**
 * Fetches the list of all blog posts dynamically.
 * @returns {Promise<BlogPost[]>}
 */
export async function getPosts() {
  return postsManifest;
}

/**
 * Fetches the content of a specific blog post by its slug. Parses the markdown.
 * @param {string} slug - The post unique slug
 * @returns {Promise<{ metadata: Record<string, string>, bodyHtml: string } | null>}
 */
export async function getPostContent(slug) {
  if (apiCache[slug]) return apiCache[slug];

  const post = postsManifest.find((p) => p.slug === slug);
  if (post) {
    const parsed = parseMarkdown(post.rawContent);
    apiCache[slug] = parsed;
    return parsed;
  }

  return null;
}
