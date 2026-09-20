// timeMath.js — pure logic for the Father Time "Converter" tab.
// Duration unit conversion, calendar-aware date arithmetic, and IANA
// timezone conversion built on Intl (no external date libraries).
import { ZONE_ABBREVS } from "./timezoneAbbrevs.js";

// ------------------------------------------------------------------
// Units (ms per unit). Months/years use Gregorian averages:
// year = 365.2425 days, month = year / 12 = 30.436875 days.
// ------------------------------------------------------------------
export const UNITS = [
  { id: "nanoseconds", label: "Nanoseconds", short: "ns", ms: 1e-6, aliases: ["ns", "nano", "nanos", "nanosecond", "nanoseconds", "nanosec", "nanosecs"] },
  { id: "microseconds", label: "Microseconds", short: "µs", ms: 1e-3, aliases: ["us", "µs", "micro", "micros", "microsecond", "microseconds", "microsec", "microsecs"] },
  { id: "milliseconds", label: "Milliseconds", short: "ms", ms: 1, aliases: ["ms", "milli", "millis", "millisecond", "milliseconds", "millisec", "millisecs", "msec", "msecs"] },
  { id: "seconds", label: "Seconds", short: "s", ms: 1000, aliases: ["s", "sec", "secs", "second", "seconds"] },
  { id: "minutes", label: "Minutes", short: "min", ms: 60000, aliases: ["m", "min", "mins", "minute", "minutes"] },
  { id: "hours", label: "Hours", short: "h", ms: 3600000, aliases: ["h", "hr", "hrs", "hour", "hours"] },
  { id: "days", label: "Days", short: "d", ms: 86400000, aliases: ["d", "day", "days"] },
  { id: "weeks", label: "Weeks", short: "wk", ms: 604800000, aliases: ["w", "wk", "wks", "week", "weeks"] },
  { id: "months", label: "Months", short: "mo", ms: 2629746000, aliases: ["mo", "mos", "month", "months", "mnth", "mnths"] },
  { id: "years", label: "Years", short: "yr", ms: 31556952000, aliases: ["y", "yr", "yrs", "year", "years"] },
  { id: "decades", label: "Decades", short: "dec", ms: 315569520000, aliases: ["decade", "decades"] },
  { id: "centuries", label: "Centuries", short: "c", ms: 3155695200000, aliases: ["century", "centuries"] },
  { id: "millennia", label: "Millennia", short: "ka", ms: 31556952000000, aliases: ["millennium", "millennia", "millenium", "milleniums"] },
];

const UNIT_ALIAS = new Map();
for (const u of UNITS) for (const a of u.aliases) UNIT_ALIAS.set(a, u);

export function unitFromToken(token) {
  return UNIT_ALIAS.get(String(token).toLowerCase()) || null;
}

export function unitById(id) {
  return UNITS.find((u) => u.id === id) || null;
}

// ------------------------------------------------------------------
// Number formatting: keeps ~10 significant digits, falls back to
// scientific notation for extreme magnitudes.
// ------------------------------------------------------------------
export function fmtNum(n, maxDec = 6) {
  if (!isFinite(n)) return "∞";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e21 || abs < 1e-6) return n.toExponential(4);
  const intDigits = abs >= 1 ? Math.floor(Math.log10(abs)) + 1 : 0;
  const dec = Math.max(0, Math.min(maxDec, 10 - intDigits));
  return n.toLocaleString("en-US", { maximumFractionDigits: dec });
}

// ------------------------------------------------------------------
// Duration parsing: "4 weeks 2 days 13 hours" -> parts + total ms
// ------------------------------------------------------------------
export function parseDurationList(str) {
  if (!str) return null;
  const cleaned = str
    .toLowerCase()
    .replace(/(\d),(?=\d)/g, "$1")
    .replace(/,|\band\b|\+/g, " ")
    .trim();
  if (!cleaned) return null;
  const re = /(-?\d+(?:\.\d+)?)\s*([a-zµ]+)/g;
  const parts = [];
  let lastEnd = 0;
  let m;
  while ((m = re.exec(cleaned)) !== null) {
    // Reject if there is stray text between matches ("jan 6" etc.)
    if (cleaned.slice(lastEnd, m.index).trim() !== "") return null;
    const unit = unitFromToken(m[2]);
    if (!unit) return null;
    parts.push({ value: parseFloat(m[1]), unit });
    lastEnd = re.lastIndex;
  }
  if (parts.length === 0 || cleaned.slice(lastEnd).trim() !== "") return null;
  const totalMs = parts.reduce((sum, p) => sum + p.value * p.unit.ms, 0);
  return { parts, totalMs };
}

// Greedy composite breakdown of a millisecond span (avg month/year lengths)
export function breakdownMs(totalMs) {
  const order = ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
  const sign = totalMs < 0 ? -1 : 1;
  let rem = Math.abs(totalMs);
  const out = [];
  for (const id of order) {
    const u = unitById(id);
    const count = id === "milliseconds" ? Math.round(rem / u.ms) : Math.floor(rem / u.ms);
    if (count > 0) {
      out.push({ unit: u, value: count });
      rem -= count * u.ms;
    }
  }
  if (out.length === 0) out.push({ unit: unitById("milliseconds"), value: 0 });
  return { sign, parts: out };
}

// ------------------------------------------------------------------
// Timezone core — built on Intl.DateTimeFormat.
// ------------------------------------------------------------------
export function isValidZone(tz) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function localZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const partsFmtCache = new Map();
function zoneFormatter(tz) {
  let f = partsFmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    partsFmtCache.set(tz, f);
  }
  return f;
}

// Wall-clock parts of an instant in a zone
export function utcToWall(date, tz) {
  const parts = {};
  for (const p of zoneFormatter(tz).formatToParts(date)) parts[p.type] = p.value;
  return {
    y: +parts.year,
    mo: +parts.month,
    d: +parts.day,
    h: +parts.hour,
    mi: +parts.minute,
    s: +parts.second,
  };
}

