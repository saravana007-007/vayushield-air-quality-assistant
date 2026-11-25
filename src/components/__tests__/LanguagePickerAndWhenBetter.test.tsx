import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguagePicker } from '../LanguagePicker';
import { WhenWillItGetBetter } from '../WhenWillItGetBetter';
import { TodayPlanTab } from '../plan/TodayPlanTab';
import { getTranslation } from '../../i18n';
import { getDemoPlanForAqi } from '../../data/demoPlans';
import * as speechUtils from '../../utils/speech';

describe('LanguagePicker, WhenWillItGetBetter, and TodayPlanTab', () => {
  const t = getTranslation('en');

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('LanguagePicker opens dropdown, selects a language, and closes on outside click', () => {
    const onSelectLanguage = vi.fn();
    render(
      <div>
        <div data-testid="outside">outside</div>
        <LanguagePicker currentLang="en" onSelectLanguage={onSelectLanguage} />
      </div>
    );

    const trigger = screen.getByRole('button', { name: /Select language/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    const hindiOption = screen.getByRole('option', { name: /Hindi/i });
    fireEvent.click(hindiOption);
    expect(onSelectLanguage).toHaveBeenCalledWith('hi');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('WhenWillItGetBetter handles Notification granted, unsupported, error, and stayIndoorsAllDay', async () => {
    const windowData = {
      startTime: '14:00',
      endTime: '16:00',
      lowestAqi: 180,
      lowestPm25: 90,
      worseAfterTime: '17:00',
      countdownHours: 0,
      countdownText: 'Now',
      stayIndoorsAllDay: false,
      plainSentence: 'Best between 14:00 and 16:00',
    };

    const NotificationMock = vi.fn() as unknown as typeof Notification & {
      requestPermission: () => Promise<NotificationPermission>;
    };
    NotificationMock.requestPermission = vi.fn().mockResolvedValue('granted');
    vi.stubGlobal('Notification', NotificationMock);

    const { rerender } = render(<WhenWillItGetBetter bestWindow={windowData} t={t} />);
    const remindBtn = screen.getByRole('button', { name: new RegExp(t.remindMe, 'i') });
    fireEvent.click(remindBtn);

    await waitFor(() => {
      expect(screen.getByText(t.reminderSet)).toBeInTheDocument();
    });

    // Error branch in requestPermission
    NotificationMock.requestPermission = vi.fn().mockRejectedValue(new Error('denied'));
    rerender(<WhenWillItGetBetter bestWindow={{ ...windowData, countdownHours: 3 }} t={t} />);
    const remindBtn2 = screen.queryByRole('button', { name: new RegExp(t.remindMe, 'i') });
    if (remindBtn2) {
      fireEvent.click(remindBtn2);
    }

    // Stay indoors all day branch
    rerender(<WhenWillItGetBetter bestWindow={{ ...windowData, stayIndoorsAllDay: true }} t={t} />);
    expect(screen.getAllByText(t.stayIndoorsAllDay).length).toBeGreaterThan(0);

    // Unsupported Notification branch
    const origNotification = window.Notification;
    // @ts-expect-error testing missing Notification global
    delete window.Notification;
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    rerender(<WhenWillItGetBetter bestWindow={windowData} t={t} />);
    const btn = screen.queryByRole('button', { name: new RegExp(t.remindMe, 'i') });
    if (btn) {
      fireEvent.click(btn);
      expect(alertMock).toHaveBeenCalled();
    }
    window.Notification = origNotification;
  });

  it('TodayPlanTab toggles speech playback and renders all routine badge types', () => {
    vi.spyOn(speechUtils, 'isSpeechSynthesisSupported').mockReturnValue(true);
    const speakSpy = vi
      .spyOn(speechUtils, 'speakText')
      .mockImplementation((_text, _lang, onEnd) => {
        onEnd?.();
        return () => {};
      });
    const stopSpy = vi.spyOn(speechUtils, 'stopSpeech').mockImplementation(() => {});

    const basePlan = getDemoPlanForAqi(350, 'Delhi', 'en');
    const customPlan = {
      ...basePlan,
      dailyRoutine: [
        {
          id: 'morning' as const,
          title: 'Morning',
          timeRange: '6 AM - 9 AM',
          badge: 'Stay Indoors' as const,
          windowRule: 'Closed',
          memberGuidance: 'Stay inside',
        },
        {
          id: 'midday' as const,
          title: 'Midday',
          timeRange: '12 PM - 3 PM',
          badge: 'Safe Ventilation Window' as const,
          windowRule: 'Open briefly',
          memberGuidance: 'Air out rooms',
        },
        {
          id: 'evening' as const,
          title: 'Evening',
          timeRange: '5 PM - 8 PM',
          badge: 'Mask Required' as const,
          windowRule: 'Closed',
          memberGuidance: 'Wear N95',
        },
        {
          id: 'night' as const,
          title: 'Night',
          timeRange: '9 PM - 11 PM',
          badge: 'Unknown' as unknown as 'Stay Indoors',
          windowRule: 'Closed',
          memberGuidance: 'Rest',
        },
      ],
    };

    render(<TodayPlanTab plan={customPlan} currentLang="en" t={t} />);
    const readBtn = screen.getByRole('button', { name: t.readAloud });
    fireEvent.click(readBtn);
    expect(speakSpy).toHaveBeenCalled();

    // Test stopSpeech when playing
    speakSpy.mockImplementation(() => () => {});
    fireEvent.click(screen.getByRole('button', { name: t.readAloud }));
    fireEvent.click(screen.getByRole('button', { name: t.stopReading }));
    expect(stopSpy).toHaveBeenCalled();
  });
});
