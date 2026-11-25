import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App full flows: tabs, modals, text size, language, and setup', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('switches across all tabs, opens and closes modals, and submits family setup', async () => {
    render(<App />);

    // Switch to Hacks tab
    const hacksTab = screen.getByRole('tab', { name: /Hacks & Swaps/i });
    fireEvent.click(hacksTab);
    expect(hacksTab).toHaveAttribute('aria-selected', 'true');

    // Open ScoreHelpModal from ActionTracker in Hacks tab
    const helpBtn = screen.getByRole('button', { name: /How is this calculated/i });
    fireEvent.click(helpBtn);
    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    fireEvent.click(screen.getByRole('button', { name: /Close calculation explanation/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Open ShareCardModal from Hacks tab (index 1 is in Hacks tab, index 0 is in Header)
    const shareBtns = screen.getAllByRole('button', { name: /^Share$/i });
    fireEvent.click(shareBtns[1] ?? shareBtns[0]!);
    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Switch to Safety tab
    const safetyTab = screen.getByRole('tab', { name: /Masks & Health/i });
    fireEvent.click(safetyTab);
    expect(safetyTab).toHaveAttribute('aria-selected', 'true');

    // Switch back to Plan tab and click Edit Family Setup
    const planTab = screen.getByRole('tab', { name: /Today's Plan/i });
    fireEvent.click(planTab);
    const editSetupBtn = screen.getByRole('button', { name: /Edit Family Setup/i });
    fireEvent.click(editSetupBtn);

    const setupTab = screen.getByRole('tab', { name: /Family & Setup/i });
    expect(setupTab).toHaveAttribute('aria-selected', 'true');

    // Submit Family Setup form -> switches back to Plan tab
    const submitBtn = screen.getByRole('button', { name: /Generate Updated Family Plan/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Today's Plan/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    // Open AskVayuDrawer
    const askBtns = screen.getAllByRole('button', { name: /Ask Vayu/i });
    fireEvent.click(askBtns[0]!);
    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  }, 15000);

  it('changes text size and language in Header', () => {
    render(<App />);

    const textSizeSelect = screen.getByLabelText(/Choose text size/i) as HTMLSelectElement;
    fireEvent.change(textSizeSelect, { target: { value: 'large' } });
    expect(textSizeSelect.value).toBe('large');

    const langTrigger = screen.getByRole('button', { name: /Select language/i });
    fireEvent.click(langTrigger);
    const urduOption = screen.getByRole('option', { name: /Urdu/i });
    fireEvent.click(urduOption);
    expect(document.documentElement.dir).toBe('rtl');

    // Home and End keyboard navigation on tablist
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(screen.getByRole('tab', { name: /Masks & Health/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(screen.getByRole('tab', { name: /Today's Plan/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });
});
