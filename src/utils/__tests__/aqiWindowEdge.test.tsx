import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { calculateBestAirWindow, validateCityInput } from '../aqiWindow';
import { ActionTracker } from '../../components/ActionTracker';
import { DEMO_PLANS } from '../../data/demoPlans';
import { TRANSLATIONS } from '../../i18n';
import type { HouseholdProfile, HourlyAqiPoint } from '../../types';

describe('aqiWindow & ActionTracker edge branches', () => {
  it('handles empty hourly array and invalid characters in city input', () => {
    const fallback = calculateBestAirWindow([]);
    expect(fallback.startTime).toBe('12:00 PM');

    const sparseFallback = calculateBestAirWindow([undefined as unknown as HourlyAqiPoint]);
    expect(sparseFallback.startTime).toBe('12:00 PM');

    const invalidChars = validateCityInput('<script>');
    expect(invalidChars.isValid).toBe(true);
    const onlyBadChars = validateCityInput('<<>>');
    expect(onlyBadChars.isValid).toBe(false);
  });

  it('toggles hack and swap checkboxes in ActionTracker', () => {
    const onToggleHack = vi.fn();
    const onToggleSwap = vi.fn();
    const plan = DEMO_PLANS['delhi-severe']!;
    const profile: HouseholdProfile = {
      tags: ['toddler_kids'],
      setup: { airPurifier: false, stoveType: 'gas', commuteMode: 'metro_bus' },
    };

    render(
      <ActionTracker
        plan={plan}
        profile={profile}
        currentAqi={350}
        completedHackIds={[]}
        completedSwapIds={[]}
        t={TRANSLATIONS.en}
        onToggleHack={onToggleHack}
        onToggleSwap={onToggleSwap}
        onOpenScoreHelp={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]!);
    expect(onToggleHack).toHaveBeenCalled();

    fireEvent.click(checkboxes[checkboxes.length - 1]!);
    expect(onToggleSwap).toHaveBeenCalled();
  });
});
