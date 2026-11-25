import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HacksSwapsTab } from '../plan/HacksSwapsTab';
import { DEMO_PLANS } from '../../data/demoPlans';
import { TRANSLATIONS } from '../../i18n';

describe('components/plan/HacksSwapsTab branch fallbacks', () => {
  it('renders fallback labels for unknown swap catalog IDs and toggles completed state', () => {
    const onToggleHack = vi.fn();
    const onToggleSwap = vi.fn();
    const plan = {
      ...DEMO_PLANS['delhi-severe']!,
      swaps: [
        {
          catalogId: 'unknown-swap-id',
          customReason: 'Fallback test reason',
        },
      ],
    };

    render(
      <HacksSwapsTab
        plan={plan}
        completedHackIds={[plan.indoorHacks[0]!.id]}
        completedSwapIds={['unknown-swap-id']}
        t={TRANSLATIONS.en}
        onToggleHack={onToggleHack}
        onToggleSwap={onToggleSwap}
      />
    );

    expect(screen.getByText('Habit Swap')).toBeInTheDocument();
    expect(screen.getByText('unknown-swap-id')).toBeInTheDocument();
    expect(screen.getByText(TRANSLATIONS.en.doneText)).toBeInTheDocument();
    expect(screen.getByText(TRANSLATIONS.en.adoptedText)).toBeInTheDocument();

    fireEvent.click(screen.getByText(TRANSLATIONS.en.doneText));
    expect(onToggleHack).toHaveBeenCalledWith(plan.indoorHacks[0]!.id);

    fireEvent.click(screen.getByText(TRANSLATIONS.en.adoptedText));
    expect(onToggleSwap).toHaveBeenCalledWith('unknown-swap-id');
  });
});
