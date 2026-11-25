import React from 'react';
import type { ActionPlan } from '../../types';
import type { UiTranslations } from '../../i18n';
import { getSwapById } from '../../data/swapCatalog';
import { TrendingDown } from 'lucide-react';

interface HacksSwapsTabProps {
  plan: ActionPlan;
  completedHackIds: string[];
  completedSwapIds: string[];
  t: UiTranslations;
  onToggleHack: (id: string) => void;
  onToggleSwap: (id: string) => void;
}

export const HacksSwapsTab: React.FC<HacksSwapsTabProps> = ({
  plan,
  completedHackIds,
  completedSwapIds,
  t,
  onToggleHack,
  onToggleSwap,
}) => {
  return (
    <>
      {/* Low-Cost Indoor Hacks: Exactly 4 Cards */}
      <section aria-labelledby="hacks-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3
              id="hacks-heading"
              className="text-lg sm:text-xl font-bold font-display text-slate-900"
            >
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
                    <span className="text-xs text-slate-500 font-semibold">{hack.difficulty}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">{hack.title}</h4>

                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 mb-4">
                    {hack.steps.map((step) => (
                      <li key={step} className="leading-snug">
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
                        ? 'bg-emerald-700 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isDone ? t.doneText || 'Done ✓' : t.markDone || 'Mark Done'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Smog Swaps: Exactly 4 Items */}
      <section aria-labelledby="swaps-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3
              id="swaps-heading"
              className="text-lg sm:text-xl font-bold font-display text-slate-900"
            >
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
                        ? 'bg-emerald-700 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isDone ? t.adoptedText || 'Adopted ✓' : t.adoptSwap || 'Adopt Swap'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};
