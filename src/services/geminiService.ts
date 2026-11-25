// VayuShield Gemini Service
// Integrates official @google/genai SDK with strict JSON schema, Zod validation,
// Multilingual generation, Offline LocalStorage caching, and Demo Mode resilience

import { GoogleGenAI } from '@google/genai';
import type { ActionPlan, AirQualityData, HouseholdProfile } from '../types';
import { GEMINI_MODEL, GEMINI_FALLBACK_MODEL, GEMINI_TEMPERATURES, TIMEOUTS } from '../config';
import { ActionPlanSchema, GEMINI_RESPONSE_SCHEMA } from './schemas';
import { getDemoPlanForAqi } from '../data/demoPlans';
import type { SupportedLanguage } from '../i18n';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';
import { type CachedPlanData, saveCachedPlan, getCachedPlan } from './planCache';
import { generateOfflineChatAnswer } from './offlineRulesEngine';
import { getSystemInstruction, buildActionPlanPrompt, buildAskVayuPrompt } from './geminiPrompts';

export { type CachedPlanData, saveCachedPlan, getCachedPlan };

// Session-only in-memory API key storage (never logged, never saved to disk or localStorage)
let memoryApiKey: string | null = null;

/**
 * Store a session-only Gemini API key in memory.
 */
export function setSessionApiKey(key: string | null): void {
  memoryApiKey = key && key.trim() ? key.trim() : null;
}

/**
 * Read the current in-memory Gemini API key.
 */
export function getSessionApiKey(): string | null {
  return memoryApiKey;
}

/**
 * Check whether an in-memory Gemini API key is configured.
 */
export function hasApiKey(): boolean {
  return getSessionApiKey() !== null;
}

/**
 * Generate a personalized Action Plan with Gemini SDK, strict schema, Zod validation, and Demo Mode resilience.
 */
export async function generateActionPlan(
  airData: AirQualityData,
  profile: HouseholdProfile,
  lang: SupportedLanguage = 'en',
  onStatusUpdate?: (status: string) => void
): Promise<{ plan: ActionPlan; isDemo: boolean; error?: string }> {
  const apiKey = getSessionApiKey();

  if (!apiKey) {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        onStatusUpdate?.('Connecting to secure VayuShield proxy...');
        const customCondition = profile.customTagDetails ? profile.customTagDetails.slice(0, 200) : undefined;
        const proxyRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generatePlan',
            prompt: `LOCATION: ${airData.cityName} (${airData.country || ''})\nAQI: ${airData.currentAqi}\nHousehold Tags: ${profile.tags.join(', ')}`,
            customCondition,
            systemInstruction: getSystemInstruction(lang),
          }),
        });

        if (proxyRes.ok) {
          const data = (await proxyRes.json()) as { plan?: unknown };
          if (data && data.plan) {
            const validatedPlan = ActionPlanSchema.parse(data.plan);
            const fullPlan: ActionPlan = {
              ...validatedPlan,
              isDemo: false,
              generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              language: lang,
            };
            saveCachedPlan(fullPlan, airData);
            return { plan: fullPlan, isDemo: false };
          }
        }
      } catch {
        // Fall back to verified demo plan on network/proxy failure
      }
    }

    onStatusUpdate?.('No API key provided; loading verified Demo Plan.');
    const demoPlan = getDemoPlanForAqi(airData.currentAqi, airData.cityName, lang);
    return { plan: demoPlan, isDemo: true };
  }

  const prompt = buildActionPlanPrompt(airData, profile);

  const attemptCall = async (model: string): Promise<ActionPlan> => {
    const ai = new GoogleGenAI({ apiKey });
    const apiCall = ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(lang),
        responseMimeType: 'application/json',
        responseSchema: GEMINI_RESPONSE_SCHEMA,
        temperature: GEMINI_TEMPERATURES.planGeneration,
      },
    });

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(
        () =>
          reject(
            new Error(
              `AI response timed out (${TIMEOUTS.geminiRequestMs / 1000}s). Switching to verified plan.`
            )
          ),
        TIMEOUTS.geminiRequestMs
      );
    });

    let response;
    try {
      response = await Promise.race([apiCall, timeoutPromise]);
    } finally {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini API.');
    }

    const parsedJson = JSON.parse(responseText);
    const validatedPlan = ActionPlanSchema.parse(parsedJson);

    return {
      ...validatedPlan,
      isDemo: false,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: lang,
    };
  };

  try {
    onStatusUpdate?.(`Consulting VayuShield Engine (${GEMINI_MODEL})...`);
    const fullPlan = await attemptCall(GEMINI_MODEL);
    saveCachedPlan(fullPlan, airData);
    return { plan: fullPlan, isDemo: false };
  } catch (err1: unknown) {
    const error1 = getErrorMessage(err1);
    logger.warn('VayuShield Gemini attempt 1 failed:', err1);

    try {
      onStatusUpdate?.(`Retrying with fallback model (${GEMINI_FALLBACK_MODEL})...`);
      const fullPlan = await attemptCall(GEMINI_FALLBACK_MODEL);
      saveCachedPlan(fullPlan, airData);
      return { plan: fullPlan, isDemo: false };
    } catch (err2: unknown) {
      const error2 = getErrorMessage(err2);
      logger.warn('VayuShield Gemini attempt 2 failed:', err2);

      onStatusUpdate?.('Gemini unavailable; displaying verified Demo Plan.');
      const fallbackPlan = getDemoPlanForAqi(airData.currentAqi, airData.cityName, lang);
      return {
        plan: fallbackPlan,
        isDemo: true,
        error: `Live AI generation failed (${error2 || error1}). Displaying verified plan.`,
      };
    }
  }
}

/**
 * Ask Vayu Chat Consultation.
 */
export async function askVayu(
  question: string,
  airData: AirQualityData,
  profile: HouseholdProfile,
  plan: ActionPlan,
  lang: SupportedLanguage = 'en'
): Promise<string> {
  const sanitizedQuestion = question.trim().slice(0, 500);
  const apiKey = getSessionApiKey();

  if (!apiKey) {
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        const proxyRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'askVayu',
            question: sanitizedQuestion,
            prompt: `USER QUESTION: "${sanitizedQuestion}"\nCity: ${airData.cityName}\nAQI: ${airData.currentAqi}`,
            systemInstruction: getSystemInstruction(lang),
          }),
        });

        if (proxyRes.ok) {
          const data = (await proxyRes.json()) as { reply?: string };
          if (data?.reply && data.reply.trim()) {
            return data.reply.trim();
          }
        }
      } catch {
        // Fall back to local reasoning
      }
    }
    return generateOfflineChatAnswer(sanitizedQuestion, airData, profile, lang);
  }

  const prompt = buildAskVayuPrompt(sanitizedQuestion, airData, profile, plan, lang);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(lang),
        temperature: GEMINI_TEMPERATURES.askVayu,
      },
    });

    const reply = response.text?.trim();
    if (reply) {
      return reply;
    }
    return generateOfflineChatAnswer(question, airData, profile, lang);
  } catch (err: unknown) {
    logger.warn('Ask Vayu online request failed, falling back to local reasoning:', err);
    return generateOfflineChatAnswer(question, airData, profile, lang);
  }
}
