import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActionPlan } from '../useActionPlan';
import * as geminiService from '../../services/geminiService';
import { AIR_PRESETS } from '../../services/airQualityService';
import { TRANSLATIONS } from '../../i18n';
import type { HouseholdProfile, ActionPlan } from '../../types';

const mockProfile: HouseholdProfile = {
  tags: ['toddler_kids'],
  customTagDetails: '',
  setup: {
    airPurifier: true,
    stoveType: 'gas',
    commuteMode: 'car_cab',
  },
};

describe('hooks/useActionPlan', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('initializes with default demo plan and handles cachedNotice dismissal', () => {
    vi.spyOn(geminiService, 'getCachedPlan').mockReturnValueOnce({
      plan: {} as ActionPlan,
      airData: {} as never,
      timestamp: '10:30 AM',
    });

    const { result } = renderHook(() => useActionPlan());

    expect(result.current.isDemo).toBe(true);
    expect(result.current.cachedNotice).toContain('10:30 AM');

    act(() => {
      result.current.dismissCachedNotice();
    });
    expect(result.current.cachedNotice).toBeNull();
  });

  it('syncs demo plan when language changes', () => {
    const { result } = renderHook(() => useActionPlan());

    act(() => {
      result.current.syncPlanForLanguage(350, 'Delhi', 'hi');
    });

    expect(result.current.plan.language).toBe('hi');
  });

  it('allows directly setting plan and demo flag', () => {
    const { result } = renderHook(() => useActionPlan());

    const customPlan = {
      ...result.current.plan,
      oneThingToDo: 'Custom test action',
    };

    act(() => {
      result.current.setPlanDirectly(customPlan, false);
    });

    expect(result.current.plan.oneThingToDo).toBe('Custom test action');
    expect(result.current.isDemo).toBe(false);
  });

  it('generates plan successfully and clears error banners', async () => {
    const mockPlan: ActionPlan = {
      ...resultPlan(),
      oneThingToDo: 'Generated action plan item',
      isDemo: false,
    };

    vi.spyOn(geminiService, 'generateActionPlan').mockResolvedValueOnce({
      plan: mockPlan,
      isDemo: false,
    });

    const { result } = renderHook(() => useActionPlan());

    await act(async () => {
      await result.current.generatePlan(
        AIR_PRESETS['delhi-severe']!,
        mockProfile,
        'en',
        TRANSLATIONS.en
      );
    });

    expect(result.current.plan.oneThingToDo).toBe('Generated action plan item');
    expect(result.current.isDemo).toBe(false);
    expect(result.current.errorBanner).toBeNull();
    expect(result.current.isLoadingPlan).toBe(false);
  });

  it('handles plan generation error banner when service returns fallback error', async () => {
    vi.spyOn(geminiService, 'generateActionPlan').mockResolvedValueOnce({
      plan: resultPlan(),
      isDemo: true,
      error: 'Rate limit exceeded; showing verified plan.',
    });

    const { result } = renderHook(() => useActionPlan());

    await act(async () => {
      await result.current.generatePlan(
        AIR_PRESETS['delhi-severe']!,
        mockProfile,
        'en',
        TRANSLATIONS.en
      );
    });

    expect(result.current.errorBanner).toBe('Rate limit exceeded; showing verified plan.');
    expect(result.current.isDemo).toBe(true);
  });

  it('handles unexpected throw in generatePlan gracefully', async () => {
    vi.spyOn(geminiService, 'generateActionPlan').mockRejectedValueOnce(new Error('Fatal crash'));

    const { result } = renderHook(() => useActionPlan());

    await act(async () => {
      await result.current.generatePlan(
        AIR_PRESETS['delhi-severe']!,
        mockProfile,
        'en',
        TRANSLATIONS.en
      );
    });

    expect(result.current.errorBanner).toContain('Engine communication error');
    expect(result.current.isDemo).toBe(true);
  });
});

function resultPlan() {
  return AIR_PRESETS['delhi-severe'] ? { ...geminiService.getCachedPlan()?.plan ?? {} as ActionPlan } : {} as ActionPlan;
}
