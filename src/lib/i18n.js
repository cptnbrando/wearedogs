import { writable, get } from 'svelte/store';

// Language detection
const browserLang = typeof window !== 'undefined' ? navigator.language.split('-')[0] : 'en';
const supportedLangs = ['en', 'es', 'fr', 'de', 'ja', 'zh'];
const initialLang = supportedLangs.includes(browserLang) ? browserLang : 'en';

// Translation data
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
export const currentLanguage = writable(initialLang);

// Translation function
export function t(key) {
  const lang = get(currentLanguage);
  return translations[lang]?.[key] || translations.en[key] || key;
}

// Paraglide-compatible message functions
export const we_are_dogs = () => t('we_are_dogs');

// Get all languages
export const languages = supportedLangs;

// Set language
export function setLanguage(lang) {
  if (supportedLangs.includes(lang)) {
    currentLanguage.set(lang);
  }
}

// Get current language
export function getLanguage() {
  return get(currentLanguage);
}

