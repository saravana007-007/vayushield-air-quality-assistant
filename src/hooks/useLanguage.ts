import { useState, useEffect, useCallback } from 'react';
import type { SupportedLanguage, UiTranslations } from '../i18n';
import {
  getTranslation,
  getSavedLanguage,
  saveLanguage,
  applyLanguageToDocument,
} from '../i18n';

export interface UseLanguageResult {
  currentLang: SupportedLanguage;
  t: UiTranslations;
  setLanguage: (lang: SupportedLanguage) => void;
}

export function useLanguage(): UseLanguageResult {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getSavedLanguage);
  const t = getTranslation(currentLang);

  const handleSelectLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLang(lang);
    saveLanguage(lang);
  }, []);

  useEffect(() => {
    applyLanguageToDocument(currentLang);
  }, [currentLang]);

  return {
    currentLang,
    t,
    setLanguage: handleSelectLanguage,
  };
}
