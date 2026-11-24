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

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

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

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(TRANSLATIONS.en.shareCardBtn)).toBeInTheDocument();

    // Select plain text format
    const textFormatBtn = screen.getByRole('button', { name: /Plain Text/i });
    fireEvent.click(textFormatBtn);

    // Copy text
    const copyBtn = screen.getByRole('button', { name: /Copy Clean Text/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Select PDF format and trigger export
    const pdfFormatBtn = screen.getByRole('button', { name: /PDF File/i });
    fireEvent.click(pdfFormatBtn);

    const downloadBtn = screen.getByRole('button', { name: /Download Clean PDF Document/i });
    await act(async () => {
      fireEvent.click(downloadBtn);
    });
    expect(pdfSpy).toHaveBeenCalled();

    // Close button
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
