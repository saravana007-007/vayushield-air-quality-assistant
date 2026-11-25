import { useState, useCallback } from 'react';
import type { AirQualityData } from '../types';
import { AIR_PRESETS, fetchLiveAirQuality } from '../services/airQualityService';
import { getErrorMessage } from '../utils/errors';

export interface UseAirQualityResult {
  airData: AirQualityData;
  activePresetId: string;
  isLoadingAir: boolean;
  airError: string | null;
  selectPreset: (presetKey: string) => AirQualityData | null;
  selectLocation: (
    name: string,
    lat: number,
    lon: number,
    country?: string
  ) => Promise<AirQualityData | null>;
}

export function useAirQuality(): UseAirQualityResult {
  const [airData, setAirData] = useState<AirQualityData>(
    () => AIR_PRESETS['delhi-severe'] ?? Object.values(AIR_PRESETS)[0]!
  );
  const [activePresetId, setActivePresetId] = useState<string>('delhi-severe');
  const [isLoadingAir, setIsLoadingAir] = useState<boolean>(false);
  const [airError, setAirError] = useState<string | null>(null);

  const selectPreset = useCallback((presetKey: string): AirQualityData | null => {
    const selected = AIR_PRESETS[presetKey];
    if (!selected) return null;

    setAirData(selected);
    setActivePresetId(presetKey);
    setAirError(null);
    return selected;
  }, []);

  const selectLocation = useCallback(
    async (
      name: string,
      lat: number,
      lon: number,
      country?: string
    ): Promise<AirQualityData | null> => {
      setIsLoadingAir(true);
      setAirError(null);
      setActivePresetId('');

      try {
        const live = await fetchLiveAirQuality(name, lat, lon, country);
        setAirData(live);
        return live;
      } catch (err: unknown) {
        setAirError(getErrorMessage(err));
        return null;
      } finally {
        setIsLoadingAir(false);
      }
    },
    []
  );

  return {
    airData,
    activePresetId,
    isLoadingAir,
    airError,
    selectPreset,
    selectLocation,
  };
}
