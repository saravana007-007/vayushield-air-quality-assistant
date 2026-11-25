// VayuShield LocalStorage Action Plan Cache

import type { ActionPlan, AirQualityData } from '../types';
import { STORAGE_KEYS } from '../config';
import { getStorageItem, setStorageItem } from '../utils/storage';

export interface CachedPlanData {
  plan: ActionPlan;
  airData: AirQualityData;
  timestamp: string;
}

/**
 * Persist the latest generated ActionPlan and AirQualityData to LocalStorage.
 */
export function saveCachedPlan(plan: ActionPlan, airData: AirQualityData): void {
  const data: CachedPlanData = {
    plan,
    airData,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  setStorageItem(STORAGE_KEYS.cachedPlan, data);
}

/**
 * Retrieve the cached ActionPlan and AirQualityData from LocalStorage, if present.
 */
export function getCachedPlan(): CachedPlanData | null {
  return getStorageItem<CachedPlanData | null>(STORAGE_KEYS.cachedPlan, null);
}
