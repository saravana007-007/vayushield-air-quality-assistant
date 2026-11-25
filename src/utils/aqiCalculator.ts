// VayuShield AQI Calculations & Scoring Engine (Public Barrel)

export {
  WHO_PM25_24H_GUIDELINE,
  AQI_CATEGORIES,
  getAqiCategory,
  calculateWhoMultiplier,
  formatHour12,
} from './aqiCategories';

export { calculateBestAirWindow, validateCityInput, validateAqi } from './aqiWindow';

export {
  type ScoreWeightsBreakdown,
  calculateProtectionScore,
  calculateCo2Saved,
  calculateExposureReduction,
} from './aqiScoring';
