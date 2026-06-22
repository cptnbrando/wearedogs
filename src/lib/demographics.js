import demographicsData from "./demographics.json";

export const flagColorMap = demographicsData.flagColorMap;
export const growthFactors = demographicsData.growthFactors;
export const defaultRates = demographicsData.defaultRates;
export const specificRates = demographicsData.specificRates;
export const globalPopulations = demographicsData.globalPopulations;

export function getHashColors(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 120) % 360;
  const h3 = (h1 + 240) % 360;
  return [
    `hsl(${h1}, 85%, 55%)`,
    `hsl(${h2}, 85%, 60%)`,
    `hsl(${h3}, 85%, 55%)`,
  ];
}

export function getFlagColors(lang, translations) {
  const t = translations[lang];
  if (!t || !t.country) return ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
  const countryLower = t.country.toLowerCase();
  for (const [key, colors] of Object.entries(flagColorMap)) {
    if (countryLower.includes(key)) {
      return colors;
    }
  }
  return getHashColors(t.country);
}

export function getRegionIdentity(lang, translations) {
  const t = translations[lang];
  if (!t || !t.country) return "default";
  const country = t.country.toLowerCase();

  for (const [region, countries] of Object.entries(demographicsData.regions)) {
    if (countries.some((c) => country.includes(c))) {
      return region;
    }
  }

  return "agricultural";
}

export function parseSpeakers(speakersText) {
  if (!speakersText || speakersText === "—") return 0;
  let clean = speakersText.replace(/,/g, "").toLowerCase().trim();
  let mult = 1;
  if (clean.includes("billion")) {
    mult = 1_000_000_000;
    clean = clean.replace("billion", "");
  } else if (clean.includes("million")) {
    mult = 1_000_000;
    clean = clean.replace("million", "");
  }
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val * mult;
}

export function parseDogs(dogsText) {
  if (!dogsText || dogsText === "—") return 0;
  let clean = dogsText.replace(/,/g, "").toLowerCase().trim();
  let mult = 1;
  if (clean.includes("billion")) {
    mult = 1_000_000_000;
    clean = clean.replace("billion", "");
  } else if (clean.includes("million")) {
    mult = 1_000_000;
    clean = clean.replace("million", "");
  }
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val * mult;
}
