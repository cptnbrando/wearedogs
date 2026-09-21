/**
 * Blog writing timeline: dates every line of every blog post from git history,
 * so the reader's scrollbar can show WHEN each stretch of a post was written.
 *
 * Exposed to the app as `virtual:blog-timeline`:
 *   { "<slug>": { "<line key>": "YYYY-MM-DD", … }, … }
 * blogApi.js stamps those days onto the rendered blocks as `data-w`.
 *
 * How a line gets its day
 *   The post's history is replayed oldest → newest (`git log --follow`, one
 *   `git cat-file --batch` for every version). A line keeps the day of the
 *   commit that first introduced it. A line that merely got EDITED — a typo
 *   fix, a reworded sentence — is matched to the line it replaced by word
 *   overlap and keeps that line's day, which plain `git blame` cannot do.
 *   Commits less than six hours apart are one writing session and share the
 *   session's first day, so a night that runs past midnight stays one date.
 *   Lines not committed yet are dated today.
 *
 * Why there is a committed artifact (src/data/blog/timeline.json)
 *   The deploy workflow checks out a SHALLOW clone: one commit, no history to
 *   replay. So wherever full history exists — i.e. every local dev server — the
 *   result is also written next to the posts, and CI reads that instead. Lines
 *   newer than the file fall back to the HEAD commit's day, which for a deploy
 *   triggered by that very push is the right answer anyway.
 *
 *   The file is rewritten only when its content changes, and a day already on
 *   record is never pushed LATER (text written at 23:50 and committed at 00:05
 *   stays on the day it was written), so committing it alongside the post leaves
 *   a clean tree. It is generated — commit it, don't edit it.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { bodyLines, createLineKeyer, isDatable } from "../src/lib/blogTimeline.js";

const VIRTUAL_ID = "virtual:blog-timeline";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

const BLOG_DIR = "src/data/blog";
const ARTIFACT = "src/data/blog/timeline.json";
const ARTIFACT_NOTE =
  "Generated from git history by scripts/vite-plugin-blog-timeline.js. Commit it, don't edit it.";

const SESSION_GAP_MS = 6 * 60 * 60 * 1000;
// Word overlap (Jaccard) above which a changed line counts as an edit of the
// line it replaced rather than as new writing.
const EDIT_SIMILARITY = 0.6;

function git(root, args, input) {
  try {
    return execFileSync("git", ["-c", "core.quotepath=off", ...args], {
      cwd: root,
      input,
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["pipe", "pipe", "ignore"],
      windowsHide: true,
    });
  } catch {
    return null; // no git, not a repository, or nothing at that path
  }
}

function gitText(root, args) {
  const out = git(root, args);
  return out ? out.toString("utf8").trim() : null;
}

/** Every commit that touched the post, oldest first, with the path it had then. */
function fileHistory(root, relPath) {
  const out = gitText(root, [
    "log",
    "--follow",
    "--format=%x00%H %aI",
    "--name-only",
    "--",
    relPath,
  ]);
  if (!out) return [];
  return out
    .split("\0")
    .slice(1)
    .map((chunk) => {
      const lines = chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const [sha, iso] = lines[0].split(" ");
      return { sha, iso, path: lines[1] || relPath };
    })
    .reverse();
}

/** The post's text at each of those commits, in one git process. */
function readVersions(root, history) {
  const out = git(
    root,
    ["cat-file", "--batch"],
    history.map((version) => `${version.sha}:${version.path}\n`).join(""),
  );
  const texts = [];
  let pos = 0;
  for (let i = 0; i < history.length; i++) {
    if (!out || pos >= out.length) {
      texts.push(null);
      continue;
    }
    const eol = out.indexOf(10, pos);
    const header = out.toString("utf8", pos, eol);
    pos = eol + 1;
    const blob = / blob (\d+)$/.exec(header);
    if (!blob) {
      texts.push(null); // "<object> missing"
      continue;
    }
    const size = Number(blob[1]); // bytes, hence the Buffer arithmetic
    texts.push(out.toString("utf8", pos, pos + size));
    pos += size + 1; // each object is followed by a newline
  }
  return texts;
}

function words(text) {
  return new Set(text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
}

function similarity(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const word of a) if (b.has(word)) shared++;
  return shared / (a.size + b.size - shared);
}

/**
 * Date one version of a post given the version before it.
 * @param {string} text
 * @param {Map<string, {day: string, words: Set<string>}>} prev
 * @param {string} day - the day any genuinely new line gets
 */
