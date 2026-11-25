// VayuShield Household Protection Scoring & Exposure Recommendations

import type { HouseholdProfile } from '../types';
import { getSwapById } from '../data/swapCatalog';

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
 * Computes Family Smog Protection Score (0 - 100%).
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

  const hackFactor = totalHacksCount > 0 ? completedHackIds.length / totalHacksCount : 0;
  const hacksScore = Math.round(Math.min(1, Math.max(0, hackFactor)) * 30);

  const swapFactor = totalSwapsCount > 0 ? completedSwapIds.length / totalSwapsCount : 0;
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
 * Computes Daily CO2 Saved (in kg) based on active swaps.
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
 * Estimates exposure reduction in percentage based on protection score and ambient AQI.
 */
export function calculateExposureReduction(
  protectionScore: number,
  ambientAqi: number
): {
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
    personalExposureNotes =
      'Optimal protection: Indoor air is effectively isolated from severe outdoor smog.';
  } else if (reductionPercentage >= 60) {
    personalExposureNotes =
      'Moderate protection: Good baseline; complete checklist swaps to seal leaks.';
  } else {
    personalExposureNotes =
      'Elevated exposure risk: Significant outdoor particulate infiltrating indoor zones.';
  }

  return {
    estimatedIndoorAqi,
    reductionPercentage,
    personalExposureNotes,
  };
}
