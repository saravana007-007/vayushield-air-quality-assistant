import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';
import { TRANSLATIONS } from '../i18n';

describe('Integration Flow: City Selection to Plan Rendering', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial Delhi plan, allows switching city to Mumbai, and updates action plan view', async () => {
    render(<App />);

    // Initial load displays Delhi
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('VayuShield');
    expect(screen.getAllByText(/Delhi/i).length).toBeGreaterThan(0);

    // Verify Action Plan tab is active with Hero Action
    expect(screen.getByRole('tab', { name: /today's plan/i })).toBeInTheDocument();
    expect(screen.getByText(/morning smog peak/i)).toBeInTheDocument();

    // Select Lahore preset scenario
    const lahoreBtn = screen.getByRole('button', { name: /lahore/i });
    fireEvent.click(lahoreBtn);

    // Verify view updates to Lahore
    await waitFor(() => {
      expect(screen.getAllByText(/Lahore/i).length).toBeGreaterThan(0);
    });

    // Switch to Hacks & Swaps tab
    const hacksTab = screen.getByRole('tab', { name: /hacks & swaps/i });
    fireEvent.click(hacksTab);

    expect(await screen.findByText(TRANSLATIONS.en.indoorHacksTitle)).toBeInTheDocument();
    expect(screen.getByText(TRANSLATIONS.en.trackerTitle)).toBeInTheDocument();

    // Switch to Family & Setup tab
    const setupTab = screen.getByRole('tab', { name: /family & setup/i });
    fireEvent.click(setupTab);

    expect(await screen.findByText(TRANSLATIONS.en.profileTitle)).toBeInTheDocument();
  });

  it('allows navigating tabs using keyboard ArrowRight and ArrowLeft', async () => {
    render(<App />);

    const planTab = screen.getByRole('tab', { name: /today's plan/i });
    planTab.focus();

    // Press ArrowRight to navigate to Hacks tab
    fireEvent.keyDown(planTab, { key: 'ArrowRight' });
    const hacksTab = screen.getByRole('tab', { name: /hacks & swaps/i });
    expect(hacksTab).toHaveAttribute('aria-selected', 'true');

    // Press ArrowLeft to navigate back to Plan tab
    fireEvent.keyDown(hacksTab, { key: 'ArrowLeft' });
    expect(planTab).toHaveAttribute('aria-selected', 'true');
  });
});
