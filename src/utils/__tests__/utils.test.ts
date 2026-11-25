import { describe, it, expect, vi } from 'vitest';
import { getErrorMessage } from '../errors';
import { logger } from '../logger';
import { getStorageItem, setStorageItem, removeStorageItem, getStorageString } from '../storage';

describe('utils/errors', () => {
  it('extracts message from standard Error instance', () => {
    const err = new Error('Test failure');
    expect(getErrorMessage(err)).toBe('Test failure');
  });

  it('handles string errors directly', () => {
    expect(getErrorMessage('Raw string error')).toBe('Raw string error');
  });

  it('extracts message from error-like objects', () => {
    expect(getErrorMessage({ message: 'Custom message' })).toBe('Custom message');
  });

  it('falls back to default message for null or unknown types', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
    expect(getErrorMessage(12345)).toBe('An unexpected error occurred');
  });
});

describe('utils/logger', () => {
  it('logs info, warn, and error without throwing', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logger.info('Info message', { test: true });
    logger.warn('Warn message');
    logger.error('Error message');

    expect(infoSpy).toHaveBeenCalledWith('[VayuShield] Info message', { test: true });
    expect(warnSpy).toHaveBeenCalledWith('[VayuShield] Warn message');
    expect(errorSpy).toHaveBeenCalledWith('[VayuShield] Error message');

    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe('utils/storage', () => {
  it('stores and retrieves JSON items successfully', () => {
    const data = { aqi: 150, city: 'Delhi' };
    setStorageItem('test_key', data);
    const result = getStorageItem('test_key', null);
    expect(result).toEqual(data);
  });

  it('falls back to defaultValue when key does not exist', () => {
    const result = getStorageItem('non_existent', { fallback: true });
    expect(result).toEqual({ fallback: true });
  });

  it('falls back safely when storage holds invalid JSON', () => {
    localStorage.setItem('corrupted_json', '{not-valid-json');
    const result = getStorageItem('corrupted_json', { safe: true });
    expect(result).toEqual({ safe: true });
  });

  it('removes item from storage', () => {
    localStorage.setItem('to_delete', 'value');
    removeStorageItem('to_delete');
    expect(localStorage.getItem('to_delete')).toBeNull();
  });

  it('handles getStorageString with existing value and fallback', () => {
    expect(getStorageString('missing_str', 'fallback_str')).toBe('fallback_str');
    localStorage.setItem('existing_str', 'hello');
    expect(getStorageString('existing_str', 'fallback_str')).toBe('hello');
  });

  it('catches and logs errors gracefully when localStorage throws', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('StorageDeniedError');
    });
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('RemoveFailedError');
    });

    expect(setStorageItem('fail_key', 'value')).toBe(false);
    expect(getStorageString('fail_str', 'default_val')).toBe('default_val');
    expect(removeStorageItem('fail_del')).toBe(false);

    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });
});
