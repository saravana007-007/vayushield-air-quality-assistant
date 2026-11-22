// VayuShield Configuration
// Centralized Gemini Model configuration and constants

export const GEMINI_MODEL = "gemini-3.8-flash";
export const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";

export const APP_CONFIG = {
  appName: "VayuShield",
  tagline: "GenAI Urban Air Quality Assistant for Winter Smog",
  openMeteoGeocodingUrl: "https://geocoding-api.open-meteo.com/v1/search",
  openMeteoAirQualityUrl: "https://air-quality-api.open-meteo.com/v1/air-quality",
  maxRetries: 1,
  defaultCity: "Delhi",
  productionProxyNote: "Browser-side API keys are visible in network requests. For production deployments, route requests through a secure Cloud Run or serverless proxy.",
};
