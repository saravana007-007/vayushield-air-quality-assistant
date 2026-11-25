import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CitySelector } from '../CitySelector';
import * as airQualityService from '../../services/airQualityService';
import { TRANSLATIONS } from '../../i18n';
import type { GeocodingResult } from '../../types';

describe('components/CitySelector detailed branches', () => {
  const onSelectPreset = vi.fn();
  const onSelectLocation = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('selects preset scenario when clicked', () => {
    render(
      <CitySelector
        currentCityName="Delhi"
        isPresetActive={true}
        activePresetId="delhi-severe"
        isLoading={false}
        t={TRANSLATIONS.en}
        onSelectPreset={onSelectPreset}
        onSelectLocation={onSelectLocation}
      />
    );

    const lahoreBtn = screen.getByRole('button', { name: /lahore/i });
    fireEvent.click(lahoreBtn);

    expect(onSelectPreset).toHaveBeenCalledWith('lahore-hazardous');
  });

  it('searches for cities with debounce and selects result on click', async () => {
    vi.useFakeTimers();
    const mockHits: GeocodingResult[] = [
      {
        id: 1,
        name: 'Bengaluru',
        latitude: 12.97,
        longitude: 77.59,
        country: 'India',
        admin1: 'Karnataka',
      },
    ];

    vi.spyOn(airQualityService, 'searchCities').mockResolvedValueOnce(mockHits);

    render(
      <CitySelector
        currentCityName="Delhi"
        isPresetActive={true}
        activePresetId="delhi-severe"
        isLoading={false}
        t={TRANSLATIONS.en}
        onSelectPreset={onSelectPreset}
        onSelectLocation={onSelectLocation}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Beng' } });

    // Advance debounce timer
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    const resultOption = screen.getByText(/Bengaluru, Karnataka/i);
    expect(resultOption).toBeInTheDocument();

    fireEvent.click(resultOption);

    expect(onSelectLocation).toHaveBeenCalledWith('Bengaluru, Karnataka', 12.97, 77.59, 'India');
  });

  it('navigates search dropdown with ArrowDown, ArrowUp, Enter and Escape keys', async () => {
    vi.useFakeTimers();
    const mockHits: GeocodingResult[] = [
      { id: 1, name: 'Jaipur', latitude: 26.91, longitude: 75.78, country: 'India' },
      { id: 2, name: 'Jodhpur', latitude: 26.23, longitude: 73.02, country: 'India' },
    ];

    vi.spyOn(airQualityService, 'searchCities').mockResolvedValueOnce(mockHits);

    render(
      <CitySelector
        currentCityName="Delhi"
        isPresetActive={true}
        activePresetId="delhi-severe"
        isLoading={false}
        t={TRANSLATIONS.en}
        onSelectPreset={onSelectPreset}
        onSelectLocation={onSelectLocation}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Jaip' } });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText('Jaipur')).toBeInTheDocument();

    // ArrowDown to first result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // ArrowDown to second result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // ArrowUp back to first result
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    // Press Enter to select
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelectLocation).toHaveBeenCalledWith('Jaipur', 26.91, 75.78, 'India');

    // Press Escape to close dropdown
    fireEvent.keyDown(input, { key: 'Escape' });
  });

  it('displays search error when geocoding network fails', async () => {
    vi.useFakeTimers();
    vi.spyOn(airQualityService, 'searchCities').mockRejectedValueOnce(
      new Error('Network lookup timed out')
    );

    render(
      <CitySelector
        currentCityName="Delhi"
        isPresetActive={true}
        activePresetId="delhi-severe"
        isLoading={false}
        t={TRANSLATIONS.en}
        onSelectPreset={onSelectPreset}
        onSelectLocation={onSelectLocation}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Faulty' } });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText('Network lookup timed out')).toBeInTheDocument();
  });

  it('handles browser geolocation detection and permissions denied', () => {
    const originalGeolocation = navigator.geolocation;
    const mockGetCurrentPosition = vi.fn();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      configurable: true,
      value: {
        getCurrentPosition: mockGetCurrentPosition,
      },
    });

    render(
      <CitySelector
        currentCityName="Delhi"
        isPresetActive={true}
        activePresetId="delhi-severe"
        isLoading={false}
        t={TRANSLATIONS.en}
        onSelectPreset={onSelectPreset}
        onSelectLocation={onSelectLocation}
      />
    );

    const gpsBtn = screen.getByRole('button', { name: /GPS/i });
    fireEvent.click(gpsBtn);

    expect(mockGetCurrentPosition).toHaveBeenCalled();

    // Trigger success callback
    const successCb = mockGetCurrentPosition.mock.calls[0]?.[0];
    act(() => {
      successCb?.({ coords: { latitude: 28.7, longitude: 77.1 } });
    });
    expect(onSelectLocation).toHaveBeenCalledWith('My Current Location', 28.7, 77.1, 'Local');

    // Trigger error callback
    fireEvent.click(gpsBtn);
    const errorCb = mockGetCurrentPosition.mock.calls[1]?.[1];
    act(() => {
      errorCb?.({ code: 1, message: 'User denied geolocation' });
    });
    expect(alertMock).toHaveBeenCalled();

    // Restore
    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      configurable: true,
      value: originalGeolocation,
    });
  });
});
