import React, { useState, useEffect, useCallback } from 'react';
import { Header, type TextSize } from './components/Header';
import { CitySelector } from './components/CitySelector';
import { DangerExplainer } from './components/DangerExplainer';
import { WhenWillItGetBetter } from './components/WhenWillItGetBetter';
import { HouseholdProfileForm } from './components/HouseholdProfileForm';
import { ActionTracker } from './components/ActionTracker';
import { ActionPlanView } from './components/ActionPlanView';
import { AskVayuDrawer } from './components/AskVayuDrawer';
import { ShareCardModal } from './components/ShareCardModal';
import { ScoreHelpModal } from './components/ScoreHelpModal';
import { Calendar, Lightbulb, Users, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

import type { AirQualityData, HouseholdProfile, ActionPlan } from './types';
import { AIR_PRESETS, fetchLiveAirQuality } from './services/airQualityService';
import { generateActionPlan, getCachedPlan } from './services/geminiService';
import { DEMO_PLANS, getDemoPlanForAqi } from './data/demoPlans';
import {
  type SupportedLanguage,
  getTranslation,
  getSavedLanguage,
  saveLanguage,
  applyLanguageToDocument,
} from './i18n';

type ActiveTab = 'plan' | 'hacks' | 'setup' | 'safety';

export const App: React.FC = () => {
  // Multilingual State
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getSavedLanguage);
  const t = getTranslation(currentLang);

  // Text Size State (Saved in localStorage: small, medium, large, xlarge)
  const [textSize, setTextSize] = useState<TextSize>(() => {
    const saved = localStorage.getItem('vayushield_text_size');
    if (saved === 'small' || saved === 'medium' || saved === 'large' || saved === 'xlarge') {
      return saved;
    }
    return 'medium';
  });

  const handleTextSizeChange = (newSize: TextSize) => {
    setTextSize(newSize);
    localStorage.setItem('vayushield_text_size', newSize);
  };

  // Active Tab State (Prevents page clutter and eliminates endless scrolling)
  const [activeTab, setActiveTab] = useState<ActiveTab>('plan');

  // Current Air Quality Data (Defaults to Delhi Severe Smog Preset)
  const [airData, setAirData] = useState<AirQualityData>(AIR_PRESETS['delhi-severe']);
  const [activePresetId, setActivePresetId] = useState<string>('delhi-severe');

  // Household Profile State (Supports custom "other" condition, stove, and commute)
  const [profile, setProfile] = useState<HouseholdProfile>({
    tags: ['toddler_kids', 'elderly', 'asthma_respiratory'],
    setup: {
      airPurifier: true,
      stoveType: 'gas',
      commuteMode: 'metro_bus',
    },
  });

  // Action Plan State
  const [plan, setPlan] = useState<ActionPlan>(DEMO_PLANS['delhi-severe']);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [isLoadingAir, setIsLoadingAir] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [cachedNotice, setCachedNotice] = useState<string | null>(null);

  // Checklist State for Hacks and Swaps
  const [completedHackIds, setCompletedHackIds] = useState<string[]>(['hack-1', 'hack-3']);
  const [completedSwapIds, setCompletedSwapIds] = useState<string[]>(['simmer-pot-aromatics']);

  // Modals / Drawers State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isScoreHelpOpen, setIsScoreHelpOpen] = useState<boolean>(false);

  // Apply Language & Direction
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    saveLanguage(lang);
    // Reload matching localized demo plan or regenerate
    if (isDemo) {
      setPlan(getDemoPlanForAqi(airData.currentAqi, airData.cityName, lang));
    }
  };

  // Plan generation function
  const handleGeneratePlan = useCallback(
    async (currentAir: AirQualityData, currentProf: HouseholdProfile, lang: SupportedLanguage) => {
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
      } catch (err: any) {
        console.error('Plan generation failed:', err);
        setErrorBanner('Engine communication error; loaded verified offline plan.');
        setIsDemo(true);
      } finally {
        setIsLoadingPlan(false);
        setStatusMessage('');
      }
    },
    [t.loadingPlan]
  );

  // Preset Selection Handler (instant, no network required)
  const handleSelectPreset = (presetKey: string) => {
    const selected = AIR_PRESETS[presetKey];
    if (!selected) return;

    setAirData(selected);
    setActivePresetId(presetKey);

    const demoKey = `${presetKey}-${currentLang}`;
    if (DEMO_PLANS[demoKey]) {
      setPlan(DEMO_PLANS[demoKey]);
      setIsDemo(true);
      setErrorBanner(null);
    } else if (DEMO_PLANS[presetKey]) {
      setPlan(DEMO_PLANS[presetKey]);
      setIsDemo(true);
      setErrorBanner(null);
    } else {
      handleGeneratePlan(selected, profile, currentLang);
    }
  };

  // Custom Location Selection Handler (calls Open-Meteo)
  const handleSelectLocation = async (
    name: string,
    lat: number,
    lon: number,
    country?: string
  ) => {
    setIsLoadingAir(true);
    setErrorBanner(null);
    setActivePresetId('');

    try {
      const live = await fetchLiveAirQuality(name, lat, lon, country);
      setAirData(live);
      await handleGeneratePlan(live, profile, currentLang);
    } catch (err: any) {
      setErrorBanner(err?.message || 'Failed to fetch live air quality data for this location.');
    } finally {
      setIsLoadingAir(false);
    }
  };

  // Checklist Toggles
  const handleToggleHack = (id: string) => {
    setCompletedHackIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSwap = (id: string) => {
    setCompletedSwapIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // On mount: check cached offline plan and set document attributes
  useEffect(() => {
    applyLanguageToDocument(currentLang);

    // Check for cached plan
    const cached = getCachedPlan();
    if (cached) {
      setCachedNotice(`${t.cachedNotice} (${cached.timestamp})`);
    }
  }, [currentLang, t.cachedNotice]);

  // CSS text size mapping
  const getTextSizeClass = (size: TextSize) => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      case 'xlarge':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased selection:bg-sky-500 selection:text-white ${getTextSizeClass(textSize)}`}>
      {/* Header */}
      <Header
        isDemo={isDemo}
        currentLang={currentLang}
        textSize={textSize}
        t={t}
        onSelectLanguage={handleSelectLanguage}
        onChangeTextSize={handleTextSizeChange}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenScoreHelp={() => setIsScoreHelpOpen(true)}
      />

      {/* Screen reader live notification */}
      <div className="sr-only" role="status" aria-live="polite">
        {statusMessage || (isLoadingPlan ? t.loadingPlan : '')}
      </div>

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Offline Cache Notice if applicable */}
        {cachedNotice && (
          <div className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold flex items-center justify-between">
            <span>{cachedNotice}</span>
            <button onClick={() => setCachedNotice(null)} className="text-slate-400 hover:text-slate-700 ml-2">
              ✕
            </button>
          </div>
        )}

        {/* City & Preset Search Bar with GPS */}
        <CitySelector
          currentCityName={airData.cityName}
          isPresetActive={Boolean(airData.isPreset)}
          activePresetId={activePresetId}
          isLoading={isLoadingAir}
          t={t}
          onSelectLocation={handleSelectLocation}
          onSelectPreset={handleSelectPreset}
        />

        {/* 1. Danger Explainer + When Will It Get Better in a unified top summary */}
        <div className="space-y-4">
          <DangerExplainer airData={airData} t={t} />
          <WhenWillItGetBetter bestWindow={airData.bestWindow} t={t} />
        </div>

        {/* 2. Modern Accessible Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex items-center justify-between gap-1 overflow-x-auto" role="tablist" aria-label="Action plan sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'plan'}
            aria-controls="panel-plan"
            onClick={() => setActiveTab('plan')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'plan'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Today's Plan</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'hacks'}
            aria-controls="panel-hacks"
            onClick={() => setActiveTab('hacks')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'hacks'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>Hacks & Swaps</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'setup'}
            aria-controls="panel-setup"
            onClick={() => setActiveTab('setup')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'setup'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Family & Setup</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'safety'}
            aria-controls="panel-safety"
            onClick={() => setActiveTab('safety')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'safety'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Masks & Health</span>
          </button>
        </div>

        {/* TAB 1: TODAY'S ACTION PLAN */}
        {activeTab === 'plan' && (
          <div id="panel-plan" role="tabpanel" className="space-y-6">
            <ActionPlanView
              plan={plan}
              isLoading={isLoadingPlan}
              errorBanner={errorBanner}
              completedHackIds={completedHackIds}
              completedSwapIds={completedSwapIds}
              currentLang={currentLang}
              t={t}
              activeTab="plan"
              onToggleHack={handleToggleHack}
              onToggleSwap={handleToggleSwap}
            />

            {/* Quick banner directing to customize family profile */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Customized for your family</h4>
                  <p className="text-xs text-slate-500">
                    Add toddlers, elderly parents, or specify stove & commute in Family Setup.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('setup')}
                className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                <span>Edit Family Setup</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INDOOR HACKS & CLEAN AIR SWAPS + ACTION TRACKER */}
        {activeTab === 'hacks' && (
          <div id="panel-hacks" role="tabpanel" className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <ActionPlanView
                plan={plan}
                isLoading={isLoadingPlan}
                errorBanner={errorBanner}
                completedHackIds={completedHackIds}
                completedSwapIds={completedSwapIds}
                currentLang={currentLang}
                t={t}
                activeTab="hacks"
                onToggleHack={handleToggleHack}
                onToggleSwap={handleToggleSwap}
              />
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
              <ActionTracker
                plan={plan}
                profile={profile}
                currentAqi={airData.currentAqi}
                completedHackIds={completedHackIds}
                completedSwapIds={completedSwapIds}
                t={t}
                onToggleHack={handleToggleHack}
                onToggleSwap={handleToggleSwap}
                onOpenScoreHelp={() => setIsScoreHelpOpen(true)}
              />

              {/* Quick Share Callout Card */}
              <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-3xl p-5 sm:p-6 text-white shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold font-display text-sm sm:text-base">{t.shareCardBtn}</h3>
                  <p className="text-xs text-sky-100 mt-0.5">
                    Export plan as PDF or WhatsApp format.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-sky-50 shadow-xs transition-colors shrink-0"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOUSEHOLD PROFILE & HOME SETUP */}
        {activeTab === 'setup' && (
          <div id="panel-setup" role="tabpanel" className="space-y-6 max-w-4xl mx-auto">
            <HouseholdProfileForm
              profile={profile}
              t={t}
              onChangeProfile={setProfile}
              onGeneratePlan={async () => {
                await handleGeneratePlan(airData, profile, currentLang);
                setActiveTab('plan'); // Return to plan tab to see results!
              }}
              isLoading={isLoadingPlan}
              statusMessage={statusMessage}
            />
          </div>
        )}

        {/* TAB 4: MASKS & HEALTH EMERGENCY GUIDE */}
        {activeTab === 'safety' && (
          <div id="panel-safety" role="tabpanel" className="space-y-6 max-w-4xl mx-auto">
            <ActionPlanView
              plan={plan}
              isLoading={isLoadingPlan}
              errorBanner={errorBanner}
              completedHackIds={completedHackIds}
              completedSwapIds={completedSwapIds}
              currentLang={currentLang}
              t={t}
              activeTab="safety"
              onToggleHack={handleToggleHack}
              onToggleSwap={handleToggleSwap}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">VayuShield</span>
            <span>— {t.tagline}</span>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-400 max-w-xl">
            {t.disclaimerText}
          </p>
        </div>
      </footer>

      {/* Drawers & Modals (API Key modal completely removed) */}
      <AskVayuDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        airData={airData}
        profile={profile}
        plan={plan}
        currentLang={currentLang}
        t={t}
      />

      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        airData={airData}
        profile={profile}
        plan={plan}
        completedHackIds={completedHackIds}
        completedSwapIds={completedSwapIds}
        t={t}
      />

      <ScoreHelpModal
        isOpen={isScoreHelpOpen}
        onClose={() => setIsScoreHelpOpen(false)}
      />
    </div>
  );
};

export default App;