// Zone offset (ms east of UTC) at a given instant
export function getZoneOffsetMs(ts, tz) {
  const w = utcToWall(new Date(ts), tz);
  const asUtc = Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s);
  return asUtc - Math.floor(ts / 1000) * 1000;
}

// Wall-clock parts in a zone -> UTC instant (iterates to settle DST)
export function wallToUtc(w, tz) {
  const target = Date.UTC(w.y, w.mo - 1, w.d, w.h || 0, w.mi || 0, w.s || 0);
  let utc = target;
  for (let i = 0; i < 3; i++) {
    const next = target - getZoneOffsetMs(utc, tz);
    if (next === utc) break;
    utc = next;
  }
  return new Date(utc);
}

// True when the zone is on its daylight/summer offset at that instant.
// Offset-based, so it holds in the southern hemisphere and for Ireland.
export function isDstAt(date, tz) {
  const y = date.getUTCFullYear();
  const jan = getZoneOffsetMs(Date.UTC(y, 0, 1), tz);
  const jul = getZoneOffsetMs(Date.UTC(y, 6, 1), tz);
  if (jan === jul) return false;
  return getZoneOffsetMs(date.getTime(), tz) > Math.min(jan, jul);
}

// Zones that share an acronym pair with the row zone in timezoneAbbrevs.js
const SHARED_ABBREV = {
  CET: ["Europe/Berlin", "Europe/Rome", "Europe/Madrid", "Europe/Amsterdam", "Europe/Brussels", "Europe/Vienna", "Europe/Zurich", "Europe/Oslo", "Europe/Stockholm", "Europe/Copenhagen", "Europe/Warsaw", "Europe/Prague", "Europe/Budapest"],
  EET: ["Europe/Helsinki", "Europe/Kyiv", "Europe/Bucharest", "Africa/Cairo"],
  EST: ["America/Toronto", "America/Detroit"],
  CST: ["America/Winnipeg"],
  MST: ["America/Edmonton"],
  PST: ["America/Vancouver"],
};
const STD_TO_DST = { CET: "CEST", EET: "EEST", EST: "EDT", CST: "CDT", MST: "MDT", PST: "PDT" };

let abbrevByZone = null;
function tableAbbrev(tz, dst) {
  if (!abbrevByZone) {
    abbrevByZone = new Map();
    const put = (zone, kind, abbr) => {
      const k = `${zone}|${kind}`;
      if (!abbrevByZone.has(k)) abbrevByZone.set(k, abbr);
    };
    for (const r of ZONE_ABBREV_ROWS) if (r.abbr.length > 2) put(r.tz, r.kind, r.abbr);
    for (const [std, zones] of Object.entries(SHARED_ABBREV)) {
      for (const z of zones) {
        put(z, "std", std);
        put(z, "dst", STD_TO_DST[std]);
      }
    }
    put("Europe/London", "std", "GMT");
    put("Europe/Dublin", "std", "GMT");
  }
  return abbrevByZone.get(`${tz}|${dst ? "dst" : "std"}`) || abbrevByZone.get(`${tz}|any`) || null;
}

export function zoneAbbrev(date, tz) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
    .formatToParts(date)
    .find((x) => x.type === "timeZoneName");
  const intl = p ? p.value : tz;
  // en-US only names North American zones; elsewhere Intl says "GMT+2".
  // Prefer the real acronym (CEST, IST, AEDT...) when the table has one.
  if (/^(?:GMT|UTC)[+\-−]/.test(intl)) return tableAbbrev(tz, isDstAt(date, tz)) || intl;
  return intl;
}

