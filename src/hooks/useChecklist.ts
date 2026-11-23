import { useState, useCallback } from 'react';

export interface UseChecklistResult {
  completedHackIds: string[];
  completedSwapIds: string[];
  toggleHack: (id: string) => void;
  toggleSwap: (id: string) => void;
}

export function useChecklist(
  initialHacks: string[] = ['hack-1', 'hack-3'],
  initialSwaps: string[] = ['simmer-pot-aromatics']
): UseChecklistResult {
  const [completedHackIds, setCompletedHackIds] = useState<string[]>(initialHacks);
  const [completedSwapIds, setCompletedSwapIds] = useState<string[]>(initialSwaps);

  const toggleHack = useCallback((id: string) => {
    setCompletedHackIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSwap = useCallback((id: string) => {
    setCompletedSwapIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  return {
    completedHackIds,
    completedSwapIds,
    toggleHack,
    toggleSwap,
  };
}
