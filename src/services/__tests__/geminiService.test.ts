import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateActionPlan,
  askVayu,
  setSessionApiKey,
  getSessionApiKey,
  hasApiKey,
  getCachedPlan,
} from '../geminiService';
import type { AirQualityData, HouseholdProfile, ActionPlan } from '../../types';
import {
  getAqiCategory,
  calculateWhoMultiplier,
  calculateBestAirWindow,
} from '../../utils/aqiCalculator';
import { TIMEOUTS } from '../../config';

// Mock @google/genai SDK
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  class MockGoogleGenAI {
    models = {
      generateContent: mockGenerateContent,
    };
  }

  return {
    GoogleGenAI: MockGoogleGenAI,
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY',
      INTEGER: 'INTEGER',
      BOOLEAN: 'BOOLEAN',
    },
  };
});

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
  customTagDetails: 'Severe asthma triggered by cold dry air',
  setup: {
    airPurifier: true,
    stoveType: 'gas',
    commuteMode: 'car_cab',
    customStove: '',
    customCommute: '',
  },
};

const sampleValidPlanJson: Omit<ActionPlan, 'isDemo' | 'generatedAt' | 'language'> = {
  oneThingToDo: 'Run HEPA purifier in the bedroom and seal external doors with damp towels.',
  familyRiskBriefing:
    'High-density winter smog creates extreme risks for toddlers and elderly relatives.',
  dailyRoutine: [
    {
      id: 'morning',
      title: 'Morning Peak Inversion',
      timeRange: '05:00 - 09:00',
      badge: 'Stay Indoors',
      windowRule: 'Keep tightly sealed',
      memberGuidance: 'Keep children indoors away from windows.',
    },
    {
      id: 'midday',
      title: 'Midday Solar Vent Window',
      timeRange: '12:00 - 15:00',
      badge: 'Safe Ventilation Window',
      windowRule: 'Brief cross-ventilation permitted',
      memberGuidance: 'Brief outdoor walks permitted with N95 masks.',
    },
    {
      id: 'evening',
      title: 'Evening Trapping',
      timeRange: '17:00 - 21:00',
      badge: 'Mask Required',
      windowRule: 'Seal all windows',
      memberGuidance: 'Avoid outdoor exercise.',
    },
    {
      id: 'night',
      title: 'Night Containment',
      timeRange: '21:00 - 05:00',
      badge: 'Stay Indoors',
      windowRule: 'Completely sealed',
      memberGuidance: 'Run purifier in sleep zone.',
    },
  ],
  indoorHacks: [
    {
      id: 'hack-1',
      title: 'Door Seal Barrier',
      targetArea: 'Main door',
      steps: ['Roll a damp towel', 'Place against gap'],
      difficulty: 'Easy (2 mins)',
      estimatedReduction: 'Cuts infiltration by 40%',
    },
    {
      id: 'hack-2',
      title: 'Exhaust Fan Cooking Protocol',
      targetArea: 'Kitchen',
      steps: ['Turn on exhaust before lighting stove', 'Keep lid on pans'],
      difficulty: 'Easy (5 mins)',
      estimatedReduction: 'Reduces indoor VOCs',
    },
    {
      id: 'hack-3',
      title: 'Damp Mopping',
      targetArea: 'All hard floors',
      steps: ['Mop with microfiber', 'Do not dry sweep'],
      difficulty: 'Easy (10 mins)',
      estimatedReduction: 'Eliminates dust resuspension',
    },
    {
      id: 'hack-4',
      title: 'Sleep Safe Room Creation',
      targetArea: 'Smallest bedroom',
      steps: ['Close balcony door', 'Place HEPA in center of room'],
      difficulty: 'Moderate (15 mins)',
      estimatedReduction: 'Drops bedroom PM2.5 by 65%',
    },
  ],
  swaps: [
    {
      catalogId: 'midday-errand-scheduling',
      customReason: 'Shift errands to noon when temperature inversion lifts.',
    },
    {
      catalogId: 'damp-microfiber-mopping',
      customReason: 'Protect toddlers crawling on floors from toxic soot.',
    },
    {
      catalogId: 'simmer-pot-aromatics',
      customReason: 'Replace toxic incense with natural cinnamon water simmer.',
    },
    {
      catalogId: 'batch-cooking-covered',
      customReason: 'Minimize indoor combustion PM2.5 in gas kitchen.',
    },
  ],
  dos: [
    'Wear certified N95 masks outdoors',
    'Drink warm liquids',
    'Check live AQI before departure',
  ],
  donts: ['Do not burn incense', 'Do not exercise outdoors at dawn', 'Do not use cloth bandanas'],
};