function dateLines(text, prev, day) {
  const keyer = createLineKeyer();
  const next = new Map();
  const fresh = [];

  for (const line of bodyLines(text)) {
    const key = keyer.next(line);
    if (!isDatable(line)) continue;
    if (prev.has(key)) next.set(key, prev.get(key));
    else fresh.push({ key, words: words(line) });
  }

  // Lines that vanished in this version are what an edited line may descend from
  const gone = [...prev].filter(([key]) => !next.has(key)).map(([, entry]) => entry);
  for (const line of fresh) {
    let best = null;
    let bestScore = EDIT_SIMILARITY;
    for (const candidate of gone) {
      if (candidate.claimed) continue;
      const score = similarity(line.words, candidate.words);
      if (score >= bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    if (best) best.claimed = true;
    next.set(line.key, { day: best ? best.day : day, words: line.words });
  }

  for (const entry of gone) delete entry.claimed;
  return next;
}

function localDay(ms) {
  const date = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function blogTimeline() {
  let root = process.cwd();
  // relPath → the replayed state at a given HEAD. Saving a post only needs the
  // cheap last step (working tree vs HEAD); the replay reruns when HEAD moves.
  const replayCache = new Map();

  function replay(relPath, head) {
    const cached = replayCache.get(relPath);
    if (cached && cached.head === head) return cached;

    const history = fileHistory(root, relPath);
    const texts = readVersions(root, history);
    let state = new Map();
    let lastCommitMs = null;
    let sessionDay = null;

    history.forEach((version, i) => {
      if (texts[i] === null) return;
      const ms = Date.parse(version.iso);
      if (lastCommitMs === null || ms - lastCommitMs > SESSION_GAP_MS) {
        sessionDay = version.iso.slice(0, 10); // the author's own calendar day
      }
      lastCommitMs = ms;
      state = dateLines(texts[i], state, sessionDay);
    });

    const result = { head, state, lastCommitMs, sessionDay };
    replayCache.set(relPath, result);
    return result;
  }

  function readArtifact() {
    try {
      return JSON.parse(fs.readFileSync(path.join(root, ARTIFACT), "utf8")).posts || {};
    } catch {
      return {};
    }
  }

  function writeArtifact(posts) {
    const file = path.join(root, ARTIFACT);
    const json = JSON.stringify({ "//": ARTIFACT_NOTE, posts }, null, 2) + "\n";
    let current = null;
    try {
      current = fs.readFileSync(file, "utf8");
    } catch {}
    if (current !== json) fs.writeFileSync(file, json);
  }

  function build() {
    const head = gitText(root, ["rev-parse", "HEAD"]);
    const shallow = gitText(root, ["rev-parse", "--is-shallow-repository"]) === "true";
    const canReplay = !!head && !shallow;
    const headDay = head ? (gitText(root, ["log", "-1", "--format=%aI"]) || "").slice(0, 10) : "";
    const recorded = readArtifact();
    const posts = {};

    const files = fs
      .readdirSync(path.join(root, BLOG_DIR))
      .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
      .sort();

    for (const name of files) {
      const slug = name.replace(/\.md$/, "");
      const relPath = `${BLOG_DIR}/${name}`;
      const text = fs.readFileSync(path.join(root, relPath), "utf8");
      const known = recorded[slug] || {};

      let replayed = null;
      if (canReplay) {
        const { state, lastCommitMs, sessionDay } = replay(relPath, head);
        // Uncommitted lines: still the same sitting if the last commit is recent
        const stillWriting =
          lastCommitMs !== null && Date.now() - lastCommitMs <= SESSION_GAP_MS;
        replayed = dateLines(text, state, stillWriting ? sessionDay : localDay(Date.now()));
      }

      const days = {};
      const keyer = createLineKeyer();
      for (const line of bodyLines(text)) {
        const key = keyer.next(line);
        if (!isDatable(line)) continue;
        const computed = replayed?.get(key)?.day;
        const onRecord = known[key];
        const day =
          computed && onRecord
            ? computed < onRecord
              ? computed
              : onRecord
            : computed || onRecord || headDay;
        if (day) days[key] = day;
      }
      posts[slug] = days;
    }

    // Only a checkout that can see history gets to write the record
    if (canReplay) writeArtifact(posts);
    return posts;
  }

  const isBlogPost = (file) => {
    const normalized = file.replace(/\\/g, "/");
    return normalized.includes(`/${BLOG_DIR}/`) && normalized.endsWith(".md");
  };

  return {
    name: "wad-blog-timeline",

    configResolved(config) {
      root = config.root;
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id === RESOLVED_ID) return `export default ${JSON.stringify(build())};`;
    },

    configureServer(server) {
      // A post added or removed changes the timeline too
      const refresh = (file) => {
        if (!isBlogPost(file)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
      };
      server.watcher.on("add", refresh);
      server.watcher.on("unlink", refresh);
    },

    // Saving a post re-dates it in the same hot update as the text itself
    handleHotUpdate(ctx) {
      if (!isBlogPost(ctx.file)) return;
      const mod = ctx.server.moduleGraph.getModuleById(RESOLVED_ID);
      if (!mod) return;
      ctx.server.moduleGraph.invalidateModule(mod);
      return [...ctx.modules, mod];
    },
  };
}
