import { useState, useCallback } from 'react';
import type { ActionPlan, AirQualityData, HouseholdProfile } from '../types';
import type { SupportedLanguage, UiTranslations } from '../i18n';
import { generateActionPlan, getCachedPlan } from '../services/geminiService';
import { DEMO_PLANS, getDemoPlanForAqi } from '../data/demoPlans';
import { logger } from '../utils/logger';

export interface UseActionPlanResult {
  plan: ActionPlan;
  isDemo: boolean;
  isLoadingPlan: boolean;
  statusMessage: string;
  errorBanner: string | null;
  cachedNotice: string | null;
  dismissCachedNotice: () => void;
  generatePlan: (
    airData: AirQualityData,
    profile: HouseholdProfile,
    lang: SupportedLanguage,
    t: UiTranslations
  ) => Promise<void>;
  setPlanDirectly: (plan: ActionPlan, isDemo: boolean) => void;
  syncPlanForLanguage: (aqi: number, cityName: string, lang: SupportedLanguage) => void;
  setErrorBanner: (error: string | null) => void;
}

/**
 * Manage action plan state, live/proxy generation, language sync, and offline caching.
 */
export function useActionPlan(): UseActionPlanResult {
  const [plan, setPlan] = useState<ActionPlan>(
    () => DEMO_PLANS['delhi-severe'] ?? Object.values(DEMO_PLANS)[0]!
  );
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Initialize cached notice directly to avoid effect setState
  const [cachedNotice, setCachedNotice] = useState<string | null>(() => {
    const cached = getCachedPlan();
    return cached ? `Showing cached offline plan (${cached.timestamp})` : null;
  });

  const dismissCachedNotice = useCallback(() => {
    setCachedNotice(null);
  }, []);

  const setPlanDirectly = useCallback((newPlan: ActionPlan, demoFlag: boolean) => {
    setPlan(newPlan);
    setIsDemo(demoFlag);
  }, []);

  const syncPlanForLanguage = useCallback(
    (aqi: number, cityName: string, lang: SupportedLanguage) => {
      if (isDemo) {
        setPlan(getDemoPlanForAqi(aqi, cityName, lang));
      }
    },
    [isDemo]
  );

  const generatePlan = useCallback(
    async (
      currentAir: AirQualityData,
      currentProf: HouseholdProfile,
      lang: SupportedLanguage,
      t: UiTranslations
    ) => {
      setIsLoadingPlan(true);
      setErrorBanner(null);
      setCachedNotice(null);
      setStatusMessage(t.loadingPlan);

      try {
        const result = await generateActionPlan(currentAir, currentProf, lang, (msg) => {
          setStatusMessage(msg);
        });

        setPlan(result.plan);
        setIsDemo(result.isDemo);
        if (result.error) {
          setErrorBanner(result.error);
        } else {
          setErrorBanner(null);
        }
      } catch (err: unknown) {
        logger.error('Plan generation failed:', err);
        setErrorBanner('Engine communication error; loaded verified offline plan.');
        setIsDemo(true);
      } finally {
        setIsLoadingPlan(false);
        setStatusMessage('');
      }
    },
    []
  );

  return {
    plan,
    isDemo,
    isLoadingPlan,
    statusMessage,
    errorBanner,
    cachedNotice,
    dismissCachedNotice,
    generatePlan,
    setPlanDirectly,
    syncPlanForLanguage,
    setErrorBanner,
  };
}
