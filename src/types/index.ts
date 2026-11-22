// VayuShield Types (Multilingual & Accessibility Upgraded)

export type AqiCategoryKey = 
  | 'good'
  | 'moderate'
  | 'unhealthy_sensitive'
  | 'unhealthy'
  | 'very_unhealthy'
  | 'hazardous';

export type TrafficStatus = 'safe' | 'warning' | 'danger';

export interface AqiCategoryInfo {
  key: AqiCategoryKey;
  label: string;
  range: string;
  min: number;
  max: number;
  emoji: string; // 😊 😐 😷 🤢 🚨 ☠️
  trafficStatus: TrafficStatus;
  trafficEmoji: string; // 🟢 🟡 🔴
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  textClass: string;
  actionSummary: string;
  maskRecommendation: string;
}

export interface HourlyAqiPoint {
  time: string; // e.g. '14:00'
  hour: number; // 0-23
  aqi: number;
  pm2_5: number;
  pm10: number;
}

export interface BestAirWindow {
  startTime: string;
  endTime: string;
  lowestAqi: number;
  lowestPm25: number;
  worseAfterTime?: string;
  countdownHours: number;
  countdownText: string;
  stayIndoorsAllDay: boolean;
  plainSentence: string;
}

export interface AirQualityData {
  cityName: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currentAqi: number;
  currentPm25: number;
  currentPm10: number;
  category: AqiCategoryInfo;
  whoMultiplier: number; // e.g. 21x WHO limit
  hourly: HourlyAqiPoint[];
  bestWindow: BestAirWindow;
  isPreset?: boolean;
  presetId?: string;
  lastUpdated: string;
}

export type HouseholdTag = 
  | 'toddler_kids'
  | 'elderly'
  | 'asthma_respiratory'
  | 'outdoor_commuter'
  | 'wfh'
  | 'other';

export type StoveType = 'gas' | 'electric' | 'induction' | 'other';
export type CommuteMode = 'metro_bus' | 'car_cab' | 'two_wheeler' | 'walk_cycle' | 'other';

export interface HouseholdSetup {
  airPurifier: boolean;
  stoveType: StoveType;
  customStove?: string;
  commuteMode: CommuteMode;
  customCommute?: string;
}

export interface HouseholdProfile {
  tags: HouseholdTag[];
  customTagDetails?: string; // For "Other" custom conditions
  setup: HouseholdSetup;
}

export type RoutineBadge = 'Stay Indoors' | 'Mask Required' | 'Safe Ventilation Window';

export interface RoutineBlock {
  id: 'morning' | 'midday' | 'evening' | 'night';
  title: string;
  timeRange: string;
  badge: RoutineBadge;
  windowRule: string;
  memberGuidance: string;
}

export interface IndoorHack {
  id: string;
  title: string;
  targetArea: string;
  steps: string[];
  difficulty: 'Quick (5 min)' | 'Moderate (15 min)' | string;
  estimatedReduction: string;
}

export interface SwapPlanItem {
  catalogId: string;
  customReason: string;
}

export interface SwapCatalogItem {
  id: string;
  title: string;
  description: string;
  category: 'commute' | 'cooking' | 'home' | 'community';
  exposureReductionBadge: string;
  co2SavedBadge: string;
  exposurePoints: number;
  co2SavedKg: number;
}

export interface ActionPlan {
  oneThingToDo: string; // The single most important action for today
  familyRiskBriefing: string;
  dailyRoutine: RoutineBlock[];
  indoorHacks: IndoorHack[];
  swaps: SwapPlanItem[];
  dos: string[];
  donts: string[];
  isDemo?: boolean;
  generatedAt?: string;
  language?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}
