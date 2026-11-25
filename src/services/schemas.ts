import { z } from 'zod';
import type { Schema } from '@google/genai';
import { Type } from '@google/genai';

// Routine Block Zod Schema
const RoutineBlockSchema = z.object({
  id: z.enum(['morning', 'midday', 'evening', 'night']),
  title: z.string().min(1),
  timeRange: z.string().min(1),
  badge: z.enum(['Stay Indoors', 'Mask Required', 'Safe Ventilation Window']),
  windowRule: z.string().min(1),
  memberGuidance: z.string().min(1),
});

// Indoor Hack Zod Schema
const IndoorHackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  targetArea: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
  difficulty: z.string().min(1),
  estimatedReduction: z.string().min(1),
});

// Swap Plan Item Zod Schema
const SwapPlanItemSchema = z.object({
  catalogId: z.string().min(1),
  customReason: z.string().min(1),
});

// Action Plan Zod Schema
export const ActionPlanSchema = z.object({
  oneThingToDo: z.string().min(5),
  familyRiskBriefing: z.string().min(10),
  dailyRoutine: z.array(RoutineBlockSchema).length(4),
  indoorHacks: z.array(IndoorHackSchema).length(4),
  swaps: z.array(SwapPlanItemSchema).length(4),
  dos: z.array(z.string()).default([]),
  donts: z.array(z.string()).default([]),
});

// Strict JSON Schema object for Gemini SDK responseSchema
export const GEMINI_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    oneThingToDo: {
      type: Type.STRING,
      description: 'The single most important action for today in one bold short sentence.',
    },
    familyRiskBriefing: {
      type: Type.STRING,
      description:
        'Calm plain-language guidance tailored to this household, with zero medical diagnoses or medication names, written in the requested language.',
    },
    dailyRoutine: {
      type: Type.ARRAY,
      description:
        'Exactly 4 chronological daily routine blocks: morning (5-9), midday (12-3), evening (5-9), night.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            enum: ['morning', 'midday', 'evening', 'night'],
          },
          title: {
            type: Type.STRING,
            description: 'Block title e.g. Morning Smog Peak (5:00 - 9:00 AM)',
          },
          timeRange: {
            type: Type.STRING,
            description: 'Time string e.g. 05:00 - 09:00',
          },
          badge: {
            type: Type.STRING,
            enum: ['Stay Indoors', 'Mask Required', 'Safe Ventilation Window'],
          },
          windowRule: {
            type: Type.STRING,
            description: 'Specific window and airing rule.',
          },
          memberGuidance: {
            type: Type.STRING,
            description:
              'Actionable guidance for specific household members in very simple short sentences.',
          },
        },
        required: ['id', 'title', 'timeRange', 'badge', 'windowRule', 'memberGuidance'],
      },
    },
    indoorHacks: {
      type: Type.ARRAY,
      description:
        'Exactly 4 low-cost actionable indoor hacks adapted to purifier/stove/home setup.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          targetArea: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          difficulty: {
            type: Type.STRING,
            enum: ['Quick (5 min)', 'Moderate (15 min)'],
          },
          estimatedReduction: { type: Type.STRING },
        },
        required: ['id', 'title', 'targetArea', 'steps', 'difficulty', 'estimatedReduction'],
      },
    },
    swaps: {
      type: Type.ARRAY,
      description:
        'Exactly 4 community and personal swaps chosen strictly from available catalog IDs.',
      items: {
        type: Type.OBJECT,
        properties: {
          catalogId: {
            type: Type.STRING,
            description: 'Catalog ID chosen strictly from valid catalog ID list.',
          },
          customReason: {
            type: Type.STRING,
            description:
              'Personalized explanation why this swap protects this specific household today.',
          },
        },
        required: ['catalogId', 'customReason'],
      },
    },
    dos: {
      type: Type.ARRAY,
      description: '3 short clear bullet actions to do today.',
      items: { type: Type.STRING },
    },
    donts: {
      type: Type.ARRAY,
      description: '3 short clear bullet mistakes to avoid today.',
      items: { type: Type.STRING },
    },
  },
  required: [
    'oneThingToDo',
    'familyRiskBriefing',
    'dailyRoutine',
    'indoorHacks',
    'swaps',
    'dos',
    'donts',
  ],
};