export function formatZoned(date, tz) {
  const main = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${main} ${zoneAbbrev(date, tz)}`;
}

export function formatZonedTime(date, tz) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatZonedDate(date, tz) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function offsetLabel(date, tz) {
  const off = getZoneOffsetMs(date.getTime(), tz);
  const sign = off < 0 ? "-" : "+";
  const abs = Math.abs(off);
  const hh = Math.floor(abs / 3600000);
  const mm = Math.floor((abs % 3600000) / 60000);
  return `UTC${sign}${hh}${mm ? ":" + String(mm).padStart(2, "0") : ""}`;
}

// ------------------------------------------------------------------
// Place lookup — common cities / regions / abbreviations -> IANA zone
// ------------------------------------------------------------------
const PLACES = [
  // North America
  ["Tulsa", "America/Chicago", "tulsa"],
  ["Oklahoma City", "America/Chicago", "oklahoma city", "okc"],
  ["Chicago", "America/Chicago", "chicago"],
  ["Houston", "America/Chicago", "houston"],
  ["Dallas", "America/Chicago", "dallas"],
  ["Austin", "America/Chicago", "austin"],
  ["San Antonio", "America/Chicago", "san antonio"],
  ["Kansas City", "America/Chicago", "kansas city"],
  ["St. Louis", "America/Chicago", "st louis", "saint louis"],
  ["Minneapolis", "America/Chicago", "minneapolis"],
  ["New Orleans", "America/Chicago", "new orleans"],
  ["Nashville", "America/Chicago", "nashville"],
  ["Memphis", "America/Chicago", "memphis"],
  ["New York", "America/New_York", "new york", "new york city", "nyc", "manhattan", "brooklyn"],
  ["Boston", "America/New_York", "boston"],
  ["Philadelphia", "America/New_York", "philadelphia", "philly"],
  ["Washington DC", "America/New_York", "washington", "washington dc", "dc", "d c"],
  ["Atlanta", "America/New_York", "atlanta"],
  ["Miami", "America/New_York", "miami"],
  ["Orlando", "America/New_York", "orlando"],
  ["Detroit", "America/Detroit", "detroit"],
  ["Charlotte", "America/New_York", "charlotte"],
  ["Pittsburgh", "America/New_York", "pittsburgh"],
  ["Denver", "America/Denver", "denver"],
  ["Salt Lake City", "America/Denver", "salt lake city", "slc"],
  ["Albuquerque", "America/Denver", "albuquerque"],
  ["Phoenix", "America/Phoenix", "phoenix", "tucson"],
  ["Los Angeles", "America/Los_Angeles", "los angeles", "la", "l a", "hollywood"],
  ["San Francisco", "America/Los_Angeles", "san francisco", "sf", "bay area"],
  ["San Diego", "America/Los_Angeles", "san diego"],
  ["Seattle", "America/Los_Angeles", "seattle"],
  ["Portland", "America/Los_Angeles", "portland"],
  ["Las Vegas", "America/Los_Angeles", "las vegas", "vegas"],
  ["Sacramento", "America/Los_Angeles", "sacramento"],
  ["Anchorage", "America/Anchorage", "anchorage", "alaska"],
  ["Honolulu", "Pacific/Honolulu", "honolulu", "hawaii", "oahu", "maui"],
  ["Toronto", "America/Toronto", "toronto"],
  ["Ottawa", "America/Toronto", "ottawa"],
  ["Montreal", "America/Toronto", "montreal"],
  ["Vancouver", "America/Vancouver", "vancouver"],
  ["Calgary", "America/Edmonton", "calgary"],
  ["Edmonton", "America/Edmonton", "edmonton"],
  ["Winnipeg", "America/Winnipeg", "winnipeg"],
  ["Halifax", "America/Halifax", "halifax"],
  ["Mexico City", "America/Mexico_City", "mexico city", "cdmx", "mexico"],
  ["Guadalajara", "America/Mexico_City", "guadalajara"],
  ["Monterrey", "America/Monterrey", "monterrey"],
  ["Havana", "America/Havana", "havana", "cuba"],
  ["Panama City", "America/Panama", "panama", "panama city"],
  ["San Juan", "America/Puerto_Rico", "san juan", "puerto rico"],
  ["Kingston", "America/Jamaica", "kingston", "jamaica"],
  ["Guatemala City", "America/Guatemala", "guatemala", "guatemala city"],
  // South America
  ["São Paulo", "America/Sao_Paulo", "sao paulo", "são paulo"],
  ["Rio de Janeiro", "America/Sao_Paulo", "rio", "rio de janeiro"],
  ["Buenos Aires", "America/Argentina/Buenos_Aires", "buenos aires", "argentina"],
  ["Santiago", "America/Santiago", "santiago", "chile"],
  ["Lima", "America/Lima", "lima", "peru"],
  ["Bogotá", "America/Bogota", "bogota", "bogotá", "colombia"],
  ["Caracas", "America/Caracas", "caracas", "venezuela"],
  ["Quito", "America/Guayaquil", "quito", "ecuador"],
  ["La Paz", "America/La_Paz", "la paz", "bolivia"],
  // Europe
  ["London", "Europe/London", "london", "england", "uk", "united kingdom"],
  ["Dublin", "Europe/Dublin", "dublin", "ireland"],
  ["Paris", "Europe/Paris", "paris", "france"],
  ["Berlin", "Europe/Berlin", "berlin", "germany", "munich", "frankfurt", "hamburg"],
  ["Madrid", "Europe/Madrid", "madrid", "spain", "barcelona"],
  ["Rome", "Europe/Rome", "rome", "italy", "milan", "venice"],
  ["Amsterdam", "Europe/Amsterdam", "amsterdam", "netherlands", "holland"],
  ["Brussels", "Europe/Brussels", "brussels", "belgium"],
  ["Vienna", "Europe/Vienna", "vienna", "austria"],
  ["Zurich", "Europe/Zurich", "zurich", "geneva", "switzerland"],
  ["Oslo", "Europe/Oslo", "oslo", "norway"],
  ["Stockholm", "Europe/Stockholm", "stockholm", "sweden"],
  ["Copenhagen", "Europe/Copenhagen", "copenhagen", "denmark"],
  ["Helsinki", "Europe/Helsinki", "helsinki", "finland"],
  ["Reykjavik", "Atlantic/Reykjavik", "reykjavik", "iceland"],
  ["Lisbon", "Europe/Lisbon", "lisbon", "portugal"],
  ["Athens", "Europe/Athens", "athens", "greece"],
  ["Istanbul", "Europe/Istanbul", "istanbul", "turkey"],
  ["Moscow", "Europe/Moscow", "moscow", "russia"],
  ["Kyiv", "Europe/Kyiv", "kyiv", "kiev", "ukraine"],
  ["Warsaw", "Europe/Warsaw", "warsaw", "poland"],
  ["Prague", "Europe/Prague", "prague", "czech republic", "czechia"],
  ["Budapest", "Europe/Budapest", "budapest", "hungary"],
  ["Bucharest", "Europe/Bucharest", "bucharest", "romania"],
  // Asia
  ["Beijing", "Asia/Shanghai", "beijing", "china", "peking"],
  ["Shanghai", "Asia/Shanghai", "shanghai", "shenzhen", "guangzhou", "chengdu"],
  ["Hong Kong", "Asia/Hong_Kong", "hong kong", "hk"],
  ["Taipei", "Asia/Taipei", "taipei", "taiwan"],
  ["Tokyo", "Asia/Tokyo", "tokyo", "japan", "osaka", "kyoto"],
  ["Seoul", "Asia/Seoul", "seoul", "korea", "south korea"],
  ["Singapore", "Asia/Singapore", "singapore"],
  ["Bangkok", "Asia/Bangkok", "bangkok", "thailand"],
  ["Hanoi", "Asia/Ho_Chi_Minh", "hanoi", "ho chi minh", "saigon", "vietnam"],
  ["Manila", "Asia/Manila", "manila", "philippines"],
  ["Jakarta", "Asia/Jakarta", "jakarta", "indonesia", "bali"],
  ["Kuala Lumpur", "Asia/Kuala_Lumpur", "kuala lumpur", "malaysia", "kl"],
  ["Mumbai", "Asia/Kolkata", "mumbai", "bombay", "india"],
  ["New Delhi", "Asia/Kolkata", "delhi", "new delhi"],
  ["Bengaluru", "Asia/Kolkata", "bangalore", "bengaluru", "kolkata", "calcutta", "chennai", "hyderabad"],
  ["Karachi", "Asia/Karachi", "karachi", "lahore", "islamabad", "pakistan"],
  ["Dhaka", "Asia/Dhaka", "dhaka", "bangladesh"],
  ["Kathmandu", "Asia/Kathmandu", "kathmandu", "nepal"],
  ["Colombo", "Asia/Colombo", "colombo", "sri lanka"],
  ["Dubai", "Asia/Dubai", "dubai", "abu dhabi", "uae"],
  ["Riyadh", "Asia/Riyadh", "riyadh", "saudi arabia", "mecca", "jeddah"],
  ["Doha", "Asia/Qatar", "doha", "qatar"],
  ["Tel Aviv", "Asia/Jerusalem", "tel aviv", "jerusalem", "israel"],
  ["Tehran", "Asia/Tehran", "tehran", "iran"],
  ["Baghdad", "Asia/Baghdad", "baghdad", "iraq"],
  ["Kabul", "Asia/Kabul", "kabul", "afghanistan"],
  // Africa
  ["Cairo", "Africa/Cairo", "cairo", "egypt"],
  ["Lagos", "Africa/Lagos", "lagos", "nigeria"],
  ["Nairobi", "Africa/Nairobi", "nairobi", "kenya"],
  ["Johannesburg", "Africa/Johannesburg", "johannesburg", "cape town", "south africa"],
  ["Casablanca", "Africa/Casablanca", "casablanca", "morocco"],
  ["Accra", "Africa/Accra", "accra", "ghana"],
  ["Addis Ababa", "Africa/Addis_Ababa", "addis ababa", "ethiopia"],
  // Oceania
  ["Sydney", "Australia/Sydney", "sydney", "canberra"],
  ["Melbourne", "Australia/Melbourne", "melbourne"],
  ["Brisbane", "Australia/Brisbane", "brisbane"],
  ["Perth", "Australia/Perth", "perth"],
  ["Adelaide", "Australia/Adelaide", "adelaide"],
  ["Auckland", "Pacific/Auckland", "auckland", "wellington", "new zealand"],
  ["Fiji", "Pacific/Fiji", "fiji", "suva"],
  // Spoken zone names (the acronyms themselves live in timezoneAbbrevs.js)
  ["UTC", "UTC", "zulu", "universal", "universal time", "greenwich"],
  ["US Eastern", "America/New_York", "eastern", "us eastern", "east coast"],
  ["US Central", "America/Chicago", "central", "us central"],
  ["US Mountain", "America/Denver", "mountain", "us mountain"],
  ["US Pacific", "America/Los_Angeles", "pacific", "us pacific", "west coast"],
  ["Alaska Time", "America/Anchorage", "alaska time", "alaskan"],
  ["Hawaii Time", "Pacific/Honolulu", "hawaii time", "hawaiian"],
  ["Atlantic Time", "America/Halifax", "atlantic"],
  ["Newfoundland Time", "America/St_Johns", "newfoundland"],
  ["Central European", "Europe/Paris", "central european", "european"],
  ["India Time", "Asia/Kolkata", "india time", "indian"],
  ["Japan Time", "Asia/Tokyo", "japan time", "japanese"],
  ["Australian Eastern", "Australia/Sydney", "australian eastern"],
];

// Acronym rows this runtime's Intl actually knows (older browsers lack a few
// renamed zones, e.g. America/Nuuk).
export const ZONE_ABBREV_ROWS = ZONE_ABBREVS.filter((row) => isValidZone(row[2])).map(
  ([abbr, fullName, tz, kind]) => ({ label: abbr, abbr, fullName, tz, kind }),
);

const PLACE_ALIAS = new Map();
// Acronyms first so "est" carries its std/dst meaning; the first row for a
// shared acronym wins the short form, every full name still resolves.
const normAlias = (s) =>
  s.toLowerCase().replace(/[.,!?'&]/g, "").replace(/-/g, " ").replace(/\s+/g, " ").trim();
for (const row of ZONE_ABBREV_ROWS) {
  const full = normAlias(row.fullName);
  for (const a of [row.abbr.toLowerCase(), full, full.replace(/\s+time$/, "")]) {
    if (a && !PLACE_ALIAS.has(a)) PLACE_ALIAS.set(a, row);
  }
}
for (const [label, tz, ...aliases] of PLACES) {
  for (const a of aliases) if (!PLACE_ALIAS.has(a)) PLACE_ALIAS.set(a, { label, tz });
}

// "utc+5:30", "gmt-3", "+0530", "utc" -> a fixed-offset zone
function resolveOffset(norm) {
  const m = norm.match(/^(?:utc|gmt)?\s*([+\-−])\s*(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return null;
  const sign = m[1] === "+" ? "+" : "-";
  const hh = +m[2];
  const mm = m[3] ? +m[3] : 0;
  if (hh > 14 || mm > 59) return null;
  const label = `UTC${sign}${hh}${mm ? ":" + String(mm).padStart(2, "0") : ""}`;
  if (hh === 0 && mm === 0) return { label: "UTC", tz: "UTC" };
  // Etc/GMT zones are whole-hour only and have their sign flipped (POSIX)
  if (mm === 0) {
    const tz = `Etc/GMT${sign === "+" ? "-" : "+"}${hh}`;
    if (isValidZone(tz)) return { label, tz };
  }
  // Offset identifiers ("+05:30") need a 2024+ browser
  const tz = `${sign}${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  return isValidZone(tz) ? { label, tz } : null;
}

// US state names + abbreviations, dropped when trailing a city name ("tulsa ok")
const US_STATE_TOKENS = new Set(
  (
    "al ak az ar ca co ct de fl ga hi id il in ia ks ky la me md ma mi mn ms mo mt ne nv nh nj nm ny nc nd oh ok or pa ri sc sd tn tx ut vt va wa wv wi wy usa us " +
    "alabama alaska arizona arkansas california colorado connecticut delaware florida georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts michigan minnesota mississippi missouri montana nebraska nevada ohio oklahoma oregon pennsylvania tennessee texas utah vermont virginia washington wisconsin wyoming"
  ).split(/\s+/),
);

export function resolvePlace(raw) {
  if (!raw) return null;
  let norm = raw
    .toLowerCase()
    .replace(/[.,!?']/g, "")
    .replace(/^the\s+/, "")
    .replace(/\s+time$/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!norm) return null;

  // Direct IANA id ("America/Chicago")
  if (raw.includes("/") && isValidZone(raw.trim())) {
    return { label: raw.trim(), tz: raw.trim() };
  }

  // Fixed offsets ("utc+5:30", "gmt-3") — before hyphens turn into spaces
  const offset = resolveOffset(norm);
  if (offset) return offset;
  norm = norm.replace(/[-&]/g, " ").replace(/\s+/g, " ").trim();

  // Full match, then progressively drop trailing tokens (state / country noise)
  let tokens = norm.split(" ");
  while (tokens.length > 0) {
    const candidate = tokens.join(" ");
    if (PLACE_ALIAS.has(candidate)) return PLACE_ALIAS.get(candidate);
    const last = tokens[tokens.length - 1];
    // Only drop generic trailing tokens; otherwise stop after first failure
    if (tokens.length > 1 && (US_STATE_TOKENS.has(last) || last === "city" || last === "time")) {
      tokens = tokens.slice(0, -1);
    } else if (tokens.length > 1) {
      tokens = tokens.slice(0, -1);
    } else {
      break;
    }
  }
  return null;
}

// Curated dropdown options for the structured forms
export const CITY_OPTIONS = [
  { label: "Local Time", tz: "local" },
  { label: "UTC", tz: "UTC" },
  ...[
    "Tulsa", "New York", "Chicago", "Denver", "Phoenix", "Los Angeles", "Anchorage", "Honolulu",
    "Toronto", "Mexico City", "São Paulo", "Buenos Aires", "London", "Paris", "Berlin", "Rome",
    "Madrid", "Oslo", "Stockholm", "Athens", "Istanbul", "Moscow", "Dubai", "Karachi", "Mumbai",
    "Kathmandu", "Dhaka", "Bangkok", "Singapore", "Hong Kong", "Beijing", "Taipei", "Seoul",
    "Tokyo", "Sydney", "Auckland", "Cairo", "Lagos", "Nairobi", "Johannesburg",
  ].map((name) => {
    const hit = PLACE_ALIAS.get(name.toLowerCase().replace("ã", "a")) || resolvePlace(name);
    return { label: name, tz: hit ? hit.tz : "UTC" };
  }),
];

// Acronym options for the structured forms. Several acronyms share a zone
// with a city (EST / New York), so options are keyed by row, not by zone.
export const ABBREV_OPTIONS = ZONE_ABBREV_ROWS.map((row, i) => ({
  value: `abbr:${i}`,
  label: `${row.abbr} — ${row.fullName}`,
}));

/** Turns a structured-form option value into a place. */
export function placeFromOptionValue(value) {
  if (value === "local") return { label: "Local Time", tz: localZone() };
  if (value.startsWith("abbr:")) return ZONE_ABBREV_ROWS[+value.slice(5)] || null;
  const opt = CITY_OPTIONS.find((c) => c.tz === value);
  return { label: opt ? opt.label : value, tz: value };
}

/**
 * Search cities, regions and timezone acronyms for the World Clock.
 * Returns [{ name, country, tz }] — exact alias hits first, then prefixes,
 * then anything containing the text.
 */
export function searchPlaces(query, limit = 12) {
  const q = normAlias(query || "");
  if (!q) return [];
  const scored = [];
  const seen = new Set();
  const consider = (name, country, tz, aliases) => {
    let best = 0;
    for (const a of aliases) {
      if (a === q) best = Math.max(best, 3);
      else if (a.startsWith(q)) best = Math.max(best, 2);
      // later words only ("york" finds New York) — never mid-word ("est" in "west")
      else if (q.length > 2 && a.includes(" " + q)) best = Math.max(best, 1);
    }
    const key = `${name}|${tz}`;
    if (best > 0 && !seen.has(key)) {
      seen.add(key);
      scored.push({ name, country, tz, score: best });
    }
  };
  for (const row of ZONE_ABBREV_ROWS) {
    consider(row.abbr, row.fullName, row.tz, [row.abbr.toLowerCase(), normAlias(row.fullName)]);
  }
  for (const [label, tz, ...aliases] of PLACES) {
    consider(label, tz.replace(/_/g, " "), tz, [normAlias(label), ...aliases]);
  }
  const offset = resolvePlace(query);
  if (offset && /^UTC[+-]/.test(offset.label)) consider(offset.label, "Fixed offset", offset.tz, [q]);
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...place }) => place);
}

