import type { ActionPlan } from '../../types';

export const EN_DEMO_PLANS: Record<string, ActionPlan> = {
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

};
