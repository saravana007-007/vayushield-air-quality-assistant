// VayuShield Bundled Demo Plans for instant resilience
// Provides curated, safe plans for presets across all 7 supported languages

import type { ActionPlan } from '../types';
import type { SupportedLanguage } from '../i18n';

export const DEMO_PLANS: Record<string, ActionPlan> = {
  // Preset 1: Delhi Severe Smog (AQI 385) - English
  'delhi-severe': {
    oneThingToDo: 'Keep all windows and balcony doors tightly closed until 2 PM.',
    familyRiskBriefing: 'Today air quality across Delhi NCR sits in the Severe category (AQI 385). Cold surface temperatures and low boundary layers are trapping ultra-fine PM2.5 close to the ground. For your household—especially young children, seniors, and anyone managing respiratory sensitivities—indoor containment is your first defense. Keep physical exertion low, prioritize well-sealed rooms, and wear an N95/FFP2 respirator for any mandatory outdoor travel.',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'Morning Smog Peak (5:00 AM – 9:00 AM)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'Keep all doors, balconies, and windows hermetically sealed. Do not aerate.',
        memberGuidance: 'Cancel outdoor school runs and morning walks for elderly members. Toddlers should play in the most central room. Outdoor commuters must don a tightly fitted N95 respirator before opening exterior doors.'
      },
      {
        id: 'midday',
        title: 'Midday Thermal Lift (12:00 PM – 3:00 PM)',
        timeRange: '12:00 - 15:00',
        badge: 'Mask Required',
        windowRule: 'Cracked window ventilation permitted only if running high-fan air purification; otherwise keep shut.',
        memberGuidance: 'Solar warmth slightly disperses particulate. Best window for outdoor grocery runs or commuting between appointments. All members stepping outside require N95/FFP2 masks; cloth coverings do not filter PM2.5.'
      },
      {
        id: 'evening',
        title: 'Evening Inversion Trap (5:00 PM – 9:00 PM)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'Completely seal all openings. Smog rapidly descends as ground cools.',
        memberGuidance: 'Move toddlers and seniors away from street-facing rooms. Avoid dry sweeping or frying foods that add particulate load indoors. Run air purifiers on medium-high.'
      },
      {
        id: 'night',
        title: 'Overnight Micro-Climate (9:00 PM – 5:00 AM)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'Keep bedroom windows and vents tightly locked. Block door under-gap with rolled moist towel.',
        memberGuidance: 'Consolidate vulnerable members into bedrooms with active filtration. Keep ceiling fans at low speed to prevent stirring settled surface particulate.'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'Targeted Bedroom Micro-Sanctuary',
        targetArea: 'Bedroom & Sleep Zone',
        steps: [
          'Choose the innermost bedroom with the fewest exterior windows.',
          'Position your air purifier 2 feet away from walls, angled toward breathing heights.',
          'Close the bedroom door 45 minutes prior to bedtime on high speed, then lower to quiet sleep mode.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Up to 65% cleaner overnight breathing zone'
      },
      {
        id: 'hack-2',
        title: 'Kitchen Inversion Ventilation Containment',
        targetArea: 'Kitchen & Cooking Area',
        steps: [
          'Always place snug lids on all pots when sautéing, boiling, or steaming.',
          'Run the range hood or exhaust fan on high, and keep kitchen doors closed to main living spaces.',
          'Avoid dry red chili roasting, tempering (tadka), or high-smoke pan searing after 5 PM.'
        ],
        difficulty: 'Moderate (15 min)',
        estimatedReduction: 'Prevents 50-80 µg/m³ indoor particulate spikes'
      },
      {
        id: 'hack-3',
        title: 'Towel Draft Interception Barrier',
        targetArea: 'Main Entrance & Balcony Sliders',
        steps: [
          'Dampen a dense bath towel with clean water and wring thoroughly until barely moist.',
          'Roll tightly into a cylindrical snake and wedge firmly along door thresholds and balcony track gaps.',
          'Re-moisten once daily in the late afternoon to trap fine microscopic soot.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Blocks 25-35% of outdoor soot ingress'
      },
      {
        id: 'hack-4',
        title: 'Static Particle Settling & Damp Microfiber Wipe',
        targetArea: 'Living Room & Play Surfaces',
        steps: [
          'Spritz a microfiber cloth lightly with water (never sweep with dry grass brooms or feather dusters).',
          'Wipe child play mats, crib rails, and desk surfaces from high shelves downward.',
          'Rinse the cloth in a basin to permanently capture settled heavy metals and sulfate dust.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Cuts resuspended airborne dust by 60%'
      }
    ],
    swaps: [
      {
        catalogId: 'carpool-metro-transit',
        customReason: 'Switching outdoor two-wheeler or road travel to metro cuts direct diesel exhaust exposure during peak Delhi smog hours.'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'Replaces evening prayer incense or dhoop with warm cinnamon-clove water, preventing harmful indoor benzene and fine soot buildup.'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'Cooking with lids during midday keeps evening kitchen emissions from compounding severe inversion smog inside your living quarters.'
      },
      {
        catalogId: 'zero-waste-mulching',
        customReason: 'Ensures no household garden debris is burned at the curb, protecting children and seniors from localized toxic combustion plumes.'
      }
    ],
    dos: [
      'Wear a tightly sealed N95 mask if you must go outdoors.',
      'Damp mop floor tiles instead of dry sweeping.',
      'Run kitchen exhaust fan with lids on pots during cooking.'
    ],
    donts: [
      'Do not go for morning outdoor walks or jogs before 10 AM.',
      'Do not light incense sticks, dhoop, or scented candles inside.',
      'Do not burn dry leaves or garbage in the neighborhood.'
    ],
    isDemo: true,
    language: 'en',
  },

  // Preset 1: Delhi Severe Smog (AQI 385) - Hindi
  'delhi-severe-hi': {
    oneThingToDo: 'दोपहर 2 बजे तक घर की सभी खिड़कियां और बालकनी के दरवाजे पूरी तरह बंद रखें।',
    familyRiskBriefing: 'आज दिल्ली में प्रदूषण का स्तर बेहद खतरनाक (AQI 385) है। ठंडी हवा और धुएं के कारण जहरीले कण जमीन के पास जमा हैं। छोटे बच्चों, बुजुर्गों और दमा के मरीजों को खास तौर पर घर के अंदर रहना चाहिए। बाहर जाना जरूरी हो तो सिर्फ N95 मास्क पहनें, कपड़े का मास्क जहरीले धुएं से नहीं बचाता।',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'सुबह का भारी स्मॉग (सुबह 5:00 से 9:00)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'खिड़कियां और बालकनी पूरी तरह बंद रखें। ताजी हवा के लिए दरवाजे न खोलें।',
        memberGuidance: 'बुजुर्गों की सुबह की सैर बंद रखें। बच्चों को घर के अंदर रखें। बाइक से ऑफिस जाने वाले N95 मास्क जरूर पहनें।'
      },
      {
        id: 'midday',
        title: 'दोपहर की हल्की धूप (दोपहर 12:00 से 3:00)',
        timeRange: '12:00 - 15:00',
        badge: 'Mask Required',
        windowRule: 'यदि आवश्यक हो तो 15-20 मिनट के लिए खिड़की खोल सकते हैं।',
        memberGuidance: 'सब्जी या जरूरी सामान लाने का यह सबसे सही समय है। बाहर जाते समय N95 मास्क अवश्य लगाएं।'
      },
      {
        id: 'evening',
        title: 'शाम का स्मॉग ट्रैप (शाम 5:00 से रात 9:00)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'शाम ढलते ही सारे दरवाजे-खिड़कियां तुरंत बंद कर लें।',
        memberGuidance: 'बच्चों और बुजुर्गों को सड़क किनारे वाले कमरों से दूर रखें। घर में झाड़ू न लगाएं।'
      },
      {
        id: 'night',
        title: 'रात का समय (रात 9:00 से सुबह 5:00)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'कमरे की खिड़की बंद रखें और दरवाजे के नीचे गीला तौलिया लगाएं।',
        memberGuidance: 'प्यूरीफायर को रात में धीमे मोड पर चालू रखें। पंखे की गति धीमी रखें।'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'सोने के कमरे को सेफ जोन बनाएं',
        targetArea: 'बेडरूम',
        steps: [
          'कमरे की सभी खिड़कियां बंद करें।',
          'एयर प्यूरीफायर को बिस्तर के पास रखें।',
          'सोने से 30 मिनट पहले तेज चलाएं, फिर स्लीप मोड पर रखें।'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'रात में 65% तक साफ हवा'
      },
      {
        id: 'hack-2',
        title: 'रसोई में ढक्कन लगाकर खाना बनाएं',
        targetArea: 'किचन',
        steps: [
          'सब्जी या दाल बनाते समय बर्तन पर ढक्कन रखें।',
          'एग्जॉस्ट फैन चालू रखें और किचन का दरवाजा बंद रखें।',
          'शाम 5 बजे के बाद तेज तड़का लगाने से बचें।'
        ],
        difficulty: 'Moderate (15 min)',
        estimatedReduction: 'घर में 50% धुआं कम होगा'
      },
      {
        id: 'hack-3',
        title: 'दरवाजे के नीचे गीला तौलिया लगाएं',
        targetArea: 'मुख्य दरवाजा',
        steps: [
          'एक तौलिए को पानी में गीला करके अच्छी तरह निचोड़ लें।',
          'दरवाजे के नीचे की खाली जगह पर इसे दबाकर रख दें।',
          'यह बाहर के काले धुएं और धूल को कमरे में आने से रोकता है।'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: '30% बाहर का धुआं रोकेगा'
      },
      {
        id: 'hack-4',
        title: 'गीले पोछे से सफाई करें (सूखा झाड़ू बंद)',
        targetArea: 'घर का फर्श',
        steps: [
          'सूखे झाड़ू से धूल उड़कर बच्चों की सांस में जाती है।',
          'गीले कपड़े या पोछे से फर्श साफ करें।',
          'धूल हमेशा गीले कपड़े में चिपककर बाहर निकल जाती है।'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: '60% उड़ने वाली धूल खत्म'
      }
    ],
    swaps: [
      {
        catalogId: 'carpool-metro-transit',
        customReason: 'सड़क पर बाइक चलाने की जगह मेट्रो या बस का इस्तेमाल धुएं से सीधे बचाता है।'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'अगरबत्ती या धूपबत्ती की जगह दालचीनी और लौंग पानी में उबालें, घर में धुआं नहीं होगा।'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'दोपहर में ही रात का खाना ढककर बना लेने से शाम का इनडोर प्रदूषण कम रहता है।'
      },
      {
        catalogId: 'zero-waste-mulching',
        customReason: 'सूखे पत्तों को जलाने के बजाय खाद बनाएं या बोरे में भरें, मोहल्ले में जहर नहीं फैलेगा।'
      }
    ],
    dos: [
      'बाहर जाते समय N95 मास्क टाइट पहनें।',
      'सूखे झाड़ू की जगह गीला पोछा लगाएं।',
      'खाना बनाते समय बर्तन पर ढक्कन रखें।'
    ],
    donts: [
      'सुबह 10 बजे से पहले बाहर टहलने न जाएं।',
      'घर के अंदर अगरबत्ती या धूपबत्ती न जलाएं।',
      'कूड़ा या सूखे पत्ते बिल्कुल न जलाएं।'
    ],
    isDemo: true,
    language: 'hi',
  },

  // Preset 1: Delhi Severe Smog (AQI 385) - Urdu
  'delhi-severe-ur': {
    oneThingToDo: 'دوپہر 2 بجے تک گھر کی تمام کھڑکیاں اور بالکونی کے دروازے مکمل بند رکھیں۔',
    familyRiskBriefing: 'آج فضائی آلودگی انتہائی خطرناک (AQI 385) سطح پر ہے۔ چھوٹے بچوں، بزرگوں اور سانس کے مریضوں کو گھر کے اندر ہی رہنا چاہیے۔ باہر نکلتے وقت صرف N95 ماسک پہنیں، کپڑے کا ماسک اسموگ کے زہریلے ذرات سے نہیں بچاتا۔',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'صبح کا شدید اسموگ (5:00 تا 9:00 بجے)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'تمام کھڑکیاں اور دروازے بند رکھیں۔ باہر کی ہوا اندر نہ آنے دیں۔',
        memberGuidance: 'بزرگوں کی صبح کی واک منسوخ رکھیں۔ بچوں کو اندر کھیل میں مصروف رکھیں۔ موٹر سائیکل سوار N95 ماسک ضرور لگائیں۔'
      },
      {
        id: 'midday',
        title: 'دوپہر کا وقت (12:00 تا 3:00 بجے)',
        timeRange: '12:00 - 15:00',
        badge: 'Mask Required',
        windowRule: 'ضرورت ہو تو 15 سے 20 منٹ کے لیے کھڑکی کھول سکتے ہیں۔',
        memberGuidance: 'سودا سلف یا ضروری کام نمٹانے کے لیے یہ وقت بہتر ہے۔ باہر ماسک لازمی پہنیں۔'
      },
      {
        id: 'evening',
        title: 'شام کا اسموگ ٹریپ (5:00 تا 9:00 بجے)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'شام ہوتے ہی تمام دروازے کھڑکیاں فورا بند کر دیں۔',
        memberGuidance: 'بچوں اور بزرگوں کو روڈ کی طرف والے کمروں سے دور رکھیں۔ گھر میں جھاڑو نہ لگائیں۔'
      },
      {
        id: 'night',
        title: 'رات کا وقت (9:00 تا صبح 5:00)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'کمرے کی کھڑکیاں بند رکھیں اور دروازے کے نیچے نم کپڑا رکھیں۔',
        memberGuidance: 'ایئر پیوریفائر کو ہلکی رفتار پر چلتا رہنے دیں۔ پنکھا تیز نہ کریں۔'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'سونے کے کمرے کو صاف رکھیں',
        targetArea: 'بیڈ روم',
        steps: ['کھڑکیاں بند کریں۔', 'پیوریفائر بستر کے قریب رکھیں۔', 'سونے سے پہلے تیز چلائیں، پھر سلیپ موڈ پر رکھیں۔'],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'رات میں 65% تک صاف ہوا'
      },
      {
        id: 'hack-2',
        title: 'ڈھکن لگا کر کھانا پکائیں',
        targetArea: 'کچن',
        steps: ['ہانڈی پر ہمیشہ ڈھکن رکھیں۔', 'ایگزاسٹ فین چلائیں۔', 'شام 5 بجے کے بعد تیز تڑکے سے گریز کریں۔'],
        difficulty: 'Moderate (15 min)',
        estimatedReduction: 'کچن کا دھواں 50% کم ہوگا'
      },
      {
        id: 'hack-3',
        title: 'دروازے کے نیچے گیلا تولیہ لگائیں',
        targetArea: 'مرکزی دروازہ',
        steps: ['تولیہ گیلا کر کے نچوڑ لیں۔', 'دروازے کی نچلی خالی جگہ پر دبا کر رکھ دیں۔', 'باہر کا کالا دھواں اندر نہیں آئے گا۔'],
        difficulty: 'Quick (5 min)',
        estimatedReduction: '30% بیرونی دھواں روکے گا'
      },
      {
        id: 'hack-4',
        title: 'گیلے کپڑے سے پونچھا لگائیں',
        targetArea: 'فرش',
        steps: ['سوکھا جھاڑو ہرگز نہ لگائیں۔', 'گیلے کپڑے سے صفائی کریں۔', 'مٹی اڑنے کے بجائے کپڑے میں چپک جائے گی۔'],
        difficulty: 'Quick (5 min)',
        estimatedReduction: '60% اڑتی دھول ختم'
      }
    ],
    swaps: [
      {
        catalogId: 'carpool-metro-transit',
        customReason: 'موٹر سائیکل کے بجائے میٹرو یا بس کا استعمال زہریلے دھوئیں سے بچاتا ہے۔'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'اگربتی کے بجائے دار چینی اور لونگ پانی میں ابالیں، کمرے میں دھواں نہیں بنے گا۔'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'دوپہر میں ہی کھانا بنا کر رکھ لیں تاکہ شام کو کچن کا دھواں جمع نہ ہو۔'
      },
      {
        catalogId: 'zero-waste-mulching',
        customReason: 'خشک پتے یا کچرا جلانے کے بجائے بوری میں بھریں، ماحول زہریلا نہیں ہوگا۔'
      }
    ],
    dos: [
      'باہر جاتے وقت N95 ماسک لازمی لگائیں۔',
      'سوکھے جھاڑو کے بجائے گیلا پونچھا لگائیں۔',
      'کھانا پکاتے وقت برتن ڈھانپ کر رکھیں۔'
    ],
    donts: [
      'صبح 10 بجے سے پہلے باہر واک کے لیے نہ جائیں۔',
      'گھر کے اندر اگربتی یا لوبان نہ جلائیں۔',
      'کچرا یا خشک پتے ہرگز نہ جلائیں۔'
    ],
    isDemo: true,
    language: 'ur',
  },

  // Preset 2: Lahore Hazardous (AQI 340) - English
  'lahore-hazardous': {
    oneThingToDo: 'Double-seal outside doors with damp towels and cancel outdoor play.',
    familyRiskBriefing: 'Lahore is experiencing heavy winter fog and industrial smoke entrapment with an AQI of 340 (Hazardous). Elevated particulate density poses immediate strain on sensitive respiratory tracts and toddler lungs. Maintain an air-sealed home envelope throughout the day and enforce strict respirator usage for anyone commuting.',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'Dense Fog & Stagnant Air (5:00 AM – 9:00 AM)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'All exterior windows and ventilators must remain latched.',
        memberGuidance: 'Keep children indoors. Postpone outdoor fitness and elderly park walks. Commuters traveling by motorbike or car must seal helmet visors and wear an N95 mask.'
      },
      {
        id: 'midday',
        title: 'Midday Temperature Inversion Lift (12:00 PM – 3:00 PM)',
        timeRange: '12:00 - 15:00',
        badge: 'Mask Required',
        windowRule: 'Keep windows shut; ambient air remains hazardous despite visible sunlight.',
        memberGuidance: 'Favorable time for essential transit or school pick-ups. Wear certified N95 or FFP2 respirators outdoors. Drink warm water to soothe throat membranes.'
      },
      {
        id: 'evening',
        title: 'Rapid Temperature Drop & Trapping (5:00 PM – 9:00 PM)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'Seal vents and exterior doors. Dense particulate concentrates at pavement level.',
        memberGuidance: 'Gather household in central living spaces. Run air purifiers continuously. Ensure members with asthma keep prescribed relief inhalers within easy reach.'
      },
      {
        id: 'night',
        title: 'Nighttime Boundary Settling (9:00 PM – 5:00 AM)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'No night aeration. Keep all bedroom sashes locked.',
        memberGuidance: 'Place a damp towel at the bedroom door gap. Maintain quiet purifier operation near bedheads for vulnerable family members.'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'Living Room Clean Air Haven',
        targetArea: 'Central Family Area',
        steps: [
          'Seal drafty cracks in window frames using painter’s tape or damp cloth strips.',
          'Elevate your purifier off deep carpets onto a low stool for optimal air circulation.',
          'Keep interior bedroom doors open during afternoon to cycle filtered air throughout.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Maintains sub-50 µg/m³ indoor levels'
      },
      {
        id: 'hack-2',
        title: 'Cookware Lid Discipline',
        targetArea: 'Kitchen',
        steps: [
          'Keep glass or steel lids firmly seated on pans during all oil frying.',
          'Turn on the exhaust 2 minutes before starting flame and leave running 5 minutes post-cook.',
          'Allow foods to steam rather than smoke on open burners.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Reduces peak kitchen carbon black by 45%'
      },
      {
        id: 'hack-3',
        title: 'Threshold Infiltration Trap',
        targetArea: 'Front Door',
        steps: [
          'Place a damp heavy mat outside and a rolled moist cloth inside the doorway.',
          'Remove outdoor shoes immediately at the threshold to avoid tracking toxic road dust.',
          'Wipe pet paws and coats with a damp cloth upon re-entry.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Stops 30% of street soot tracking'
      },
      {
        id: 'hack-4',
        title: 'Damp Mopping with Plain Water',
        targetArea: 'Floors & Hard Surfaces',
        steps: [
          'Avoid dry brooms which launch settled micro-particles into toddler eye and lung level.',
          'Use warm water with a drop of vinegar or mild soap on a microfiber mop head.',
          'Rinse pad frequently in bucket rather than dragging soot across rooms.'
        ],
        difficulty: 'Moderate (15 min)',
        estimatedReduction: 'Eliminates 70% of resuspended indoor PM10'
      }
    ],
    swaps: [
      {
        catalogId: 'carpool-metro-transit',
        customReason: 'Minimizes exposure to dense open road smog plumes during the busy Lahore morning and evening commute.'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'Keeps household air calm and fresh without releasing combustion particulates from scented candles or incense.'
      },
      {
        catalogId: 'damp-microfiber-mopping',
        customReason: 'Replaces dry sweeping to safeguard toddlers playing on floor rugs from inhaling settled toxic particulates.'
      },
      {
        catalogId: 'diy-hepa-boxfan-rig',
        customReason: 'Provides an economical supplemental air cleaning layer for elderly family members during overnight smog saturation.'
      }
    ],
    dos: [
      'Keep outdoor shoes at the front door to stop soot tracking.',
      'Wear tight N95 mask on roads.',
      'Drink warm water to soothe airway lining.'
    ],
    donts: [
      'Do not allow children to play outdoors in the evening.',
      'Do not use dry straw brooms inside.',
      'Do not burn trash or leaves.'
    ],
    isDemo: true,
    language: 'en',
  },

  // Preset 3: Moderate Haze (AQI 145) - English
  'moderate-haze': {
    oneThingToDo: 'Open opposite windows for 20 minutes between 1 PM and 2 PM, then reseal.',
    familyRiskBriefing: 'Current air quality is Unhealthy for Sensitive Groups (AQI 145). While healthy adults can go about normal indoor activities, children, seniors, and those with reactive airways may experience mild eye irritation or throat dryness. Taking proactive steps now prevents cumulative respiratory irritation during the smog season.',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'Early Morning Haze (5:00 AM – 9:00 AM)',
        timeRange: '05:00 - 09:00',
        badge: 'Mask Required',
        windowRule: 'Keep windows closed until the sun burns off early ground inversion.',
        memberGuidance: 'High-intensity outdoor jogging should be shifted indoors. Children can attend regular outdoor school sports if no symptoms appear, but keep an eye on asthmatic family members.'
      },
      {
        id: 'midday',
        title: 'Afternoon Ventilation Window (12:00 PM – 3:00 PM)',
        timeRange: '12:00 - 15:00',
        badge: 'Safe Ventilation Window',
        windowRule: 'Safe window for a 20-30 minute cross-breeze air exchange in cross-facing rooms.',
        memberGuidance: 'Air dispersion is at peak efficiency. Open opposite windows for 20 minutes to flush indoor CO2 and stale VOCs, then reseal and resume normal air purifier filtration.'
      },
      {
        id: 'evening',
        title: 'Dusk Cool-Down (5:00 PM – 9:00 PM)',
        timeRange: '17:00 - 21:00',
        badge: 'Mask Required',
        windowRule: 'Close windows as traffic builds and ambient temperatures drop.',
        memberGuidance: 'Outdoor commuters walking near busy arterials should slip on an N95 or well-sealed respirator. Seniors can do indoor stretches or light walking.'
      },
      {
        id: 'night',
        title: 'Overnight Rest (9:00 PM – 5:00 AM)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'Keep bedroom windows shut to prevent late-night haze infiltration.',
        memberGuidance: 'Run air purifiers on low eco-mode. Keep a glass of water on bedside tables to maintain airway hydration.'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'Controlled 20-Minute Midday Air Flush',
        targetArea: 'Whole Home',
        steps: [
          'Check outdoor air around 1:00 PM when solar mixing is highest.',
          'Open two opposite windows for 20 minutes to lower indoor CO2 without loading rooms with heavy soot.',
          'Close promptly and turn purifier on high for 15 minutes.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Clears stale CO2 while capping indoor PM2.5 below 25 µg/m³'
      },
      {
        id: 'hack-2',
        title: 'Purifier Pre-Filter Vacuuming',
        targetArea: 'Air Purifier Unit',
        steps: [
          'Unplug your purifier and unclip the front outer plastic grill.',
          'Vacuum the mesh pre-filter (the washable screen that catches hair and large dust).',
          'Restores optimal cubic feet per minute (CFM) airflow through the inner HEPA element.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Boosts clean air delivery rate (CADR) by 20%'
      },
      {
        id: 'hack-3',
        title: 'Ventilation Hood Pre-Run for Stovetop Cooking',
        targetArea: 'Kitchen',
        steps: [
          'Switch your kitchen exhaust on 1 minute before turning on the gas burner.',
          'Keep burner flames steady blue; avoid flare-ups and excess cooking oil fumes.',
          'Leave fan on for 3 minutes after shutting down burner.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Cuts kitchen-to-living-room fume spread by 40%'
      },
      {
        id: 'hack-4',
        title: 'Entryway Shoeless Zone',
        targetArea: 'Foyer / Hallway',
        steps: [
          'Designate a clear boundary at the front door where all shoes come off.',
          'Keep indoor slippers or socks for hardwood and tiled living floors.',
          'Prevents tracking outdoor road dust containing brake dust and soot into bedrooms.'
        ],
        difficulty: 'Quick (5 min)',
        estimatedReduction: 'Reduces household floor contaminant buildup by 50%'
      }
    ],
    swaps: [
      {
        catalogId: 'midday-errand-scheduling',
        customReason: 'Taking advantage of the midday solar clearance minimizes particulate inhalation during essential daily trips.'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'Maintains excellent indoor air cleanliness without adding cooking smoke to borderline haze levels.'
      },
      {
        catalogId: 'damp-microfiber-mopping',
        customReason: 'Keeps household dust settled so elderly lungs and curious toddlers stay comfortable all day.'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'Creates a warm, welcoming home atmosphere while completely avoiding scented candle hydrocarbons.'
      }
    ],
    dos: [
      'Aerate the house for 20 minutes at 1 PM.',
      'Check purifier pre-filter for dust.',
      'Stay hydrated throughout the day.'
    ],
    donts: [
      'Do not keep windows open past 5 PM.',
      'Do not run dry fry pans on smoking oil.',
      'Do not burn incense in small closed rooms.'
    ],
    isDemo: true,
    language: 'en',
  },

  // Preset: Bengali (বাংলা)
  'delhi-severe-bn': {
    oneThingToDo: 'দুপুর ২টা পর্যন্ত ঘরের সব জানালা ও বারান্দার দরজা শক্ত করে বন্ধ রাখুন।',
    familyRiskBriefing: 'আজ বাতাসের মান অত্যন্ত বিপজ্জনক (Severe Smog)। বাতাসে ক্ষতিকারক ধূলিকণা খুব বেশি। শিশু, বয়স্ক এবং যাদের শ্বাসকষ্ট আছে তাদের অবশ্যই ঘরের ভিতরে রাখুন। বাইরে বের হলে সাধারণ কাপড়ের মাস্ক কাজ করবে না, শক্ত করে N95 মাস্ক পরুন।',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'সকালের ধোঁয়াশা ও কুয়াশা (সকাল ৫:০০ – ৯:০০)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'সব জানালা এবং দরজা সম্পূর্ণ বন্ধ রাখুন। একেবারেই ঘরে বাতাস ঢুকতে দেবেন না।',
        memberGuidance: 'বাচ্চাদের এবং বয়স্কদের সকালে বাইরে হাঁটতে পাঠাবেন না। জরুরি কাজে বাইরে গেলে N95 মাস্ক লাগান।'
      },
      {
        id: 'midday',
        title: 'দুপুরের হালকা রোদের সময় (দুপুর ১২:০০ – ৩:০০)',
        timeRange: '12:00 - 15:00',
        badge: 'Safe Ventilation Window',
        windowRule: 'যদি পিউরিফায়ার থাকে তবে ১৫-২০ মিনিটের জন্য বিপরীতমুখী জানালা খুলে ঘরে তাজা বাতাস নিতে পারেন।',
        memberGuidance: 'দিনের সবচেয়ে নিরাপদ সময়। বাইরের দরকারি কাজ থাকলে এই সময়েই সেরে নিন।'
      },
      {
        id: 'evening',
        title: 'সন্ধ্যার দূষণ বৃদ্ধি (সন্ধ্যা ৫:০০ – রাত ৯:০০)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'সব জানালা আবার শক্ত করে বন্ধ করে দিন। ঠান্ডা বাতাসে ধোঁয়া নিচে নেমে আসে।',
        memberGuidance: 'ঘরের ভিতরে রান্নার সময় এগজস্ট ফ্যান চালু রাখুন এবং বাচ্চাদের ভেতরের ঘরে রাখুন।'
      },
      {
        id: 'night',
        title: 'রাতের বিশ্রাম (রাত ৯:০০ – সকাল ৫:০০)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'শোবার ঘরের সব জানালা বন্ধ রাখুন। দরজার নিচের ফাঁকা জায়গায় ভেজা তোয়ালে রাখুন।',
        memberGuidance: 'সবাইকে সুরক্ষিত ঘরে ঘুমাতে দিন। ফ্যান খুব জোরে চালাবেন না যাতে মেঝে থেকে ধুলো না ওড়ে।'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'শোবার ঘরে নিরাপদ সুরক্ষাবলয়',
        targetArea: 'শোবার ঘর',
        steps: [
          'সবচেয়ে ভেতরের শোবার ঘরটি বেছে নিন যেখানে বাইরের জানালা কম।',
          'এয়ার পিউরিফায়ার দেওয়াল থেকে ২ ফুট দূরে রাখুন।',
          'ঘুমানোর আধা ঘণ্টা আগে দরজা বন্ধ করে পিউরিফায়ার চালু করুন।'
        ],
        difficulty: 'সহজ (৫ মিনিট)',
        estimatedReduction: 'রাতে ঘরের বাতাস ৬৫% পর্যন্ত পরিষ্কার থাকে'
      },
      {
        id: 'hack-2',
        title: 'রান্নাঘরের ধোঁয়া নিয়ন্ত্রণ',
        targetArea: 'রান্নাঘর',
        steps: [
          'রান্না করার সময় পাত্রের ঢাকনা দিয়ে রাখুন।',
          'রান্না শুরুর ১ মিনিট আগেই এগজস্ট ফ্যান চালু করুন।',
          'সন্ধ্যাবেলায় বেশি ধোঁয়া হয় এমন ভাজাভুজি এড়িয়ে চলুন।'
        ],
        difficulty: 'সহজ (১০ মিনিট)',
        estimatedReduction: 'ঘরের ভেতরের বিষাক্ত ধোঁয়া ৫০% কমায়'
      },
      {
        id: 'hack-3',
        title: 'ভেজা কাপড় দিয়ে ঘর মোছা',
        targetArea: 'মেঝে ও আসবাবপত্র',
        steps: [
          'শুকনো ঝাঁটা দিয়ে ঝাঁট দেবেন না, এতে ধুলো বাতাসে ওড়ে।',
          'ভেজা মাইক্রোফাইবার কাপড় দিয়ে দিনে একবার ঘর মুছুন।',
          'দরজার সামনে পাপোশ রাখুন এবং বাইরের জুতো বাইরে রাখুন।'
        ],
        difficulty: 'সহজ (১০ মিনিট)',
        estimatedReduction: 'মেঝের জমে থাকা ধূলিকণা ৮০% দূর করে'
      },
      {
        id: 'hack-4',
        title: 'দরজা-জানালার ফাঁক বন্ধ করা',
        targetArea: 'প্রধান দরজা ও ব্যালকনি',
        steps: [
          'প্রধান দরজার নিচের ফাঁক দিয়ে বাইরে থেকে বিষাক্ত বাতাস ঢোকে।',
          'একটি পুরনো তোয়ালে সামান্য ভিজিয়ে দরজার নিচের ফাঁকে গুঁজে দিন।',
          'জানালায় ভারী পর্দা টেনে রাখুন যাতে ধোঁয়া আটকে যায়।'
        ],
        difficulty: 'সহজ (৩ মিনিট)',
        estimatedReduction: 'বাইরের দূষিত বাতাস ঢোকা ৪০% কমায়'
      }
    ],
    swaps: [
      {
        catalogId: 'midday-errand-scheduling',
        customReason: 'দুপুরে দূষণ কম থাকে, তাই এই সময়ে কেনাকাটা করলে ফুসফুসে ক্ষতিকর ধোঁয়া কম যাবে।'
      },
      {
        catalogId: 'damp-microfiber-mopping',
        customReason: 'শুকনো ঝাড়ুর বদলে ভেজা কাপড়ে মুছলে ধুলো বাতাসে মেশে না।'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'ধূপকাঠি বা মোমবাতির ক্ষতিকর ধোঁয়ার বদলে দারুচিনি ফুটিয়ে ঘরে সুবাস তৈরি করুন।'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'ঢাকনা দিয়ে রান্না করলে রান্নার ক্ষতিকারক ধোঁয়া সারা ঘরে ছড়ায় না।'
      }
    ],
    dos: [
      'বাইরে বের হলে শক্ত করে N95 মাস্ক পরুন।',
      'প্রচুর পরিমাণে পরিষ্কার জল ও গরম চা/স্যুপ পান করুন।',
      'দুপুর ১২টা থেকে ২টার মধ্যে ঘর অল্প সময়ের জন্য বাতাস চলাচল করান।'
    ],
    donts: [
      'সকালে বা সন্ধ্যায় বাইরে ব্যায়াম বা প্রাতঃভ্রমণ করবেন না।',
      'কাপড়ের সাধারণ মাস্ক বা রুমাল দিয়ে মুখ ঢাকবেন না (তাতে ধোঁয়া আটকায় না)।',
      'ঘরের ভেতরে ধূপকাঠি বা মশার কয়েল জ্বালাবেন না।'
    ],
    isDemo: true,
    language: 'bn',
  },

  // Preset: Tamil (தமிழ்)
  'delhi-severe-ta': {
    oneThingToDo: 'மதியம் 2 மணி வரை அனைத்து ஜன்னல்கள் மற்றும் கதவுகளை இறுக்கமாக மூடி வைக்கவும்.',
    familyRiskBriefing: 'இன்று காற்றின் தரம் மிக ஆபத்தான நிலையில் உள்ளது (Severe Smog). காற்றில் நுண் துகள்கள் மிக அதிகமாக உள்ளன. குழந்தைகள், முதியவர்கள் மற்றும் ஆஸ்துமா உள்ளவர்களை வீட்டிற்குள் பாதுகாப்பாக வைக்கவும். வெளியே செல்லும்போது சாதாரண துணி முகக்கவசம் பலனளிக்காது, சரியான N95 மாஸ்க் அணியுங்கள்.',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'காலை நேர அடர்ந்த புகை மூட்டம் (காலை 5:00 – 9:00)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'அனைத்து ஜன்னல்கள் மற்றும் கதவுகளை முழுமையாக மூடி வைக்கவும்.',
        memberGuidance: 'முதியவர்கள் காலை நடைப்பயிற்சியைத் தவிர்க்கவும். குழந்தைகள் வீட்டிலேயே இருக்க வேண்டும்.'
      },
      {
        id: 'midday',
        title: 'மதிய நேர சூரிய வெப்ப சாளரம் (மதியம் 12:00 – 3:00)',
        timeRange: '12:00 - 15:00',
        badge: 'Safe Ventilation Window',
        windowRule: 'ஏர் பியூரிஃபையர் இருந்தால் 15 நிமிடங்கள் ஜன்னல்களைத் திறந்து புதிய காற்றை உள்ளே விடலாம்.',
        memberGuidance: 'அத்தியாவசியப் பணிகளுக்கு வெளியே செல்ல இதுவே சிறந்த நேரம். கட்டாயம் N95 மாஸ்க் அணியவும்.'
      },
      {
        id: 'evening',
        title: 'மாலை நேர நச்சுப் புகை அதிகரிப்பு (மாலை 5:00 – இரவு 9:00)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'ஜன்னல்களை மீண்டும் இறுக்கமாக மூடிவிடவும்.',
        memberGuidance: 'சமையல் செய்யும்போது எக்ஸாஸ்ட் ஃபேனைப் பயன்படுத்தவும். குழந்தைகளை உட்புற அறையில் வைக்கவும்.'
      },
      {
        id: 'night',
        title: 'இரவு நேர காற்றுப் பாதுகாப்பு (இரவு 9:00 – காலை 5:00)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'படுக்கையறை ஜன்னல்களை மூடி வைக்கவும். கதவின் கீழ் இடைவெளியை ஈரமான துணியால் அடைக்கவும்.',
        memberGuidance: 'அனைவரையும் பாதுகாப்பான அறையில் தூங்க வைக்கவும். விசிறியை மிதமான வேகத்தில் இயக்கவும்.'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'படுக்கையறை காற்றுப் பாதுகாப்பு மண்டலம்',
        targetArea: 'படுக்கையறை',
        steps: [
          'குறைந்த ஜன்னல்கள் கொண்ட உட்புற அறையைத் தேர்வு செய்யவும்.',
          'ஏர் பியூரிஃபையரை சுவரிலிருந்து 2 அடி தள்ளி வைக்கவும்.',
          'தூங்குவதற்கு 30 நிமிடங்களுக்கு முன்பே கதவை மூடி இயக்கவும்.'
        ],
        difficulty: 'எளிது (5 நிமிடம்)',
        estimatedReduction: 'இரவில் 65% தூய்மையான காற்று'
      },
      {
        id: 'hack-2',
        title: 'சமையலறைப் புகை தடுப்பு',
        targetArea: 'சமையலறை',
        steps: [
          'சமைக்கும் போது பாத்திரங்களை மூடி வைக்கவும்.',
          'சமையல் தொடங்கும் முன் எக்ஸாஸ்ட் ஃபேனை இயக்கவும்.',
          'மாலை நேரங்களில் அதிக புகை வரும் வறுவல்களைத் தவிர்க்கவும்.'
        ],
        difficulty: 'எளிது (10 நிமிடம்)',
        estimatedReduction: 'உட்புற புகையை 50% குறைக்கிறது'
      },
      {
        id: 'hack-3',
        title: 'ஈரத்துணியால் தரை துடைத்தல்',
        targetArea: 'தரை மற்றும் வீட்டின் பகுதி',
        steps: [
          'உலர்ந்த துடைப்பத்தால் கூட்ட வேண்டாம், அது தூசியைக் காற்றில் கலக்கும்.',
          'ஈரமான துணியால் தினமும் ஒருமுறை தரையைத் துடைக்கவும்.',
          'வெளிப்புற காலணிகளை வீட்டிற்கு வெளியே வைக்கவும்.'
        ],
        difficulty: 'எளிது (10 நிமிடம்)',
        estimatedReduction: 'காற்றில் தூசி கலப்பதை 80% தடுக்கிறது'
      },
      {
        id: 'hack-4',
        title: 'கதவு இடுக்குகளை அடைத்தல்',
        targetArea: 'முன் கதவு',
        steps: [
          'முன் கதவின் கீழ் இடுக்கு வழியாக நச்சு காற்று உள்ளே வரும்.',
          'ஒரு பழைய ஈரமான துணியை கதவின் கீழ் இடைவெளியில் வைக்கவும்.',
          'ஜன்னல்களில் தடிமனான திரைகளைப் போடவும்.'
        ],
        difficulty: 'எளிது (3 நிமிடம்)',
        estimatedReduction: 'வெளிப்புற காற்று நுழைவதை 40% குறைக்கிறது'
      }
    ],
    swaps: [
      {
        catalogId: 'midday-errand-scheduling',
        customReason: 'மதிய வேளையில் காற்று தூய்மையாக இருக்கும்போது வேலைகளை முடிப்பது பாதுகாப்பானது.'
      },
      {
        catalogId: 'damp-microfiber-mopping',
        customReason: 'ஈரத்துணியால் துடைப்பது தூசியை காற்றில் பரவாமல் தடுக்கிறது.'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'ஊதுபத்தி புகைக்குப் பதிலாக இலவங்கப்பட்டை வேகவைத்து நறுமணம் பெறலாம்.'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'பாத்திரங்களை மூடி சமைப்பதால் சமையல் புகை பரவாமல் தடுக்கப்படுகிறது.'
      }
    ],
    dos: [
      'வெளியே செல்லும்போது N95 மாஸ்க் மட்டுமே அணியவும்.',
      'நிறைய தண்ணீர் மற்றும் வெதுவெதுப்பான திரவங்களை அருந்தவும்.',
      'மதியம் 12 முதல் 2 மணி வரை சிறிது நேரம் காற்றோட்டம் செய்யவும்.'
    ],
    donts: [
      'காலை அல்லது மாலையில் வெளிப்புற உடற்பயிற்சிகளைச் செய்யாதீர்கள்.',
      'சாதாரண துணி மாஸ்க் அல்லது கைக்குட்டையைப் பயன்படுத்தாதீர்கள்.',
      'வீட்டிற்குள் ஊதுபத்தி அல்லது கொசு சுருள் ஏற்றாதீர்கள்.'
    ],
    isDemo: true,
    language: 'ta',
  },

  // Preset: Telugu (తెలుగు)
  'delhi-severe-te': {
    oneThingToDo: 'మధ్యాహ్నం 2 గంటల వరకు ఇంటి కిటికీలు మరియు తలుపులు పూర్తిగా మూసి ఉంచండి.',
    familyRiskBriefing: 'ఈ రోజు గాలి నాణ్యత చాలా ప్రమాదకర స్థాయిలో ఉంది (Severe Smog). గాలిలో హానికరమైన సూక్ష్మ ధూళికణాలు ఎక్కువగా ఉన్నాయి. పిల్లలు, వృద్ధులు మరియు ఆస్తమా ఉన్నవారు ఇంట్లోనే ఉండాలి. బయటకు వెళ్లాల్సి వస్తే సాధారణ గుడ్డ మాస్క్ పనిచేయదు, తప్పనిసరిగా N95 మాస్క్ ధరించండి.',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'ఉదయం తీవ్రమైన పొగమంచు (ఉదయం 5:00 – 9:00)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'కిటికీలు మరియు తలుపులు పూర్తిగా మూసి ఉంచండి.',
        memberGuidance: 'వృద్ధులు మార్నింగ్ వాకింగ్ మానుకోవాలి. పిల్లలు ఇంట్లోనే సురక్షిత గదిలో ఆడుకోవాలి.'
      },
      {
        id: 'midday',
        title: 'మధ్యాహ్నపు ఎండ సమయం (మధ్యాహ్నం 12:00 – 3:00)',
        timeRange: '12:00 - 15:00',
        badge: 'Safe Ventilation Window',
        windowRule: 'ఎయిర్ ప్యూరిఫైయర్ ఉంటే 15 నిమిషాలు కిటికీలు తెరిచి తాజా గాలిని రానివ్వవచ్చు.',
        memberGuidance: 'బయట పనులకు ఇది అత్యంత అనుకూలమైన సమయం. బయటకు వెళ్లేటప్పుడు N95 మాస్క్ ధరించండి.'
      },
      {
        id: 'evening',
        title: 'సాయంత్రం కాలుష్యం పెరుగుదల (సాయంత్రం 5:00 – రాత్రి 9:00)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'కిటికీలను మళ్లీ గట్టిగా మూసివేయండి.',
        memberGuidance: 'వంట చేసేటప్పుడు ఎగ్జాస్ట్ ఫ్యాన్ వేయండి. పిల్లలను లోపలి గదిలోనే ఉంచండి.'
      },
      {
        id: 'night',
        title: 'రాత్రి సమయ గాలి రక్షణ (రాత్రి 9:00 – ఉదయం 5:00)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'బెడ్‌రూమ్ కిటికీలు మూసివేయండి. తలుపు కింద ఖాళీని తడి గుడ్డతో మూయండి.',
        memberGuidance: 'అందరూ సురక్షిత గదిలో నిద్రించండి. ఫ్యాన్ వేగం తక్కువగా ఉంచండి.'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'బెడ్‌రూమ్‌లో క్లీన్ ఎయిర్ జోన్',
        targetArea: 'బెడ్‌రూమ్',
        steps: [
          'బయటి కిటికీలు తక్కువగా ఉన్న గదిని ఎంచుకోండి.',
          'ప్యూరిఫైయర్‌ను గోడకు 2 అడుగుల దూరంలో ఉంచండి.',
          'పడుకోవడానికి 30 నిమిషాల ముందే తలుపులు మూసి ఆన్ చేయండి.'
        ],
        difficulty: 'సులువు (5 నిమిషాలు)',
        estimatedReduction: 'రాత్రి వేళ 65% స్వచ్ఛమైన గాలి'
      },
      {
        id: 'hack-2',
        title: 'వంటగది పొగ నియంత్రణ',
        targetArea: 'వంటగది',
        steps: [
          'వంట చేసేటప్పుడు పాత్రలపై మూతలు ఉంచండి.',
          'వంట మొదలుపెట్టే ముందే ఎగ్జాస్ట్ ఫ్యాన్ ఆన్ చేయండి.',
          'సాయంత్రం వేళల్లో ఎక్కువ పొగ వచ్చే వేపుళ్ళు తగ్గించండి.'
        ],
        difficulty: 'సులువు (10 నిమిషాలు)',
        estimatedReduction: 'ఇంటి లోపలి పొగను 50% తగ్గిస్తుంది'
      },
      {
        id: 'hack-3',
        title: 'తడి గుడ్డతో నేల తుడవడం',
        targetArea: 'నేల మరియు ఇల్లు',
        steps: [
          'పొడి చీపురుతో ఊడ్వకండి, ధూళి గాలిలోకి లేస్తుంది.',
          'రోజూ ఒకసారి తడి గుడ్డతో నేలను తుడవండి.',
          'బయటి చెప్పులను ఇంటి బయటే ఉంచండి.'
        ],
        difficulty: 'సులువు (10 నిమిషాలు)',
        estimatedReduction: 'గాలిలో ధూళిని 80% తగ్గిస్తుంది'
      },
      {
        id: 'hack-4',
        title: 'తలుపుల సందులు మూసివేయడం',
        targetArea: 'ప్రధాన తలుపు',
        steps: [
          'తలుపు కింది సందుల ద్వారా కాలుష్యపు గాలి లోపలికి వస్తుంది.',
          'ఒక పాత తడి గుడ్డను తలుపు కింద ఉంచండి.',
          'కిటికీలకు మందపాటి కర్టెన్లు వేయండి.'
        ],
        difficulty: 'సులువు (3 నిమిషాలు)',
        estimatedReduction: 'బయటి కాలుష్యం రాకుండా 40% ఆపుతుంది'
      }
    ],
    swaps: [
      {
        catalogId: 'midday-errand-scheduling',
        customReason: 'మధ్యాహ్నం కాలుష్యం తక్కువగా ఉన్నప్పుడు పనులు పూర్తి చేసుకోవడం సురక్షితం.'
      },
      {
        catalogId: 'damp-microfiber-mopping',
        customReason: 'తడి గుడ్డతో తుడవడం వల్ల ధూళి గాలిలో కలవకుండా ఉంటుంది.'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'అగరబత్తుల పొగకు బదులుగా దాల్చినచెక్క మరిగించి సువాసన పొందండి.'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'మూత పెట్టి వండడం వల్ల వంట పొగ ఇల్లంతా వ్యాపించదు.'
      }
    ],
    dos: [
      'బయటకు వెళ్లేటప్పుడు తప్పనిసరిగా N95 మాస్క్ ధరించండి.',
      'మంచి నీళ్లు మరియు వేడి ద్రవాలు ఎక్కువగా తాగండి.',
      'మధ్యాహ్నం 12 నుండి 2 గంటల మధ్య కాసేపు గాలి రానివ్వండి.'
    ],
    donts: [
      'ఉదయం లేదా సాయంత్రం బయట వ్యాయామం లేదా వాకింగ్ చేయవద్దు.',
      'సాధారణ గుడ్డ మాస్క్ లేదా రుమాలు నమ్మవద్దు.',
      'ఇంట్లో అగరబత్తులు లేదా దోమల కాయిల్స్ వెలిగించవద్దు.'
    ],
    isDemo: true,
    language: 'te',
  },

  // Preset: Marathi (मराठी)
  'delhi-severe-mr': {
    oneThingToDo: 'दुपारी २ वाजेपर्यंत घरातील सर्व खिडक्या आणि दरवाजे घट्ट बंद ठेवा.',
    familyRiskBriefing: 'आज हवेची गुणवत्ता अत्यंत धोकादायक पातळीवर आहे (Severe Smog). हवेत विषारी सूक्ष्म धुलिकण खूप जास्त आहेत. लहान मुले, वृद्ध आणि दम्याचा त्रास असणाऱ्यांना घरातच सुरक्षित ठेवा. बाहेर पडताना सामान्य कापडी मास्क उपयोगी पडत नाही, योग्य N95 मास्क वापरा.',
    dailyRoutine: [
      {
        id: 'morning',
        title: 'सकाळचा दाट धूर आणि धुकं (सकाळी ५:०० – ९:००)',
        timeRange: '05:00 - 09:00',
        badge: 'Stay Indoors',
        windowRule: 'घराच्या सर्व खिडक्या आणि बाल्कनीचे दरवाजे पूर्णपणे बंद ठेवा.',
        memberGuidance: 'ज्येष्ठ नागरिकांनी मॉर्निंग वॉक पूर्णपणे टाळावे. लहान मुलांना घरातच ठेवावे.'
      },
      {
        id: 'midday',
        title: 'दुपारची सुरक्षित वेळ (दुपारी १२:०० – ३:००)',
        timeRange: '12:00 - 15:00',
        badge: 'Safe Ventilation Window',
        windowRule: 'एअर प्युरिफायर असल्यास १५-२० मिनिटे खिडक्या उघडून ताजी हवा घेऊ शकता.',
        memberGuidance: 'बाहेरची आवश्यक कामे पूर्ण करण्यासाठी ही सर्वात योग्य वेळ आहे. N95 मास्क नक्की वापरा.'
      },
      {
        id: 'evening',
        title: 'संध्याकाळचे वाढते प्रदूषण (संध्याकाळी ५:०० – रात्री ९:००)',
        timeRange: '17:00 - 21:00',
        badge: 'Stay Indoors',
        windowRule: 'खिडक्या पुन्हा घट्ट बंद करा. हवेतील गारव्यामुळे धूर जमिनीजवळ येतो.',
        memberGuidance: 'स्वयंपाक करताना एक्झॉस्ट फॅन चालू ठेवा. मुलांना आतील खोलीत ठेवा.'
      },
      {
        id: 'night',
        title: 'रात्रीची सुरक्षा (रात्री ९:०० – सकाळी ५:००)',
        timeRange: '21:00 - 05:00',
        badge: 'Stay Indoors',
        windowRule: 'बेडरूमच्या खिडक्या बंद ठेवा. दरवाजाच्या खालची फट ओल्या कपड्याने बंद करा.',
        memberGuidance: 'सर्वांनी सुरक्षित खोलीत झोपावे. पंख्याचा वेग कमी ठेवा जेणेकरून धूळ उडणार नाही.'
      }
    ],
    indoorHacks: [
      {
        id: 'hack-1',
        title: 'बेडरूममध्ये सुरक्षित हवा झोन',
        targetArea: 'बेडरूम',
        steps: [
          'कमी खिडक्या असलेली घरातील सर्वात आतील खोली निवडा.',
          'एअर प्युरिफायर भिंतीपासून २ फूट लांब ठेवा.',
          'झोपण्याच्या ३० मिनिटे आधी दरवाजा बंद करून प्युरिफायर चालू करा.'
        ],
        difficulty: 'सोपे (५ मिनिटे)',
        estimatedReduction: 'रात्री ६५% पर्यंत स्वच्छ हवा'
      },
      {
        id: 'hack-2',
        title: 'स्वयंपाकघरातील धूर नियंत्रण',
        targetArea: 'स्वयंपाकघर',
        steps: [
          'स्वयंपाक करताना भांड्यांवर नेहमी झाकण ठेवा.',
          'स्वयंपाक सुरू करण्यापूर्वी एक्झॉस्ट फॅन चालू करा.',
          'संध्याकाळी जास्त धूर होणारे तळणाचे पदार्थ टाळा.'
        ],
        difficulty: 'सोपे (१० मिनिटे)',
        estimatedReduction: 'घरातील विषारी धूर ५०% कमी होतो'
      },
      {
        id: 'hack-3',
        title: 'ओल्या फडक्याने फरशी पुसणे',
        targetArea: 'फरशी आणि परिसर',
        steps: [
          'सुक्या झाडूने झाडू नका, त्यामुळे धूळ हवेत उडते.',
          'रोज एकदा ओल्या फडक्याने फरशी पुसून घ्या.',
          'बाहेरच्या चपला घराबाहेरच ठेवा.'
        ],
        difficulty: 'सोपे (१० मिनिटे)',
        estimatedReduction: 'हवेतील धूळ ८०% रोखते'
      },
      {
        id: 'hack-4',
        title: 'दरवाजाच्या फटी बंद करणे',
        targetArea: 'मुख्य दरवाजा',
        steps: [
          'मुख्य दरवाजाच्या खालच्या फटीतून बाहेरची विषारी हवा आत येते.',
          'एक जुना ओला टॉवेल दरवाजाच्या खाली लावून ठेवा.',
          'खिडक्यांवर जाड पडदे लावा.'
        ],
        difficulty: 'सोपे (३ मिनिटे)',
        estimatedReduction: 'बाहेरील प्रदूषण ४०% रोखते'
      }
    ],
    swaps: [
      {
        catalogId: 'midday-errand-scheduling',
        customReason: 'दुपारी प्रदूषण कमी असते, तेव्हा बाहेरची कामे करणे फुफ्फुसांसाठी सुरक्षित ठरते.'
      },
      {
        catalogId: 'damp-microfiber-mopping',
        customReason: 'ओल्या फडक्याने पुसल्यास धूळ हवेत मिसळत नाही.'
      },
      {
        catalogId: 'simmer-pot-aromatics',
        customReason: 'अगरबत्तीच्या धुराऐवजी दालचिनी पाण्यात उकळून घरात छान सुगंध आणा.'
      },
      {
        catalogId: 'batch-cooking-covered',
        customReason: 'झाकण ठेवून स्वयंपाक केल्याने धूर संपूर्ण घरात पसरत नाही.'
      }
    ],
    dos: [
      'बाहेर पडताना केवळ N95 मास्कच वापरा.',
      'भरपूर पाणी आणि गरम सूप किंवा चहा प्या.',
      'दुपारी १२ ते २ दरम्यान थोडा वेळ घरात ताजी हवा येऊ द्या.'
    ],
    donts: [
      'सकाळी किंवा संध्याकाळी बाहेर व्यायाम किंवा फिरणे टाळा.',
      'कापडी मास्क किंवा रुमालावर विश्वास ठेवू नका.',
      'घरात अगरबत्ती किंवा डासांची अगरबत्ती लावू नका.'
    ],
    isDemo: true,
    language: 'mr',
  }
};

