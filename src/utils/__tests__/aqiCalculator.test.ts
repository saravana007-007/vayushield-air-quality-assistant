// VayuShield Core Tests: AQI Calculations, WHO Multiplier, Best Window, Input Validations & i18n

import { describe, it, expect } from 'vitest';
import {
  getAqiCategory,
  calculateWhoMultiplier,
  calculateBestAirWindow,
  validateCityInput,
  validateAqi,
  calculateProtectionScore,
  calculateCo2Saved,
  calculateExposureReduction,
} from '../aqiCalculator';
import { ActionPlanSchema } from '../../services/schemas';
import type { HouseholdProfile, HourlyAqiPoint } from '../../types';
import { DEMO_PLANS } from '../../data/demoPlans';
import { getTranslation, type SupportedLanguage } from '../../i18n';

describe('AQI Category Classification Boundaries & Visual Identifiers', () => {
  it('classifies 0-50 as Good with safe emoji 😊', () => {
    const res = getAqiCategory(25);
    expect(res.key).toBe('good');
    expect(res.emoji).toBe('😊');
    expect(res.trafficStatus).toBe('safe');
  });

  it('classifies 51-100 as Moderate with neutral emoji 😐', () => {
    const res = getAqiCategory(75);
    expect(res.key).toBe('moderate');
    expect(res.emoji).toBe('😐');
    expect(res.trafficStatus).toBe('safe');
  });

  it('classifies 101-150 as Unhealthy for Sensitive Groups with mask emoji 😷', () => {
    const res = getAqiCategory(125);
    expect(res.key).toBe('unhealthy_sensitive');
    expect(res.emoji).toBe('😷');
    expect(res.trafficStatus).toBe('warning');
  });

  it('classifies 151-200 as Unhealthy with nauseated emoji 🤢', () => {
    const res = getAqiCategory(180);
    expect(res.key).toBe('unhealthy');
    expect(res.emoji).toBe('🤢');
    expect(res.trafficStatus).toBe('danger');
  });

  it('classifies 201-300 as Very Unhealthy with emergency siren 🚨', () => {
    const res = getAqiCategory(250);
    expect(res.key).toBe('very_unhealthy');
    expect(res.emoji).toBe('🚨');
    expect(res.trafficStatus).toBe('danger');
  });

  it('classifies 301+ as Hazardous with skull emoji ☠️', () => {
    const res = getAqiCategory(385);
    expect(res.key).toBe('hazardous');
    expect(res.emoji).toBe('☠️');
    expect(res.trafficStatus).toBe('danger');
  });
});

describe('WHO PM2.5 Multiplier Calculation', () => {
  it('returns 1x when PM2.5 is at or below WHO guideline (15 µg/m³)', () => {
    expect(calculateWhoMultiplier(10)).toBe(1);
    expect(calculateWhoMultiplier(15)).toBe(1);
  });

  it('computes correct ratio when PM2.5 significantly exceeds 15 µg/m³', () => {
    // 30 / 15 = 2.0
    expect(calculateWhoMultiplier(30)).toBe(2);
    // 320.4 / 15 ≈ 21.4
    expect(calculateWhoMultiplier(320.4)).toBe(21.4);
  });
});

