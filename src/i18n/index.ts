// VayuShield i18n entry
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation, UiTranslations } from './translations';

export * from './translations';

const STORAGE_KEY = 'vayushield_lang';

export function getSavedLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved as SupportedLanguage;
    }
  } catch (e) {
    // ignore
  }
  return 'en';
}

export function saveLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // ignore
  }
  applyLanguageToDocument(lang);
}

export function applyLanguageToDocument(lang: SupportedLanguage): void {
  const meta = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}