describe('services/geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSessionApiKey(null);
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    setSessionApiKey(null);
  });

  describe('API key session management', () => {
    it('manages session-only in-memory API key without disk persistence', () => {
      expect(hasApiKey()).toBe(false);
      expect(getSessionApiKey()).toBeNull();

      setSessionApiKey('   test-session-key-123   ');
      expect(hasApiKey()).toBe(true);
      expect(getSessionApiKey()).toBe('test-session-key-123');

      setSessionApiKey('');
      expect(hasApiKey()).toBe(false);
      expect(getSessionApiKey()).toBeNull();
    });
  });

  describe('generateActionPlan', () => {
    it('seamlessly returns demo plan when no API key is provided and proxy is offline', async () => {
      const statusUpdates: string[] = [];
      const result = await generateActionPlan(mockAirData, mockProfile, 'en', (s) =>
        statusUpdates.push(s)
      );

      expect(result.isDemo).toBe(true);
      expect(result.plan).toBeDefined();
      expect(result.plan.dailyRoutine).toHaveLength(4);
      expect(mockGenerateContent).not.toHaveBeenCalled();
      expect(statusUpdates).toContain('No API key provided; loading verified Demo Plan.');
    });

    it('generates and validates action plan successfully with live SDK when API key is set', async () => {
      setSessionApiKey('valid-test-key');
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify(sampleValidPlanJson),
      });

      const statusUpdates: string[] = [];
      const result = await generateActionPlan(mockAirData, mockProfile, 'en', (s) =>
        statusUpdates.push(s)
      );

      expect(result.isDemo).toBe(false);
      expect(result.plan.oneThingToDo).toBe(sampleValidPlanJson.oneThingToDo);
      expect(result.plan.swaps).toHaveLength(4);
      expect(result.plan.language).toBe('en');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      // Verify cached plan was stored
      const cached = getCachedPlan();
      expect(cached).not.toBeNull();
      expect(cached?.plan.oneThingToDo).toBe(sampleValidPlanJson.oneThingToDo);
    });

    it('retries with fallback model when first attempt returns malformed JSON', async () => {
      setSessionApiKey('valid-test-key');

      // Attempt 1: Malformed JSON
      mockGenerateContent.mockResolvedValueOnce({
        text: '{"oneThingToDo": "Corrupted response...',
      });
      // Attempt 2 (fallback model): Valid JSON
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify(sampleValidPlanJson),
      });

      const statusUpdates: string[] = [];
      const result = await generateActionPlan(mockAirData, mockProfile, 'en', (s) =>
        statusUpdates.push(s)
      );

      expect(result.isDemo).toBe(false);
      expect(result.plan.oneThingToDo).toBe(sampleValidPlanJson.oneThingToDo);
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
      expect(statusUpdates.some((s) => s.includes('Retrying with fallback model'))).toBe(true);
    });

    it('retries with fallback model when first attempt throws an API error', async () => {
      setSessionApiKey('valid-test-key');

      // Attempt 1: Throws 503
      mockGenerateContent.mockRejectedValueOnce(new Error('Model overloaded (503)'));
      // Attempt 2: Succeeds
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify(sampleValidPlanJson),
      });

      const result = await generateActionPlan(mockAirData, mockProfile, 'en');

      expect(result.isDemo).toBe(false);
      expect(result.plan.dailyRoutine).toHaveLength(4);
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it('falls back to demo plan when both live attempts fail', async () => {
      setSessionApiKey('valid-test-key');

      // Attempt 1 and 2 both fail
      mockGenerateContent.mockRejectedValueOnce(new Error('Quota limit 429'));
      mockGenerateContent.mockRejectedValueOnce(new Error('Service unavailable 503'));

      const statusUpdates: string[] = [];
      const result = await generateActionPlan(mockAirData, mockProfile, 'en', (s) =>
        statusUpdates.push(s)
      );

      expect(result.isDemo).toBe(true);
      expect(result.plan).toBeDefined();
      expect(result.error).toContain('Live AI generation failed');
      expect(statusUpdates).toContain('Gemini unavailable; displaying verified Demo Plan.');
    });

    it('times out and clears timer when API call exceeds timeout limit', async () => {
      vi.useFakeTimers();
      setSessionApiKey('valid-test-key');

      // Hang both attempts indefinitely
      mockGenerateContent.mockImplementation(() => new Promise(() => {}));

      const planPromise = generateActionPlan(mockAirData, mockProfile, 'en');

      // Advance through both attempt timeouts
      await vi.advanceTimersByTimeAsync(TIMEOUTS.geminiRequestMs + 500);
      await vi.advanceTimersByTimeAsync(TIMEOUTS.geminiRequestMs + 500);

      const result = await planPromise;

      expect(result.isDemo).toBe(true);
      expect(result.error).toContain('timed out');
    });

    it('throws error when response.text is empty', async () => {
      setSessionApiKey('valid-test-key');

      // Both attempts return empty text
      mockGenerateContent.mockResolvedValue({ text: '' });

      const result = await generateActionPlan(mockAirData, mockProfile, 'en');

      expect(result.isDemo).toBe(true);
      expect(result.error).toContain('Empty response received');
    });
  });

  describe('askVayu consultation', () => {
    it('returns concise consultation reply from live Gemini model when API key is set', async () => {
      setSessionApiKey('valid-test-key');
      const mockReply =
        'No, outdoor play is unsafe today at AQI 350. Keep children indoors with air purification running.';
      mockGenerateContent.mockResolvedValueOnce({
        text: mockReply,
      });

      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: false,
        generatedAt: '12:00 PM',
        language: 'en',
      };

      const reply = await askVayu(
        'Can my children play in the park today?',
        mockAirData,
        mockProfile,
        dummyPlan,
        'en'
      );

      expect(reply).toBe(mockReply);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('falls back to smart local reasoning when live Gemini consultation throws', async () => {
      setSessionApiKey('valid-test-key');
      mockGenerateContent.mockRejectedValueOnce(new Error('Network disconnected'));

      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: false,
        generatedAt: '12:00 PM',
        language: 'en',
      };

      const reply = await askVayu(
        'Should I take my asthma inhaler or change the dose?',
        mockAirData,
        mockProfile,
        dummyPlan,
        'en'
      );

      expect(reply).toContain('No, VayuShield cannot provide medication advice');
      expect(reply).toContain('physician');
    });

    it('sanitizes input and limits question length to 500 characters', async () => {
      setSessionApiKey('valid-test-key');
      mockGenerateContent.mockResolvedValueOnce({ text: 'No, stay indoors.' });

      const longQuestion = 'Should I exercise outside today? '.repeat(30); // ~960 chars
      expect(longQuestion.length).toBeGreaterThan(500);

      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: false,
        generatedAt: '12:00 PM',
        language: 'en',
      };

      await askVayu(longQuestion, mockAirData, mockProfile, dummyPlan, 'en');

      const callArgs = mockGenerateContent.mock.calls[0]?.[0] as { contents: string };
      expect(callArgs.contents).toBeDefined();
      // Verify prompt contains sanitized question trimmed to max 500 characters
      expect(callArgs.contents).toContain(longQuestion.trim().slice(0, 500));
    });

    it('provides accurate local reasoning for medical queries without API key', async () => {
      setSessionApiKey(null);
      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: true,
        generatedAt: '12:00 PM',
        language: 'en',
      };

      const reply = await askVayu(
        'What medicine or antibiotic should I take for coughing?',
        mockAirData,
        mockProfile,
        dummyPlan,
        'en'
      );

      expect(reply.startsWith('No,')).toBe(true);
      expect(reply).toContain('medication advice');
      expect(reply).toContain('physician');
    });

    it('provides accurate local reasoning for outdoor exercise and parks', async () => {
      setSessionApiKey(null);
      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: true,
        generatedAt: '12:00 PM',
        language: 'en',
      };

      const reply = await askVayu(
        'Can I go for a jog in the park?',
        mockAirData,
        mockProfile,
        dummyPlan,
        'en'
      );

      expect(reply.startsWith('No,')).toBe(true);
      expect(reply).toContain('outdoor physical activity is unsafe today');
    });

    it('provides accurate local reasoning for window ventilation and cooking', async () => {
      setSessionApiKey(null);
      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: true,
        generatedAt: '12:00 PM',
        language: 'en',
      };

      const reply = await askVayu(
        'Should I open windows while cooking?',
        mockAirData,
        mockProfile,
        dummyPlan,
        'en'
      );

      expect(reply.startsWith('No,')).toBe(true);
      expect(reply).toContain('exterior windows hermetically sealed');
    });

    it('provides accurate local reasoning for cloth vs N95 masks', async () => {
      setSessionApiKey(null);
      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: true,
        generatedAt: '12:00 PM',
        language: 'en',
      };

      const reply = await askVayu(
        'Is a cloth mask sufficient?',
        mockAirData,
        mockProfile,
        dummyPlan,
        'en'
      );

      expect(reply.startsWith('No,')).toBe(true);
      expect(reply).toContain('N95 or FFP2');
    });

    it('provides localized Hindi local reasoning for Hindi language queries', async () => {
      setSessionApiKey(null);
      const dummyPlan: ActionPlan = {
        ...sampleValidPlanJson,
        isDemo: true,
        generatedAt: '12:00 PM',
        language: 'hi',
      };

      const medReply = await askVayu(
        'दवा और डॉक्टर की सलाह',
        mockAirData,
        mockProfile,
        dummyPlan,
        'hi'
      );
      expect(medReply).toContain('नहीं, वायुशील्ड दवाओं');

      const parkReply = await askVayu(
        'पार्क में खेलने जा सकते हैं?',
        mockAirData,
        mockProfile,
        dummyPlan,
        'hi'
      );
      expect(parkReply).toContain('नहीं, आज AQI');
    });
  });
});
