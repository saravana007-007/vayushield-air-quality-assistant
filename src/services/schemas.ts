// VayuShield Zod Schemas & Gemini JSON Schema Definitions
import { z } from 'zod';

export const RoutineBadgeSchema = z.enum([
  'Stay Indoors',
  'Mask Required',
  'Safe Ventilation Window'
]);

export const RoutineBlockSchema = z.object({
  id: z.enum(['morning', 'midday', 'evening', 'night']),
  title: z.string().min(1),
  timeRange: z.string().min(1),
  badge: RoutineBadgeSchema,
  windowRule: z.string().min(5),
  memberGuidance: z.string().min(5),
});

export const IndoorHackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  targetArea: z.string().min(2),
  steps: z.array(z.string().min(3)).min(1),
  difficulty: z.enum(['Quick (5 min)', 'Moderate (15 min)']),
  estimatedReduction: z.string().min(3),
});

export const SwapPlanItemSchema = z.object({
  catalogId: z.string().min(1),
  customReason: z.string().min(10),
});

export const ActionPlanSchema = z.object({
  oneThingToDo: z.string().min(5),
  familyRiskBriefing: z.string().min(15),
  dailyRoutine: z.array(RoutineBlockSchema).length(4),
  indoorHacks: z.array(IndoorHackSchema).length(4),
  swaps: z.array(SwapPlanItemSchema).length(4),
  dos: z.array(z.string()).default([]),
  donts: z.array(z.string()).default([]),
});

export type ValidatedActionPlan = z.infer<typeof ActionPlanSchema>;

// Strict JSON Schema object for Gemini SDK responseSchema
export const GEMINI_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    oneThingToDo: {
      type: 'string',
      description: 'The single most important action for today in one bold short sentence.',
    },
    familyRiskBriefing: {
      type: 'string',
      description: 'Calm plain-language guidance tailored to this household, with zero medical diagnoses or medication names, written in the requested language.',
    },
    dailyRoutine: {
      type: 'array',
      description: 'Exactly 4 chronological daily routine blocks: morning (5-9), midday (12-3), evening (5-9), night.',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            enum: ['morning', 'midday', 'evening', 'night'],
          },
          title: {
            type: 'string',
            description: 'Block title e.g. Morning Smog Peak (5:00 - 9:00 AM)',
          },
          timeRange: {
            type: 'string',
            description: 'Time string e.g. 05:00 - 09:00',
          },
          badge: {
            type: 'string',
            enum: ['Stay Indoors', 'Mask Required', 'Safe Ventilation Window'],
          },
          windowRule: {
            type: 'string',
            description: 'Specific window and airing rule.',
          },
          memberGuidance: {
            type: 'string',
            description: 'Actionable guidance for specific household members in very simple short sentences.',
          },
        },
        required: ['id', 'title', 'timeRange', 'badge', 'windowRule', 'memberGuidance'],
      },
    },
    indoorHacks: {
      type: 'array',
      description: 'Exactly 4 low-cost actionable indoor hacks adapted to purifier/stove/home setup.',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          targetArea: { type: 'string' },
          steps: {
            type: 'array',
            items: { type: 'string' },
          },
          difficulty: {
            type: 'string',
            enum: ['Quick (5 min)', 'Moderate (15 min)'],
          },
          estimatedReduction: { type: 'string' },
        },
        required: ['id', 'title', 'targetArea', 'steps', 'difficulty', 'estimatedReduction'],
      },
    },
    swaps: {
      type: 'array',
      description: 'Exactly 4 community and personal swaps chosen strictly from available catalog IDs.',
      items: {
        type: 'object',
        properties: {
          catalogId: {
            type: 'string',
            description: 'Catalog ID chosen strictly from valid catalog ID list.',
          },
          customReason: {
            type: 'string',
            description: 'Personalized explanation why this swap protects this specific household today.',
          },
        },
        required: ['catalogId', 'customReason'],
      },
    },
    dos: {
      type: 'array',
      description: '3 short clear bullet actions to do today.',
      items: { type: 'string' },
    },
    donts: {
      type: 'array',
      description: '3 short clear bullet mistakes to avoid today.',
      items: { type: 'string' },
    },
  },
  required: ['oneThingToDo', 'familyRiskBriefing', 'dailyRoutine', 'indoorHacks', 'swaps'],
};
