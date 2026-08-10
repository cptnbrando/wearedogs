// Derived demographic vitals for every language in worldwidedogs.json.
// humanCBR / humanCDR are crude birth & death rates — events per 1,000
// speakers per year (WHO/UN convention) — so every figure here is a
// deterministic derivation, computed once at module load.
//
// Speaker populations overlap (people speak more than one language), so
// aggregate totals describe the sum of speaker populations, not unique humans.

import translations from "../../lib/data/worldwidedogs.json" with { type: "json" };
import {
  parseSpeakers,
  parseDogs,
  langEnglishName,
} from "../../lib/langUtils.js";

const DAYS_PER_YEAR = 365.25;
const SECONDS_PER_DAY = 86_400;

/** Every language, sorted by speaker population (descending), rank attached. */
export const languageVitals = Object.keys(translations)
  .map((code) => {
    const t = translations[code];
    const speakers = parseSpeakers(t.speakers);
    const birthRate = t.humanCBR ?? 0; // births / 1,000 speakers / year
    const deathRate = t.humanCDR ?? 0; // deaths / 1,000 speakers / year
    const dailyBirths = (speakers * birthRate) / 1000 / DAYS_PER_YEAR;
    const dailyDeaths = (speakers * deathRate) / 1000 / DAYS_PER_YEAR;
    const dogs = parseDogs(t.dogs_count);
    const dogBirthRate = t.dogCBR ?? 0;
    const dogDeathRate = t.dogCDR ?? 0;
    return {
      code,
      name: langEnglishName(code),
      country: t.country || "—",
      phrase: `${t.we} ${t.are} ${t.dogs}`,
      colors: t.colors || [],
      speakers,
      speakersText: t.speakers || "—",
      birthRate,
      deathRate,
      dailyBirths,
      dailyDeaths,
      dailyNet: dailyBirths - dailyDeaths,
      // Natural annual growth as a signed fraction (CBR − CDR, per head)
      growthRate: (birthRate - deathRate) / 1000,
      secondsPerBirth: dailyBirths > 0 ? SECONDS_PER_DAY / dailyBirths : Infinity,
      secondsPerDeath: dailyDeaths > 0 ? SECONDS_PER_DAY / dailyDeaths : Infinity,
      // Dog vitals for the same region/population
      dogs,
      dogsText: t.dogs_count || "—",
      dogBirthRate,
      dogDeathRate,
      dogDailyBirths: (dogs * dogBirthRate) / 1000 / DAYS_PER_YEAR,
      dogDailyDeaths: (dogs * dogDeathRate) / 1000 / DAYS_PER_YEAR,
    };
  })
  .sort((a, b) => b.speakers - a.speakers)
  .map((v, i) => ({ ...v, rank: i + 1 }));

/** Quick lookup by language code. */
export const vitalsByCode = Object.fromEntries(
  languageVitals.map((v) => [v.code, v]),
);

/**
 * Sum of every speaker population. People speak more than one language, so
 * this OVERCOUNTS humans — it is a denominator for part-to-whole shares,
 * never a population headline. Use worldVitals for anything labeled people.
 */
export const trackedSpeakerTotal = languageVitals.reduce(
  (s, v) => s + v.speakers,
  0,
);

// World demographics — UN World Population Prospects (2024 Revision) estimates, NOT the sum
// of speaker populations (which double-counts multilinguals).
const WORLD_POP_REFERENCE = 8_300_584_377; // mid-2026 estimate (July 1, 2026)
const WORLD_POP_REFERENCE_MS = Date.UTC(2026, 6, 1);
const WORLD_CBR = 15.88; // births / 1,000 people / year
const WORLD_CDR = 7.778; // deaths / 1,000 people / year

export const worldVitals = (() => {
  const dailyBirths = (WORLD_POP_REFERENCE * WORLD_CBR) / 1000 / DAYS_PER_YEAR;
  const dailyDeaths = (WORLD_POP_REFERENCE * WORLD_CDR) / 1000 / DAYS_PER_YEAR;
  return {
    languageCount: languageVitals.length,
    population: WORLD_POP_REFERENCE,
    birthRate: WORLD_CBR,
    deathRate: WORLD_CDR,
    dailyBirths,
    dailyDeaths,
    dailyNet: dailyBirths - dailyDeaths,
    birthsPerSecond: dailyBirths / SECONDS_PER_DAY,
    deathsPerSecond: dailyDeaths / SECONDS_PER_DAY,
    netPerSecond: (dailyBirths - dailyDeaths) / SECONDS_PER_DAY,
  };
})();

