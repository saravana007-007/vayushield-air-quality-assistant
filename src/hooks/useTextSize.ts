import { useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../config';
import { getStorageString, setStorageItem } from '../utils/storage';

export type TextSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface UseTextSizeResult {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  textSizeClass: string;
}

/**
 * Manage accessible UI text scale preference persisted in LocalStorage.
 */
export function useTextSize(): UseTextSizeResult {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    const saved = getStorageString(STORAGE_KEYS.textSize, 'medium');
    if (saved === 'small' || saved === 'medium' || saved === 'large' || saved === 'xlarge') {
      return saved;
    }
    return 'medium';
  });

  const setTextSize = useCallback((newSize: TextSize) => {
    setTextSizeState(newSize);
    setStorageItem(STORAGE_KEYS.textSize, newSize);
  }, []);

  const getTextSizeClass = (size: TextSize): string => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      case 'xlarge':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return {
    textSize,
    setTextSize,
    textSizeClass: getTextSizeClass(textSize),
  };
}
