// VayuShield Bundled Demo Plans for instant resilience
// Provides curated, safe plans for presets across all 7 supported languages

import type { ActionPlan } from '../types';
import type { SupportedLanguage } from '../i18n';
import { EN_DEMO_PLANS } from './demo/enPlans';
import { HI_DEMO_PLANS } from './demo/hiPlans';
import { UR_DEMO_PLANS } from './demo/urPlans';
import { REGIONAL_DEMO_PLANS } from './demo/regionalPlans';

export const DEMO_PLANS: Record<string, ActionPlan> = {
  ...EN_DEMO_PLANS,
  ...HI_DEMO_PLANS,
  ...UR_DEMO_PLANS,
  ...REGIONAL_DEMO_PLANS,
};

export function getDemoPlanForAqi(
  aqi: number,
  cityName?: string,
  lang: SupportedLanguage = 'en'
): ActionPlan {
  const fallback = DEMO_PLANS['delhi-severe'] ?? Object.values(DEMO_PLANS)[0]!;

  if (lang === 'hi') {
    return DEMO_PLANS['delhi-severe-hi'] ?? fallback;
  }
  if (lang === 'ur') {
    return DEMO_PLANS['delhi-severe-ur'] ?? fallback;
  }
  if (lang === 'bn') {
    return DEMO_PLANS['delhi-severe-bn'] ?? fallback;
  }
  if (lang === 'ta') {
    return DEMO_PLANS['delhi-severe-ta'] ?? fallback;
  }
  if (lang === 'te') {
    return DEMO_PLANS['delhi-severe-te'] ?? fallback;
  }
  if (lang === 'mr') {
    return DEMO_PLANS['delhi-severe-mr'] ?? fallback;
  }
  if (cityName && cityName.toLowerCase().includes('delhi')) {
    return DEMO_PLANS['delhi-severe'] ?? fallback;
  }
  if (cityName && cityName.toLowerCase().includes('lahore')) {
    return DEMO_PLANS['lahore-hazardous'] ?? fallback;
  }
  if (aqi >= 300) {
    return DEMO_PLANS['delhi-severe'] ?? fallback;
  }
  if (aqi >= 200) {
    return DEMO_PLANS['lahore-hazardous'] ?? fallback;
  }
  return DEMO_PLANS['moderate-haze'] ?? fallback;
}
