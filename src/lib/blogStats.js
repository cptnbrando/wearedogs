/**
 * Reading stats for a blog post, computed from its markdown on load so they
 * always match the text being shown. Revisions (edit count, last edit) come
 * from git history via scripts/vite-plugin-blog-timeline.js.
 */
import { bodyLines, isDatable } from "./blogTimeline.js";

// Average silent reading speed for adult non-fiction (Brysbaert, 2019)
const READING_WPM = 238;
// Markdown that is markup, not words: link targets, emphasis, heading and list markers
const LINK_TARGET = /\]\([^)]*\)/g;
const MARKUP = /[#*_`>[\]]/g;
const FENCE = /^```/;

/**
 * @typedef {Object} PostStats
 * @property {number} words
 * @property {number} readMinutes - rounded up, at least 1
 * @property {number | null} edits - null when no history is known
 * @property {string | null} lastEdit - "YYYY-MM-DD"
 */

/**
 * @param {string} rawMd - the whole post, frontmatter included
 * @param {{ edits: number, lastEdit: string } | undefined} revision
 * @returns {PostStats}
 */
export function postStats(rawMd, revision) {
  let words = 0;
  for (const line of bodyLines(rawMd)) {
    if (FENCE.test(line)) continue;
    const tokens = line.replace(LINK_TARGET, "]").replace(MARKUP, " ").split(/\s+/);
    for (const token of tokens) if (isDatable(token)) words++;
  }
  return {
    words,
    readMinutes: Math.max(1, Math.ceil(words / READING_WPM)),
    edits: revision ? revision.edits : null,
    lastEdit: revision ? revision.lastEdit : null,
  };
}

/**
 * "25 min", "1 hr 5 min".
 * @param {number} minutes
 */
export function formatReadTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const rest = minutes % 60;
  return `${Math.floor(minutes / 60)} hr${rest ? ` ${rest} min` : ""}`;
}

/**
 * "Sep 21, 2026" from "2026-09-21", read as a calendar day (no timezone drift).
 * @param {string | null} day
 */
export function formatDay(day) {
  const parts = day ? day.split("-").map(Number) : [];
  if (parts.length !== 3) return "—";
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
