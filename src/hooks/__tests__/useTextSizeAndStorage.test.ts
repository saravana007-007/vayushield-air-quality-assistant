import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTextSize } from '../useTextSize';
import { useLocalStorage } from '../useLocalStorage';
import { useLanguage } from '../useLanguage';
import { useChecklist } from '../useChecklist';
import { STORAGE_KEYS } from '../../config';

describe('hooks/useTextSize, useLocalStorage, useLanguage, useChecklist', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('useTextSize reads valid saved value, falls back on invalid value, and updates class', () => {
    localStorage.setItem(STORAGE_KEYS.textSize, 'xlarge');
    const { result, unmount } = renderHook(() => useTextSize());
    expect(result.current.textSize).toBe('xlarge');
    expect(result.current.textSizeClass).toBe('text-xl');

    act(() => {
      result.current.setTextSize('small');
    });
    expect(result.current.textSize).toBe('small');
    expect(result.current.textSizeClass).toBe('text-sm');

    act(() => {
      result.current.setTextSize('large');
    });
    expect(result.current.textSizeClass).toBe('text-lg');
    unmount();

    localStorage.setItem(STORAGE_KEYS.textSize, 'invalid-size');
    const { result: fallbackResult } = renderHook(() => useTextSize());
    expect(fallbackResult.current.textSize).toBe('medium');
    expect(fallbackResult.current.textSizeClass).toBe('text-base');
  });

  it('useLocalStorage supports direct values and updater functions', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter_key', 1));
    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](5);
    });
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1]((prev) => prev + 2);
    });
    expect(result.current[0]).toBe(7);
    expect(localStorage.getItem('counter_key')).toBe('7');
  });

  it('useLanguage updates language and document attributes', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.currentLang).toBe('en');

    act(() => {
      result.current.setLanguage('ur');
    });
    expect(result.current.currentLang).toBe('ur');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('useChecklist toggles hacks and swaps on and off', () => {
    const { result } = renderHook(() => useChecklist(['h1'], ['s1']));
    act(() => {
      result.current.toggleHack('h1');
      result.current.toggleHack('h2');
      result.current.toggleSwap('s1');
      result.current.toggleSwap('s2');
    });
    expect(result.current.completedHackIds).toEqual(['h2']);
    expect(result.current.completedSwapIds).toEqual(['s2']);
  });
});
