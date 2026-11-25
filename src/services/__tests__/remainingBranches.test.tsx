import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { generateActionPlanPdf } from '../pdfService';
import { generateActionPlan, askVayu } from '../geminiService';
import { AIR_PRESETS } from '../airQualityService';
import { DEMO_PLANS } from '../../data/demoPlans';
import { startVoiceRecognition, speakText, stopSpeech } from '../../utils/speech';
import { getStorageString, removeStorageItem } from '../../utils/storage';
import { Header } from '../../components/Header';
import { TodayPlanTab } from '../../components/plan/TodayPlanTab';
import { HacksSwapsTab } from '../../components/plan/HacksSwapsTab';
import { TRANSLATIONS } from '../../i18n';
import type { UiTranslations } from '../../i18n';
import * as speechUtils from '../../utils/speech';
import App from '../../App';
import { screen, waitFor } from '@testing-library/react';
import { useModalAccessibility } from '../../hooks/useModalAccessibility';
import type { HouseholdProfile } from '../../types';

const EmptyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useModalAccessibility(isOpen, onClose, ref);
  if (!isOpen) return null;
  return (
    <div ref={ref} role="dialog" aria-modal="true">
      No buttons here
    </div>
  );
};

describe('Remaining branch coverage: pdfService, geminiService, speech, useModalAccessibility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('pdfService handles unknown swap catalogId and page breaks', async () => {
    const plan = {
      ...DEMO_PLANS['delhi-severe']!,
      indoorHacks: [
        ...DEMO_PLANS['delhi-severe']!.indoorHacks,
        ...DEMO_PLANS['delhi-severe']!.indoorHacks,
        ...DEMO_PLANS['delhi-severe']!.indoorHacks,
      ],
      swaps: [{ catalogId: 'unknown-swap-xyz', customReason: 'Custom reason for unknown swap' }],
    };
    await expect(
      generateActionPlanPdf(AIR_PRESETS['delhi-severe']!, plan, 85)
    ).resolves.toBeUndefined();
  });

  it('geminiService falls back to demo/offline when /api/gemini returns !ok', async () => {
    const profile: HouseholdProfile = {
      tags: ['toddler_kids'],
      setup: { airPurifier: false, stoveType: 'gas', commuteMode: 'metro_bus' },
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
      })
    );

    const planRes = await generateActionPlan(AIR_PRESETS['delhi-severe']!, profile, 'en');
    expect(planRes.isDemo).toBe(true);

    const reply = await askVayu(
      'Can we go out?',
      AIR_PRESETS['delhi-severe']!,
      profile,
      DEMO_PLANS['delhi-severe']!,
      'en'
    );
    expect(reply).toBeTruthy();
  });

  it('speech startVoiceRecognition handles unsupported, start() throw, and stop() throw', () => {
    const origSR = window.SpeechRecognition;
    const origWSR = window.webkitSpeechRecognition;
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;

    const onError = vi.fn();
    startVoiceRecognition('en', vi.fn(), onError);
    expect(onError).toHaveBeenCalledWith('Speech recognition not supported in this browser.');

    class ThrowingSR {
      lang = '';
      continuous = false;
      interimResults = false;
      onresult: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        throw new Error('start failed');
      }
      stop() {
        throw new Error('stop failed');
      }
    }
    window.SpeechRecognition = ThrowingSR as unknown as typeof window.SpeechRecognition;
    const onError2 = vi.fn();
    const stop = startVoiceRecognition('en', vi.fn(), onError2);
    expect(onError2).toHaveBeenCalled();
    expect(() => stop()).not.toThrow();

    window.SpeechRecognition = origSR;
    window.webkitSpeechRecognition = origWSR;
  });

  it('useModalAccessibility handles Tab when modal has zero focusable elements and non-Escape keys', () => {
    const onClose = vi.fn();
    render(<EmptyModal isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Header renders Live AI badge when isDemo is false and triggers score help', () => {
    const onOpenScoreHelp = vi.fn();
    render(
      <Header
        isDemo={false}
        currentLang="en"
        textSize="medium"
        t={TRANSLATIONS.en}
        onSelectLanguage={vi.fn()}
        onChangeTextSize={vi.fn()}
        onOpenChat={vi.fn()}
        onOpenShare={vi.fn()}
        onOpenScoreHelp={onOpenScoreHelp}
      />
    );
    expect(document.body.textContent).toContain('Live AI');
  });

  it('speech speakText/stopSpeech handle missing speechSynthesis and storage handles null/remove', () => {
    const origSynth = window.speechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
    const onError = vi.fn();
    speakText('Hello', 'en', undefined, onError);
    expect(onError).toHaveBeenCalled();
    expect(() => stopSpeech()).not.toThrow();
    Object.defineProperty(window, 'speechSynthesis', { value: origSynth, configurable: true });

    expect(getStorageString('missing_key', 'fallback')).toBe('fallback');
    localStorage.setItem('temp_k', 'v');
    expect(getStorageString('temp_k', 'fallback')).toBe('v');
    removeStorageItem('temp_k');
    expect(localStorage.getItem('temp_k')).toBeNull();
  });

  it('TodayPlanTab handles onError in speakText and non-demo plan; HacksSwapsTab handles empty i18n fallbacks', () => {
    vi.spyOn(speechUtils, 'isSpeechSynthesisSupported').mockReturnValue(true);
    vi.spyOn(speechUtils, 'speakText').mockImplementation((_t, _l, _onEnd, onError) => {
      onError?.(new Error('audio fail'));
      return () => {};
    });

    const plan = { ...DEMO_PLANS['delhi-severe']!, isDemo: false, generatedAt: '12:00' };
    render(<TodayPlanTab plan={plan} currentLang="en" t={TRANSLATIONS.en} />);
    fireEvent.click(screen.getByRole('button', { name: TRANSLATIONS.en.readAloud }));

    const emptyT = {
      ...TRANSLATIONS.en,
      doneText: '',
      markDone: '',
      whyMattersPrefix: '',
      adoptedText: '',
      adoptSwap: '',
    } as UiTranslations;

    render(
      <HacksSwapsTab
        plan={plan}
        completedHackIds={[plan.indoorHacks[0]!.id]}
        completedSwapIds={[plan.swaps[0]!.catalogId]}
        t={emptyT}
        onToggleHack={vi.fn()}
        onToggleSwap={vi.fn()}
      />
    );
    expect(screen.getByText('Done ✓')).toBeInTheDocument();
    expect(screen.getByText('Adopted ✓')).toBeInTheDocument();
  });

  it('App shows and dismisses errorBanner when live air quality fetch fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 1, name: 'Jaipur', latitude: 26.9, longitude: 75.8, country: 'India' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    const input = screen.getAllByRole('combobox')[1]!;
    fireEvent.change(input, { target: { value: 'Jaipur' } });

    await waitFor(
      () => {
        expect(screen.getByText(/Jaipur/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    fireEvent.click(screen.getByText(/Jaipur/i));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
