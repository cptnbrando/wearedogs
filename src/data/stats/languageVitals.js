// Derived demographic vitals for every language in worldwidedogs.json.
// humanCBR / humanCDR are crude birth & death rates — events per 1,000
// speakers per year (WHO/UN convention) — so every figure here is a
// deterministic derivation, computed once at module load.
//
// Speaker populations overlap (people speak more than one language), so
// aggregate totals describe the sum of speaker populations, not unique humans.

import translations from "../../lib/data/worldwidedogs.json" with { type: "json" };
import { parseSpeakers, langEnglishName } from "../../lib/langUtils.js";

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

// World demographics — UN World Population Prospects estimates, NOT the sum
// of speaker populations (which double-counts multilinguals).
const WORLD_POP_REFERENCE = 8_240_000_000; // mid-2026 estimate
const WORLD_POP_REFERENCE_MS = Date.UTC(2026, 6, 1);
const WORLD_CBR = 16.0; // births / 1,000 people / year (≈132M/yr)
const WORLD_CDR = 7.5; // deaths / 1,000 people / year (≈62M/yr)

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
 * Part-to-whole speaker share: top `n` languages plus a folded "Other" tail.
 * Shares are fractions of trackedSpeakerTotal (combined counts, overlapping)
 * and sum to 1.
 */
export function speakerShare(n = 5) {
  const top = languageVitals.slice(0, n).map((v) => ({
    code: v.code,
    name: v.name,
    speakers: v.speakers,
    share: v.speakers / trackedSpeakerTotal,
  }));
  const otherSpeakers =
    trackedSpeakerTotal - top.reduce((s, d) => s + d.speakers, 0);
  top.push({
    code: "other",
    name: `Other (${languageVitals.length - n})`,
    speakers: otherSpeakers,
    share: otherSpeakers / trackedSpeakerTotal,
  });
  return top;
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
