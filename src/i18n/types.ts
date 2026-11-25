// VayuShield Multilingual i18n Types

export type SupportedLanguage = 'en' | 'hi' | 'ur' | 'bn' | 'ta' | 'te' | 'mr';

export interface LanguageMeta {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', speechLang: 'en-US' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', speechLang: 'hi-IN' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', dir: 'rtl', speechLang: 'ur-PK' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', dir: 'ltr', speechLang: 'bn-IN' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', dir: 'ltr', speechLang: 'ta-IN' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', dir: 'ltr', speechLang: 'te-IN' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', dir: 'ltr', speechLang: 'mr-IN' },
];

export interface UiTranslations {
  appName: string;
  tagline: string;
  selectLanguage: string;
  largeText: string;
  normalText: string;
  readAloud: string;
  stopReading: string;
  voiceSearch: string;
  listening: string;
  demoBadge: string;
  liveBadge: string;
  cachedNotice: string;

  // Danger Explainer
  dangerTitle: string;
  gaugeLabel: string;
  categoryLabelPrefix: string;
  trafficSafe: string;
  trafficWarning: string;
  trafficDanger: string;
  whoExceedLabel: string;
  categorySummaries: Record<string, string>;
  categoryNames: Record<string, string>;
  pm25Label: string;
  pm10Label: string;
  maskStandardLabel: string;
  clothFailsShort: string;

  // When Will it Get Better
  bestTimeTitle: string;
  bestTimeLabel: string;
  worseAfter: string;
  stayIndoorsAllDay: string;
  countdownImproving: string;
  remindMe: string;
  reminderSet: string;
  bestTimeSentence: (start: string, end: string, worse: string) => string;
  happeningNow: string;
  nextSafeTomorrow: string;

  // One Thing To Do
  oneThingTitle: string;

  // City Selector
  searchCityPlaceholder: string;
  useMyLocation: string;
  presetsTitle: string;
  presetDelhi: string;
  presetLahore: string;
  presetModerate: string;

  // Household Profile
  profileTitle: string;
  profileSubtitle: string;
  updatePlanBtn: string;
  loadingPlan: string;
  toddlersLabel: string;
  elderlyLabel: string;
  asthmaLabel: string;
  commuterLabel: string;
  wfhLabel: string;
  otherConditionLabel: string;
  otherConditionPlaceholder: string;
  tapToAdd: string;
  selectedText: string;
  customConditionPrompt: string;

  // Custom Setup Questions
  purifierLabel: string;
  purifierYes: string;
  purifierNo: string;
  stoveLabel: string;
  stoveGas: string;
  stoveElectric: string;
  stoveInduction: string;
  stoveOther: string;
  commuteLabel: string;
  commuteMetro: string;
  commuteCar: string;
  commuteBike: string;
  commuteWalk: string;
  commuteOther: string;
  customSetupPlaceholder: string;

  // Action Plan Sections
  familyBriefingTitle: string;
  routineTitle: string;
  indoorHacksTitle: string;
  swapsTitle: string;
  dosAndDontsTitle: string;
  dosTitle: string;
  dontsTitle: string;
  windowRulePrefix: string;
  familyGuidancePrefix: string;
  whyMattersPrefix: string;
  markDone: string;
  doneText: string;
  adoptSwap: string;
  adoptedText: string;

  // Masks & Doctor Guide
  maskGuideTitle: string;
  n95Works: string;
  n95Tip: string;
  clothFails: string;
  clothTip: string;
  seeDoctorTitle: string;
  doctorWarningSymptoms: string;
  doctorSymptomsList: string[];
  disclaimerText: string;

  // Protection Tracker
  trackerTitle: string;
  trackerSubtitle: string;
  protectionScore: string;
  co2Saved: string;
  howCalculated: string;
  estIndoorAqiPrefix: string;
  co2CommunityImpact: string;
  currentIsolationPrefix: string;
  isolationOptimal: string;
  isolationModerate: string;
  isolationElevated: string;
  indoorHacksChecklistTitle: string;
  swapsChecklistTitle: string;
  realtimeUpdateNote: string;
  viewFormulaBtn: string;

  // Ask Vayu Drawer
  askVayuBtn: string;
  askVayuTitle: string;
  askPlaceholder: string;
  askContextNotice: string;

  // Share & Export
  shareCardBtn: string;
  copyTextBtn: string;
  whatsAppBtn: string;
  downloadCardBtn: string;
  downloadingPdf: string;
  copied: string;
}
