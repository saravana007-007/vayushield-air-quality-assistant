import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AskVayuDrawer } from '../AskVayuDrawer';
import { AIR_PRESETS } from '../../services/airQualityService';
import { DEMO_PLANS } from '../../data/demoPlans';
import { TRANSLATIONS } from '../../i18n';
import * as geminiService from '../../services/geminiService';
import * as speechUtils from '../../utils/speech';
import type { HouseholdProfile } from '../../types';

const mockProfile: HouseholdProfile = {
  tags: ['toddler_kids'],
  customTagDetails: '',
  setup: {
    airPurifier: true,
    stoveType: 'gas',
    commuteMode: 'metro_bus',
  },
};

describe('components/AskVayuDrawer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders null when isOpen is false', () => {
    const { container } = render(
      <AskVayuDrawer
        isOpen={false}
        onClose={vi.fn()}
        airData={AIR_PRESETS['delhi-severe']!}
        profile={mockProfile}
        plan={DEMO_PLANS['delhi-severe']!}
        currentLang="en"
        t={TRANSLATIONS.en}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders drawer, sends question, and displays answer', async () => {
    vi.spyOn(geminiService, 'askVayu').mockResolvedValueOnce(
      'No, keep children strictly indoors during peak smog hours.'
    );

    render(
      <AskVayuDrawer
        isOpen={true}
        onClose={vi.fn()}
        airData={AIR_PRESETS['delhi-severe']!}
        profile={mockProfile}
        plan={DEMO_PLANS['delhi-severe']!}
        currentLang="en"
        t={TRANSLATIONS.en}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Ask Vayu/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(TRANSLATIONS.en.askPlaceholder);
    fireEvent.change(input, { target: { value: 'Can we play outside?' } });

    const sendBtn = screen.getByRole('button', { name: /send/i });
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    expect(geminiService.askVayu).toHaveBeenCalled();
    expect(
      await screen.findByText('No, keep children strictly indoors during peak smog hours.')
    ).toBeInTheDocument();
  });

  it('clicks quick question chip to trigger answer', async () => {
    vi.spyOn(geminiService, 'askVayu').mockResolvedValueOnce('No, cloth masks do not filter PM2.5.');

    render(
      <AskVayuDrawer
        isOpen={true}
        onClose={vi.fn()}
        airData={AIR_PRESETS['delhi-severe']!}
        profile={mockProfile}
        plan={DEMO_PLANS['delhi-severe']!}
        currentLang="en"
        t={TRANSLATIONS.en}
      />
    );

    const chip = screen.getByRole('button', {
      name: /Is a double cloth mask enough for my walk\?/i,
    });

    await act(async () => {
      fireEvent.click(chip);
    });

    expect(geminiService.askVayu).toHaveBeenCalled();
    expect(await screen.findByText('No, cloth masks do not filter PM2.5.')).toBeInTheDocument();
  });

  it('triggers voice recognition when microphone button is clicked', () => {
    const mockStop = vi.fn();
    vi.spyOn(speechUtils, 'isSpeechRecognitionSupported').mockReturnValue(true);
    vi.spyOn(speechUtils, 'startVoiceRecognition').mockReturnValue(mockStop);

    render(
      <AskVayuDrawer
        isOpen={true}
        onClose={vi.fn()}
        airData={AIR_PRESETS['delhi-severe']!}
        profile={mockProfile}
        plan={DEMO_PLANS['delhi-severe']!}
        currentLang="en"
        t={TRANSLATIONS.en}
      />
    );

    const micBtn = screen.getByTitle('Click to speak');
    fireEvent.click(micBtn);

    expect(speechUtils.startVoiceRecognition).toHaveBeenCalled();
  });

  it('closes on Escape key press or close button click', () => {
    const onClose = vi.fn();
    render(
      <AskVayuDrawer
        isOpen={true}
        onClose={onClose}
        airData={AIR_PRESETS['delhi-severe']!}
        profile={mockProfile}
        plan={DEMO_PLANS['delhi-severe']!}
        currentLang="en"
        t={TRANSLATIONS.en}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    // Trigger Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
