// VayuShield Air Quality & Geocoding Service
// Powered by Open-Meteo (No API Key Required) + Instant Presets & GPS Location

import { z } from 'zod';
import type { AirQualityData, HourlyAqiPoint, GeocodingResult } from '../types';
import {
  getAqiCategory,
  calculateWhoMultiplier,
  calculateBestAirWindow,
  validateCityInput,
} from '../utils/aqiCalculator';
import { APP_CONFIG } from '../config';

const GeocodingItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional().default(''),
  admin1: z.string().optional(),
});

const GeocodingResponseSchema = z.object({
  results: z.array(GeocodingItemSchema).optional().default([]),
});

const AirQualityResponseSchema = z.object({
  timezone: z.string().optional().default('auto'),
  current: z
    .object({
      us_aqi: z.number().nullable().optional(),
      pm2_5: z.number().nullable().optional(),
      pm10: z.number().nullable().optional(),
    })
    .optional(),
  hourly: z
    .object({
      time: z.array(z.string()).optional().default([]),
      us_aqi: z.array(z.number().nullable()).optional().default([]),
      pm2_5: z.array(z.number().nullable()).optional().default([]),
      pm10: z.array(z.number().nullable()).optional().default([]),
    })
    .optional(),
});

const delhiHourly: HourlyAqiPoint[] = [
  { time: '05:00', hour: 5, aqi: 410, pm2_5: 350, pm10: 510 },
  { time: '07:00', hour: 7, aqi: 425, pm2_5: 375, pm10: 540 },
  { time: '09:00', hour: 9, aqi: 395, pm2_5: 330, pm10: 495 },
  { time: '11:00', hour: 11, aqi: 340, pm2_5: 280, pm10: 410 },
  { time: '13:00', hour: 13, aqi: 285, pm2_5: 210, pm10: 330 },
  { time: '15:00', hour: 15, aqi: 310, pm2_5: 235, pm10: 370 },
  { time: '17:00', hour: 17, aqi: 375, pm2_5: 305, pm10: 460 },
  { time: '19:00', hour: 19, aqi: 415, pm2_5: 360, pm10: 520 },
  { time: '21:00', hour: 21, aqi: 430, pm2_5: 380, pm10: 550 },
  { time: '23:00', hour: 23, aqi: 410, pm2_5: 355, pm10: 515 },
];

const lahoreHourly: HourlyAqiPoint[] = [
  { time: '05:00', hour: 5, aqi: 370, pm2_5: 310, pm10: 450 },
  { time: '07:00', hour: 7, aqi: 380, pm2_5: 325, pm10: 470 },
  { time: '09:00', hour: 9, aqi: 350, pm2_5: 290, pm10: 430 },
  { time: '11:00', hour: 11, aqi: 310, pm2_5: 245, pm10: 380 },
  { time: '13:00', hour: 13, aqi: 260, pm2_5: 195, pm10: 310 },
  { time: '15:00', hour: 15, aqi: 285, pm2_5: 215, pm10: 345 },
  { time: '17:00', hour: 17, aqi: 335, pm2_5: 270, pm10: 410 },
  { time: '19:00', hour: 19, aqi: 365, pm2_5: 300, pm10: 455 },
  { time: '21:00', hour: 21, aqi: 375, pm2_5: 315, pm10: 465 },
  { time: '23:00', hour: 23, aqi: 360, pm2_5: 295, pm10: 440 },
];

const moderateHourly: HourlyAqiPoint[] = [
  { time: '05:00', hour: 5, aqi: 165, pm2_5: 65, pm10: 115 },
  { time: '07:00', hour: 7, aqi: 160, pm2_5: 62, pm10: 110 },
  { time: '09:00', hour: 9, aqi: 150, pm2_5: 57, pm10: 102 },
  { time: '11:00', hour: 11, aqi: 130, pm2_5: 45, pm10: 85 },
  { time: '13:00', hour: 13, aqi: 105, pm2_5: 34, pm10: 70 },
  { time: '15:00', hour: 15, aqi: 115, pm2_5: 38, pm10: 75 },
  { time: '17:00', hour: 17, aqi: 145, pm2_5: 53, pm10: 98 },
  { time: '19:00', hour: 19, aqi: 155, pm2_5: 59, pm10: 106 },
  { time: '21:00', hour: 21, aqi: 160, pm2_5: 63, pm10: 112 },
  { time: '23:00', hour: 23, aqi: 155, pm2_5: 60, pm10: 108 },
];

