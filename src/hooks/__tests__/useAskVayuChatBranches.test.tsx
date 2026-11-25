import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAskVayuChat } from '../useAskVayuChat';
import { AIR_PRESETS } from '../../services/airQualityService';
import { DEMO_PLANS } from '../../data/demoPlans';
import * as geminiService from '../../services/geminiService';
import * as speechUtils from '../../utils/speech';
import type { HouseholdProfile } from '../../types';

const airData = AIR_PRESETS['delhi-severe']!;
const plan = DEMO_PLANS['delhi-severe']!;
const profile: HouseholdProfile = {
  tags: ['toddler_kids'],
  setup: { airPurifier: true, stoveType: 'gas', commuteMode: 'metro_bus' },
};

describe('hooks/useAskVayuChat branches', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a Hindi welcome message for Hindi users', () => {
    const { result } = renderHook(() =>
      useAskVayuChat({ airData, profile, plan, currentLang: 'hi' })
    );

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]?.content).toContain('हाँ, मैं आपके परिवार की मदद');
  });

  it('ignores empty submissions without asking Vayu', async () => {
    const askSpy = vi.spyOn(geminiService, 'askVayu').mockResolvedValue('A reply');
    const { result } = renderHook(() =>
      useAskVayuChat({ airData, profile, plan, currentLang: 'en' })
    );

    await act(async () => {
      await result.current.handleSend('   ');
      await result.current.handleSend('');
    });

    expect(askSpy).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.inputQuery).toBe('');
    expect(result.current.isAnswering).toBe(false);
  });

  it('starts and stops voice input through the toggle', () => {
    const stopSpy = vi.fn();
    let onEnd: (() => void) | undefined;
    const startSpy = vi
      .spyOn(speechUtils, 'startVoiceRecognition')
      .mockImplementation((_lang, _onResult, _onError, endCallback) => {
        onEnd = endCallback;
        return stopSpy;
      });

    const { result } = renderHook(() =>
      useAskVayuChat({ airData, profile, plan, currentLang: 'en' })
    );

    act(() => {
      result.current.handleToggleVoice();
    });
    expect(startSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isRecording).toBe(true);

    act(() => {
      onEnd?.();
    });
    expect(result.current.isRecording).toBe(false);

    act(() => {
      result.current.handleToggleVoice();
    });
    expect(result.current.isRecording).toBe(true);

    act(() => {
      result.current.handleToggleVoice();
    });
    expect(startSpy).toHaveBeenCalledTimes(2);
    expect(stopSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isRecording).toBe(false);
  });
});
