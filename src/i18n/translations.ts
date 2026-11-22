// VayuShield Multilingual i18n System
// Complete dictionaries for English, Hindi, Urdu (RTL), Bengali, Tamil, Telugu, Marathi

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
  
  // When will it get better
  bestTimeTitle: string;
  bestTimeLabel: string;
  worseAfter: string;
  stayIndoorsAllDay: string;
  countdownImproving: string;
  remindMe: string;
  reminderSet: string;
  bestTimeSentence: (start: string, end: string, worseAfter: string) => string;
  happeningNow: string;
  nextSafeTomorrow: string;
  
  // One thing to do
  oneThingTitle: string;
  
  // City search & presets
  searchCityPlaceholder: string;
  useMyLocation: string;
  presetsTitle: string;
  presetDelhi: string;
  presetLahore: string;
  presetModerate: string;
  
  // Family profile
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
  
  // Setup
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
  
  // Plan sections
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
  
  // Health & doctor
  maskGuideTitle: string;
  n95Works: string;
  n95Tip: string;
  clothFails: string;
  clothTip: string;
  seeDoctorTitle: string;
  doctorWarningSymptoms: string;
  doctorSymptomsList: string[];
  disclaimerText: string;
  
  // Action tracker
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
  
  // Ask vayu
  askVayuBtn: string;
  askVayuTitle: string;
  askPlaceholder: string;
  askContextNotice: string;
  
  // Share
  shareCardBtn: string;
  copyTextBtn: string;
  whatsAppBtn: string;
  downloadCardBtn: string;
  downloadingPdf: string;
  copied: string;
}

