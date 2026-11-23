import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '../useLanguage';
import { useTextSize } from '../useTextSize';
import { useChecklist } from '../useChecklist';
import { useLocalStorage } from '../useLocalStorage';

describe('hooks/useLanguage', () => {
  it('initializes with default language and changes language', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.currentLang).toBe('en');
    expect(result.current.t.appName).toBe('VayuShield');

    act(() => {
      result.current.setLanguage('hi');
    });

    expect(result.current.currentLang).toBe('hi');
    expect(result.current.t.appName).toContain('वायुशील्ड');
  });
});

describe('hooks/useTextSize', () => {
  it('changes text size correctly', () => {
    const { result } = renderHook(() => useTextSize());
    expect(result.current.textSize).toBe('medium');
    expect(result.current.textSizeClass).toBe('text-base');

    act(() => {
      result.current.setTextSize('large');
    });

    expect(result.current.textSize).toBe('large');
    expect(result.current.textSizeClass).toBe('text-lg');

    act(() => {
      result.current.setTextSize('small');
    });

    expect(result.current.textSize).toBe('small');
    expect(result.current.textSizeClass).toBe('text-sm');
  });
});

describe('hooks/useChecklist', () => {
  it('toggles hack and swap completions correctly', () => {
    const { result } = renderHook(() => useChecklist([], []));
    expect(result.current.completedHackIds).toEqual([]);
    expect(result.current.completedSwapIds).toEqual([]);

    act(() => {
      result.current.toggleHack('wet-towel');
      result.current.toggleSwap('swap-1');
    });

    expect(result.current.completedHackIds).toContain('wet-towel');
    expect(result.current.completedSwapIds).toContain('swap-1');

    act(() => {
      result.current.toggleHack('wet-towel');
    });

    expect(result.current.completedHackIds).not.toContain('wet-towel');
  });
});

describe('hooks/useLocalStorage', () => {
  it('reads and writes values to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_hook_key', 'initial_val'));
    expect(result.current[0]).toBe('initial_val');

    act(() => {
      result.current[1]('updated_val');
    });

    expect(result.current[0]).toBe('updated_val');
  });
});
