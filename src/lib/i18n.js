import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import translations from './translations.json';

// All supported language codes (keys from translation dict)
export const supportedLangs = Object.keys(translations);

// Register each locale with svelte-i18n using the translation data
supportedLangs.forEach((lang) => {
  register(lang, () => Promise.resolve({
    we: translations[lang].we,
    are: translations[lang].are,
    dogs: translations[lang].dogs,
  }));
});

// Detect browser locale, fallback to 'en'
const browserLang = getLocaleFromNavigator()?.split('-')[0] || 'en';
const initialLocale = supportedLangs.includes(browserLang) ? browserLang : 'en';

init({
  fallbackLocale: 'en',
  initialLocale,
});

export { initialLocale };
