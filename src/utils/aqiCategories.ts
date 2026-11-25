// VayuShield AQI Category Classification & Formatting

import type { AqiCategoryInfo, AqiCategoryKey } from '../types';

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
    actionSummary:
      'Unsafe for toddlers, elderly, and people with cough or asthma. Keep windows closed.',
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
    actionSummary:
      'Severe toxic catastrophe. Air penetrates deep into lung alveoli. Strict indoor quarantine.',
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
 * Computes how many times PM2.5 exceeds WHO 24h Clean Air Guideline (15 µg/m³).
 */
export function calculateWhoMultiplier(pm25: number): number {
  if (typeof pm25 !== 'number' || isNaN(pm25) || pm25 <= 0) {
    return 1;
  }
  const ratio = pm25 / WHO_PM25_24H_GUIDELINE;
  return Math.max(1, Math.round(ratio * 10) / 10);
}

/**
 * Converts 24h hour format (e.g. 14) to 12h clock string (e.g. '2 PM').
 */
export function formatHour12(hour: number): string {
  const h = hour % 24;
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}