describe('When Will It Get Better Engine (Best-Window Calculation)', () => {
  it('identifies best afternoon window when dispersion occurs', () => {
    const sampleHourly: HourlyAqiPoint[] = [
      { time: '06:00', hour: 6, aqi: 280, pm2_5: 220, pm10: 300 },
      { time: '09:00', hour: 9, aqi: 240, pm2_5: 180, pm10: 250 },
      { time: '13:00', hour: 13, aqi: 120, pm2_5: 45, pm10: 80 },
      { time: '14:00', hour: 14, aqi: 110, pm2_5: 40, pm10: 75 }, // lowest point
      { time: '15:00', hour: 15, aqi: 130, pm2_5: 50, pm10: 85 },
      { time: '18:00', hour: 18, aqi: 250, pm2_5: 190, pm10: 270 },
      { time: '21:00', hour: 21, aqi: 290, pm2_5: 230, pm10: 310 },
    ];

    const window = calculateBestAirWindow(sampleHourly, 8);
    expect(window.stayIndoorsAllDay).toBe(false);
    expect(window.lowestAqi).toBe(110);
    expect(window.plainSentence).toContain('Best time to go out');
    expect(window.countdownHours).toBeGreaterThan(0);
  });

  it('flags stayIndoorsAllDay=true when even the lowest AQI is severe (no clean window)', () => {
    const severeHourly: HourlyAqiPoint[] = [
      { time: '06:00', hour: 6, aqi: 450, pm2_5: 390, pm10: 550 },
      { time: '10:00', hour: 10, aqi: 410, pm2_5: 340, pm10: 480 },
      { time: '14:00', hour: 14, aqi: 360, pm2_5: 290, pm10: 420 }, // lowest is still 360
      { time: '18:00', hour: 18, aqi: 440, pm2_5: 380, pm10: 520 },
      { time: '22:00', hour: 22, aqi: 470, pm2_5: 410, pm10: 580 },
    ];

    const window = calculateBestAirWindow(severeHourly, 8);
    expect(window.stayIndoorsAllDay).toBe(true);
    expect(window.plainSentence).toBe('Stay indoors all day. Smog will not clear today.');
  });
});

describe('Input Validation', () => {
  describe('City Input Validation', () => {
    it('rejects empty or whitespace-only city names', () => {
      expect(validateCityInput('').isValid).toBe(false);
      expect(validateCityInput('   ').isValid).toBe(false);
    });

    it('rejects single-character city names', () => {
      expect(validateCityInput('A').isValid).toBe(false);
    });

    it('rejects non-string inputs', () => {
      expect(validateCityInput(null).isValid).toBe(false);
      expect(validateCityInput(123).isValid).toBe(false);
    });

    it('sanitizes unsafe HTML/Script characters', () => {
      const res = validateCityInput('<script>Delhi</script>');
      expect(res.isValid).toBe(true);
      expect(res.sanitized).toBe('scriptDelhiscript');
    });

    it('accepts and trims normal city names', () => {
      const res = validateCityInput('  New Delhi  ');
      expect(res.isValid).toBe(true);
      expect(res.sanitized).toBe('New Delhi');
    });

    it('flags excessively long names (> 80 chars)', () => {
      const longCity = 'A'.repeat(90);
      const res = validateCityInput(longCity);
      expect(res.isValid).toBe(false);
      expect(res.sanitized.length).toBe(80);
    });
  });

  describe('AQI Value Validation', () => {
    it('accepts valid numeric AQI', () => {
      expect(validateAqi(150)).toEqual({ isValid: true, aqi: 150 });
      expect(validateAqi(0)).toEqual({ isValid: true, aqi: 0 });
      expect(validateAqi(500)).toEqual({ isValid: true, aqi: 500 });
    });

    it('rejects negative AQI', () => {
      const res = validateAqi(-10);
      expect(res.isValid).toBe(false);
    });

    it('rejects non-numeric AQI', () => {
      expect(validateAqi('300').isValid).toBe(false);
      expect(validateAqi(NaN).isValid).toBe(false);
    });

    it('rejects out-of-range AQI (> 1000)', () => {
      const res = validateAqi(1200);
      expect(res.isValid).toBe(false);
      expect(res.aqi).toBe(1000);
    });
  });
});