/** Live world population: reference estimate plus net natural change since. */
export function livePopulation(nowMs) {
  const elapsedSeconds = (nowMs - WORLD_POP_REFERENCE_MS) / 1000;
  return WORLD_POP_REFERENCE + worldVitals.netPerSecond * elapsedSeconds;
}

/**
 * World dog demographics: total of every region's dog count, with birth and
 * death rates as the dog-population-weighted mean of each region's dogCBR /
 * dogCDR.
 */
export const worldDogVitals = (() => {
  let population = 0;
  let weightedCBR = 0;
  let weightedCDR = 0;
  for (const v of languageVitals) {
    population += v.dogs;
    weightedCBR += v.dogs * v.dogBirthRate;
    weightedCDR += v.dogs * v.dogDeathRate;
  }
  const birthRate = weightedCBR / population;
  const deathRate = weightedCDR / population;
  const dailyBirths = (population * birthRate) / 1000 / DAYS_PER_YEAR;
  const dailyDeaths = (population * deathRate) / 1000 / DAYS_PER_YEAR;
  return {
    population,
    birthRate,
    deathRate,
    dailyBirths,
    dailyDeaths,
    dailyNet: dailyBirths - dailyDeaths,
    birthsPerSecond: dailyBirths / SECONDS_PER_DAY,
    deathsPerSecond: dailyDeaths / SECONDS_PER_DAY,
    netPerSecond: (dailyBirths - dailyDeaths) / SECONDS_PER_DAY,
  };
})();

/** Live world dog population, same reference date as livePopulation. */
export function liveDogPopulation(nowMs) {
  const elapsedSeconds = (nowMs - WORLD_POP_REFERENCE_MS) / 1000;
  return worldDogVitals.population + worldDogVitals.netPerSecond * elapsedSeconds;
}

/**
 * Part-to-whole speaker share. Includes every language, largest first, until
 * the folded "Other" tail drops below `maxOtherShare` of the combined total —
 * so no single hidden bucket ever dominates the pie. Shares are fractions of
 * trackedSpeakerTotal (combined counts, overlapping) and sum to 1.
 */
export function speakerShare(maxOtherShare = 0.25) {
  const slices = [];
  let cum = 0;
  for (const v of languageVitals) {
    if ((trackedSpeakerTotal - cum) / trackedSpeakerTotal <= maxOtherShare) {
      break;
    }
    slices.push({
      code: v.code,
      name: v.name,
      speakers: v.speakers,
      share: v.speakers / trackedSpeakerTotal,
    });
    cum += v.speakers;
  }
  const other = trackedSpeakerTotal - cum;
  slices.push({
    code: "other",
    name: `Other (${languageVitals.length - slices.length})`,
    speakers: other,
    share: other / trackedSpeakerTotal,
  });
  return slices;
}

/**
 * Exponential natural-growth projection for one language.
 * Returns [{ year, speakers }] from `startYear` in `step`-year increments.
 */
export function projectSpeakers(vitals, years = 50, step = 5, startYear = 2026) {
  const points = [];
  for (let y = 0; y <= years; y += step) {
    points.push({
      year: startYear + y,
      speakers: vitals.speakers * Math.pow(1 + vitals.growthRate, y),
    });
  }
  return points;
}

/** 1_500_000_000 → "1.5B", 90_000_000 → "90M", 700_000 → "700K" */
export function formatCompact(n) {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return trim(n / 1e9) + "B";
  if (abs >= 1e6) return trim(n / 1e6) + "M";
  if (abs >= 1e3) return trim(n / 1e3) + "K";
  return String(Math.round(n));
}

function trim(x) {
  const rounded = Math.round(x * 10) / 10;
  return rounded % 1 === 0 ? String(Math.round(rounded)) : rounded.toFixed(1);
}

/** Integer with thousands separators. */
export function formatInt(n) {
  if (!isFinite(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

/**
 * Rate figure across the unit toggle's full range: per-second values need
 * decimals (0.52), per-year values need compacting (16.5M).
 */
export function formatRate(n) {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e6) return formatCompact(n);
  if (abs >= 1000) return formatInt(n);
  if (abs >= 100) return n.toFixed(0);
  if (abs >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

/** Human cadence: 4.2 → "every 4.2s", 130 → "every 2m 10s" */
export function formatCadence(seconds) {
  if (!isFinite(seconds)) return "—";
  if (seconds < 60) {
    return seconds < 10
      ? `every ${seconds.toFixed(1)}s`
      : `every ${Math.round(seconds)}s`;
  }
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return s > 0 ? `every ${m}m ${s}s` : `every ${m}m`;
  const h = Math.floor(m / 60);
  return `every ${h}h ${m % 60}m`;
}
