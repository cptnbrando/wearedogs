/**
 * trackDate.js
 * The date the music player shows beside a song's album: "NOV 2026".
 *
 * A DOGS song shows the month it went up on the site (its `dateAdded`, which
 * is moved forward when the song is updated). Anybody else's shows the month
 * it was released (`released`, "2018-05" or a full date), or just the year
 * when no month is known.
 */

/** Artists whose songs are DOGS's own. */
const OWN_ARTISTS = ["DOGS", "DOG BLOG"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
/** The year and month at the start of a date as written: no time zone can move it. */
const YEAR_MONTH = /^(\d{4})-(\d{2})/;

/**
 * @param {{ artist?: string, dateAdded?: string, released?: string, year?: number }} track
 * @returns {string} "NOV 2026", "2018", or "" when nothing is known
 */
export function trackMonthYear(track) {
  const own = OWN_ARTISTS.includes(track.artist);
  const match = YEAR_MONTH.exec((own ? track.dateAdded : track.released) || "");
  const month = match ? MONTHS[Number(match[2]) - 1] : "";
  if (month) return `${month} ${match[1]}`;
  return track.year ? String(track.year) : "";
}
