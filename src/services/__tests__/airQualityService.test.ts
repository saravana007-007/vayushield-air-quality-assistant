import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchCities, fetchLiveAirQuality, AIR_PRESETS } from '../airQualityService';

describe('services/airQualityService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('searches cities successfully with valid response', async () => {
    const mockGeocoding = {
      results: [
        {
          id: 1,
          name: 'Delhi',
          latitude: 28.65,
          longitude: 77.23,
          country: 'India',
          admin1: 'Delhi',
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeocoding,
    } as Response);

    const results = await searchCities('Delhi');
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('Delhi');
  });

  it('handles empty geocoding search results', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    const results = await searchCities('Nonexistentplace123');
    expect(results).toEqual([]);
  });

  it('throws error on search HTTP error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(searchCities('ErrorCity')).rejects.toThrow('Location search failed (500)');
  });

  it('throws error when network fails on search', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network offline'));
    await expect(searchCities('NetworkFail')).rejects.toThrow('Network offline');
  });

  it('fetches live air quality data successfully', async () => {
    const mockAirData = {
      current: {
        us_aqi: 220,
        pm2_5: 145.5,
        pm10: 190.2,
      },
      hourly: {
        time: ['2026-11-23T12:00', '2026-11-23T13:00'],
        us_aqi: [210, 200],
        pm2_5: [140, 130],
        pm10: [180, 170],
      },
      timezone: 'Asia/Kolkata',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockAirData,
    } as Response);

    const data = await fetchLiveAirQuality('Delhi', 28.65, 77.23, 'India');
    expect(data.currentAqi).toBe(220);
    expect(data.cityName).toBe('Delhi');
    expect(data.country).toBe('India');
    expect(data.hourly.length).toBeGreaterThan(0);
  });

  it('throws error when live air quality API returns an error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response);

    await expect(fetchLiveAirQuality('Delhi', 28.65, 77.23, 'India')).rejects.toThrow(
      'Air quality feed unreachable (503)'
    );
  });

  it('provides valid presets for known cities', () => {
    const delhi = AIR_PRESETS['delhi-severe'];
    expect(delhi).toBeDefined();
    expect(delhi?.cityName).toContain('Delhi');
    expect(delhi?.currentAqi).toBe(385);

    const lahore = AIR_PRESETS['lahore-hazardous'];
    expect(lahore).toBeDefined();
    expect(lahore?.cityName).toContain('Lahore');
    expect(lahore?.currentAqi).toBe(340);

    const moderate = AIR_PRESETS['moderate-haze'];
    expect(moderate).toBeDefined();
    expect(moderate?.currentAqi).toBe(145);
  });
});
