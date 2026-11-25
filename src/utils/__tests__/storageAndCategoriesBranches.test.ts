import { describe, it, expect, vi, afterEach } from 'vitest';
import { getStorageItem, getStorageString, removeStorageItem, setStorageItem } from '../storage';
import {
  AQI_CATEGORIES,
  calculateWhoMultiplier,
  formatHour12,
  getAqiCategory,
} from '../aqiCategories';

describe('utils/storage when window is unavailable', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns safe fallbacks instead of touching localStorage', () => {
    vi.stubGlobal('window', undefined);

    expect(getStorageItem('any_key', { fallback: true })).toEqual({ fallback: true });
    expect(getStorageString('any_key', 'fallback')).toBe('fallback');
    expect(setStorageItem('any_key', 'value')).toBe(false);
    expect(removeStorageItem('any_key')).toBe(false);
  });

  it('uses defaults for keys that were never stored', () => {
    expect(getStorageItem('never-stored', 42)).toBe(42);
    expect(getStorageString('never-stored', 'default')).toBe('default');
  });
});

describe('utils/aqiCategories invalid inputs and clock boundaries', () => {
  it('classifies NaN as Moderate and clamps non-positive PM2.5 multipliers', () => {
    expect(getAqiCategory(Number.NaN)).toEqual(AQI_CATEGORIES.moderate);
    expect(calculateWhoMultiplier(Number.NaN)).toBe(1);
    expect(calculateWhoMultiplier(0)).toBe(1);
    expect(calculateWhoMultiplier(-5)).toBe(1);
  });

  it('formats midnight as 12 AM', () => {
    expect(formatHour12(0)).toBe('12 AM');
    expect(formatHour12(24)).toBe('12 AM');
  });
});
