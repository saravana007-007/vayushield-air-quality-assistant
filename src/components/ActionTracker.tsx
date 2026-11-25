import React from 'react';
import type { ActionPlan, HouseholdProfile } from '../types';
import type { UiTranslations } from '../i18n';
import {
  calculateProtectionScore,
  calculateCo2Saved,
  calculateExposureReduction,
} from '../utils/aqiCalculator';
import { getSwapById } from '../data/swapCatalog';
import { ShieldCheck, CheckCircle2, Circle, Leaf, HelpCircle, ArrowUpRight } from 'lucide-react';

interface ActionTrackerProps {
  plan: ActionPlan;
  profile: HouseholdProfile;
  currentAqi: number;
  completedHackIds: string[];
  completedSwapIds: string[];
  t: UiTranslations;
  onToggleHack: (id: string) => void;
  onToggleSwap: (id: string) => void;
  onOpenScoreHelp: () => void;
}

export const ActionTracker: React.FC<ActionTrackerProps> = ({
  plan,
  profile,
  currentAqi,
  completedHackIds,
  completedSwapIds,
  t,
  onToggleHack,
  onToggleSwap,
  onOpenScoreHelp,
}) => {
  const scoreBreakdown = calculateProtectionScore(
    profile,
    completedHackIds,
    plan.indoorHacks.length,
    completedSwapIds,
    plan.swaps.length
  );

  const co2Saved = calculateCo2Saved(completedSwapIds);
  const exposureInfo = calculateExposureReduction(scoreBreakdown.total, currentAqi);

  const localizedIsolationNote =
    exposureInfo.reductionPercentage >= 80
      ? t.isolationOptimal
      : exposureInfo.reductionPercentage >= 60
        ? t.isolationModerate
        : t.isolationElevated;

  return (
    <aside
      aria-labelledby="tracker-heading"
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-7 flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="tracker-heading"
                className="text-base sm:text-lg font-bold font-display text-slate-900"
              >
                {t.trackerTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.trackerSubtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenScoreHelp}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
            title={t.howCalculated}
            aria-label={t.howCalculated}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Big Dual Counters: Protection Score & CO2 Saved */}
        <div className="grid grid-cols-2 gap-3 my-5">
          {/* Protection Score Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200 text-center relative overflow-hidden">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
              {t.protectionScore}
            </span>
            <div className="text-3xl sm:text-4xl font-black font-display text-emerald-800 my-1">
              {scoreBreakdown.total}%
            </div>
            <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${scoreBreakdown.total}%` }}
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                role="progressbar"
                aria-valuenow={scoreBreakdown.total}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Family smog protection percentage"
              />
            </div>
            <p className="text-[10px] text-emerald-800 font-medium mt-1.5">
              {t.estIndoorAqiPrefix}: ~{exposureInfo.estimatedIndoorAqi}
            </p>
          </div>

          {/* CO2 Saved Counter */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/40 border border-sky-200 text-center relative overflow-hidden">
            <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block">
              {t.co2Saved}
            </span>
            <div className="text-3xl sm:text-4xl font-black font-display text-sky-800 my-1 flex items-baseline justify-center">
              <span>{co2Saved}</span>
              <span className="text-sm font-bold text-sky-600 ml-1">kg</span>
            </div>
            <p className="text-[10px] text-sky-700 font-medium mt-3 flex items-center justify-center">
              <Leaf className="w-3 h-3 mr-1 text-emerald-600" aria-hidden="true" />
              {t.co2CommunityImpact}
            </p>
          </div>
        </div>

        {/* Live Exposure Note */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl mb-5 text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900">{t.currentIsolationPrefix}: </span>
          {localizedIsolationNote}
        </div>

        {/* Checklist of Active Items */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span>
                {t.indoorHacksChecklistTitle} ({completedHackIds.length}/{plan.indoorHacks.length})
              </span>
            </div>
            <div className="space-y-1.5" role="group" aria-label="Indoor micro hacks checklist">
              {plan.indoorHacks.map((hack) => {
                const isDone = completedHackIds.includes(hack.id);
                return (
                  <button
                    key={hack.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isDone}
                    onClick={() => onToggleHack(hack.id)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors focus:ring-2 focus:ring-sky-500 ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 pr-2">
                      {isDone ? (
                        <CheckCircle2
                          className="w-4 h-4 text-emerald-600 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                      )}
                      <span className={isDone ? 'line-through text-slate-500' : ''}>
                        {hack.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">+7.5%</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span>
                {t.swapsChecklistTitle} ({completedSwapIds.length}/{plan.swaps.length})
              </span>
            </div>
            <div className="space-y-1.5" role="group" aria-label="Smog swaps checklist">
              {plan.swaps.map((item) => {
                const catalog = getSwapById(item.catalogId);
                const isDone = completedSwapIds.includes(item.catalogId);
                return (
                  <button
                    key={item.catalogId}
                    type="button"
                    role="checkbox"
                    aria-checked={isDone}
                    onClick={() => onToggleSwap(item.catalogId)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors focus:ring-2 focus:ring-sky-500 ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 pr-2">
                      {isDone ? (
                        <CheckCircle2
                          className="w-4 h-4 text-emerald-600 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                      )}
                      <span className={isDone ? 'line-through text-slate-500' : ''}>
                        {catalog ? catalog.title : item.catalogId}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 shrink-0">
                      +{catalog?.co2SavedKg || 0.5} kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>{t.realtimeUpdateNote}</span>
        <button
          type="button"
          onClick={onOpenScoreHelp}
          className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center"
        >
          {t.viewFormulaBtn} <ArrowUpRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </aside>
  );
};
