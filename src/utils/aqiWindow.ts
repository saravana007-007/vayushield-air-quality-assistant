// VayuShield Best Air Window & Input Validation Engine

import type { BestAirWindow, HourlyAqiPoint } from '../types';
import { formatHour12 } from './aqiCategories';

/**
 * "When Will It Get Better" Engine (Computed in code, NOT by AI).
 * Calculates the best (lowest-PM2.5) window from hourly forecast.
 */
export function calculateBestAirWindow(
  hourly: HourlyAqiPoint[],
  currentHour: number = new Date().getHours()
): BestAirWindow {
  if (!Array.isArray(hourly) || hourly.length === 0) {
    return {
      startTime: '12:00 PM',
      endTime: '3:00 PM',
      lowestAqi: 150,
      lowestPm25: 60,
      worseAfterTime: '5:00 PM',
      countdownHours: 0,
      countdownText: 'Best window at midday',
      stayIndoorsAllDay: false,
      plainSentence: 'Best time to go out: 12 PM to 3 PM. Air gets worse again after 5 PM.',
    };
  }

  const firstPoint = hourly[0];
  if (!firstPoint) {
    return {
      startTime: '12:00 PM',
      endTime: '3:00 PM',
      lowestAqi: 150,
      lowestPm25: 60,
      worseAfterTime: '5:00 PM',
      countdownHours: 0,
      countdownText: 'Best window at midday',
      stayIndoorsAllDay: false,
      plainSentence: 'Best time to go out: 12 PM to 3 PM. Air gets worse again after 5 PM.',
    };
  }

  let minAqiPoint: HourlyAqiPoint = firstPoint;
  for (const point of hourly) {
    if (point.aqi < minAqiPoint.aqi) {
      minAqiPoint = point;
    }
  }

  const isAllDaySevere = minAqiPoint.aqi >= 280;

  if (isAllDaySevere) {
    return {
      startTime: formatHour12(minAqiPoint.hour),
      endTime: formatHour12(minAqiPoint.hour + 2),
      lowestAqi: minAqiPoint.aqi,
      lowestPm25: minAqiPoint.pm2_5,
      countdownHours: 0,
      countdownText: 'No clean window today',
      stayIndoorsAllDay: true,
      plainSentence: 'Stay indoors all day. Smog will not clear today.',
    };
  }

  const bestHour = minAqiPoint.hour;
  const startHour = Math.max(0, bestHour - 1);
  const endHour = Math.min(23, bestHour + 2);
  const startTime = formatHour12(startHour);
  const endTime = formatHour12(endHour);

  const worseAfterHour = Math.min(22, Math.max(17, endHour + 1));
  const worseAfterTime = formatHour12(worseAfterHour);

  let countdownHours = 0;
  let countdownText = '';

  if (currentHour >= startHour && currentHour <= endHour) {
    countdownHours = 0;
    countdownText = 'Happening right now!';
  } else if (currentHour < startHour) {
    countdownHours = startHour - currentHour;
    countdownText = `Air improves in ${countdownHours} hour${countdownHours > 1 ? 's' : ''}`;
  } else {
    countdownHours = 24 - currentHour + startHour;
    countdownText = `Next safe window tomorrow at ${startTime}`;
  }

  const plainSentence = `Best time to go out: ${startTime} to ${endTime}. Air gets worse again after ${worseAfterTime}.`;

  return {
    startTime,
    endTime,
    lowestAqi: minAqiPoint.aqi,
    lowestPm25: minAqiPoint.pm2_5,
    worseAfterTime,
    countdownHours,
    countdownText,
    stayIndoorsAllDay: false,
    plainSentence,
  };
}

/**
 * Input validation for City string.
 */
export function validateCityInput(city: unknown): { isValid: boolean; sanitized: string; error?: string } {
  if (typeof city !== 'string') {
    return { isValid: false, sanitized: '', error: 'City name must be a text string.' };
  }

  const trimmed = city.trim();
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'City name cannot be empty.' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, sanitized: trimmed, error: 'City name must be at least 2 characters long.' };
  }

  if (trimmed.length > 80) {
    return { isValid: false, sanitized: trimmed.substring(0, 80), error: 'City name cannot exceed 80 characters.' };
  }

  const sanitized = trimmed.replace(/[<>'"`;/\\]/g, '').trim();
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'City name contains invalid characters.' };
  }

  return { isValid: true, sanitized };
}

/**
 * Input validation for AQI numbers.
 */
export function validateAqi(aqi: unknown): { isValid: boolean; aqi: number; error?: string } {
  if (typeof aqi !== 'number' || isNaN(aqi)) {
    return { isValid: false, aqi: 0, error: 'AQI must be a valid number.' };
  }

  if (aqi < 0) {
    return { isValid: false, aqi: 0, error: 'AQI cannot be negative.' };
  }

  if (aqi > 1000) {
    return { isValid: false, aqi: 1000, error: 'AQI value exceeds maximum plausible index (1000).' };
  }

  return { isValid: true, aqi: Math.round(aqi) };
}
