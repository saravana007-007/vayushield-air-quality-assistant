import React from 'react';
import type { ActionPlan } from '../types';
import type { UiTranslations, SupportedLanguage } from '../i18n';
import { MaskAndDoctorGuide } from './MaskAndDoctorGuide';
import { TodayPlanTab } from './plan/TodayPlanTab';
import { HacksSwapsTab } from './plan/HacksSwapsTab';
import { AlertTriangle } from 'lucide-react';

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
  // Skeleton Loader State
  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading family action plan">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-3 border-sky-600 border-t-transparent animate-spin shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {t.loadingPlan || 'Generating personalized action plan...'}
              </h4>
              <p className="text-xs text-slate-500">
                Calculating atmospheric inversion layers, safe ventilation windows & family risks
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-5 border border-slate-200 h-44 animate-pulse flex flex-col justify-between"
            >
              <div>
                <div className="h-3 bg-slate-200 rounded-md w-28 mb-3" />
                <div className="h-5 bg-slate-200 rounded-md w-44 mb-3" />
                <div className="h-3 bg-slate-100 rounded-md w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded-md w-5/6" />
              </div>
              <div className="h-3 bg-slate-100 rounded-md w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!plan) return null;

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
      {activeTab === 'plan' && <TodayPlanTab plan={plan} currentLang={currentLang} t={t} />}

      {/* HACKS TAB: Indoor Hacks and Swaps */}
      {activeTab === 'hacks' && (
        <HacksSwapsTab
          plan={plan}
          completedHackIds={completedHackIds}
          completedSwapIds={completedSwapIds}
          t={t}
          onToggleHack={onToggleHack}
          onToggleSwap={onToggleSwap}
        />
      )}

      {/* SAFETY TAB: Masks & Doctor Guide */}
      {activeTab === 'safety' && <MaskAndDoctorGuide t={t} />}
    </div>
  );
};
