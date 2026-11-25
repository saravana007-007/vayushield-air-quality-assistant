import React from 'react';
import type { AirQualityData } from '../types';
import type { UiTranslations } from '../i18n';
import { Activity, ShieldAlert } from 'lucide-react';

interface DangerExplainerProps {
  airData: AirQualityData;
  t: UiTranslations;
}

export const DangerExplainer: React.FC<DangerExplainerProps> = ({ airData, t }) => {
  const { currentAqi, currentPm25, currentPm10, category, whoMultiplier, cityName, lastUpdated } =
    airData;

  // Gauge percentage (clamped between 0 and 100% for 0 to 500 AQI)
  const gaugePercent = Math.min(100, Math.max(0, (currentAqi / 500) * 100));

  // Localized category name and summary from translation dictionary
  const localizedCategoryName = t.categoryNames?.[category.key] || category.label;
  const localizedSummary = t.categorySummaries?.[category.key] || category.actionSummary;

  return (
    <article
      aria-labelledby="danger-explainer-title"
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-7 transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Big Prominent Number + Emoji + Traffic Light */}
        <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
          {/* Big Number Card */}
          <div
            className={`p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center min-w-[120px] text-center shadow-xs border ${category.colorClass}`}
            aria-label={`AQI ${currentAqi}, ${localizedCategoryName}`}
          >
            <span
              className="text-4xl sm:text-5xl mb-1 select-none"
              role="img"
              aria-label="Pollution face indicator"
            >
              {category.emoji}
            </span>
            <span className="text-4xl sm:text-5xl font-black font-display tracking-tight my-0.5">
              {currentAqi}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
              US AQI
            </span>
          </div>

          {/* Details & Traffic Light */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center space-x-2 flex-wrap">
              <h2
                id="danger-explainer-title"
                className="text-xl sm:text-2xl font-bold font-display text-slate-900"
              >
                {cityName}
              </h2>
              <span className="text-xs text-slate-400 font-medium">{lastUpdated}</span>
            </div>

            {/* Traffic-Light Status Pill (Icon + Text + Emoji) */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 pt-0.5">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border ${category.colorClass}`}
              >
                <span className="mr-1.5 text-base">{category.trafficEmoji}</span>
                <span>
                  {t.categoryLabelPrefix || 'Category'}: {localizedCategoryName}
                </span>
              </span>

              {/* WHO Guideline Multiplier Badge */}
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                <Activity className="w-3.5 h-3.5 mr-1 text-amber-700" aria-hidden="true" />
                <span>
                  {whoMultiplier}x {t.whoExceedLabel}
                </span>
              </span>
            </div>

            {/* Plain-Language 1-Sentence Meaning (Zero Jargon) */}
            <p className="text-xs sm:text-sm text-slate-700 font-medium pt-1 max-w-xl leading-relaxed">
              {localizedSummary}
            </p>
          </div>
        </div>

        {/* Right: Quick Particulate Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center sm:text-left">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              {t.pm25Label}
            </span>
            <span className="text-xl sm:text-2xl font-black font-display text-slate-900">
              {currentPm25}
            </span>
            <span className="text-[10px] text-slate-500 block">µg/m³</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center sm:text-left">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              {t.pm10Label}
            </span>
            <span className="text-xl sm:text-2xl font-black font-display text-slate-900">
              {currentPm10}
            </span>
            <span className="text-[10px] text-slate-500 block">µg/m³</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-center sm:text-left">
            <span className="text-[11px] font-bold text-amber-900 uppercase block flex items-center justify-center sm:justify-start">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-700" />
              {t.maskStandardLabel}
            </span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">
              {currentAqi > 150 ? 'N95 / FFP2' : 'Surgical / KN95'}
            </span>
            <span className="text-[10px] text-slate-600 block">{t.clothFailsShort}</span>
          </div>
        </div>
      </div>

      {/* Visual Gauge Bar from 0 to 500 with Active Marker */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span>{t.gaugeLabel}</span>
          <span className="font-mono text-slate-800">{currentAqi} / 500 AQI</span>
        </div>

        {/* Color Spectrum Bar with Pin Marker */}
        <div className="relative w-full h-4 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 via-rose-600 to-purple-900 shadow-inner">
          <div
            style={{ left: `${Math.min(98, Math.max(2, gaugePercent))}%` }}
            className="absolute top-0 bottom-0 w-2 bg-white border-2 border-slate-900 rounded-full shadow-md transform -translate-x-1/2 transition-all duration-500"
            role="presentation"
            title={`Marker at AQI ${currentAqi}`}
          />
        </div>

        {/* Benchmark ticks */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-0.5">
          <span>0 (Clean)</span>
          <span className="hidden xs:inline">50</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>500+</span>
        </div>
      </div>
    </article>
  );
};