export const EN_TRANSLATIONS: UiTranslations = {
  appName: 'VayuShield',
  tagline: 'Simple Air Quality & Family Protection Assistant',
  selectLanguage: 'Choose Language',
  largeText: 'Large Text',
  normalText: 'Default Text',
  readAloud: 'Read Aloud 🔊',
  stopReading: 'Stop Audio ⏹️',
  voiceSearch: 'Voice Search',
  listening: 'Listening...',
  demoBadge: 'Demo Mode (Offline Plan)',
  liveBadge: 'Gemini Live AI',
  cachedNotice: 'Showing saved data from previous session',
  
  dangerTitle: 'Current Smog Level',
  gaugeLabel: 'Pollution Scale (0 - 500)',
  categoryLabelPrefix: 'Category',
  trafficSafe: 'Safe: Air is clean',
  trafficWarning: 'Be Careful: Sensitive people stay cautious',
  trafficDanger: 'Danger: Toxic smog outside, seal home',
  whoExceedLabel: 'times over WHO clean air limit',
  categoryNames: {
    good: 'Good',
    moderate: 'Moderate',
    unhealthy_sensitive: 'Unhealthy for Sensitive Groups',
    unhealthy: 'Unhealthy',
    very_unhealthy: 'Very Unhealthy',
    hazardous: 'Hazardous / Severe Smog'
  },
  categorySummaries: {
    good: 'Air is clean and fresh. Perfect for open windows and outdoor play.',
    moderate: 'Air is acceptable. Unusually sensitive people should take light caution.',
    unhealthy_sensitive: 'Unsafe for children, seniors, and asthma patients. Keep windows shut.',
    unhealthy: 'Hazardous air for everyone. Prolonged outdoor exertion causes irritation.',
    very_unhealthy: 'Emergency health alert: Toxic smog outside. Stay indoors and seal door gaps.',
    hazardous: 'Emergency catastrophe. Toxic particulate penetrates deep into lungs. Quarantine indoors.'
  },
  pm25Label: 'PM2.5 (Fine Soot)',
  pm10Label: 'PM10 (Road Dust)',
  maskStandardLabel: 'Mask Standard',
  clothFailsShort: 'Cloth masks fail',
  
  bestTimeTitle: 'When Will The Air Get Better?',
  bestTimeLabel: 'Safest time to go out today',
  worseAfter: 'Air worsens again after',
  stayIndoorsAllDay: 'Smog will not clear today. Please stay indoors all day.',
  countdownImproving: 'Air clears in',
  remindMe: 'Remind me when safe 🔔',
  reminderSet: 'Reminder active! We will notify you.',
  bestTimeSentence: (start, end, worse) => `Best time to go out: ${start} to ${end}. Air gets worse again after ${worse}.`,
  happeningNow: 'Happening right now!',
  nextSafeTomorrow: 'Next safe window tomorrow at',
  
  oneThingTitle: '⭐ The #1 Most Important Thing To Do Today',
  
  searchCityPlaceholder: 'Type your city name...',
  useMyLocation: 'Use My GPS Location 📍',
  presetsTitle: 'Quick 1-Click Smog Presets:',
  presetDelhi: 'Delhi: Severe Smog AQI 385',
  presetLahore: 'Lahore: Hazardous AQI 340',
  presetModerate: 'Moderate Haze AQI 145',
  
  profileTitle: 'Who Lives in Your Home?',
  profileSubtitle: 'Tap everyone in your household so we protect them properly.',
  updatePlanBtn: 'Create Fresh Family Plan',
  loadingPlan: 'Calculating safest actions...',
  toddlersLabel: 'Babies / Children 👶',
  elderlyLabel: 'Grandparents / Elderly 👵',
  asthmaLabel: 'Asthma / Cough / Chest Issues 🫁',
  commuterLabel: 'Goes Out For Work / Bike 🛵',
  wfhLabel: 'Stays Home / WFH 🏠',
  otherConditionLabel: 'Other Condition / Need ✍️',
  otherConditionPlaceholder: 'Type other details (e.g. pregnant, heart patient, pet)...',
  tapToAdd: 'Tap to Add',
  selectedText: 'Selected ✓',
  customConditionPrompt: 'Describe other member or health vulnerability:',
  
  purifierLabel: 'Do you have an Air Purifier?',
  purifierYes: 'Active HEPA filter at home',
  purifierNo: 'No mechanical purifier (relies on passive traps)',
  stoveLabel: 'Kitchen Stove Type',
  stoveGas: 'Gas Cylinder / PNG (Smoke & NO2)',
  stoveElectric: 'Electric Hot Plate',
  stoveInduction: 'Induction Cooker (Cleanest)',
  stoveOther: 'Other / Wood / Chulha',
  commuteLabel: 'How do family members travel?',
  commuteMetro: 'Metro Train / AC Bus',
  commuteCar: 'Car / Cab with AC',
  commuteBike: 'Motorcycle / Scooter / Auto',
  commuteWalk: 'Walking / Bicycle',
  commuteOther: 'Other travel mode',
  customSetupPlaceholder: 'Describe your custom stove or commute...',
  
  familyBriefingTitle: 'Personal Family Briefing',
  routineTitle: 'Daily Inversion Schedule (4 Blocks)',
  indoorHacksTitle: 'Easy Home Hacks (No Extra Cost)',
  swapsTitle: 'Smart Swaps for Cleaner Air',
  dosAndDontsTitle: 'Clear Do & Don\'t Rules',
  dosTitle: 'Do This Today ✅',
  dontsTitle: 'Avoid Doing This ❌',
  windowRulePrefix: '🪟 Window & Airing Rule:',
  familyGuidancePrefix: '👥 Family Members Guidance:',
  whyMattersPrefix: 'Why this matters for your home today:',
  markDone: 'Mark Done',
  doneText: 'Done ✓',
  adoptSwap: 'Adopt Swap',
  adoptedText: 'Adopted ✓',
  
  maskGuideTitle: 'Mask Guide: What Actually Protects You?',
  n95Works: 'N95 / FFP2 Masks: Block 95% of fine toxic soot. Tight nose seal required.',
  n95Tip: '👉 Pinch metal nose-clip tightly for zero leak.',
  clothFails: 'Cloth & Surgical Masks: DO NOT work against fine PM2.5 smog particles.',
  clothTip: '👉 Fine PM2.5 soot passes easily through fabric weave.',
  seeDoctorTitle: '🚨 When to See a Doctor Immediately',
  doctorWarningSymptoms: 'Chest tightness, severe shortness of breath, continuous wheezing, or bluish lips require emergency medical care.',
  doctorSymptomsList: [
    '⚠️ Severe shortness of breath',
    '⚠️ Chest pain or constriction',
    '⚠️ Bluish lips or fingernails',
    '⚠️ Continuous coughing or wheezing'
  ],
  disclaimerText: 'General health guidance, not a medical diagnosis or prescription. Always consult a licensed doctor for illness.',
  
  trackerTitle: 'Family Action Tracker',
  trackerSubtitle: 'Live family smog safety index',
  protectionScore: 'Protection Score',
  co2Saved: 'CO₂ Averted',
  howCalculated: 'How is this calculated?',
  estIndoorAqiPrefix: 'Est. Indoor AQI',
  co2CommunityImpact: 'Community clean air impact',
  currentIsolationPrefix: 'Current Isolation',
  isolationOptimal: 'Optimal protection: Indoor air is effectively isolated from outdoor smog.',
  isolationModerate: 'Moderate protection: Good baseline; complete checklist swaps to seal leaks.',
  isolationElevated: 'Elevated exposure risk: Significant outdoor particulate infiltrating indoor zones.',
  indoorHacksChecklistTitle: 'Indoor Micro-Hacks',
  swapsChecklistTitle: 'Smog Swaps',
  realtimeUpdateNote: 'Updates in real-time',
  viewFormulaBtn: 'View weighting formula',
  
  askVayuBtn: 'Ask Vayu Assistant',
  askVayuTitle: 'Ask Vayu: Smog Helper',
  askPlaceholder: 'Ask in short words (e.g. Can baby go to park?)...',
  askContextNotice: 'Answers in 3 short sentences starting with Yes / No / Wait.',
  
  shareCardBtn: 'Share Family Card',
  copyTextBtn: 'Copy Text',
  whatsAppBtn: 'Send on WhatsApp',
  downloadCardBtn: 'Download PDF Card',
  downloadingPdf: 'Generating PDF...',
  copied: 'Copied to Clipboard!',
};

