import React, { useState } from 'react';
import type { BestAirWindow } from '../types';
import type { UiTranslations } from '../i18n';
import { Sun, Clock, Bell, BellCheck, AlertTriangle } from 'lucide-react';
import { logger } from '../utils/logger';

interface WhenWillItGetBetterProps {
  bestWindow: BestAirWindow;
  t: UiTranslations;
}

export const WhenWillItGetBetter: React.FC<WhenWillItGetBetterProps> = ({ bestWindow, t }) => {
  const [reminderSet, setReminderSet] = useState(false);

  const handleSetReminder = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported on this device.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setReminderSet(true);
        if (bestWindow.countdownHours <= 1) {
          const notification = new Notification('VayuShield Safe Window Alert', {
            body: `Now is the safest time to go out or aerate: ${bestWindow.startTime} to ${bestWindow.endTime}.`,
            icon: '/favicon.svg',
          });
          void notification;
        }
      }
    } catch (e: unknown) {
      logger.warn('Notification permission error:', e);
    }
  };

  // Localized sentence
  const localizedSentence = bestWindow.stayIndoorsAllDay
    ? t.stayIndoorsAllDay
    : t.bestTimeSentence
      ? t.bestTimeSentence(
          bestWindow.startTime,
          bestWindow.endTime,
          bestWindow.worseAfterTime || '5 PM'
        )
      : bestWindow.plainSentence;

  // Localized countdown
  let localizedCountdown = bestWindow.countdownText;
  if (bestWindow.countdownHours === 0 && !bestWindow.stayIndoorsAllDay) {
    localizedCountdown = t.happeningNow || 'Happening right now!';
  } else if (bestWindow.stayIndoorsAllDay) {
    localizedCountdown = t.stayIndoorsAllDay;
  }

  return (
    <article
      aria-labelledby="when-better-title"
      className={`rounded-3xl border p-5 sm:p-6 shadow-sm transition-all ${
        bestWindow.stayIndoorsAllDay
          ? 'bg-rose-50/70 border-rose-200 text-rose-950'
          : 'bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border-emerald-200 text-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Timing Message */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2">
            {bestWindow.stayIndoorsAllDay ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
            )}
            <h3
              id="when-better-title"
              className="text-base sm:text-lg font-bold font-display text-slate-900"
            >
              {t.bestTimeTitle}
            </h3>
          </div>

          <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>{localizedSentence}</span>
          </div>

          {/* Countdown indicator */}
          <div className="flex items-center space-x-2 text-xs font-semibold pt-0.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" aria-hidden="true" />
              <span>{localizedCountdown}</span>
            </span>

            {!bestWindow.stayIndoorsAllDay && (
              <span className="text-[11px] text-slate-500 font-normal">
                Lowest AQI expected: ~{bestWindow.lowestAqi}
              </span>
            )}
          </div>
        </div>

        {/* Right: 1-Click Reminder Notification */}
        {!bestWindow.stayIndoorsAllDay && (
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleSetReminder}
              disabled={reminderSet}
              className={`inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs focus:ring-2 focus:ring-sky-500 ${
                reminderSet
                  ? 'bg-emerald-700 text-white cursor-default'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
              }`}
            >
              {reminderSet ? (
                <>
                  <BellCheck className="w-4 h-4 mr-1.5" />
                  {t.reminderSet}
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-1.5" />
                  {t.remindMe}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
