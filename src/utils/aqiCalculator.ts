// VayuShield AQI Calculations & Scoring Engine
// Features: Boundary Classifications, WHO Guideline Multiplier,
// Inversion "When Will It Get Better" Algorithm, and Transparent Scoring

import type { AqiCategoryInfo, AqiCategoryKey, BestAirWindow, HourlyAqiPoint, HouseholdProfile } from '../types';
import { getSwapById } from '../data/swapCatalog';

export const WHO_PM25_24H_GUIDELINE = 15; // µg/m³

export const AQI_CATEGORIES: Record<AqiCategoryKey, AqiCategoryInfo> = {
  good: {
    key: 'good',
    label: 'Good',
    range: '0 – 50',
    min: 0,
    max: 50,
    emoji: '😊',
    trafficStatus: 'safe',
    trafficEmoji: '🟢',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    bgLightClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
    actionSummary: 'Air is clean and fresh. Perfect for open windows and outdoor play.',
    maskRecommendation: 'No mask required.',
  },
  moderate: {
    key: 'moderate',
    label: 'Moderate',
    range: '51 – 100',
    min: 51,
    max: 100,
    emoji: '😐',
    trafficStatus: 'safe',
    trafficEmoji: '🟢',
    colorClass: 'text-lime-700 bg-lime-50 border-lime-300',
    bgLightClass: 'bg-lime-50',
    borderClass: 'border-lime-200',
    textClass: 'text-lime-800',
    actionSummary: 'Air is acceptable. Extremely sensitive individuals may notice mild dryness.',
    maskRecommendation: 'Sensitive persons may keep a mask handy.',
  },
  unhealthy_sensitive: {
    key: 'unhealthy_sensitive',
    label: 'Unhealthy for Sensitive Groups',
    range: '101 – 150',
    min: 101,
    max: 150,
    emoji: '😷',
    trafficStatus: 'warning',
    trafficEmoji: '🟡',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-300',
    bgLightClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    actionSummary: 'Unsafe for toddlers, elderly, and people with cough or asthma. Keep windows closed.',
    maskRecommendation: 'N95 respirator advised for outdoor activities for vulnerable members.',
  },
  unhealthy: {
    key: 'unhealthy',
    label: 'Unhealthy',
    range: '151 – 200',
    min: 151,
    max: 200,
    emoji: '🤢',
    trafficStatus: 'danger',
    trafficEmoji: '🔴',
    colorClass: 'text-orange-700 bg-orange-50 border-orange-300',
    bgLightClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
    textClass: 'text-orange-800',
    actionSummary: 'Hazardous air for everyone. Outdoor exercise causes lung irritation.',
    maskRecommendation: 'N95 or FFP2 respirator required for any outdoor departure.',
  },
  very_unhealthy: {
    key: 'very_unhealthy',
    label: 'Very Unhealthy',
    range: '201 – 300',
    min: 201,
    max: 300,
    emoji: '🚨',
    trafficStatus: 'danger',
    trafficEmoji: '🔴',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-300',
    bgLightClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    actionSummary: 'Emergency alert: Toxic smog outside. Stay indoors and seal door gaps.',
    maskRecommendation: 'Tight N95/FFP2 required; cloth masks fail completely.',
  },
  hazardous: {
    key: 'hazardous',
    label: 'Hazardous / Severe Smog',
    range: '301+',
    min: 301,
    max: 1000,
    emoji: '☠️',
    trafficStatus: 'danger',
    trafficEmoji: '🔴',
    colorClass: 'text-purple-900 bg-purple-50 border-purple-300',
    bgLightClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-950',
    actionSummary: 'Severe toxic catastrophe. Air penetrates deep into lung alveoli. Strict indoor quarantine.',
    maskRecommendation: 'Strict N95/FFP2 with unbroken seal. Avoid opening doors.',
  },
};

/**
 * Classify AQI into standard categories with exact boundary conditions.
 */
export function getAqiCategory(aqi: number): AqiCategoryInfo {
  if (typeof aqi !== 'number' || isNaN(aqi)) {
    return AQI_CATEGORIES.moderate;
  }
  
  if (aqi <= 50) return AQI_CATEGORIES.good;
  if (aqi <= 100) return AQI_CATEGORIES.moderate;
  if (aqi <= 150) return AQI_CATEGORIES.unhealthy_sensitive;
  if (aqi <= 200) return AQI_CATEGORIES.unhealthy;
  if (aqi <= 300) return AQI_CATEGORIES.very_unhealthy;
  return AQI_CATEGORIES.hazardous;
}

/**
 * Computes how many times PM2.5 exceeds WHO 24h Clean Air Guideline (15 µg/m³)
 */
export function calculateWhoMultiplier(pm25: number): number {
  if (typeof pm25 !== 'number' || isNaN(pm25) || pm25 <= 0) {
    return 1;
  }
  const ratio = pm25 / WHO_PM25_24H_GUIDELINE;
  return Math.max(1, Math.round(ratio * 10) / 10);
}

/**
 * Converts 24h hour format (e.g. 14) to 12h clock string (e.g. '2 PM')
 */