export const TRANSLATIONS: Record<SupportedLanguage, UiTranslations> = {
  en: EN_TRANSLATIONS,
  hi: {
    appName: 'वायुशील्ड (VayuShield)',
    tagline: 'गंभीर स्मॉग में परिवारों के लिए सरल सुरक्षा सहायक',
    selectLanguage: 'भाषा (Language)',
    largeText: 'बड़ा अक्षर (Large Text)',
    normalText: 'सामान्य अक्षर',
    readAloud: 'सुनें (आवाज़ में) 🔊',
    stopReading: 'रोकें ⏹️',
    voiceSearch: 'बोलकर खोजें',
    listening: 'सुन रहे हैं...',
    demoBadge: 'डेमो मोड (ऑफलाइन सुरक्षित प्लान)',
    liveBadge: 'जेमिनी लाइव एआई',
    cachedNotice: 'पिछला सुरक्षित डेटा दिखाया जा रहा है',
    
    dangerTitle: 'आज का प्रदूषण स्तर',
    gaugeLabel: 'प्रदूषण पैमाना (0 - 500)',
    categoryLabelPrefix: 'श्रेणी',
    trafficSafe: 'सुरक्षित: हवा साफ है',
    trafficWarning: 'सावधान रहें: संवेदनशील लोग ध्यान दें',
    trafficDanger: 'खतरा: बाहर जहरीला धुआं है, घर बंद रखें',
    whoExceedLabel: 'गुना ज्यादा (विश्व स्वास्थ्य संगठन सीमा से)',
    categoryNames: {
      good: 'अच्छा (Good)',
      moderate: 'मध्यम (Moderate)',
      unhealthy_sensitive: 'संवेदनशील लोगों के लिए अस्वस्थ',
      unhealthy: 'अस्वस्थ (Unhealthy)',
      very_unhealthy: 'बहुत अस्वस्थ (Very Unhealthy)',
      hazardous: 'खतरनाक / गंभीर स्मॉग (Hazardous)'
    },
    categorySummaries: {
      good: 'हवा पूरी तरह साफ है। खिड़कियां खोल सकते हैं और बाहर खेल सकते हैं।',
      moderate: 'हवा सामान्य है। बहुत ज्यादा संवेदनशील लोग हल्की सावधानी रखें।',
      unhealthy_sensitive: 'बच्चों, बुजुर्गों और दमा के मरीजों के लिए असुरक्षित। खिड़कियां बंद रखें।',
      unhealthy: 'सभी के लिए हानिकारक हवा। बाहर ज्यादा देर रहने से फेफड़ों में जलन होगी।',
      very_unhealthy: 'आपातकालीन चेतावनी: बाहर जहरीला स्मॉग है। घर में रहें और खिड़की-दरवाजे सील रखें।',
      hazardous: 'महा-आपदा: हवा में अत्यधिक जहरीले कण हैं जो सीधे फेफड़ों में जाते हैं। घर में ही क्वारंटाइन रहें।'
    },
    pm25Label: 'PM2.5 (बारीक कालिख)',
    pm10Label: 'PM10 (सड़क की धूल)',
    maskStandardLabel: 'मास्क मानक',
    clothFailsShort: 'कपड़े का मास्क बेकार',
    
    bestTimeTitle: 'हवा कब बेहतर होगी?',
    bestTimeLabel: 'आज बाहर जाने का सबसे सुरक्षित समय',
    worseAfter: 'इसके बाद हवा फिर खराब होगी',
    stayIndoorsAllDay: 'आज हवा बिल्कुल साफ नहीं होगी। पूरे दिन घर में ही रहें।',
    countdownImproving: 'हवा में सुधार होगा',
    remindMe: 'सुरक्षित समय पर याद दिलाएं 🔔',
    reminderSet: 'रिमाइंडर सेट हो गया है!',
    bestTimeSentence: (start, end, worse) => `बाहर जाने का सबसे अच्छा समय: ${start} से ${end} तक। इसके बाद ${worse} बजे हवा फिर खराब होगी।`,
    happeningNow: 'यह समय अभी चल रहा है!',
    nextSafeTomorrow: 'कल सुरक्षित समय शुरू होगा',
    
    oneThingTitle: '⭐ आज का सबसे जरूरी 1 काम',
    
    searchCityPlaceholder: 'अपने शहर का नाम लिखें...',
    useMyLocation: 'मेरी लोकेशन से खोजें 📍',
    presetsTitle: '1-क्लिक प्रदूषण उदाहरण:',
    presetDelhi: 'दिल्ली: गंभीर स्मॉग AQI 385',
    presetLahore: 'लाहौर: खतरनाक स्मॉग AQI 340',
    presetModerate: 'हल्की धुंध AQI 145',
    
    profileTitle: 'घर में कौन-कौन सदस्य हैं?',
    profileSubtitle: 'परिवार के सभी सदस्यों पर निशान लगाएं ताकि सही सुरक्षा मिले।',
    updatePlanBtn: 'नया फैमिली प्लान बनाएं',
    loadingPlan: 'सुरक्षा योजना तैयार हो रही है...',
    toddlersLabel: 'छोटे बच्चे 👶',
    elderlyLabel: 'बुजुर्ग / माता-पिता 👵',
    asthmaLabel: 'दमा / सांस / खांसी की परेशानी 🫁',
    commuterLabel: 'बाहर काम या बाइक से जाने वाले 🛵',
    wfhLabel: 'घर पर रहने वाले (WFH) 🏠',
    otherConditionLabel: 'अन्य कोई स्थिति / बीमारी ✍️',
    otherConditionPlaceholder: 'अन्य स्थिति लिखें (जैसे गर्भवती, दिल के मरीज, पालतू जानवर)...',
    tapToAdd: 'जोड़ने के लिए छुएं',
    selectedText: 'चुना गया ✓',
    customConditionPrompt: 'अन्य सदस्य या बीमारी के बारे में बताएं:',
    
    purifierLabel: 'क्या घर में एयर प्यूरीफायर (Air Purifier) है?',
    purifierYes: 'घर में एक्टिव HEPA प्यूरीफायर है',
    purifierNo: 'प्यूरीफायर नहीं है (घरेलू तरीकों पर निर्भर)',
    stoveLabel: 'खाना पकाने का चूल्हा',
    stoveGas: 'गैस सिलेंडर / पीएनजी (धुआं व गैस)',
    stoveElectric: 'इलेक्ट्रिक हीटर',
    stoveInduction: 'इंडक्शन चूल्हा (सबसे साफ)',
    stoveOther: 'अन्य / लकड़ी / कोयला चूल्हा',
    commuteLabel: 'सफर का साधन क्या है?',
    commuteMetro: 'मेट्रो ट्रेन / एसी बस',
    commuteCar: 'कार / एसी कैब',
    commuteBike: 'मोटरसाइकिल / स्कूटर / ऑटो',
    commuteWalk: 'पैदल / साइकिल',
    commuteOther: 'अन्य साधन',
    customSetupPlaceholder: 'अपने चूल्हे या सफर के बारे में लिखें...',
    
    familyBriefingTitle: 'परिवार के लिए सीधी सलाह',
    routineTitle: 'आज का 4-चरणीय रूटीन',
    indoorHacksTitle: 'आसान घरेलू उपाय (बिना खर्च के)',
    swapsTitle: 'साफ हवा के लिए छोटी आदतें',
    dosAndDontsTitle: 'क्या करें और क्या न करें',
    dosTitle: 'आज यह जरूर करें ✅',
    dontsTitle: 'यह गलती बिल्कुल न करें ❌',
    windowRulePrefix: '🪟 खिड़की व हवा का नियम:',
    familyGuidancePrefix: '👥 परिवार के सदस्यों के लिए सलाह:',
    whyMattersPrefix: 'यह उपाय आपके घर के लिए क्यों जरूरी है:',
    markDone: 'पूरा किया',
    doneText: 'हो गया ✓',
    adoptSwap: 'आदत अपनाएं',
    adoptedText: 'अपना लिया ✓',
    
    maskGuideTitle: 'मास्क गाइड: कौन सा मास्क बचाता है?',
    n95Works: 'N95 / FFP2 मास्क: 95% जहरीला धुआं रोकता है। नाक पर सही बैठाएं।',
    n95Tip: '👉 नाक की पत्ती को दबाकर पूरी तरह सील करें।',
    clothFails: 'कपड़े और सर्जिकल मास्क: बारीक जहरीले कणों को नहीं रोक पाते।',
    clothTip: '👉 जहरीला धुआं कपड़े के छेदों से आसानी से आर-पार निकल जाता है।',
    seeDoctorTitle: '🚨 तुरंत डॉक्टर के पास कब जाएं?',
    doctorWarningSymptoms: 'सांस फूलना, सीने में दर्द, लगातार तेज खांसी या होंठ नीले पड़ने पर तुरंत अस्पताल जाएं।',
    doctorSymptomsList: [
      '⚠️ अत्यधिक सांस फूलना या घबराहट',
      '⚠️ सीने में तेज दर्द या जकड़न',
      '⚠️ होंठ या नाखूनों का नीला पड़ना',
      '⚠️ लगातार खांसी और उल्टी का मन'
    ],
    disclaimerText: 'यह सामान्य प्रदूषण जानकारी है, डॉक्टर की दवा या इलाज का विकल्प नहीं।',
    
    trackerTitle: 'पारिवारिक सुरक्षा ट्रैकर',
    trackerSubtitle: 'लाइव परिवार सुरक्षा इंडेक्स',
    protectionScore: 'सुरक्षा स्कोर',
    co2Saved: 'बचाया गया CO₂',
    howCalculated: 'यह कैसे गिना जाता है?',
    estIndoorAqiPrefix: 'घर के अंदर अनुमानित AQI',
    co2CommunityImpact: 'स्वच्छ पर्यावरण में आपका योगदान',
    currentIsolationPrefix: 'वर्तमान सुरक्षा स्तर',
    isolationOptimal: 'उत्तम सुरक्षा: घर की हवा बाहर के जहरीले स्मॉग से काफी सुरक्षित है।',
    isolationModerate: 'मध्यम सुरक्षा: ठीक स्थिति है; बची हुई आदतें अपनाकर सुरक्षा बढ़ाएं।',
    isolationElevated: 'खतरे में: बाहर का जहरीला धुआं घर में घुस रहा है, लीकेज बंद करें।',
    indoorHacksChecklistTitle: 'घरेलू छोटे उपाय',
    swapsChecklistTitle: 'स्वच्छ हवा की आदतें',
    realtimeUpdateNote: 'तुरंत अपडेट होता है',
    viewFormulaBtn: 'गणना का फॉर्मूला देखें',
    
    askVayuBtn: 'वायु सहायक से पूछें',
    askVayuTitle: 'पूछें वायु: तुरंत मदद',
    askPlaceholder: 'छोटा सवाल पूछें (जैसे: क्या बच्चे पार्क जा सकते हैं?)...',
    askContextNotice: '3 छोटे वाक्यों में हां / ना / रुकें से शुरू होने वाला उत्तर।',
    
    shareCardBtn: 'फैमिली कार्ड शेयर करें',
    copyTextBtn: 'कॉपी करें',
    whatsAppBtn: 'व्हाट्सएप पर भेजें',
    downloadCardBtn: 'PDF कार्ड डाउनलोड करें',
    downloadingPdf: 'PDF तैयार हो रहा है...',
    copied: 'कॉपी हो गया!',
  },

  ur: {
    appName: 'وایو شیلڈ (VayuShield)',
    tagline: 'شدید اسموگ میں خاندانوں کے لیے آسان حفاظتی گائیڈ',
    selectLanguage: 'زبان (Language)',
    largeText: 'بڑے حروف (Large Text)',
    normalText: 'عام حروف',
    readAloud: 'سنیں (آواز میں) 🔊',
    stopReading: 'روکیں ⏹️',
    voiceSearch: 'بول کر تلاش کریں',
    listening: 'سن رہے ہیں...',
    demoBadge: 'ڈیمو موڈ (آف لائن پلان)',
    liveBadge: 'جیمنی لائیو AI',
    cachedNotice: 'محفوظ شدہ پرانا ڈیٹا دکھایا جا رہا ہے',
    
    dangerTitle: 'آج کا فضائی آلودگی لیول',
    gaugeLabel: 'آلودگی کا پیمانہ (0 - 500)',
    categoryLabelPrefix: 'درجہ بندی',
    trafficSafe: 'محفوظ: ہوا صاف ہے',
    trafficWarning: 'احتیاط کریں: حساس افراد دھیان رکھیں',
    trafficDanger: 'خطرہ: باہر زہریلا دھواں ہے، کھڑکیاں بند رکھیں',
    whoExceedLabel: 'گنا زیادہ (عالمی ادارہ صحت کی حد سے)',
    categoryNames: {
      good: 'اچھا (Good)',
      moderate: 'معتدل (Moderate)',
      unhealthy_sensitive: 'حساس افراد کے لیے مضر',
      unhealthy: 'مضر صحت (Unhealthy)',
      very_unhealthy: 'انتہائی مضر صحت',
      hazardous: 'خطرناک اسموگ (Hazardous)'
    },
    categorySummaries: {
      good: 'ہوا بالکل صاف ہے۔ کھڑکیاں کھول سکتے ہیں اور باہر جا سکتے ہیں۔',
      moderate: 'ہوا مناسب ہے۔ انتہائی حساس افراد ہلکی احتیاط کریں۔',
      unhealthy_sensitive: 'بچوں، بوڑھوں اور دمہ کے مریضوں کے لیے خطرناک۔ کھڑکیاں بند رکھیں۔',
      unhealthy: 'تمام افراد کے لیے مضر ہوا ہے۔ باہر جانے سے گریز کریں۔',
      very_unhealthy: 'ہنگامی الرٹ: باہر زہریلا دھواں ہے۔ گھر میں رہیں اور کھڑکیاں بند رکھیں۔',
      hazardous: 'شدید آفت: ہوا میں زہریلے ذرات پھیپھڑوں کو نقصان پہنچاتے ہیں۔ باہر نہ نکلیں۔'
    },
    pm25Label: 'PM2.5 (باریک دھواں)',
    pm10Label: 'PM10 (سڑک کی مٹی)',
    maskStandardLabel: 'ماسک کی ضرورت',
    clothFailsShort: 'کپڑے کا ماسک ناکارہ',
    
    bestTimeTitle: 'ہوا کب بہتر ہوگی؟',
    bestTimeLabel: 'آج باہر جانے کا محفوظ ترین وقت',
    worseAfter: 'اس کے بعد ہوا دوبارہ خراب ہوگی',
    stayIndoorsAllDay: 'آج دھواں کم نہیں ہوگا۔ سارا دن اندر ہی رہیں۔',
    countdownImproving: 'ہوا میں بہتری آئے گی',
    remindMe: 'محفوظ وقت پر یاد دہانی کرائیں 🔔',
    reminderSet: 'یاد دہانی فعال ہو چکی ہے!',
    bestTimeSentence: (start, end, worse) => `باہر جانے کا بہترین وقت: ${start} سے ${end}۔ اس کے بعد ${worse} بجے ہوا دوبارہ خراب ہوگی۔`,
    happeningNow: 'یہ وقت ابھی جاری ہے!',
    nextSafeTomorrow: 'اگلا محفوظ وقت کل شروع ہوگا',
    
    oneThingTitle: '⭐ آج کا سب سے اہم ترین 1 کام',
    
    searchCityPlaceholder: 'اپنے شہر کا نام لکھیں...',
    useMyLocation: 'میری لوکیشن استعمال کریں 📍',
    presetsTitle: 'فوری 1-کلک اسموگ کے نمونے:',
    presetDelhi: 'دہلی: شدید اسموگ AQI 385',
    presetLahore: 'لاہور: خطرناک اسموگ AQI 340',
    presetModerate: 'ہلکی دھند AQI 145',
    
    profileTitle: 'گھر میں کون کون رہتا ہے؟',
    profileSubtitle: 'گھر کے تمام افراد پر نشان لگائیں تاکہ ان کی مکمل حفاظت ہو سکے۔',
    updatePlanBtn: 'نیا فیملی پلان بنائیں',
    loadingPlan: 'حفاظتی پلان تیار ہو رہا ہے...',
    toddlersLabel: 'چھوٹے بچے 👶',
    elderlyLabel: 'بزرگ والدین / دادا دادی 👵',
    asthmaLabel: 'دمہ / الرجی / سانس کی تکلیف 🫁',
    commuterLabel: 'موٹر سائیکل یا پبلک ٹرانسپورٹ مسافر 🛵',
    wfhLabel: 'گھر پر رہنے والے (WFH) 🏠',
    otherConditionLabel: 'کوئی اور مسئلہ یا بیماری ✍️',
    otherConditionPlaceholder: 'دیگر تفصیلات لکھیں (مثلاً حاملہ، دل کے مریض، پالتو جانور)...',
    tapToAdd: 'شامل کرنے کے لیے دبائیں',
    selectedText: 'منتخب شدہ ✓',
    customConditionPrompt: 'دیگر مسئلہ یا بیماری کی تفصیل:',
    
    purifierLabel: 'کیا گھر میں ایئر پیوریفائر موجود ہے؟',
    purifierYes: 'گھر میں فعال HEPA پیوریفائر موجود ہے',
    purifierNo: 'پیوریفائر نہیں ہے (گھریلو طریقوں پر انحصار)',
    stoveLabel: 'باورچی خانے کا چولہا',
    stoveGas: 'سوئی گیس / ایل پی جی سلنڈر',
    stoveElectric: 'الیکٹرک ہیٹر',
    stoveInduction: 'انڈکشن چولہا (سب سے صاف)',
    stoveOther: 'دیگر / لکڑی یا کوئلے کا چولہا',
    commuteLabel: 'سفر کا ذریعہ کیا ہے؟',
    commuteMetro: 'میٹرو ٹرین / ایئرکنڈیشنڈ بس',
    commuteCar: 'گاڑی / ٹیکسی (اے سی کے ساتھ)',
    commuteBike: 'موٹرسائیکل / رکشہ / اسکوٹر',
    commuteWalk: 'پیدل / سائیکل',
    commuteOther: 'کوئی اور ذریعہ',
    customSetupPlaceholder: 'چولہے یا سفر کی تفصیل لکھیں...',
    
    familyBriefingTitle: 'خاندان کے لیے آسان رہنمائی',
    routineTitle: 'آج کا 4 مرحلوں پر مشتمل معمول',
    indoorHacksTitle: 'گھریلو اور مفت تدابیر',
    swapsTitle: 'صاف ہوا کے لیے چھوٹی تبدیلیاں',
    dosAndDontsTitle: 'کیا کریں اور کیا نہ کریں',
    dosTitle: 'آج یہ لازمی کریں ✅',
    dontsTitle: 'یہ ہرگز نہ کریں ❌',
    windowRulePrefix: '🪟 کھڑکی کھولنے کا اصول:',
    familyGuidancePrefix: '👥 فیملی ممبرز کے لیے رہنمائی:',
    whyMattersPrefix: 'یہ آپ کے گھر کے لیے کیوں ضروری ہے:',
    markDone: 'مکمل ہوا',
    doneText: 'ہو گیا ✓',
    adoptSwap: 'اپنائیں',
    adoptedText: 'اپنا لیا ✓',
    
    maskGuideTitle: 'ماسک گائیڈ: کون سا ماسک کام کرتا ہے؟',
    n95Works: 'N95 / FFP2 ماسک: باریک زہریلے دھوئیں کو روکتا ہے۔ ناک پر درست فٹ کریں۔',
    n95Tip: '👉 ناک کی پٹی کو دبا کر مکمل بند کریں۔',
    clothFails: 'کپڑے اور سرجیکل ماسک: زہریلے اسموگ ذرات کے خلاف بالکل بے اثر ہیں۔',
    clothTip: '👉 زہریلا دھواں کپڑے کے سوراخوں سے باآسانی گزر جاتا ہے۔',
    seeDoctorTitle: '🚨 فوری طور پر ڈاکٹر کے پاس کب جائیں؟',
    doctorWarningSymptoms: 'سینے میں شدید درد، سانس لینے میں دشواری، یا ہونٹوں کی نیلاہٹ پر فوری اسپتال جائیں۔',
    doctorSymptomsList: [
      '⚠️ سانس لینے میں شدید دشواری',
      '⚠️ سینے میں درد یا دباؤ',
      '⚠️ ہونٹوں یا ناخنوں کا نیلا پڑنا',
      '⚠️ مسلسل کھانسی یا الٹی'
    ],
    disclaimerText: 'یہ عمومی معلومات ہے، طبی تشخیص یا دوا کا متبادل نہیں۔',
    
    trackerTitle: 'خاندانی حفاظتی ٹریکر',
    trackerSubtitle: 'لائیو فیملی پروٹیکشن انڈیکس',
    protectionScore: 'حفاظتی اسکور',
    co2Saved: 'بچائی گئی کاربن ڈائی آکسائیڈ',
    howCalculated: 'اس کا حساب کیسے ہوتا ہے؟',
    estIndoorAqiPrefix: 'گھر کے اندر کا اندازاً AQI',
    co2CommunityImpact: 'صاف ماحول میں آپ کا کردار',
    currentIsolationPrefix: 'موجودہ حفاظتی صورتحال',
    isolationOptimal: 'بہترین حفاظت: اندرونی ہوا بیرونی زہریلے دھوئیں سے محفوظ ہے۔',
    isolationModerate: 'معتدل حفاظت: اچھی حالت ہے؛ باقی کام کر کے حفاظت بڑھائیں۔',
    isolationElevated: 'خطرہ: بیرونی دھواں اندر داخل ہو رہا ہے، خلا کو بند کریں۔',
    indoorHacksChecklistTitle: 'گھریلو چھوٹے طریقے',
    swapsChecklistTitle: 'صاف ہوا کی عادات',
    realtimeUpdateNote: 'فوری اپ ڈیٹ ہوتا ہے',
    viewFormulaBtn: 'حساب کا طریقہ دیکھیں',
    
    askVayuBtn: 'وایو اسسٹنٹ سے پوچھیں',
    askVayuTitle: 'پوچھیں وایو: فوری مدد',
    askPlaceholder: 'مختصر سوال پوچھیں (مثلاً: کیا بچے پارک جا سکتے ہیں؟)...',
    askContextNotice: '3 مختصر جملوں میں جواب جو ہاں / نہیں / ٹھہریں سے شروع ہوگا۔',
    
    shareCardBtn: 'فیملی کارڈ شیئر کریں',
    copyTextBtn: 'کاپی کریں',
    whatsAppBtn: 'واٹس ایپ پر بھیجیں',
    downloadCardBtn: 'PDF کارڈ ڈاؤن لوڈ کریں',
    downloadingPdf: 'PDF بن رہا ہے...',
    copied: 'کاپی ہو گیا!',
  },

  bn: {
    ...getLanguageTemplate('bn', 'বাংলা (Bengali)')
  },
  ta: {
    ...getLanguageTemplate('ta', 'தமிழ் (Tamil)')
  },
  te: {
    ...getLanguageTemplate('te', 'తెలుగు (Telugu)')
  },
  mr: {
    ...getLanguageTemplate('mr', 'मराठी (Marathi)')
  }
};

