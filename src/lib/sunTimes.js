/**
 * Day or night where the visitor is, without asking where they are.
 *
 * The browser gives a time zone ("America/Chicago") and a clock, never a
 * position, so the position is a guess: a spot near the middle of that time
 * zone's people (ZONE_PLACES), or, for a zone not listed, the longitude its
 * clock implies and a middle latitude. Sunrise and sunset are then worked out
 * for that spot with the usual solar equations.
 *
 * It is an estimate. Inside a listed zone it is usually within half an hour
 * of the real sunset; at the far edge of a wide zone, or for an unlisted one,
 * it can be an hour out. That is fine for picking a light or dark theme. For
 * anything that needs the real time, ask for the position.
 */

const MS_PER_MINUTE = 60000;
const MINUTES_PER_DAY = 1440;
const MS_PER_DAY = MINUTES_PER_DAY * MS_PER_MINUTE;
const DEGREES_PER_HOUR = 15;
const TO_RADIANS = Math.PI / 180;
/** The sun counts as down when its centre is this far under the horizon (refraction and its own width). */
const SUN_HORIZON_DEGREES = -0.833;
/** Where an unlisted zone is assumed to sit, north or south of the equator. */
const FALLBACK_LATITUDE = 35;
const SOUTHERN_PREFIXES = ["Australia/", "Antarctica/", "Pacific/Auckland", "Pacific/Fiji", "Africa/Johannesburg", "America/Sao_Paulo", "America/Argentina/", "America/Santiago", "America/Lima", "America/Montevideo"];

/** Time zone -> [latitude, longitude] of a spot most of its people are near. */
const ZONE_PLACES = {
  "America/New_York": [40.0, -77.0],
  "America/Detroit": [42.5, -83.5],
  "America/Toronto": [44.0, -79.0],
  "America/Chicago": [36.5, -94.0],
  "America/Denver": [39.5, -106.0],
  "America/Phoenix": [33.5, -112.0],
  "America/Los_Angeles": [36.5, -120.0],
  "America/Anchorage": [61.2, -149.9],
  "Pacific/Honolulu": [21.3, -157.9],
  "America/Vancouver": [49.3, -123.1],
  "America/Edmonton": [52.0, -113.8],
  "America/Winnipeg": [50.0, -97.1],
  "America/Halifax": [44.6, -63.6],
  "America/Mexico_City": [19.4, -99.1],
  "America/Bogota": [4.7, -74.1],
  "America/Lima": [-12.0, -77.0],
  "America/Santiago": [-33.4, -70.7],
  "America/Sao_Paulo": [-23.5, -46.6],
  "America/Argentina/Buenos_Aires": [-34.6, -58.4],
  "Europe/London": [52.5, -1.5],
  "Europe/Dublin": [53.3, -6.3],
  "Europe/Lisbon": [38.7, -9.1],
  "Europe/Madrid": [40.4, -3.7],
  "Europe/Paris": [47.0, 2.5],
  "Europe/Amsterdam": [52.4, 4.9],
  "Europe/Brussels": [50.8, 4.4],
  "Europe/Berlin": [51.0, 10.5],
  "Europe/Rome": [42.5, 12.5],
  "Europe/Zurich": [47.4, 8.5],
  "Europe/Vienna": [48.2, 16.4],
  "Europe/Stockholm": [59.3, 18.1],
  "Europe/Oslo": [59.9, 10.8],
  "Europe/Copenhagen": [55.7, 12.6],
  "Europe/Helsinki": [60.2, 24.9],
  "Europe/Warsaw": [52.2, 21.0],
  "Europe/Prague": [50.1, 14.4],
  "Europe/Athens": [38.0, 23.7],
  "Europe/Istanbul": [41.0, 29.0],
  "Europe/Kyiv": [50.5, 30.5],
  "Europe/Moscow": [55.8, 37.6],
  "Africa/Cairo": [30.0, 31.2],
  "Africa/Lagos": [6.5, 3.4],
  "Africa/Nairobi": [-1.3, 36.8],
  "Africa/Johannesburg": [-26.2, 28.0],
  "Asia/Dubai": [25.2, 55.3],
  "Asia/Karachi": [24.9, 67.0],
  "Asia/Kolkata": [22.0, 79.0],
  "Asia/Dhaka": [23.8, 90.4],
  "Asia/Bangkok": [13.8, 100.5],
  "Asia/Jakarta": [-6.2, 106.8],
  "Asia/Singapore": [1.4, 103.8],
  "Asia/Manila": [14.6, 121.0],
  "Asia/Hong_Kong": [22.3, 114.2],
  "Asia/Shanghai": [32.0, 114.0],
  "Asia/Taipei": [25.0, 121.5],
  "Asia/Seoul": [37.6, 127.0],
  "Asia/Tokyo": [35.7, 139.7],
  "Australia/Perth": [-31.9, 115.9],
  "Australia/Adelaide": [-34.9, 138.6],
  "Australia/Brisbane": [-27.5, 153.0],
  "Australia/Sydney": [-33.9, 151.2],
  "Australia/Melbourne": [-37.8, 145.0],
  "Pacific/Auckland": [-36.8, 174.8],
};