export function getDemoPlanForAqi(aqi: number, cityName?: string, lang: SupportedLanguage = 'en'): ActionPlan {
  if (lang === 'hi') {
    return DEMO_PLANS['delhi-severe-hi'] || DEMO_PLANS['delhi-severe'];
  }
  if (lang === 'ur') {
    return DEMO_PLANS['delhi-severe-ur'] || DEMO_PLANS['delhi-severe'];
  }
  if (lang === 'bn') {
    return DEMO_PLANS['delhi-severe-bn'] || DEMO_PLANS['delhi-severe'];
  }
  if (lang === 'ta') {
    return DEMO_PLANS['delhi-severe-ta'] || DEMO_PLANS['delhi-severe'];
  }
  if (lang === 'te') {
    return DEMO_PLANS['delhi-severe-te'] || DEMO_PLANS['delhi-severe'];
  }
  if (lang === 'mr') {
    return DEMO_PLANS['delhi-severe-mr'] || DEMO_PLANS['delhi-severe'];
  }
  if (cityName && cityName.toLowerCase().includes('delhi')) {
    return DEMO_PLANS['delhi-severe'];
  }
  if (cityName && cityName.toLowerCase().includes('lahore')) {
    return DEMO_PLANS['lahore-hazardous'];
  }
  if (aqi >= 300) {
    return DEMO_PLANS['delhi-severe'];
  }
  if (aqi >= 200) {
    return DEMO_PLANS['lahore-hazardous'];
  }
  return DEMO_PLANS['moderate-haze'];
}
