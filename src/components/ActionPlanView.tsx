import React, { useState } from 'react';
import type { ActionPlan, RoutineBadge } from '../types';
import type { UiTranslations, SupportedLanguage } from '../i18n';
import { getSwapById } from '../data/swapCatalog';
import { speakText, stopSpeech, isSpeechSynthesisSupported } from '../utils/speech';
import { OneThingToDo } from './OneThingToDo';
import { DosAndDonts } from './DosAndDonts';
import { MaskAndDoctorGuide } from './MaskAndDoctorGuide';
import {
  Shield,
  Home,
  AlertTriangle,
  Wind,
  TrendingDown,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ActionPlanViewProps {
  plan: ActionPlan | null;
  isLoading: boolean;
  errorBanner?: string | null;
  completedHackIds: string[];
  completedSwapIds: string[];
  currentLang: SupportedLanguage;
  t: UiTranslations;
  activeTab?: 'plan' | 'hacks' | 'safety';
  onToggleHack: (id: string) => void;
  onToggleSwap: (id: string) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  plan,
  isLoading,
  errorBanner,
  completedHackIds,
  completedSwapIds,
  currentLang,
  t,
  activeTab = 'plan',
  onToggleHack,
  onToggleSwap,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Skeleton Loader State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading family action plan">
        <div className="bg-white rounded-3xl p-6 border border-slate-200">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-3" />
          <div className="h-4 bg-slate-100 rounded w-full mb-2" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 h-44" />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const textToSpeak = `${plan.oneThingToDo}. ${plan.familyRiskBriefing}.`;
      setIsPlayingAudio(true);
      speakText(
        textToSpeak,
        currentLang,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const getBadgeStyle = (badge: RoutineBadge) => {
    switch (badge) {
      case 'Stay Indoors':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Mask Required':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Safe Ventilation Window':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-7" role="region" aria-label="Generated daily smog action plan">
      {/* Error banner if any occurred during generation */}
      {errorBanner && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3 text-sm shadow-xs"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="font-semibold block">Notice:</strong>
            <span>{errorBanner}</span>
          </div>
        </div>
      )}

      {/* PLAN TAB: Hero Action, Risk Briefing, 4 Routine Blocks, and Dos & Don'ts */}
      {activeTab === 'plan' && (
        <>
          {/* 1. THE #1 MOST IMPORTANT ACTION TODAY (Prominent Hero Banner) */}
          <OneThingToDo oneThing={plan.oneThingToDo} t={t} />

          {/* 2. Family Risk Briefing + Audio Button */}
          <section
            aria-labelledby="family-risk-heading"
            className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-100 text-sky-800 rounded-xl" aria-hidden="true">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 id="family-risk-heading" className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  {t.familyBriefingTitle}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                {/* Read Aloud Button */}
                {isSpeechSynthesisSupported() && (
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                      isPlayingAudio
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100'
                    }`}
                    title={isPlayingAudio ? t.stopReading : t.readAloud}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4 mr-1.5" />
                        <span>{t.stopReading}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-1.5" />
                        <span>{t.readAloud}</span>
                      </>
                    )}
                  </button>
                )}

                {plan.isDemo && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full">
                    {t.demoBadge}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              <p>{plan.familyRiskBriefing}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Non-clinical guidance based on atmospheric boundary physics</span>
              {plan.generatedAt && <span>Generated: {plan.generatedAt}</span>}
            </div>
          </section>

          {/* 3. Daily Routine: Exactly 4 Chronological Blocks */}
          <section aria-labelledby="routine-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="routine-heading" className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  {t.routineTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Synchronized to atmospheric temperature shifts.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl">
                4 Times
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.dailyRoutine.map((block) => (
                <article
                  key={block.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-500 block">
                          {block.timeRange}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">
                          {block.title}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${getBadgeStyle(
                          block.badge
                        )}`}
                      >
                        {block.badge === 'Stay Indoors' && <Home className="w-3.5 h-3.5 mr-1" />}
                        {block.badge === 'Mask Required' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                        {block.badge === 'Safe Ventilation Window' && <Wind className="w-3.5 h-3.5 mr-1" />}
                        {block.badge}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-3 text-xs text-slate-700">
                      <strong className="text-slate-900 font-bold block mb-0.5">
                        {t.windowRulePrefix || '🪟 Window Rule:'}
                      </strong>
                      <span>{block.windowRule}</span>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 font-bold block mb-0.5">
                        {t.familyGuidancePrefix || '👥 Family Members:'}
                      </strong>
                      <span>{block.memberGuidance}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 4. Do's and Don'ts Lists */}
          <DosAndDonts dos={plan.dos || []} donts={plan.donts || []} t={t} />
        </>
      )}

      {/* HACKS TAB: Indoor Hacks and Swaps */}
      {activeTab === 'hacks' && (
        <>
          {/* 5. Low-Cost Indoor Hacks: Exactly 4 Cards */}
          <section aria-labelledby="hacks-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="hacks-heading" className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  {t.indoorHacksTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Simple home barriers with zero extra cost.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                Free / High ROI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.indoorHacks.map((hack) => {
                const isDone = completedHackIds.includes(hack.id);
                return (
                  <article
                    key={hack.id}
                    className={`bg-white rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                      isDone ? 'border-emerald-300 ring-2 ring-emerald-200' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                          {hack.targetArea}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {hack.difficulty}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {hack.title}
                      </h4>

                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 mb-4">
                        {hack.steps.map((step, idx) => (
                          <li key={idx} className="leading-snug">
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center">
                        <TrendingDown className="w-3.5 h-3.5 mr-1" />
                        {hack.estimatedReduction}
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleHack(hack.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isDone ? (t.doneText || 'Done ✓') : (t.markDone || 'Mark Done')}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 6. Smog Swaps: Exactly 4 Items */}
          <section aria-labelledby="swaps-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="swaps-heading" className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  {t.swapsTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Small habits that reduce personal exposure and community emissions.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl">
                Catalog Linked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.swaps.map((item) => {
                const catalog = getSwapById(item.catalogId);
                const isDone = completedSwapIds.includes(item.catalogId);

                return (
                  <article
                    key={item.catalogId}
                    className={`bg-white rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                      isDone ? 'border-emerald-300 ring-2 ring-emerald-200' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          {catalog?.category || 'Habit Swap'}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {catalog?.co2SavedBadge || '-1.0 kg CO2/day (est.)'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {catalog?.title || item.catalogId}
                      </h4>

                      <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3 mb-3 text-xs text-sky-950">
                        <strong className="block text-sky-900 font-bold mb-0.5">
                          {t.whyMattersPrefix || 'Why this matters for your home today:'}
                        </strong>
                        <span>{item.customReason}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] font-bold text-slate-700">
                        {catalog?.exposureReductionBadge}
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSwap(item.catalogId)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isDone ? (t.adoptedText || 'Adopted ✓') : (t.adoptSwap || 'Adopt Swap')}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* SAFETY TAB: Masks & Doctor Guide */}
      {activeTab === 'safety' && (
        <MaskAndDoctorGuide t={t} />
      )}
    </div>
  );
};
