import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ShareCardModal } from '../ShareCardModal';
import { AIR_PRESETS } from '../../services/airQualityService';
import { DEMO_PLANS } from '../../data/demoPlans';
import { TRANSLATIONS } from '../../i18n';
import * as pdfService from '../../services/pdfService';
import type { HouseholdProfile } from '../../types';

const mockProfile: HouseholdProfile = {
  tags: ['toddler_kids', 'elderly'],
  customTagDetails: '',
  setup: {
    airPurifier: true,
    stoveType: 'gas',
    commuteMode: 'metro_bus',
  },
};

describe('components/ShareCardModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders null when isOpen is false', () => {
    const { container } = render(
      <ShareCardModal
        isOpen={false}
        onClose={vi.fn()}
        airData={AIR_PRESETS['delhi-severe']!}
        profile={mockProfile}
        plan={DEMO_PLANS['delhi-severe']!}
        completedHackIds={[]}
        completedSwapIds={[]}
        t={TRANSLATIONS.en}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal, switches format, copies text, and handles download', async () => {
    const onClose = vi.fn();
    const pdfSpy = vi.spyOn(pdfService, 'generateActionPlanPdf').mockResolvedValue();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <ShareCardModal
        isOpen={true}
        onClose={onClose}
        airData={AIR_PRESETS['delhi-severe']!}
        profile={mockProfile}
        plan={DEMO_PLANS['delhi-severe']!}
        completedHackIds={['hack-1']}
        completedSwapIds={['simmer-pot-aromatics']}
        t={TRANSLATIONS.en}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'share-card-title');
    expect(screen.getByText(TRANSLATIONS.en.shareCardBtn)).toBeInTheDocument();

    // Select plain text format
    fireEvent.click(screen.getByRole('button', { name: /Plain Text/i }));

    // Copy text (button label is "Copy Clean Text to Clipboard")
    const copyBtn = screen.getByRole('button', { name: /Copy Clean Text/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(String(writeText.mock.calls[0]?.[0]).length).toBeGreaterThan(0);

    // Select PDF format and trigger export
    fireEvent.click(screen.getByRole('button', { name: /PDF File/i }));

    const downloadBtn = screen.getByRole('button', { name: /download/i });
    await act(async () => {
      fireEvent.click(downloadBtn);
    });
    expect(pdfSpy).toHaveBeenCalledTimes(1);

    // Close button
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});