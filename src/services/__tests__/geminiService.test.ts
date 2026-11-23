import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { generateActionPlan, askVayu } from '../geminiService';
import type { AirQualityData, HouseholdProfile } from '../../types';
import { getAqiCategory, calculateWhoMultiplier, calculateBestAirWindow } from '../../utils/aqiCalculator';

const mockHourly = [
  { time: '12:00', hour: 12, aqi: 280, pm2_5: 180, pm10: 250 },
  { time: '13:00', hour: 13, aqi: 250, pm2_5: 150, pm10: 220 },
];

const mockAirData: AirQualityData = {
  cityName: 'Delhi',
  country: 'India',
  latitude: 28.65,
  longitude: 77.23,
  timezone: 'Asia/Kolkata',
  currentAqi: 350,
  category: getAqiCategory(350),
  currentPm25: 250,
  currentPm10: 380,
  whoMultiplier: calculateWhoMultiplier(250),
  hourly: mockHourly,
  bestWindow: calculateBestAirWindow(mockHourly, 12),
  lastUpdated: '12:00 PM',
};

const mockProfile: HouseholdProfile = {
  tags: ['toddler_kids', 'elderly'],
  customTagDetails: '',
  setup: {
    airPurifier: true,
    stoveType: 'gas',
    commuteMode: 'car_cab',
  },
};

describe('services/geminiService', () => {
  const originalKey = import.meta.env.VITE_GEMINI_API_KEY;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    // Default tests to offline mode to avoid unmocked external network calls in CI
    delete (import.meta.env as Record<string, unknown>).VITE_GEMINI_API_KEY;
  });

  afterAll(() => {
    if (originalKey !== undefined) {
      (import.meta.env as Record<string, unknown>).VITE_GEMINI_API_KEY = originalKey;
    }
  });

  it('falls back to demo plan when no API key is available', async () => {
    const statusUpdates: string[] = [];
    const result = await generateActionPlan(
      mockAirData,
      mockProfile,
      'en',
      (s) => statusUpdates.push(s)
    );

    expect(result.isDemo).toBe(true);
    expect(result.plan).toBeDefined();
    expect(result.plan.dailyRoutine).toHaveLength(4);
    expect(statusUpdates).toContain('No API key provided; loading verified Demo Plan.');
  });

  it('returns concise consultation response from askVayu using local reasoning fallback', async () => {
    const demoPlan = (await generateActionPlan(mockAirData, mockProfile, 'en')).plan;
    const answer = await askVayu(
      'Can toddlers play on balcony today?',
      mockAirData,
      mockProfile,
      demoPlan,
      'en'
    );

    expect(typeof answer).toBe('string');
    expect(answer.length).toBeGreaterThan(10);
    // Offline local reasoning starts with YES, NO, or WAIT
    expect(answer).toMatch(/^(Yes|No|Wait)/i);
  });
});
