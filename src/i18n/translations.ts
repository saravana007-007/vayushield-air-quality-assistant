// VayuShield Multilingual i18n System
// Aggregator and entry point for all locales

import type { SupportedLanguage, UiTranslations } from './types';
import { EN_TRANSLATIONS } from './locales/en';
import { HI_TRANSLATIONS } from './locales/hi';
import { UR_TRANSLATIONS } from './locales/ur';
import { getLanguageTemplate } from './locales/regional';

export * from './types';
export { EN_TRANSLATIONS } from './locales/en';
export { HI_TRANSLATIONS } from './locales/hi';
export { UR_TRANSLATIONS } from './locales/ur';

export const TRANSLATIONS: Record<SupportedLanguage, UiTranslations> = {
  en: EN_TRANSLATIONS,
  hi: HI_TRANSLATIONS,
  ur: UR_TRANSLATIONS,
  bn: getLanguageTemplate('bn', 'বাংলা (Bengali)'),
  ta: getLanguageTemplate('ta', 'தமிழ் (Tamil)'),
  te: getLanguageTemplate('te', 'తెలుగు (Telugu)'),
  mr: getLanguageTemplate('mr', 'मराठी (Marathi)'),
};

export function getTranslation(lang: SupportedLanguage): UiTranslations {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
