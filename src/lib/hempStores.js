/**
 * The STORES layer for the lawmaker map: every DSHS-registered consumable
 * hemp retailer that the July 31st shelf pull hits, drawn as a density field.
 *
 * DSHS doesn't publish a clean geocoded list of its 7,500+ retail
 * registrations, so this layer is explicit about what it is: the statewide
 * retailer count from TEXAS_STATS, allocated to metros in proportion to
 * population and scattered deterministically around each city centre. Dot
 * positions are illustrative; the counts are the honest part. The map legend
 * says so in as many words.
 */

import { CITIES } from "./texasGeo.js";
import { TEXAS_STATS } from "./hempStats.js";

/** Statewide registered-retailer count this layer distributes. */
export const STORE_TOTAL = 7500;
export const STORE_TOTAL_LABEL = TEXAS_STATS.retailers; // "7,500+"

/** One rendered dot stands for this many stores. */
export const STORE_DOT_RATIO = 10;

/** "2.3M" / "980K" / "1.5K" → a number. */
function parsePop(pop) {
  const m = /^([\d.]+)\s*([MK])$/i.exec(pop ?? "");
  if (!m) return 0;
  return parseFloat(m[1]) * (m[2].toUpperCase() === "M" ? 1_000_000 : 1_000);
}

/**
 * Deterministic PRNG (mulberry32). Store dots must land in the same place on
 * every load — a scatter that reshuffles per visit would read as live data.
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Roughly-gaussian offset in [-1, 1]: two uniforms, centred. */
function jitter(rand) {
  return rand() + rand() - 1;
}

const totalPop = CITIES.reduce((sum, c) => sum + parsePop(c.pop), 0);

/** Per-city store counts: population share of the statewide total, floor 2. */
export const STORE_CITY_COUNTS = CITIES.map((c) => ({
  name: c.name,
  short: c.short || c.name,
  lng: c.lng,
  lat: c.lat,
  count: Math.max(2, Math.round((parsePop(c.pop) / totalPop) * STORE_TOTAL)),
}));

/** Quick lookup for the map's city labels: "DFW · ~1,150 stores". */
export const STORE_COUNT_BY_NAME = new Map(
  STORE_CITY_COUNTS.map((c) => [c.name, c.count]),
);

/**
 * The dots themselves, one per STORE_DOT_RATIO stores, scattered around each
 * city centre. Spread scales with the metro's share so DFW smears across the
 * metroplex while a county seat stays a tight cluster. Rendered inside the
 * state-outline clip, so coastal and border scatter never lands in Mexico or
 * the Gulf.
 */
export const STORE_DOTS = (() => {
  const dots = [];
  STORE_CITY_COUNTS.forEach((c, i) => {
    const n = Math.max(1, Math.round(c.count / STORE_DOT_RATIO));
    const rand = mulberry32(0xd095 + i * 7919);
    // Degrees of scatter: big metros reach ~0.42°, small towns ~0.06°.
    const spread = 0.06 + 0.36 * Math.sqrt(c.count / 1200);
    for (let k = 0; k < n; k++) {
      dots.push({
        lng: c.lng + jitter(rand) * spread * 1.25,
        lat: c.lat + jitter(rand) * spread,
        city: c.name,
      });
    }
  });
  return dots;
})();
