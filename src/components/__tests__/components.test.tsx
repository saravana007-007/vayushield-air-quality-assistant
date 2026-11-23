import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OneThingToDo } from '../OneThingToDo';
import { DosAndDonts } from '../DosAndDonts';
import { ScoreHelpModal } from '../ScoreHelpModal';
import { getTranslation } from '../../i18n';

const t = getTranslation('en');

describe('components/OneThingToDo', () => {
  it('renders critical one thing message', () => {
    render(<OneThingToDo oneThing="Seal balcony doors immediately" t={t} />);
    expect(screen.getByText(/"Seal balcony doors immediately"/)).toBeDefined();
    expect(screen.getByText(t.oneThingTitle)).toBeDefined();
  });

  it('renders nothing when oneThing is empty', () => {
    const { container } = render(<OneThingToDo oneThing="" t={t} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('components/DosAndDonts', () => {
  it('renders list of dos and donts correctly', () => {
    const dos = ['Wear N95', 'Drink warm water', 'Run purifier'];
    const donts = ['No morning walk', 'No incense', 'No burning trash'];

    render(<DosAndDonts dos={dos} donts={donts} t={t} />);
    expect(screen.getByText('Wear N95')).toBeDefined();
    expect(screen.getByText('No incense')).toBeDefined();
    expect(screen.getByText(t.dosTitle)).toBeDefined();
    expect(screen.getByText(t.dontsTitle)).toBeDefined();
  });
});

describe('components/ScoreHelpModal', () => {
  it('renders modal when open and handles close action', () => {
    const handleClose = vi.fn();
    render(<ScoreHelpModal isOpen={true} onClose={handleClose} />);
    expect(screen.getByText('How the Protection Score is Calculated')).toBeDefined();

    const closeBtn = screen.getByLabelText('Close calculation explanation');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<ScoreHelpModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
