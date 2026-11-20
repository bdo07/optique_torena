import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const savedLang = localStorage.getItem('torena_lang') || 'fr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: savedLang,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'torena_lang',
      caches: ['localStorage'],
    },
  });

// Helper function to update document direction and language attributes
export function applyLanguageSettings(lang: string) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (lang === 'ar') {
    document.body.classList.add('font-arabic');
  } else {
    document.body.classList.remove('font-arabic');
  }
}

// Initial setup
applyLanguageSettings(i18n.language || savedLang);

// Listen to language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('torena_lang', lng);
  applyLanguageSettings(lng);
});

export default i18n;
