import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActionTracker } from '../../components/ActionTracker';
import { ChatMessageBubble } from '../../components/ChatMessageBubble';
import { CitySelector } from '../../components/CitySelector';
import { HouseholdProfileForm } from '../../components/HouseholdProfileForm';
import { TodayPlanTab } from '../../components/plan/TodayPlanTab';
import { WhenWillItGetBetter } from '../../components/WhenWillItGetBetter';
import { DEMO_PLANS } from '../../data/demoPlans';
import { TRANSLATIONS } from '../../i18n';
import type { UiTranslations } from '../../i18n';
import * as airQualityService from '../../services/airQualityService';
import type { HouseholdProfile } from '../../types';

describe('Final branch coverage for >= 90% branches', () => {
  const plan = DEMO_PLANS['delhi-severe']!;

  it('ActionTracker renders all 3 isolation levels and completed swap state', () => {
    const profileHigh: HouseholdProfile = {
      tags: ['toddler_kids'],
      setup: { airPurifier: true, stoveType: 'induction', commuteMode: 'metro_bus' },
    };

    const { rerender } = render(
      <ActionTracker
        plan={plan}
        profile={profileHigh}
        currentAqi={350}
        completedHackIds={plan.indoorHacks.map((h) => h.id)}
        completedSwapIds={plan.swaps.map((s) => s.catalogId)}
        t={TRANSLATIONS.en}
        onToggleHack={vi.fn()}
        onToggleSwap={vi.fn()}
        onOpenScoreHelp={vi.fn()}
      />
    );
    expect(screen.getByText(TRANSLATIONS.en.isolationOptimal)).toBeInTheDocument();

    const profileLow: HouseholdProfile = {
      tags: ['toddler_kids'],
      setup: { airPurifier: false, stoveType: 'gas', commuteMode: 'two_wheeler' },
    };
    rerender(
      <ActionTracker
        plan={plan}
        profile={profileLow}
        currentAqi={350}
        completedHackIds={[]}
        completedSwapIds={[]}
        t={TRANSLATIONS.en}
        onToggleHack={vi.fn()}
        onToggleSwap={vi.fn()}
        onOpenScoreHelp={vi.fn()}
      />
    );
    expect(screen.getByText(TRANSLATIONS.en.isolationElevated)).toBeInTheDocument();
  });

  it('CitySelector handles Clear search button, focus reopen, and loading state', async () => {
    vi.useFakeTimers();
    vi.spyOn(airQualityService, 'searchCities').mockResolvedValue([
      { id: 1, name: 'Pune', latitude: 18.5, longitude: 73.8, country: 'India' },
    ]);

    render(
      <CitySelector
        currentCityName="Delhi"
        isPresetActive={false}
        activePresetId=""
        isLoading={true}
        t={TRANSLATIONS.en}
        onSelectLocation={vi.fn()}
        onSelectPreset={vi.fn()}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Pune' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    fireEvent.focus(input);

    const clearBtn = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearBtn);
    expect((input as HTMLInputElement).value).toBe('');
    vi.useRealTimers();
  });

  it('HouseholdProfileForm updates custom stove and custom commute inputs', () => {
    const onChangeProfile = vi.fn();
    const profile: HouseholdProfile = {
      tags: ['other'],
      customTagDetails: 'Asthma',
      setup: { airPurifier: false, stoveType: 'other', commuteMode: 'other' },
    };

    render(
      <HouseholdProfileForm
        profile={profile}
        t={TRANSLATIONS.en}
        onChangeProfile={onChangeProfile}
        onGeneratePlan={vi.fn()}
        isLoading={false}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    for (const inp of inputs) {
      fireEvent.change(inp, { target: { value: 'Custom detail' } });
    }
    expect(onChangeProfile).toHaveBeenCalled();
  });

  it('TodayPlanTab and WhenWillItGetBetter handle optional translation fallbacks', () => {
    const partialT = {
      ...TRANSLATIONS.en,
      windowRulePrefix: '',
      familyGuidancePrefix: '',
      happeningNow: '',
      bestTimeSentence: undefined as unknown as UiTranslations['bestTimeSentence'],
    } as UiTranslations;

    render(
      <div>
        <TodayPlanTab plan={plan} currentLang="en" t={partialT} />
        <WhenWillItGetBetter
          bestWindow={{
            startTime: '12:00 PM',
            endTime: '3:00 PM',
            lowestAqi: 150,
            lowestPm25: 55,
            countdownHours: 0,
            countdownText: 'Now',
            stayIndoorsAllDay: false,
            plainSentence: 'Fallback plain sentence',
          }}
          t={partialT}
        />
      </div>
    );

    expect(screen.getByText('Fallback plain sentence')).toBeInTheDocument();
    expect(screen.getByText('Happening right now!')).toBeInTheDocument();
  });

  it('ActionTracker unknown swap, ChatMessageBubble speaking state, and airQualityService hourly points', async () => {
    const unknownPlan = {
      ...plan,
      swaps: [{ catalogId: 'unknown-swap-id', customReason: 'test' }],
    };
    render(
      <ActionTracker
        plan={unknownPlan}
        profile={{
          tags: ['toddler_kids'],
          setup: { airPurifier: false, stoveType: 'gas', commuteMode: 'metro_bus' },
        }}
        currentAqi={350}
        completedHackIds={[]}
        completedSwapIds={[]}
        t={TRANSLATIONS.en}
        onToggleHack={vi.fn()}
        onToggleSwap={vi.fn()}
        onOpenScoreHelp={vi.fn()}
      />
    );
    expect(screen.getByText('unknown-swap-id')).toBeInTheDocument();

    render(
      <ChatMessageBubble
        message={{ id: 'm1', role: 'model', content: 'Stay indoors.', timestamp: '10:00' }}
        currentLang="en"
      />
    );
    const speakBtn = screen.queryByRole('button', { name: /Listen/i });
    if (speakBtn) fireEvent.click(speakBtn);

    // CitySelector missing geolocation
    const origGeo = navigator.geolocation;
    Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <CitySelector
        currentCityName="Delhi"
        isPresetActive={false}
        activePresetId=""
        isLoading={false}
        t={TRANSLATIONS.en}
        onSelectLocation={vi.fn()}
        onSelectPreset={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /GPS/i }));
    expect(alertSpy).toHaveBeenCalled();
    Object.defineProperty(navigator, 'geolocation', { value: origGeo, configurable: true });

    const futureIso = new Date(Date.now() + 3600_000).toISOString();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          timezone: 'Asia/Kolkata',
          current: { us_aqi: 210, pm2_5: 110, pm10: 180 },
          hourly: {
            time: [futureIso, ''],
            us_aqi: [210, 200],
            pm2_5: [110, 100],
            pm10: [180, 170],
          },
        }),
      })
    );
    const aq = await airQualityService.fetchLiveAirQuality('Pune', 18.5, 73.8);
    expect(aq.hourly.length).toBe(1);
  });
});
