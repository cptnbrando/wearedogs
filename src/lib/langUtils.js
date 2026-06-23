import translations from './worldwidedogs.json' with { type: 'json' };

export { translations };
export const langs = Object.keys(translations);

/** Parse global speaker population string into a numeric value */
export function parseSpeakers(text) {
  if (!text || text === "—") return 0;
  let clean = text.replace(/,/g, "").toLowerCase().trim();
  let multiplier = 1;
  if (clean.includes("billion")) {
    multiplier = 1_000_000_000;
    clean = clean.replace("billion", "");
  } else if (clean.includes("million")) {
    multiplier = 1_000_000;
    clean = clean.replace("million", "");
  }
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val * multiplier;
}

/** Parse dog population string into a numeric value */
export function parseDogs(text) {
  if (!text || text === "—") return 0;
  let clean = text.replace(/,/g, "").toLowerCase().trim();
  let multiplier = 1;
  if (clean.includes("billion")) {
    multiplier = 1_000_000_000;
    clean = clean.replace("billion", "");
  } else if (clean.includes("million")) {
    multiplier = 1_000_000;
    clean = clean.replace("million", "");
  } else if (clean.includes("sleigh dogs") || clean.includes("sled dogs")) {
    clean = clean.replace(/sleigh dogs|sled dogs/g, "");
  }
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val * multiplier;
}

const displayNameCaches = {};

/** Get display name for a language, falling back to 'fullname' then 'dialect' to avoid displaying raw codes */
export function langDisplayName(code, userLocale = 'en') {
  try {
    if (typeof Intl === "undefined" || !Intl.DisplayNames) {
      return translations[code]?.fullname || translations[code]?.dialect || code;
    }
    if (!displayNameCaches[userLocale]) {
      displayNameCaches[userLocale] = new Intl.DisplayNames([userLocale], { type: "language" });
    }
    const name = displayNameCaches[userLocale].of(code);
    if (!name || name.toLowerCase() === code.toLowerCase()) {
      return translations[code]?.fullname || translations[code]?.dialect || code;
    }
    return name;
  } catch {
    return translations[code]?.fullname || translations[code]?.dialect || code;
  }
}

let englishLangNames = null;
let triedEnglishInit = false;

function getEnglishLangNames() {
  if (triedEnglishInit) return englishLangNames;
  triedEnglishInit = true;
  try {
    if (typeof Intl !== "undefined" && Intl.DisplayNames) {
      englishLangNames = new Intl.DisplayNames(["en"], { type: "language" });
    }
  } catch (e) {
    englishLangNames = null;
  }
  return englishLangNames;
}

/** Get the stable English name for keyboard selection and matching */
export function langEnglishName(code) {
  try {
    const formatter = getEnglishLangNames();
    if (!formatter) {
      return translations[code]?.fullname || translations[code]?.dialect || code;
    }
    const name = formatter.of(code);
    if (!name || name.toLowerCase() === code.toLowerCase()) {
      return translations[code]?.fullname || translations[code]?.dialect || code;
    }
    return name;
  } catch {
    return translations[code]?.fullname || translations[code]?.dialect || code;
  }
}

/** Get the tri-color flag array for a language, pre-computed in translations.json */
export function getFlagColors(code) {
  return translations[code]?.colors || ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
}
