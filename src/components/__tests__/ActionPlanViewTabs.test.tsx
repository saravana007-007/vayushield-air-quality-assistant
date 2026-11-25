import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionPlanView } from '../ActionPlanView';
import { DEMO_PLANS } from '../../data/demoPlans';
import { TRANSLATIONS } from '../../i18n';

describe('components/ActionPlanView and tabs', () => {
  const mockPlan = DEMO_PLANS['delhi-severe']!;
  const onToggleHack = vi.fn();
  const onToggleSwap = vi.fn();

  beforeEach(() => {
    onToggleHack.mockClear();
    onToggleSwap.mockClear();
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(
      <ActionPlanView
        plan={null}
        isLoading={true}
        completedHackIds={[]}
        completedSwapIds={[]}
        currentLang="en"
        t={TRANSLATIONS.en}
        onToggleHack={onToggleHack}
        onToggleSwap={onToggleSwap}
      />
    );

    const busy = screen.getByLabelText(/loading family action plan/i);
    expect(busy).toBeInTheDocument();
    expect(busy).toHaveAttribute('aria-busy', 'true');
  });

  it('renders null when plan is null and not loading', () => {
    const { container } = render(
      <ActionPlanView
        plan={null}
        isLoading={false}
        completedHackIds={[]}
        completedSwapIds={[]}
        currentLang="en"
        t={TRANSLATIONS.en}
        onToggleHack={onToggleHack}
        onToggleSwap={onToggleSwap}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders Plan Tab with routine blocks and dos/donts', () => {
    render(
      <ActionPlanView
        plan={mockPlan}
        isLoading={false}
        errorBanner="Sample test warning"
        completedHackIds={[]}
        completedSwapIds={[]}
        currentLang="en"
        t={TRANSLATIONS.en}
        activeTab="plan"
        onToggleHack={onToggleHack}
        onToggleSwap={onToggleSwap}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Sample test warning');
    // The hero text is wrapped in quote marks and split across text nodes,
    // so match by substring instead of exact text.
    expect(
      screen.getByText((content) => content.includes(mockPlan.oneThingToDo))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(mockPlan.familyRiskBriefing))
    ).toBeInTheDocument();
    expect(screen.getByText(/morning smog peak/i)).toBeInTheDocument();
  });

  it('renders Hacks Tab and allows toggling hacks and swaps', () => {
    render(
      <ActionPlanView
        plan={mockPlan}
        isLoading={false}
        completedHackIds={['hack-1']}
        completedSwapIds={['simmer-pot-aromatics']}
        currentLang="en"
        t={TRANSLATIONS.en}
        activeTab="hacks"
        onToggleHack={onToggleHack}
        onToggleSwap={onToggleSwap}
      />
    );

    expect(screen.getByText(mockPlan.indoorHacks[0]!.title)).toBeInTheDocument();

    // Hacks and swaps are buttons, not checkboxes.
    const markDone = screen.getAllByRole('button', { name: /mark done/i });
    expect(markDone.length).toBeGreaterThan(0);
    fireEvent.click(markDone[0]!);
    expect(onToggleHack).toHaveBeenCalledTimes(1);

    const commitSwap = screen.getAllByRole('button', { name: /commit to swap/i });
    expect(commitSwap.length).toBeGreaterThan(0);
    fireEvent.click(commitSwap[0]!);
    expect(onToggleSwap).toHaveBeenCalledTimes(1);

    // Completed state is reflected on the buttons.
    expect(screen.getAllByRole('button', { name: /completed/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /adopted/i }).length).toBeGreaterThan(0);
  });

  it('renders Safety Tab with Mask and Doctor Guide', () => {
    render(
      <ActionPlanView
        plan={mockPlan}
        isLoading={false}
        completedHackIds={[]}
        completedSwapIds={[]}
        currentLang="en"
        t={TRANSLATIONS.en}
        activeTab="safety"
        onToggleHack={onToggleHack}
        onToggleSwap={onToggleSwap}
      />
    );

    expect(screen.getByText(TRANSLATIONS.en.maskGuideTitle)).toBeInTheDocument();
    expect(screen.getByText(TRANSLATIONS.en.seeDoctorTitle)).toBeInTheDocument();
  });
});