/**
 * A zone's clock offset from UTC in winter, in minutes east. Summer time is
 * left out, because it moves the clock and not the sun.
 * @param {Date} now
 */
function standardOffsetMinutes(now) {
  const january = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const july = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  return -Math.max(january, july);
}

/**
 * Roughly where the visitor is.
 * @param {string} timeZone - an IANA name, or "" when the browser has none
 * @param {Date} now
 * @returns {[number, number]} latitude and longitude
 */
export function guessPlace(timeZone, now) {
  if (ZONE_PLACES[timeZone]) return ZONE_PLACES[timeZone];
  const south = SOUTHERN_PREFIXES.some((prefix) => (timeZone || "").indexOf(prefix) === 0);
  return [south ? -FALLBACK_LATITUDE : FALLBACK_LATITUDE, (standardOffsetMinutes(now) / 60) * DEGREES_PER_HOUR];
}

/**
 * Sunrise and sunset on a date at a place.
 * @param {Date} date
 * @param {number} latitude
 * @param {number} longitude - east is positive
 * @returns {{ sunrise: Date, sunset: Date } | { alwaysUp: boolean }} alwaysUp
 *   says which way it went when the sun does not cross the horizon that day
 */
export function sunTimes(date, latitude, longitude) {
  const dayStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayOfYear = Math.floor((dayStart - Date.UTC(date.getUTCFullYear(), 0, 0)) / MS_PER_DAY);
  // How far round the year, as an angle
  const year = (2 * Math.PI / 365) * (dayOfYear - 1 + 0.5);
  // How far the sundial runs ahead of the clock, in minutes
  const equationOfTime = 229.18 * (0.000075 + 0.001868 * Math.cos(year) - 0.032077 * Math.sin(year)
    - 0.014615 * Math.cos(2 * year) - 0.040849 * Math.sin(2 * year));
  // How far north or south of the equator the sun is overhead
  const declination = 0.006918 - 0.399912 * Math.cos(year) + 0.070257 * Math.sin(year)
    - 0.006758 * Math.cos(2 * year) + 0.000907 * Math.sin(2 * year)
    - 0.002697 * Math.cos(3 * year) + 0.00148 * Math.sin(3 * year);
  const lat = latitude * TO_RADIANS;
  const cosHourAngle = (Math.sin(SUN_HORIZON_DEGREES * TO_RADIANS) - Math.sin(lat) * Math.sin(declination))
    / (Math.cos(lat) * Math.cos(declination));
  if (cosHourAngle < -1) return { alwaysUp: true };
  if (cosHourAngle > 1) return { alwaysUp: false };
  const halfDayMinutes = (Math.acos(cosHourAngle) / TO_RADIANS) * 4;
  const noonMinutes = MINUTES_PER_DAY / 2 - 4 * longitude - equationOfTime;
  return {
    sunrise: new Date(dayStart + (noonMinutes - halfDayMinutes) * MS_PER_MINUTE),
    sunset: new Date(dayStart + (noonMinutes + halfDayMinutes) * MS_PER_MINUTE),
  };
}

/**
 * Whether it is daytime for the visitor, and when that next changes.
 * @param {Date} [now]
 * @returns {{ day: boolean, changesAt: Date | null }} changesAt is null where
 *   the sun stays up or down all day
 */
export function daylight(now = new Date()) {
  let timeZone = "";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) {
    // An old browser with no Intl: the clock's own offset still places them
  }
  const [latitude, longitude] = guessPlace(timeZone, now);
  // The sun's day at a place does not line up with the UTC date, so look at
  // the days either side as well and keep the nearest crossings
  const crossings = [];
  for (const shift of [-1, 0, 1]) {
    const times = sunTimes(new Date(now.getTime() + shift * MS_PER_DAY), latitude, longitude);
    if (typeof times.alwaysUp === "boolean") {
      if (shift === 0) return { day: times.alwaysUp, changesAt: null };
      continue;
    }
    crossings.push({ at: times.sunrise, day: true }, { at: times.sunset, day: false });
  }
  crossings.sort((a, b) => a.at - b.at);
  const last = crossings.filter((c) => c.at <= now).pop();
  const next = crossings.find((c) => c.at > now);
  return { day: last ? last.day : !(next && next.day), changesAt: next ? next.at : null };
}