// ------------------------------------------------------------------
// Date/time string parsing ("jan 6 2026 2:14pm", "tomorrow 9am", "now")
// Returns wall-clock parts intended for a specific zone.
// ------------------------------------------------------------------
const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11,
  dec: 12, december: 12,
};

export function parseDateTimeString(str, tz, now = new Date()) {
  let rest = (str || "").toLowerCase().replace(/,/g, " ").replace(/\s+/g, " ").trim();
  const nowWall = utcToWall(now, tz);

  if (rest === "" || rest === "now" || rest === "right now") {
    return { ...nowWall, desc: "now" };
  }

  // --- extract time-of-day ---
  let h = null, mi = 0, s = 0;
  const applyTime = (re, fn) => {
    const m = rest.match(re);
    if (m && h === null) {
      fn(m);
      rest = (rest.slice(0, m.index) + " " + rest.slice(m.index + m[0].length)).replace(/\s+/g, " ").trim();
    }
  };
  applyTime(/\bnoon\b/, () => { h = 12; });
  applyTime(/\bmidnight\b/, () => { h = 0; });
  // 2:14pm / 14:30 / 2:14:05 pm
  applyTime(/\b(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?\b/, (m) => {
    h = +m[1]; mi = +m[2]; s = m[3] ? +m[3] : 0;
    const ap = m[4] ? m[4][0] : null;
    if (ap === "p" && h < 12) h += 12;
    if (ap === "a" && h === 12) h = 0;
  });
  // bare "2pm"
  applyTime(/\b(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)\b/, (m) => {
    h = +m[1];
    const ap = m[2][0];
    if (ap === "p" && h < 12) h += 12;
    if (ap === "a" && h === 12) h = 0;
  });

  // --- extract date ---
  let y = null, mo = null, d = null;
  if (/\btoday\b|\btonight\b/.test(rest)) {
    ({ y, mo, d } = nowWall);
    rest = rest.replace(/\btoday\b|\btonight\b/, "").trim();
  } else if (/\btomorrow\b/.test(rest)) {
    const t = new Date(Date.UTC(nowWall.y, nowWall.mo - 1, nowWall.d + 1));
    y = t.getUTCFullYear(); mo = t.getUTCMonth() + 1; d = t.getUTCDate();
    rest = rest.replace(/\btomorrow\b/, "").trim();
  } else if (/\byesterday\b/.test(rest)) {
    const t = new Date(Date.UTC(nowWall.y, nowWall.mo - 1, nowWall.d - 1));
    y = t.getUTCFullYear(); mo = t.getUTCMonth() + 1; d = t.getUTCDate();
    rest = rest.replace(/\byesterday\b/, "").trim();
  } else {
    // "jan 6 2026" or "6 jan 2026"
    let m = rest.match(/\b([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\b/);
    if (m && MONTHS[m[1]]) {
      mo = MONTHS[m[1]]; d = +m[2]; y = m[3] ? +m[3] : null;
      rest = (rest.slice(0, m.index) + " " + rest.slice(m.index + m[0].length)).trim();
    } else {
      m = rest.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)(?:\s+(\d{4}))?\b/);
      if (m && MONTHS[m[2]]) {
        mo = MONTHS[m[2]]; d = +m[1]; y = m[3] ? +m[3] : null;
        rest = (rest.slice(0, m.index) + " " + rest.slice(m.index + m[0].length)).trim();
      } else {
        // numeric formats: 2026-01-06 or 1/6/2026
        m = rest.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
        if (m) {
          y = +m[1]; mo = +m[2]; d = +m[3];
          rest = (rest.slice(0, m.index) + " " + rest.slice(m.index + m[0].length)).trim();
        } else {
          m = rest.match(/\b(\d{1,2})[\/](\d{1,2})(?:[\/](\d{2,4}))?\b/);
          if (m) {
            mo = +m[1]; d = +m[2];
            y = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : null;
            rest = (rest.slice(0, m.index) + " " + rest.slice(m.index + m[0].length)).trim();
          }
        }
      }
    }
    // standalone year left over ("jan 6 2026" already consumed; "2026" alone)
    if (y === null) {
      const ym = rest.match(/\b(\d{4})\b/);
      if (ym && mo !== null) {
        y = +ym[1];
        rest = (rest.slice(0, ym.index) + " " + rest.slice(ym.index + ym[0].length)).trim();
      }
    }
  }

  // Nothing recognized at all -> fail
  if (h === null && mo === null && d === null) return null;
  // Unconsumed junk -> fail (protects against misparses)
  rest = rest.replace(/\b(at|on|of|the)\b/g, "").replace(/\s+/g, " ").trim();
  if (rest !== "") return null;

  if (mo === null || d === null) ({ mo, d } = { mo: mo ?? nowWall.mo, d: d ?? nowWall.d });
  if (y === null) y = nowWall.y;
  if (h === null) h = 0;

  return { y, mo, d, h, mi, s, desc: "explicit" };
}

// ------------------------------------------------------------------
// Calendar-aware duration arithmetic on a zoned wall time.
// Years/months move the calendar (clamping day-of-month), weeks/days
// move the calendar date, and h/m/s/ms shift the exact instant.
// ------------------------------------------------------------------
export function addDurationZoned(wall, tz, parts, sign = 1) {
  let { y, mo, d, h, mi, s } = wall;
  let extraMs = 0;
  let monthsTotal = 0;
  let daysTotal = 0;

  for (const p of parts) {
    const v = p.value * sign;
    switch (p.unit.id) {
      case "years": monthsTotal += v * 12; break;
      case "months": monthsTotal += v; break;
      case "weeks": daysTotal += v * 7; break;
      case "days": daysTotal += v; break;
      default: extraMs += v * p.unit.ms;
    }
  }

  // integer months on the calendar; fractional months as average ms
  const intMonths = Math.trunc(monthsTotal);
  extraMs += (monthsTotal - intMonths) * unitById("months").ms;
  if (intMonths !== 0) {
    const idx = y * 12 + (mo - 1) + intMonths;
    y = Math.floor(idx / 12);
    mo = (idx % 12 + 12) % 12 + 1;
    const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate();
    if (d > dim) d = dim;
  }

  // integer days on the calendar; fractional days as ms
  const intDays = Math.trunc(daysTotal);
  extraMs += (daysTotal - intDays) * 86400000;
  if (intDays !== 0) {
    const t = new Date(Date.UTC(y, mo - 1, d + intDays));
    y = t.getUTCFullYear(); mo = t.getUTCMonth() + 1; d = t.getUTCDate();
  }

  const instant = wallToUtc({ y, mo, d, h, mi, s }, tz);
  return new Date(instant.getTime() + Math.round(extraMs));
}

// ------------------------------------------------------------------
// Answer builders (shared by smart-query mode and structured forms)
// ------------------------------------------------------------------
export function answerDurationConvert(parsed, targetUnit) {
  const { parts, totalMs } = parsed;
  const inputLabel = parts
    .map((p) => `${fmtNum(p.value)} ${p.unit.label.toLowerCase()}`)
    .join(" ");
  const rows = UNITS.map((u) => ({
    unit: u,
    value: totalMs / u.ms,
    isTarget: targetUnit ? u.id === targetUnit.id : false,
  }));
  return {
    type: "convert",
    inputLabel,
    totalMs,
    target: targetUnit ? { unit: targetUnit, value: totalMs / targetUnit.ms } : null,
    rows,
    breakdown: breakdownMs(totalMs),
  };
}

// "EST" typed in July: the region is really on EDT. Say so rather than
// silently picking one reading.
function halfNotes(places, instant) {
  const onDaylight = new Map(); // typed a standard acronym, region is on daylight
  const onStandard = new Map(); // the reverse
  for (const p of places) {
    if (!p.abbr || !p.kind || p.kind === "any") continue;
    const dst = isDstAt(instant, p.tz);
    if ((p.kind === "dst") === dst) continue;
    (dst ? onDaylight : onStandard).set(p.abbr, zoneAbbrev(instant, p.tz));
  }
  const list = (arr) => (arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`);
  const sentence = (map, typedHalf, actualHalf) => {
    if (map.size === 0) return null;
    const many = map.size > 1;
    return `${list([...map.keys()])} ${many ? "name" : "names"} ${typedHalf} time, but ${many ? "those regions are" : "that region is"} on ${actualHalf} time on this date — used ${list([...new Set(map.values())])}, the time actually observed there.`;
  };
  return [sentence(onDaylight, "standard", "daylight"), sentence(onStandard, "daylight", "standard")].filter(Boolean);
}

// tgtPlace may be one place or a list ("2pm est to cst and pst")
export function answerZoneConvert(timeStr, srcPlace, tgtPlace, now = new Date()) {
  const src = typeof srcPlace === "string" ? resolvePlace(srcPlace) : srcPlace;
  if (!src) return { type: "error", message: `Unknown place: "${srcPlace}". Try a city, a timezone acronym like EST or AEDT, an offset like UTC+5:30, or an IANA zone like America/Chicago.` };

  const targets = [];
  for (const t of Array.isArray(tgtPlace) ? tgtPlace : [tgtPlace]) {
    const hit = typeof t === "string" ? resolvePlace(t) : t;
    if (!hit) return { type: "error", message: `Unknown place: "${t}". Try a city, a timezone acronym like CST or JST, an offset like UTC-3, or an IANA zone like Asia/Shanghai.` };
    targets.push(hit);
  }

  const wall = parseDateTimeString(timeStr, src.tz, now);
  if (!wall) return { type: "error", message: `Couldn't read the time "${timeStr}". Try formats like "2pm", "2:14pm", or "jan 6 2026 2:14pm".` };

  const instant = wallToUtc(wall, src.tz);
  const srcDay = Date.UTC(wall.y, wall.mo - 1, wall.d);
  const describe = (place) => ({
    ...place,
    time: formatZonedTime(instant, place.tz),
    date: formatZonedDate(instant, place.tz),
    abbrev: zoneAbbrev(instant, place.tz),
    offset: offsetLabel(instant, place.tz),
  });
  const describeTarget = (place) => {
    const w = utcToWall(instant, place.tz);
    const dayDelta = Date.UTC(w.y, w.mo - 1, w.d) - srcDay;
    const diffMin = Math.round((getZoneOffsetMs(instant.getTime(), place.tz) - getZoneOffsetMs(instant.getTime(), src.tz)) / 60000);
    const abs = Math.abs(diffMin);
    const span = `${Math.floor(abs / 60)}h${abs % 60 ? " " + (abs % 60) + "m" : ""}`;
    return {
      ...describe(place),
      dayNote: dayDelta > 0 ? "next day" : dayDelta < 0 ? "previous day" : "same day",
      diff: diffMin === 0 ? "same time" : `${span} ${diffMin > 0 ? "ahead" : "behind"}`,
    };
  };

  const described = targets.map(describeTarget);
  const notes = halfNotes([src, ...targets], instant);

  return {
    type: "zone",
    instant,
    src: describe(src),
    tgt: described[0],
    others: described.slice(1),
    dayNote: described[0].dayNote,
    notes,
    local: formatZoned(instant, localZone()),
    utc: instant.toISOString().replace(".000", ""),
  };
}

export function answerDateMath(durationParsed, direction, dateStr, placeStr, now = new Date()) {
  let place = null;
  if (placeStr) {
    place = typeof placeStr === "string" ? resolvePlace(placeStr) : placeStr;
    if (!place) return { type: "error", message: `Unknown place: "${placeStr}". Try a major city or an IANA zone like America/Chicago.` };
  }
  const tz = place ? place.tz : localZone();
  const wall = parseDateTimeString(dateStr, tz, now);
  if (!wall) return { type: "error", message: `Couldn't read the date "${dateStr}". Try formats like "jan 6 2026 2:14pm", "1/6/2026", or "now".` };

  const sign = direction === "before" ? -1 : 1;
  const baseInstant = wallToUtc(wall, tz);
  const result = addDurationZoned(wall, tz, durationParsed.parts, sign);

  return {
    type: "datemath",
    direction,
    durationLabel: durationParsed.parts.map((p) => `${fmtNum(p.value)} ${p.unit.label.toLowerCase()}`).join(" "),
    placeLabel: place ? place.label : "Local Time",
    tz,
    base: formatZoned(baseInstant, tz),
    result,
    resultZoned: formatZoned(result, tz),
    resultLocal: formatZoned(result, localZone()),
    resultUtc: result.toISOString().replace(".000", ""),
    sameZoneAsLocal: tz === localZone(),
  };
}

// ------------------------------------------------------------------
// Smart query parser — routes free text to one of the three answers.
// ------------------------------------------------------------------
function normalizeQuery(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[?？!]+$/g, "")
    .replace(/(\d),(?=\d)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// "cst and pst" / "cst, pst or tokyo" -> ["cst", "pst", "tokyo"]
function splitTargets(str) {
  return str
    .split(/\s*(?:,|&|\band\b|\bor\b|\bvs\b)\s*/)
    .map((s) => s.replace(/^in\s+/, "").trim())
    .filter(Boolean);
}

// "2pm est" / "jan 6 9:30am new york" -> { time, place }. The place is the
// longest trailing run of words that resolves, and what's left must read as
// a time in that zone.
function splitTimeAndPlace(str, now) {
  const tokens = str.trim().split(" ");
  for (let i = 1; i < tokens.length; i++) {
    const place = resolvePlace(tokens.slice(i).join(" "));
    if (!place) continue;
    const time = tokens.slice(0, i).join(" ");
    if (parseDateTimeString(time, place.tz, now)) return { time, place };
  }
  return null;
}

const ZONE_CONNECTOR =
  /\s+(?:is what time in|is what in|what time is that in|what time is it in|what is that in|equals|into|to|->|→|=>|=|as|in|is)\s+/g;

/**
 * Timezone questions only. Returns a "zone" answer, an "error" for a
 * "time in <unknown place>" question, or null when the text isn't one.
 * Shared by the Converter's Smart Query and the World Clock search bar.
 */
export function runZoneQuery(raw, now = new Date()) {
  if (!raw || !raw.trim()) return null;
  const local = { label: "Local Time", tz: localZone() };
  let q = normalizeQuery(raw);

  // --- "what time is it in beijing" / "time in tulsa" ---
  let m = q.match(/^(?:what time is it in|what's the time in|whats the time in|current time in|time in|now in)\s+(.+)$/);
  if (m) return answerZoneConvert("now", m[1], local, now);

  q = q.replace(/^(?:what time is|what time would|what is|what's|whats|when is|convert)\s+/, "");

  // --- "2pm in beijing is what in tulsa time" / "... to tulsa" ---
  m = q.match(
    /^(.+?)\s+in\s+(.+?)\s+(?:is what time|is what|what time is that|what time is it|what is that|equals|=|to|is|as|in)\s+(?:in\s+)?(.+?)$/,
  );
  if (m) {
    const res = answerZoneConvert(m[1], m[2], splitTargets(m[3]), now);
    if (res.type !== "error") return res;
  }

  // --- "2pm est to cst" / "9:30am pst in ist and gmt" / "noon tokyo -> utc-3" ---
  ZONE_CONNECTOR.lastIndex = 0;
  let c;
  while ((c = ZONE_CONNECTOR.exec(q)) !== null) {
    const left = splitTimeAndPlace(q.slice(0, c.index), now);
    if (left) {
      const targets = splitTargets(q.slice(c.index + c[0].length));
      if (targets.length > 0 && targets.every((t) => resolvePlace(t))) {
        const res = answerZoneConvert(left.time, left.place, targets, now);
        if (res.type !== "error") return res;
      }
    }
    // connectors can overlap ("... is what in ..."), so step one char at a time
    ZONE_CONNECTOR.lastIndex = c.index + 1;
  }

  // --- "2pm est" on its own -> your local time ---
  const lone = splitTimeAndPlace(q, now);
  if (lone) {
    const res = answerZoneConvert(lone.time, lone.place, local, now);
    if (res.type !== "error") return res;
  }

  return null;
}

export function runQuery(raw, now = new Date()) {
  if (!raw || !raw.trim()) return null;
  const q = normalizeQuery(raw);

  // Timezone questions first; an unknown place in "time in ___" is reported,
  // anything else falls through (e.g. "5000 seconds in minutes").
  const zone = runZoneQuery(raw, now);
  if (zone) return zone;
  let m;

  // --- "3 hours ago" / "2 weeks from now [in oslo]" ---
  m = q.match(/^(.+?)\s+ago(?:\s+in\s+(.+))?$/);
  if (m) {
    const dur = parseDurationList(m[1]);
    if (dur) return answerDateMath(dur, "before", "now", m[2] || null, now);
  }
  m = q.match(/^(.+?)\s+from\s+(?:now|today)(?:\s+in\s+(.+))?$/);
  if (m) {
    const dur = parseDurationList(m[1]);
    if (dur) return answerDateMath(dur, "after", "now", m[2] || null, now);
  }

  // --- "4 weeks 2 days 13 hours after jan 6 2026 2:14pm in tulsa ok" ---
  m = q.match(/^(.+?)\s+(after|before|from|until)\s+(.+)$/);
  if (m) {
    const dur = parseDurationList(m[1]);
    if (dur) {
      const direction = m[2] === "before" || m[2] === "until" ? "before" : "after";
      let dtStr = m[3];
      let placeStr = null;
      // peel a trailing " in <place>" if the place resolves
      const inIdx = dtStr.lastIndexOf(" in ");
      if (inIdx !== -1) {
        const candidate = dtStr.slice(inIdx + 4).trim();
        if (resolvePlace(candidate)) {
          placeStr = candidate;
          dtStr = dtStr.slice(0, inIdx).trim();
        }
      }
      return answerDateMath(dur, direction, dtStr, placeStr, now);
    }
  }

  // --- "2418187620 seconds to years" / "420.7372 years to months" ---
  m = q.match(/^(?:convert\s+)?(.+?)\s+(?:to|into|in|as|->|=)\s+([a-zµ]+)$/);
  if (m) {
    const dur = parseDurationList(m[1]);
    const target = unitFromToken(m[2].replace(/s$/, "")) || unitFromToken(m[2]);
    if (dur && target) return answerDurationConvert(dur, target);
  }

  // --- bare duration: "2418187620 seconds" -> show everything ---
  const bare = parseDurationList(q.replace(/^(?:convert|breakdown|break down)\s+/, ""));
  if (bare) return answerDurationConvert(bare, null);

  return {
    type: "error",
    message:
      'Couldn\'t understand that. Try: "2418187620 seconds to years" · "4 weeks 2 days 13 hours after jan 6 2026 2:14pm in tulsa ok" · "2pm in beijing is what in tulsa time?"',
  };
}