describe('Family Smog Protection Score & Calculations', () => {
  const baseProfile: HouseholdProfile = {
    tags: ['toddler_kids', 'elderly'],
    setup: {
      airPurifier: false,
      stoveType: 'gas',
      commuteMode: 'metro_bus',
    },
  };

  it('computes baseline score with no checklist items and no purifier', () => {
    const score = calculateProtectionScore(baseProfile, [], 4, [], 4);
    expect(score.baseline).toBe(20);
    expect(score.purifierBonus).toBe(0);
    expect(score.setupBonus).toBe(0);
    expect(score.hacksScore).toBe(0);
    expect(score.swapsScore).toBe(0);
    expect(score.total).toBe(20);
  });

  it('adds purifier bonus (+15) and electric stove bonus (+5)', () => {
    const upgradedProfile: HouseholdProfile = {
      ...baseProfile,
      setup: {
        ...baseProfile.setup,
        airPurifier: true,
        stoveType: 'induction',
      },
    };
    const score = calculateProtectionScore(upgradedProfile, [], 4, [], 4);
    expect(score.baseline).toBe(20);
    expect(score.purifierBonus).toBe(15);
    expect(score.setupBonus).toBe(5);
    expect(score.total).toBe(40);
  });

  it('calculates CO2 savings accurately from completed catalog swap IDs', () => {
    expect(calculateCo2Saved([])).toBe(0);
    const saved = calculateCo2Saved(['carpool-metro-transit', 'simmer-pot-aromatics']);
    expect(saved).toBe(3.6);
  });

  it('calculates exposure reduction percentages and indoor estimates', () => {
    const reductionHigh = calculateExposureReduction(100, 300);
    expect(reductionHigh.reductionPercentage).toBeGreaterThanOrEqual(80);
    expect(reductionHigh.estimatedIndoorAqi).toBeLessThan(70);
  });
});

describe('Zod Schema Validation for Gemini Output', () => {
  it('successfully validates bundled demo plans', () => {
    const plan = DEMO_PLANS['delhi-severe'];
    const parsed = ActionPlanSchema.safeParse(plan);
    expect(parsed.success).toBe(true);
  });

  it('successfully validates Hindi demo plan', () => {
    const planHi = DEMO_PLANS['delhi-severe-hi'];
    const parsed = ActionPlanSchema.safeParse(planHi);
    expect(parsed.success).toBe(true);
  });

  it('fails validation when dailyRoutine does not have exactly 4 blocks', () => {
    const validPlan = DEMO_PLANS['delhi-severe'];
    if (!validPlan) throw new Error('Plan not found');
    const invalidPlan = {
      ...validPlan,
      dailyRoutine: validPlan.dailyRoutine.slice(0, 3),
    };
    const result = ActionPlanSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });

  it('fails validation when badge is not an allowed enum', () => {
    const validPlan = DEMO_PLANS['delhi-severe'];
    if (!validPlan) throw new Error('Plan not found');
    const firstRoutine = validPlan.dailyRoutine[0];
    if (!firstRoutine) throw new Error('First routine not found');
    const invalidPlan = {
      ...validPlan,
      dailyRoutine: [
        {
          ...firstRoutine,
          badge: 'Go Outside Jogging',
        },
        ...validPlan.dailyRoutine.slice(1),
      ],
    };
    const result = ActionPlanSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });

  it('fails validation when indoorHacks count is not 4', () => {
    const validPlan = DEMO_PLANS['delhi-severe'];
    if (!validPlan) throw new Error('Plan not found');
    const firstHack = validPlan.indoorHacks[0];
    if (!firstHack) throw new Error('First hack not found');
    const invalidPlan = {
      ...validPlan,
      indoorHacks: [firstHack],
    };
    const result = ActionPlanSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });

  it('fails validation when oneThingToDo is missing', () => {
    const validPlan = DEMO_PLANS['delhi-severe'];
    if (!validPlan) throw new Error('Plan not found');
    const { oneThingToDo: _removed, ...invalidPlan } = validPlan as unknown as Record<string, unknown>;
    const result = ActionPlanSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });
});

describe('i18n Language Fallback', () => {
  it('returns valid translation for supported languages', () => {
    const en = getTranslation('en');
    expect(en.appName).toBe('VayuShield');

    const hi = getTranslation('hi');
    expect(hi.appName).toContain('वायुशील्ड');

    const ur = getTranslation('ur');
    expect(ur.appName).toContain('وایو شیلڈ');
  });

  it('safely falls back to English when an unsupported language code is passed', () => {
    const fallback = getTranslation('fr' as unknown as SupportedLanguage);
    expect(fallback).toBeDefined();
    expect(fallback.appName).toBe('VayuShield');
    expect(fallback.selectLanguage).toBe('Choose Language');
  });
});