function getLanguageTemplate(lang: SupportedLanguage, nativeLabel: string): UiTranslations {
  // Base template with rich native translated fallbacks
  const base = EN_TRANSLATIONS;
  if (lang === 'bn') {
    return {
      ...base,
      appName: 'বায়ুশীল্ড (VayuShield)',
      tagline: 'তীব্র ধোঁয়াশায় পরিবারের জন্য সহজ সুরক্ষা সহায়ক',
      selectLanguage: 'ভাষা (Language)',
      dangerTitle: 'আজকের বাতাসের দূষণ মাত্রা',
      bestTimeTitle: 'বাতাস কখন ভালো হবে?',
      oneThingTitle: '⭐ আজকের সবচেয়ে গুরুত্বপূর্ণ ১টি কাজ',
      profileTitle: 'আপনার পরিবারে কারা আছেন?',
      familyBriefingTitle: 'পরিবারের জন্য সহজ নির্দেশনা',
      routineTitle: 'আজকের ৪-ধাপের রুটিন',
      indoorHacksTitle: 'সহজ ও বিনামূল্যের ঘরোয়া কৌশল',
      swapsTitle: 'পরিষ্কার বাতাসের জন্য সহজ পরিবর্তন',
      dosAndDontsTitle: 'কী করবেন এবং কী করবেন না',
      dosTitle: 'আজ অবশ্যই যা করবেন ✅',
      dontsTitle: 'যা একদম করবেন না ❌',
      maskGuideTitle: 'মাস্ক গাইড: কোন মাস্ক কাজ করে?',
      seeDoctorTitle: '🚨 কখন অবিলম্বে ডাক্তারের কাছে যাবেন?',
      trackerTitle: 'পারিবারিক সুরক্ষা তালিকা',
      askVayuTitle: 'বায়ুকে প্রশ্ন করুন',
      shareCardBtn: 'ফ্যামিলি কার্ড শেयर করুন',
      downloadCardBtn: 'PDF কার্ড ডাউনলোড করুন',
      bestTimeSentence: (start, end, worse) => `বাইরে বেরোনোর সেরা সময়: ${start} থেকে ${end} পর্যন্ত। ${worse} টার পর বাতাস আবার খারাপ হবে।`,
    };
  }
  if (lang === 'mr') {
    return {
      ...base,
      appName: 'वायुशील्ड (VayuShield)',
      tagline: 'हिवाळ्यातील तीव्र धुक्यात कुटुंबासाठी सोपा सुरक्षा सहाय्यक',
      selectLanguage: 'भाषा (Language)',
      dangerTitle: 'आजची हवेतील प्रदूषण पातळी',
      bestTimeTitle: 'हवा कधी सुधारेल?',
      oneThingTitle: '⭐ आजची सर्वात महत्त्वाची १ गोष्ट',
      profileTitle: 'घरात कोण कोण राहते?',
      familyBriefingTitle: 'कुटुंबासाठी सोपा सल्ला',
      routineTitle: 'आजचे ४-टप्प्यांचे वेळापत्रक',
      indoorHacksTitle: 'सोपे घरगुती उपाय (विनाखर्च)',
      swapsTitle: 'स्वच्छ हवेसाठी छोट्या सवयी',
      dosAndDontsTitle: 'काय करावे आणि काय टाळावे',
      dosTitle: 'आज हे नक्की करा ✅',
      dontsTitle: 'ही चूक करू नका ❌',
      maskGuideTitle: 'मास्क मार्गदर्शक: कोणता मास्क उपयुक्त आहे?',
      seeDoctorTitle: '🚨 त्वरित डॉक्टरांकडे कधी जावे?',
      trackerTitle: 'कौटुंबिक सुरक्षा चेकलिस्ट',
      askVayuTitle: 'विचारा वायू: झटपट मदत',
      shareCardBtn: 'कौटुंबिक कार्ड शेअर करा',
      downloadCardBtn: 'PDF कार्ड डाउनलोड करा',
      bestTimeSentence: (start, end, worse) => `बाहेर पडण्याची सर्वात उत्तम वेळ: ${start} ते ${end} पर्यंत। ${worse} नंतर हवा पुन्हा बिघडेल।`,
    };
  }
  if (lang === 'ta') {
    return {
      ...base,
      appName: 'வாயுஷீல்ட் (VayuShield)',
      tagline: 'பனிப்புகை காலத்தில் குடும்பங்களுக்கான எளிய காற்று பாதுகாப்பு வழிகாட்டி',
      selectLanguage: 'மொழி (Language)',
      dangerTitle: 'இன்றைய காற்று மாசுபாடு நிலை',
      bestTimeTitle: 'காற்று எப்போது சரியாகும்?',
      oneThingTitle: '⭐ இன்று செய்ய வேண்டிய மிக முக்கியமான 1 விஷயம்',
      profileTitle: 'உங்கள் வீட்டில் யார் யார் உள்ளனர்?',
      familyBriefingTitle: 'குடும்பத்திற்கான வழிகாட்டல்',
      routineTitle: 'இன்றைய 4-நேர அட்டவணை',
      indoorHacksTitle: 'எளிய வீட்டு முறைகள் (செலவில்லாதவை)',
      swapsTitle: 'தூய காற்றுக்கான எளிய மாற்றங்கள்',
      dosAndDontsTitle: 'செய்ய வேண்டியவை மற்றும் செய்யக்கூடாதவை',
      dosTitle: 'இன்று செய்ய வேண்டியவை ✅',
      dontsTitle: 'தவிர்க்க வேண்டியவை ❌',
      maskGuideTitle: 'முகக்கவசம் வழிகாட்டி: எது பயனுள்ளது?',
      seeDoctorTitle: '🚨 எப்போது உடனடியாக மருத்துவரிடம் செல்ல வேண்டும்?',
      trackerTitle: 'பாதுகாப்பு சரிபார்ப்புப் பட்டியல்',
      askVayuTitle: 'கேளுங்கள் வாயு',
      shareCardBtn: 'குடும்ப கார்டை பகிர்க',
      downloadCardBtn: 'PDF கார்டை பதிவிறக்குக',
      bestTimeSentence: (start, end, worse) => `வெளியே செல்ல சிறந்த நேரம்: ${start} முதல் ${end} வரை. ${worse} மணிக்கு பிறகு காற்று மோசமாகும்.`,
    };
  }
  // te
  return {
    ...base,
    appName: 'వాయుషీల్డ్ (VayuShield)',
    tagline: 'చలికాలపు తీవ్ర పొగమంచులో కుటుంబాలకు సులభమైన రక్షణ సహాయకుడు',
    selectLanguage: 'భాష (Language)',
    dangerTitle: 'నేటి వాయు కాలుష్య స్థాయి',
    bestTimeTitle: 'గాలి ఎప్పుడు మెరుగుపడుతుంది?',
    oneThingTitle: '⭐ ఈ రోజు చేయవలసిన అత్యంత ముఖ్యమైన 1 పని',
    profileTitle: 'ఇంట్లో ఎవరెవరు ఉన్నారు?',
    familyBriefingTitle: 'కుటుంబం కోసం సూచనలు',
    routineTitle: 'నేటి 4-సమయాల దినచర్య',
    indoorHacksTitle: 'ఖర్చులేని సులభమైన చిట్కాలు',
    swapsTitle: 'స్వచ్ఛమైన గాలి కోసం చిన్న మార్పులు',
    dosAndDontsTitle: 'చేయవలసినవి మరియు చేయకూడనివి',
    dosTitle: 'తప్పక చేయవలసినవి ✅',
    dontsTitle: 'అస్సలు చేయకూడనివి ❌',
    maskGuideTitle: 'మాస్క్ గైడ్: ఏ మాస్క్ పనిచేస్తుంది?',
    seeDoctorTitle: '🚨 ఎప్పుడు వెంటనే డాక్టర్‌ను సంప్రదించాలి?',
    trackerTitle: 'కుటుంబ రక్షణ చెక్‌లిస్ట్',
    askVayuTitle: 'వాయును ప్రశ్నించండి',
    shareCardBtn: 'ఫ్యామిలీ కార్డును షేర్ చేయండి',
    downloadCardBtn: 'PDF కార్డు డౌన్‌లోడ్ చేయండి',
    bestTimeSentence: (start, end, worse) => `బయటకు వెళ్లడానికి ఉత్తమ సమయం: ${start} నుండి ${end} వరకు. ${worse} తర్వాత గాలి మళ్లీ క్షీణిస్తుంది.`,
  };
}

export function getTranslation(lang: SupportedLanguage): UiTranslations {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
