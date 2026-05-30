import { writable, get } from 'svelte/store';

// Language detection
const browserLang = typeof window !== 'undefined' ? navigator.language.split('-')[0] : 'en';
/** @typedef {'en'|'es'|'fr'|'de'|'ja'|'zh'} Language */
/** @type {Language[]} */
const supportedLangs = ['en', 'es', 'fr', 'de', 'ja', 'zh'];
/** @type {Language} */
// supportedLangs is typed as Language[], so cast browserLang when checking includes
const initialLang = /** @type {Language} */ (supportedLangs.includes(/** @type {Language} */ (browserLang)) ? browserLang : 'en');

// Types for translations
/** @typedef {Record<string,string>} LocaleStrings */
/**
 * @typedef {{
 *   en: LocaleStrings,
 *   es: LocaleStrings,
 *   fr: LocaleStrings,
 *   de: LocaleStrings,
 *   ja: LocaleStrings,
 *   zh: LocaleStrings
 * }} Translations
 */

// Translation data
/** @type {Translations} */
const translations = {
  en: {
    we_are_dogs: 'We are dogs'
  },
  es: {
    we_are_dogs: 'Somos perros'
  },
  fr: {
    we_are_dogs: 'Nous sommes des chiens'
  },
  de: {
    we_are_dogs: 'Wir sind Hunde'
  },
  ja: {
    we_are_dogs: '私たちは犬です'
  },
  zh: {
    we_are_dogs: '我们是狗'
  }
};

// Language store (paraglide-compatible)
/** @type {import('svelte/store').Writable<Language>} */
export const currentLanguage = writable(initialLang);

// Translation function
/**
 * Translate a key for the current language.
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  /** @type {Language} */
  const lang = get(currentLanguage);
  const langKey = lang in translations ? lang : 'en';
  return translations[langKey]?.[key] || translations.en[key] || key;
}

// Paraglide-compatible message functions
export const we_are_dogs = () => t('we_are_dogs');

// Get all languages
/** @type {Language[]} */
export const languages = supportedLangs;

// Set language
/**
 * @param {Language} lang
 */
export function setLanguage(lang) {
  if (supportedLangs.includes(lang)) {
    currentLanguage.set(lang);
  }
}

// Get current language
export function getLanguage() {
  return get(currentLanguage);
}

