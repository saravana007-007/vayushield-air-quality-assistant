import React, { useState } from 'react';
import { Header } from './components/Header';
import { CitySelector } from './components/CitySelector';
import { DangerExplainer } from './components/DangerExplainer';
import { WhenWillItGetBetter } from './components/WhenWillItGetBetter';
import { HouseholdProfileForm } from './components/HouseholdProfileForm';
import { ActionTracker } from './components/ActionTracker';
import { ActionPlanView } from './components/ActionPlanView';
import { AskVayuDrawer } from './components/AskVayuDrawer';
import { ShareCardModal } from './components/ShareCardModal';
import { ScoreHelpModal } from './components/ScoreHelpModal';
import { Calendar, Lightbulb, Users, ShieldAlert, ArrowRight } from 'lucide-react';

import type { HouseholdProfile } from './types';
import { DEMO_PLANS } from './data/demoPlans';
import { useLanguage } from './hooks/useLanguage';
import { useTextSize } from './hooks/useTextSize';
import { useAirQuality } from './hooks/useAirQuality';
import { useActionPlan } from './hooks/useActionPlan';
import { useChecklist } from './hooks/useChecklist';

type ActiveTab = 'plan' | 'hacks' | 'setup' | 'safety';

export const App: React.FC = () => {
  const { currentLang, t, setLanguage } = useLanguage();
  const { textSize, setTextSize, textSizeClass } = useTextSize();
  const { airData, activePresetId, isLoadingAir, airError, selectPreset, selectLocation } = useAirQuality();
  const {
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
  } = useActionPlan();
  const { completedHackIds, completedSwapIds, toggleHack, toggleSwap } = useChecklist();

  const [activeTab, setActiveTab] = useState<ActiveTab>('plan');
  const [profile, setProfile] = useState<HouseholdProfile>({
    tags: ['toddler_kids', 'elderly', 'asthma_respiratory'],
    setup: { airPurifier: true, stoveType: 'gas', commuteMode: 'metro_bus' },
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isScoreHelpOpen, setIsScoreHelpOpen] = useState(false);

  const handleLanguageChange = (lang: typeof currentLang) => {
    setLanguage(lang);
    syncPlanForLanguage(airData.currentAqi, airData.cityName, lang);
  };

  const handlePresetChange = (presetKey: string) => {
    const selected = selectPreset(presetKey);
    if (!selected) return;

    const demoKey = `${presetKey}-${currentLang}`;
    const planToSet = DEMO_PLANS[demoKey] ?? DEMO_PLANS[presetKey];
    if (planToSet) {
      setPlanDirectly(planToSet, true);
    } else {
      void generatePlan(selected, profile, currentLang, t);
    }
  };

  const handleLocationChange = async (name: string, lat: number, lon: number, country?: string) => {
    const live = await selectLocation(name, lat, lon, country);
    if (live) {
      void generatePlan(live, profile, currentLang, t);
    } else if (airError) {
      setErrorBanner(airError);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased selection:bg-sky-500 selection:text-white ${textSizeClass}`}>
      <Header
        isDemo={isDemo}
        currentLang={currentLang}
        textSize={textSize}
        t={t}
        onSelectLanguage={handleLanguageChange}
        onChangeTextSize={setTextSize}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenScoreHelp={() => setIsScoreHelpOpen(true)}
      />

      <div className="sr-only" role="status" aria-live="polite">
        {statusMessage || (isLoadingPlan ? t.loadingPlan : '')}
      </div>

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {cachedNotice && (
          <div className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold flex items-center justify-between">
            <span>{cachedNotice}</span>
            <button onClick={dismissCachedNotice} className="text-slate-400 hover:text-slate-700 ml-2" aria-label="Dismiss notice">
              ✕
            </button>
          </div>
        )}

        <CitySelector
          currentCityName={airData.cityName}
          isPresetActive={Boolean(airData.isPreset)}
          activePresetId={activePresetId}
          isLoading={isLoadingAir}
          t={t}
          onSelectLocation={handleLocationChange}
          onSelectPreset={handlePresetChange}
        />

        <div className="space-y-4">
          <DangerExplainer airData={airData} t={t} />
          <WhenWillItGetBetter bestWindow={airData.bestWindow} t={t} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex items-center justify-between gap-1 overflow-x-auto" role="tablist" aria-label="Action plan sections">
          {[
            { id: 'plan', label: "Today's Plan", icon: Calendar },
            { id: 'hacks', label: 'Hacks & Swaps', icon: Lightbulb },
            { id: 'setup', label: 'Family & Setup', icon: Users },
            { id: 'safety', label: 'Masks & Health', icon: ShieldAlert },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id as ActiveTab)}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                activeTab === id ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

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
              onToggleHack={toggleHack}
              onToggleSwap={toggleSwap}
            />
            <div className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Customized for your family</h4>
                  <p className="text-xs text-slate-500">Add toddlers, elderly parents, or specify stove & commute in Family Setup.</p>
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
                onToggleHack={toggleHack}
                onToggleSwap={toggleSwap}
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
                onToggleHack={toggleHack}
                onToggleSwap={toggleSwap}
                onOpenScoreHelp={() => setIsScoreHelpOpen(true)}
              />
              <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-3xl p-5 sm:p-6 text-white shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold font-display text-sm sm:text-base">{t.shareCardBtn}</h3>
                  <p className="text-xs text-sky-100 mt-0.5">Export plan as PDF or WhatsApp format.</p>
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

        {activeTab === 'setup' && (
          <div id="panel-setup" role="tabpanel" className="space-y-6 max-w-4xl mx-auto">
            <HouseholdProfileForm
              profile={profile}
              t={t}
              onChangeProfile={setProfile}
              onGeneratePlan={async () => {
                await generatePlan(airData, profile, currentLang, t);
                setActiveTab('plan');
              }}
              isLoading={isLoadingPlan}
              statusMessage={statusMessage}
            />
          </div>
        )}

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
              onToggleHack={toggleHack}
              onToggleSwap={toggleSwap}
            />
          </div>
        )}
      </main>

      <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">VayuShield</span>
            <span>— {t.tagline}</span>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-400 max-w-xl">{t.disclaimerText}</p>
        </div>
      </footer>

      <AskVayuDrawer key={`${currentLang}-${airData.cityName}`} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} airData={airData} profile={profile} plan={plan} currentLang={currentLang} t={t} />
      <ShareCardModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} airData={airData} profile={profile} plan={plan} completedHackIds={completedHackIds} completedSwapIds={completedSwapIds} t={t} />
      <ScoreHelpModal isOpen={isScoreHelpOpen} onClose={() => setIsScoreHelpOpen(false)} />
    </div>
  );
};

export default App;
