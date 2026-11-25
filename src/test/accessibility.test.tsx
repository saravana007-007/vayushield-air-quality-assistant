import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import type { ReactElement } from 'react';
import App from '../App';
import { AskVayuDrawer } from '../components/AskVayuDrawer';
import { ShareCardModal } from '../components/ShareCardModal';
import { ScoreHelpModal } from '../components/ScoreHelpModal';
import { AIR_PRESETS } from '../services/airQualityService';
import { DEMO_PLANS } from '../data/demoPlans';
import { TRANSLATIONS } from '../i18n';
import type { HouseholdProfile } from '../types';
import { findLowContrastText } from './contrast';

const profile: HouseholdProfile = {
  tags: ['toddler_kids', 'elderly'],
  setup: { airPurifier: true, stoveType: 'gas', commuteMode: 'metro_bus' },
};

const askVayuModal = (isOpen: boolean, onClose: () => void): ReactElement => (
  <AskVayuDrawer
    isOpen={isOpen}
    onClose={onClose}
    airData={AIR_PRESETS['delhi-severe']!}
    profile={profile}
    plan={DEMO_PLANS['delhi-severe']!}
    currentLang="en"
    t={TRANSLATIONS.en}
  />
);

const shareModal = (isOpen: boolean, onClose: () => void): ReactElement => (
  <ShareCardModal
    isOpen={isOpen}
    onClose={onClose}
    airData={AIR_PRESETS['delhi-severe']!}
    profile={profile}
    plan={DEMO_PLANS['delhi-severe']!}
    completedHackIds={[]}
    completedSwapIds={[]}
    t={TRANSLATIONS.en}
  />
);

const scoreHelpModal = (isOpen: boolean, onClose: () => void): ReactElement => (
  <ScoreHelpModal isOpen={isOpen} onClose={onClose} />
);

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function expectAccessibleModal(
  name: string,
  modal: (isOpen: boolean, onClose: () => void) => ReactElement
): void {
  it(`${name} is keyboard accessible and has no axe violations`, async () => {
    const trigger = document.createElement('button');
    trigger.textContent = `Open ${name}`;
    document.body.appendChild(trigger);
    trigger.focus();

    const onClose = vi.fn();
    const { container, rerender } = render(modal(true, onClose));
    const dialog = screen.getByRole('dialog');

    expect((await axe(container)).violations).toEqual([]);
    expect(findLowContrastText(container)).toEqual([]);

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(modal(false, onClose));
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
}

describe('accessibility', () => {
  it('main App view has no axe violations', async () => {
    const { container } = render(<App />);
    expect((await axe(container)).violations).toEqual([]);
    expect(findLowContrastText(container)).toEqual([]);
  });

  expectAccessibleModal('AskVayuDrawer', askVayuModal);
  expectAccessibleModal('ShareCardModal', shareModal);
  expectAccessibleModal('ScoreHelpModal', scoreHelpModal);

  it('tabs move focus with arrow, Home, and End keys', () => {
    render(<App />);
    const tabs = screen.getAllByRole('tab');

    tabs[0]!.focus();
    fireEvent.keyDown(tabs[0]!, { key: 'ArrowRight' });
    expect(tabs[1]!).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[1]!);

    fireEvent.keyDown(tabs[1]!, { key: 'ArrowLeft' });
    expect(tabs[0]!).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[0]!);

    fireEvent.keyDown(tabs[0]!, { key: 'End' });
    expect(tabs[tabs.length - 1]!).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[tabs.length - 1]!);

    fireEvent.keyDown(tabs[tabs.length - 1]!, { key: 'Home' });
    expect(tabs[0]!).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tabs[0]!);
  });
});
