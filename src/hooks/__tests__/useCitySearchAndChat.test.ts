import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCitySearch } from '../useCitySearch';
import { useAskVayuChat } from '../useAskVayuChat';
import * as airQualityService from '../../services/airQualityService';
import * as geminiService from '../../services/geminiService';
import * as speechUtils from '../../utils/speech';
import { AIR_PRESETS } from '../../services/airQualityService';
import { DEMO_PLANS } from '../../data/demoPlans';
import type { HouseholdProfile } from '../../types';

describe('hooks/useCitySearch & useAskVayuChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('useCitySearch handles short input, empty results, AbortError, and non-Error throw', async () => {
    vi.useFakeTimers();
    const onSelectResult = vi.fn();
    const searchSpy = vi.spyOn(airQualityService, 'searchCities');

    const { result } = renderHook(() => useCitySearch({ onSelectResult }));

    // Short query (< 2 chars) clears results without fetching
    act(() => {
      result.current.handleInputChange({
        target: { value: 'a' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.isOpen).toBe(false);

    // Empty hits sets "No cities matching" error
    searchSpy.mockResolvedValueOnce([]);
    act(() => {
      result.current.handleInputChange({
        target: { value: 'NowhereCity' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current.searchError).toContain('No cities matching');

    // AbortError is silently ignored
    searchSpy.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));
    act(() => {
      result.current.handleInputChange({
        target: { value: 'Delhi' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current.searchError).toBeNull();

    // Non-Error rejection sets fallback message
    searchSpy.mockRejectedValueOnce('raw failure');
    act(() => {
      result.current.handleInputChange({
        target: { value: 'Mumbai' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current.searchError).toBe('Location lookup failed. Check connection.');

    // Reset search clears term and closes dropdown
    act(() => {
      result.current.resetSearch(true);
    });
    expect(result.current.searchTerm).toBe('');
    expect(result.current.isOpen).toBe(false);

    // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
    searchSpy.mockResolvedValueOnce([
      { id: 1, name: 'Delhi', latitude: 28.6, longitude: 77.2, country: 'India' },
      { id: 2, name: 'Dehradun', latitude: 30.3, longitude: 78.0, country: 'India' },
    ]);
    act(() => {
      result.current.handleInputChange({
        target: { value: 'De' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(onSelectResult).toHaveBeenCalled();

    act(() => {
      result.current.handleKeyDown({
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('useAskVayuChat handles askVayu rejection and voice recognition callbacks', async () => {
    const airData = AIR_PRESETS['delhi-severe']!;
    const plan = DEMO_PLANS['delhi-severe']!;
    const profile: HouseholdProfile = {
      tags: ['toddler_kids'],
      setup: { airPurifier: true, stoveType: 'gas', commuteMode: 'metro_bus' },
    };

    vi.spyOn(geminiService, 'askVayu').mockRejectedValueOnce(new Error('Ask failure'));
    const stopSpy = vi.fn();
    let capturedOnResult: ((t: string) => void) | undefined;
    let capturedOnError: ((e: unknown) => void) | undefined;
    let capturedOnEnd: (() => void) | undefined;

    vi.spyOn(speechUtils, 'startVoiceRecognition').mockImplementation(
      (_lang, onResult, onError, onEnd) => {
        capturedOnResult = onResult;
        capturedOnError = onError;
        capturedOnEnd = onEnd;
        return stopSpy;
      }
    );

    const { result } = renderHook(() =>
      useAskVayuChat({ airData, profile, plan, currentLang: 'en' })
    );

    // Trigger send that rejects -> adds fallback error message
    await act(async () => {
      await result.current.handleSend('Will it clear?');
    });
    expect(result.current.messages.some((m) => m.id.startsWith('err-'))).toBe(true);

    // Start voice recording, then stop it manually
    act(() => {
      result.current.handleToggleVoice();
    });
    expect(result.current.isRecording).toBe(true);
    act(() => {
      result.current.handleToggleVoice();
    });
    expect(stopSpy).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(false);

    // Start again and trigger voice error + end + result
    vi.spyOn(geminiService, 'askVayu').mockResolvedValueOnce('Yes, safe.');
    act(() => {
      result.current.handleToggleVoice();
    });
    act(() => {
      capturedOnError?.('not-allowed');
      capturedOnEnd?.();
    });
    expect(result.current.isRecording).toBe(false);

    await act(async () => {
      capturedOnResult?.('Can I go out?');
    });
    expect(result.current.messages.some((m) => m.content === 'Yes, safe.')).toBe(true);
  });
});
