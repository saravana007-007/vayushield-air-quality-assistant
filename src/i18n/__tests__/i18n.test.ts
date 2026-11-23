import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../translations';
import { getDemoPlanForAqi } from '../../data/demoPlans';
import { SWAP_CATALOG } from '../../data/swapCatalog';

describe('i18n completeness and dictionaries', () => {
  const enKeys = Object.keys(TRANSLATIONS.en);

  it('all supported languages have complete keys matching English', () => {
    SUPPORTED_LANGUAGES.forEach((langMeta) => {
      const langCode = langMeta.code as SupportedLanguage;
      const dict = TRANSLATIONS[langCode];
      expect(dict).toBeDefined();

      enKeys.forEach((key) => {
        expect(dict[key as keyof typeof dict]).toBeDefined();
      });
    });
  });

  it('returns appropriate demo plan across AQI thresholds and languages', () => {
    const hazardousPlan = getDemoPlanForAqi(350, 'Delhi', 'en');
    expect(hazardousPlan.dailyRoutine).toHaveLength(4);

    const moderatePlan = getDemoPlanForAqi(120, 'Bengaluru', 'hi');
    expect(moderatePlan.dailyRoutine).toHaveLength(4);

    const regionalPlan = getDemoPlanForAqi(320, 'Kolkata', 'bn');
    expect(regionalPlan.dailyRoutine).toHaveLength(4);
  });

  it('validates swap catalog entries', () => {
    expect(SWAP_CATALOG.length).toBeGreaterThan(0);
    SWAP_CATALOG.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.description).toBeDefined();
      expect(item.exposurePoints).toBeGreaterThan(0);
    });
  });
});