export function formatHour12(hour: number): string {
  const h = hour % 24;
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

/**
 * "When Will It Get Better" Engine (Computed in code, NOT by AI)
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

  // Find minimum AQI / PM2.5 in hourly series
  let minAqiPoint: HourlyAqiPoint = firstPoint;
  for (const point of hourly) {
    if (point.aqi < minAqiPoint.aqi) {
      minAqiPoint = point;
    }
  }

  // Check if air NEVER improves to a safe or reasonably bearable level (e.g. lowest AQI is still >= 280)
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

  // Find optimal consecutive window around the lowest point (typically 2-3 hours)
  const bestHour = minAqiPoint.hour;
  const startHour = Math.max(0, bestHour - 1);
  const endHour = Math.min(23, bestHour + 2);
  const startTime = formatHour12(startHour);
  const endTime = formatHour12(endHour);

  // Worse after time (usually when dusk inversion settles, e.g. 5 PM or hour after endHour)
  const worseAfterHour = Math.min(22, Math.max(17, endHour + 1));
  const worseAfterTime = formatHour12(worseAfterHour);

  // Countdown calculation
  let countdownHours = 0;
  let countdownText = '';

  if (currentHour >= startHour && currentHour <= endHour) {
    countdownHours = 0;
    countdownText = 'Happening right now!';
  } else if (currentHour < startHour) {
    countdownHours = startHour - currentHour;
    countdownText = `Air improves in ${countdownHours} hour${countdownHours > 1 ? 's' : ''}`;
  } else {
    // Already past today's best window
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
 * Input validation for City string
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
  
  // Strip control chars or unsafe tags
  const sanitized = trimmed.replace(/[<>'"`;/\\]/g, '').trim();
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'City name contains invalid characters.' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Input validation for AQI numbers
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

export interface ScoreWeightsBreakdown {
  baseline: number;
  purifierBonus: number;
  setupBonus: number;
  hacksScore: number;
  swapsScore: number;
  total: number;
  completedHacksCount: number;
  totalHacksCount: number;
  completedSwapsCount: number;
  totalSwapsCount: number;
}

/**
 * Computes Family Smog Protection Score (0 - 100%)
 */
export function calculateProtectionScore(
  profile: HouseholdProfile,
  completedHackIds: string[],
  totalHacksCount: number = 4,
  completedSwapIds: string[],
  totalSwapsCount: number = 4
): ScoreWeightsBreakdown {
  const baseline = 20;
  const purifierBonus = profile.setup.airPurifier ? 15 : 0;
  const setupBonus = profile.setup.stoveType !== 'gas' ? 5 : 0;
  
  const hackFactor = totalHacksCount > 0 ? (completedHackIds.length / totalHacksCount) : 0;
  const hacksScore = Math.round(Math.min(1, Math.max(0, hackFactor)) * 30);
  
  const swapFactor = totalSwapsCount > 0 ? (completedSwapIds.length / totalSwapsCount) : 0;
  const swapsScore = Math.round(Math.min(1, Math.max(0, swapFactor)) * 30);
  
  const total = Math.min(100, baseline + purifierBonus + setupBonus + hacksScore + swapsScore);
  
  return {
    baseline,
    purifierBonus,
    setupBonus,
    hacksScore,
    swapsScore,
    total,
    completedHacksCount: completedHackIds.length,
    totalHacksCount,
    completedSwapsCount: completedSwapIds.length,
    totalSwapsCount,
  };
}

/**
 * Computes Daily CO2 Saved (in kg) based on active swaps
 */
export function calculateCo2Saved(completedSwapIds: string[]): number {
  if (!Array.isArray(completedSwapIds) || completedSwapIds.length === 0) {
    return 0;
  }
  
  const totalKg = completedSwapIds.reduce((sum, id) => {
    const item = getSwapById(id);
    return sum + (item ? item.co2SavedKg : 0);
  }, 0);
  
  return Math.round(totalKg * 10) / 10;
}

/**
 * Estimates exposure reduction in percentage based on protection score and ambient AQI
 */
export function calculateExposureReduction(protectionScore: number, ambientAqi: number): {
  estimatedIndoorAqi: number;
  reductionPercentage: number;
  personalExposureNotes: string;
} {
  const clampedScore = Math.max(10, Math.min(100, protectionScore));
  const efficiency = 0.35 + (clampedScore / 100) * 0.55;
  
  const estimatedIndoorAqi = Math.max(10, Math.round(ambientAqi * (1 - efficiency)));
  const reductionPercentage = Math.round(efficiency * 100);
  
  let personalExposureNotes = '';
  if (reductionPercentage >= 80) {
    personalExposureNotes = 'Optimal protection: Indoor air is effectively isolated from severe outdoor smog.';
  } else if (reductionPercentage >= 60) {
    personalExposureNotes = 'Moderate protection: Good baseline; complete checklist swaps to seal leaks.';
  } else {
    personalExposureNotes = 'Elevated exposure risk: Significant outdoor particulate infiltrating indoor zones.';
  }
  
  return {
    estimatedIndoorAqi,
    reductionPercentage,
    personalExposureNotes,
  };
}
