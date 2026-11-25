import { describe, it, expect } from 'vitest';
import { getTranslation, getSavedLanguage, saveLanguage } from '../index';
import { getDemoPlanForAqi } from '../../data/demoPlans';
import { generateOfflineChatAnswer } from '../../services/offlineRulesEngine';
import { AIR_PRESETS } from '../../services/airQualityService';
import type { HouseholdProfile } from '../../types';

describe('i18n locales, demoPlans, and offlineRulesEngine branches', () => {
  const profile: HouseholdProfile = {
    tags: ['toddler_kids', 'asthma_respiratory'],
    setup: { airPurifier: false, stoveType: 'gas', commuteMode: 'metro_bus' },
  };

  it('exercises all supported locale dynamic formatters', () => {
    const langs = ['en', 'hi', 'ur', 'bn', 'ta', 'te', 'mr'] as const;
    for (const lang of langs) {
      const t = getTranslation(lang);
      expect(t.bestTimeSentence('06:00', '09:00', '10:00')).toBeTruthy();
      expect(t.appName).toBeTruthy();
      saveLanguage(lang);
      expect(getSavedLanguage()).toBe(lang);
    }
    localStorage.setItem('vayushield_lang', 'unknown');
    expect(getSavedLanguage()).toBe('en');
  });

  it('selects appropriate demo plans across languages, cities, and AQI levels', () => {
    expect(getDemoPlanForAqi(350, 'Delhi', 'hi').language).toBe('hi');
    expect(getDemoPlanForAqi(350, 'Delhi', 'ur').language).toBe('ur');
    expect(getDemoPlanForAqi(350, 'Delhi', 'bn').language).toBe('bn');
    expect(getDemoPlanForAqi(350, 'Delhi', 'ta').language).toBe('ta');
    expect(getDemoPlanForAqi(350, 'Delhi', 'te').language).toBe('te');
    expect(getDemoPlanForAqi(350, 'Delhi', 'mr').language).toBe('mr');
    expect(getDemoPlanForAqi(400, 'Lahore', 'en').oneThingToDo).toBeTruthy();
    expect(getDemoPlanForAqi(320, 'Kanpur', 'en').oneThingToDo).toBeTruthy();
    expect(getDemoPlanForAqi(240, 'Lucknow', 'en').oneThingToDo).toBeTruthy();
    expect(getDemoPlanForAqi(120, 'Pune', 'en').oneThingToDo).toBeTruthy();
    expect(getDemoPlanForAqi(350, 'Delhi', 'en').oneThingToDo).toBeTruthy();
  });

  it('covers Hindi and English offlineRulesEngine branches', () => {
    const severeAir = AIR_PRESETS['delhi-severe']!;
    const modAir = AIR_PRESETS['moderate-haze']!;

    // Hindi branches
    expect(generateOfflineChatAnswer('दवा बताओ', severeAir, profile, 'hi')).toContain('नहीं');
    expect(generateOfflineChatAnswer('पार्क जा सकते हैं?', severeAir, profile, 'hi')).toContain('नहीं');
    expect(generateOfflineChatAnswer('पार्क जा सकते हैं?', modAir, profile, 'hi')).toContain('रुकें');
    expect(generateOfflineChatAnswer('आज कैसा है?', severeAir, profile, 'hi')).toContain('रुकें');

    // English branches
    expect(
      generateOfflineChatAnswer('which medicine inhaler?', severeAir, profile, 'en')
    ).toContain('No,');
    expect(generateOfflineChatAnswer('go to park?', severeAir, profile, 'en')).toContain('No,');
    expect(generateOfflineChatAnswer('go to park?', modAir, profile, 'en')).toContain('Wait,');
    expect(generateOfflineChatAnswer('open window?', severeAir, profile, 'en')).toContain('No,');
    expect(generateOfflineChatAnswer('open window?', modAir, profile, 'en')).toContain('Wait');
    expect(generateOfflineChatAnswer('cloth mask ok?', severeAir, profile, 'en')).toContain('No,');
    expect(
      generateOfflineChatAnswer('cloth mask ok?', { ...modAir, currentAqi: 80 }, profile, 'en')
    ).toContain('Yes,');
    expect(
      generateOfflineChatAnswer(
        'general question',
        severeAir,
        { ...profile, tags: ['wfh'], setup: { ...profile.setup, airPurifier: true } },
        'en'
      )
    ).toContain('HEPA purifier');
  });
});
