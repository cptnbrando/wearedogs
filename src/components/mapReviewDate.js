/**
 * mapReviewDate.js
 * When a DOGS map review was written: "Oct 26, 2026 · 9:41pm (today)".
 * The age in brackets is one unit only, the biggest that fits.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MS_PER_DAY = 86400000;
// Up to this many days old the age counts days; past it, months
const MAX_DAYS_SHOWN = 31;
const MONTHS_PER_YEAR = 12;

const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;

/**
 * One-unit age: "today", "1 day ago", "13 days ago", "1 month ago", "2 years ago".
 * @param {Date} then
 * @param {Date} [now]
 * @returns {string}
 */
export function reviewAge(then, now = new Date()) {
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(then)) / MS_PER_DAY);
  if (days <= 0) return "today";
  if (days <= MAX_DAYS_SHOWN) return plural(days, "day");
  // Whole calendar months, dropping the last one if its day isn't reached yet
  const months = Math.max(
    1,
    (now.getFullYear() - then.getFullYear()) * MONTHS_PER_YEAR +
      now.getMonth() - then.getMonth() - (now.getDate() < then.getDate() ? 1 : 0),
  );
  if (months < MONTHS_PER_YEAR) return plural(months, "month");
  return plural(Math.floor(months / MONTHS_PER_YEAR), "year");
}

/**
 * "Oct 26, 2026 · 9:41pm (today)" in the viewer's local time.
 * @param {string} iso - review.reviewedAt
 * @param {Date} [now]
 * @returns {string}
 */
export function formatReviewDate(iso, now = new Date()) {
  const d = new Date(iso);
  const h = d.getHours();
  const time = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}${h < 12 ? "am" : "pm"}`;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${time} (${reviewAge(d, now)})`;
}
