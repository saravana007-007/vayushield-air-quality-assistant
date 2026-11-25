import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchCities, fetchLiveAirQuality } from '../airQualityService';

describe('services/airQualityService edge branches', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('searchCities rejects invalid short query, handles !ok response, and handles empty results', async () => {
    await expect(searchCities('a')).rejects.toThrow();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 503,
      })
    );
    await expect(searchCities('Delhi')).rejects.toThrow(/Location search failed/);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      })
    );
    const empty = await searchCities('Atlantis');
    expect(empty).toEqual([]);
  });

  it('fetchLiveAirQuality handles !ok response and falls back to synthetic hourly points on malformed payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
    );
    await expect(fetchLiveAirQuality('Test', 10, 20)).rejects.toThrow(
      /Air quality feed unreachable/
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ unexpected: true }),
      })
    );
    const data = await fetchLiveAirQuality('FallbackCity', 10, 20, 'India');
    expect(data.cityName).toBe('FallbackCity');
    expect(data.currentAqi).toBe(100);
    expect(data.hourly).toHaveLength(6);
  });
});
