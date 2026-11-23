// VayuShield Safe Storage Utility
// Provides type-safe, error-handled localStorage interactions

import { logger } from './logger';
import { getErrorMessage } from './errors';

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    logger.warn(`Failed to read storage key "${key}":`, getErrorMessage(err));
    return defaultValue;
  }
}

export function getStorageString(key: string, defaultValue: string): string {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    const raw = window.localStorage.getItem(key);
    return raw !== null ? raw : defaultValue;
  } catch (err: unknown) {
    logger.warn(`Failed to read storage string "${key}":`, getErrorMessage(err));
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (err: unknown) {
    logger.warn(`Failed to write storage key "${key}":`, getErrorMessage(err));
    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.removeItem(key);
    return true;
  } catch (err: unknown) {
    logger.warn(`Failed to remove storage key "${key}":`, getErrorMessage(err));
    return false;
  }
}
