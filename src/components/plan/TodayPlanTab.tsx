import React, { useState } from 'react';
import type { ActionPlan, RoutineBadge } from '../../types';
import type { UiTranslations, SupportedLanguage } from '../../i18n';
import { speakText, stopSpeech, isSpeechSynthesisSupported } from '../../utils/speech';
import { OneThingToDo } from '../OneThingToDo';
import { DosAndDonts } from '../DosAndDonts';
import { Shield, Home, AlertTriangle, Wind, Volume2, VolumeX } from 'lucide-react';

interface TodayPlanTabProps {
  plan: ActionPlan;
  currentLang: SupportedLanguage;
  t: UiTranslations;
}

export const TodayPlanTab: React.FC<TodayPlanTabProps> = ({ plan, currentLang, t }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
    <>
      <OneThingToDo oneThing={plan.oneThingToDo} t={t} />

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

      <DosAndDonts dos={plan.dos || []} donts={plan.donts || []} t={t} />
    </>
  );
};
