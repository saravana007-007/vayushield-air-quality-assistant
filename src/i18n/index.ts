// VayuShield i18n entry
import { SupportedLanguage, SUPPORTED_LANGUAGES } from './translations';
import { STORAGE_KEYS } from '../config';
import { getStorageString, setStorageItem } from '../utils/storage';

export * from './translations';

export function getSavedLanguage(): SupportedLanguage {
  const saved = getStorageString(STORAGE_KEYS.language, 'en');
  if (SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
    return saved as SupportedLanguage;
  }
  return 'en';
}

export function saveLanguage(lang: SupportedLanguage): void {
  setStorageItem(STORAGE_KEYS.language, lang);
  applyLanguageToDocument(lang);
}

export function applyLanguageToDocument(lang: SupportedLanguage): void {
  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0]!;
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}