// 1-Click Offline Presets
export const AIR_PRESETS: Record<string, AirQualityData> = {
  'delhi-severe': {
    cityName: 'Delhi (Severe Smog)',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
    currentAqi: 385,
    currentPm25: 320.4,
    currentPm10: 480.2,
    category: getAqiCategory(385),
    whoMultiplier: calculateWhoMultiplier(320.4),
    isPreset: true,
    presetId: 'delhi-severe',
    lastUpdated: 'Live Smog Snapshot',
    hourly: delhiHourly,
    bestWindow: calculateBestAirWindow(delhiHourly, 8),
  },
  'lahore-hazardous': {
    cityName: 'Lahore (Hazardous Smog)',
    country: 'Pakistan',
    latitude: 31.5204,
    longitude: 74.3587,
    timezone: 'Asia/Karachi',
    currentAqi: 340,
    currentPm25: 275.5,
    currentPm10: 415.0,
    category: getAqiCategory(340),
    whoMultiplier: calculateWhoMultiplier(275.5),
    isPreset: true,
    presetId: 'lahore-hazardous',
    lastUpdated: 'Live Smog Snapshot',
    hourly: lahoreHourly,
    bestWindow: calculateBestAirWindow(lahoreHourly, 8),
  },
  'moderate-haze': {
    cityName: 'Moderate Haze (Winter Transition)',
    country: 'Regional Average',
    latitude: 25.0,
    longitude: 75.0,
    timezone: 'UTC',
    currentAqi: 145,
    currentPm25: 53.2,
    currentPm10: 98.4,
    category: getAqiCategory(145),
    whoMultiplier: calculateWhoMultiplier(53.2),
    isPreset: true,
    presetId: 'moderate-haze',
    lastUpdated: 'Live Smog Snapshot',
    hourly: moderateHourly,
    bestWindow: calculateBestAirWindow(moderateHourly, 8),
  },
};

/**
 * Search cities using Open-Meteo Geocoding API
 */
export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<GeocodingResult[]> {
  const validation = validateCityInput(query);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid city name.');
  }

  const url = `${APP_CONFIG.openMeteoGeocodingUrl}?name=${encodeURIComponent(validation.sanitized)}&count=5&language=en&format=json`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Location search failed (${response.status}). Check network connection.`);
  }

  const rawJson: unknown = await response.json();
  const parsed = GeocodingResponseSchema.safeParse(rawJson);
  if (!parsed.success || !parsed.data.results || parsed.data.results.length === 0) {
    return [];
  }

  return parsed.data.results.map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

/**
 * Fetch live AQI and hourly forecast for latitude / longitude
 */
export async function fetchLiveAirQuality(
  cityName: string,
  latitude: number,
  longitude: number,
  country?: string,
  signal?: AbortSignal
): Promise<AirQualityData> {
  const url = `${APP_CONFIG.openMeteoAirQualityUrl}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10&hourly=us_aqi,pm2_5,pm10&timezone=auto&forecast_days=2`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Air quality feed unreachable (${response.status}).`);
  }

  const rawJson: unknown = await response.json();
  const parsed = AirQualityResponseSchema.safeParse(rawJson);
  const defaultAirQuality = {
    timezone: 'auto',
    current: undefined,
    hourly: { time: [], us_aqi: [], pm2_5: [], pm10: [] },
  };
  const data = parsed.success ? parsed.data : defaultAirQuality;

  const currentAqi = Math.round(data.current?.us_aqi ?? 100);
  const currentPm25 = Math.round((data.current?.pm2_5 ?? 35) * 10) / 10;
  const currentPm10 = Math.round((data.current?.pm10 ?? 60) * 10) / 10;

  // Process hourly forecast (next 24 hours)
  const hourlyTimes: string[] = data.hourly?.time ?? [];
  const hourlyAqi = data.hourly?.us_aqi ?? [];
  const hourlyPm25 = data.hourly?.pm2_5 ?? [];
  const hourlyPm10 = data.hourly?.pm10 ?? [];

  const hourly: HourlyAqiPoint[] = [];
  const now = new Date();

  for (let i = 0; i < hourlyTimes.length && hourly.length < 24; i++) {
    const timeStr = hourlyTimes[i];
    if (!timeStr) continue;
    const pointDate = new Date(timeStr);

    if (pointDate >= now || i >= hourlyTimes.length - 24) {
      const hours = pointDate.getHours();
      const formattedTime = `${hours.toString().padStart(2, '0')}:00`;

      hourly.push({
        time: formattedTime,
        hour: hours,
        aqi: Math.round(hourlyAqi[i] ?? currentAqi),
        pm2_5: Math.round((hourlyPm25[i] ?? currentPm25) * 10) / 10,
        pm10: Math.round((hourlyPm10[i] ?? currentPm10) * 10) / 10,
      });
    }
  }

  if (hourly.length === 0) {
    const hours = [6, 9, 12, 15, 18, 21];
    hours.forEach((h) => {
      hourly.push({
        time: `${h.toString().padStart(2, '0')}:00`,
        hour: h,
        aqi: currentAqi,
        pm2_5: currentPm25,
        pm10: currentPm10,
      });
    });
  }

  return {
    cityName,
    country,
    latitude,
    longitude,
    timezone: data.timezone || 'auto',
    currentAqi,
    currentPm25,
    currentPm10,
    category: getAqiCategory(currentAqi),
    whoMultiplier: calculateWhoMultiplier(currentPm25),
    hourly,
    bestWindow: calculateBestAirWindow(hourly),
    isPreset: false,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
