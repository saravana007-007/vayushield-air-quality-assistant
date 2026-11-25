import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSystemInstruction, buildActionPlanPrompt, buildAskVayuPrompt } from '../geminiPrompts';
import { generateActionPlan, askVayu } from '../geminiService';
import { AIR_PRESETS } from '../airQualityService';
import { DEMO_PLANS } from '../../data/demoPlans';
import type { HouseholdProfile } from '../../types';

describe('geminiPrompts & /api/gemini proxy paths', () => {
  const customProfile: HouseholdProfile = {
    tags: ['other', 'toddler_kids'],
    customTagDetails: 'Newborn infant',
    setup: {
      airPurifier: true,
      stoveType: 'other',
      customStove: 'Biomass chulha',
      commuteMode: 'other',
      customCommute: 'Auto-rickshaw',
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('builds system instruction and prompts with custom household details', () => {
    const instr = getSystemInstruction('ta');
    expect(instr).toContain('Tamil');

    const prompt = buildActionPlanPrompt(AIR_PRESETS['delhi-severe']!, customProfile);
    expect(prompt).toContain('Newborn infant');
    expect(prompt).toContain('Biomass chulha');
    expect(prompt).toContain('Auto-rickshaw');
    expect(prompt).toContain('YES (Active HEPA available)');

    const askPrompt = buildAskVayuPrompt(
      'Can baby go out?',
      AIR_PRESETS['delhi-severe']!,
      customProfile,
      DEMO_PLANS['delhi-severe']!,
      'en'
    );
    expect(askPrompt).toContain('Can baby go out?');
  });

  it('uses /api/gemini proxy when no client API key is provided', async () => {
    const mockPlan = { ...DEMO_PLANS['delhi-severe']! };
    delete mockPlan.isDemo;
    delete mockPlan.generatedAt;
    delete mockPlan.language;

    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ plan: mockPlan }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await generateActionPlan(AIR_PRESETS['delhi-severe']!, customProfile, 'en');
    expect(res.isDemo).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith('/api/gemini', expect.any(Object));

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'No, stay indoors with HEPA purifier.' }),
    });

    const reply = await askVayu(
      'Should we open windows?',
      AIR_PRESETS['delhi-severe']!,
      customProfile,
      DEMO_PLANS['delhi-severe']!,
      'en'
    );
    expect(reply).toBe('No, stay indoors with HEPA purifier.');
  });
});
