// VayuShield Configuration
// Centralized Gemini Model configuration, timeouts, thresholds, and constants

export const GEMINI_MODEL = 'gemini-3.8-flash';
export const GEMINI_FALLBACK_MODEL = 'gemini-2.5-flash';

export const TIMEOUTS = {
  geminiRequestMs: 7000,
  debounceSearchMs: 300,
  drawerFocusDelayMs: 150,
} as const;

export const AQI_THRESHOLDS = {
  good: 50,
  moderate: 100,
  unhealthySensitive: 150,
  unhealthy: 200,
  veryUnhealthy: 300,
  hazardous: 400,
  severeEmergency: 500,
} as const;

export const STORAGE_KEYS = {
  cachedPlan: 'vayushield_cached_plan',
  language: 'vayushield_lang',
  textSize: 'vayushield_text_size',
} as const;

export const GEMINI_TEMPERATURES = {
  planGeneration: 0.2,
  askVayu: 0.1,
} as const;

export const APP_CONFIG = {
  appName: 'VayuShield',
  tagline: 'GenAI Urban Air Quality Assistant for Winter Smog',
  openMeteoGeocodingUrl: 'https://geocoding-api.open-meteo.com/v1/search',
  openMeteoAirQualityUrl: 'https://air-quality-api.open-meteo.com/v1/air-quality',
  maxRetries: 1,
  defaultCity: 'Delhi',
  productionProxyNote:
    'Browser-side API keys are visible in network requests. For production deployments, route requests through a secure Cloud Run or serverless proxy.',
} as const;
