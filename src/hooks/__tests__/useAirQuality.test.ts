import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAirQuality } from '../useAirQuality';
import * as airQualityService from '../../services/airQualityService';

describe('hooks/useAirQuality', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default delhi-severe preset', () => {
    const { result } = renderHook(() => useAirQuality());

    expect(result.current.airData.cityName).toContain('Delhi');
    expect(result.current.activePresetId).toBe('delhi-severe');
    expect(result.current.isLoadingAir).toBe(false);
    expect(result.current.airError).toBeNull();
  });

  it('updates state when selecting another preset', () => {
    const { result } = renderHook(() => useAirQuality());

    act(() => {
      const selected = result.current.selectPreset('lahore-hazardous');
      expect(selected?.cityName).toContain('Lahore');
    });

    expect(result.current.airData.cityName).toContain('Lahore');
    expect(result.current.activePresetId).toBe('lahore-hazardous');
  });

  it('returns null and does not update when selecting an invalid preset', () => {
    const { result } = renderHook(() => useAirQuality());

    act(() => {
      const selected = result.current.selectPreset('non-existent-city');
      expect(selected).toBeNull();
    });

    expect(result.current.activePresetId).toBe('delhi-severe');
  });

  it('fetches live air quality data successfully for custom location', async () => {
    const mockLive = {
      ...resultAirData(),
      cityName: 'Pune',
      currentAqi: 180,
    };
    vi.spyOn(airQualityService, 'fetchLiveAirQuality').mockResolvedValueOnce(mockLive);

    const { result } = renderHook(() => useAirQuality());

    let returned: unknown;
    await act(async () => {
      returned = await result.current.selectLocation('Pune', 18.52, 73.85, 'India');
    });

    expect(returned).toEqual(mockLive);
    expect(result.current.airData.cityName).toBe('Pune');
    expect(result.current.activePresetId).toBe('');
    expect(result.current.isLoadingAir).toBe(false);
    expect(result.current.airError).toBeNull();
  });

  it('sets error when fetching live air quality fails', async () => {
    vi.spyOn(airQualityService, 'fetchLiveAirQuality').mockRejectedValueOnce(
      new Error('Open-Meteo API unreachable')
    );

    const { result } = renderHook(() => useAirQuality());

    await act(async () => {
      const res = await result.current.selectLocation('Faulty City', 0, 0);
      expect(res).toBeNull();
    });

    expect(result.current.isLoadingAir).toBe(false);
    expect(result.current.airError).toBe('Open-Meteo API unreachable');
  });
});

function resultAirData() {
  return airQualityService.AIR_PRESETS['delhi-severe']!;
}
