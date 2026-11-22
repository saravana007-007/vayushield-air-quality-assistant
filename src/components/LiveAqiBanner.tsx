import React from 'react';
import type { AirQualityData } from '../types';
import { AlertOctagon, Wind, ShieldAlert, Sun, Moon, Info } from 'lucide-react';

interface LiveAqiBannerProps {
  airData: AirQualityData;
}

export const LiveAqiBanner: React.FC<LiveAqiBannerProps> = ({ airData }) => {
  const { currentAqi, currentPm25, currentPm10, category, cityName, country, hourly, lastUpdated, isPreset } = airData;

  // Find max AQI in hourly data for scaling bar heights
  const maxHourlyAqi = Math.max(400, ...hourly.map((h) => h.aqi));

  return (
    <article
      aria-labelledby="live-aqi-title"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
    >
      {/* Top Banner Row: Primary Metrics */}
      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Location & Primary AQI Badge */}
          <div className="flex items-start sm:items-center space-x-4 sm:space-x-5">
            {/* Big AQI Number Card */}
            <div
              className={`p-4 rounded-2xl flex flex-col items-center justify-center min-w-[110px] text-center shadow-xs border ${category.colorClass}`}
              aria-label={`Current US AQI is ${currentAqi}, classified as ${category.label}`}
            >
              <span className="text-xs uppercase font-bold tracking-wider opacity-85">US AQI</span>
              <span className="text-4xl sm:text-5xl font-black font-display tracking-tight my-0.5">
                {currentAqi}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wide">
                {category.label.split(' ')[0]}
              </span>
            </div>

            {/* City & Category Description */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 id="live-aqi-title" className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                  {cityName}
                </h1>
                {country && (
                  <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-md">
                    {country}
                  </span>
                )}
                {isPreset && (
                  <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                    Curated Preset
                  </span>
                )}
              </div>

              {/* Status Badge with ICON + TEXT (never color alone) */}
              <div className="flex items-center space-x-2 pt-0.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${category.colorClass}`}>
                  <AlertOctagon className="w-3.5 h-3.5 mr-1.5 shrink-0" aria-hidden="true" />
                  Category: {category.label}
                </span>
                <span className="text-xs text-slate-400">
                  Updated: {lastUpdated}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl pt-1">
                {category.actionSummary}
              </p>
            </div>
          </div>

          {/* Right: Particulate breakdown & Mask recommendation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
            {/* PM2.5 Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>PM2.5</span>
                <span className="text-[10px] text-slate-400">Fine</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-display">
                {currentPm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
              <p className="text-[10px] text-amber-700 mt-1 font-medium">
                {Math.round(currentPm25 / 15)}x WHO 24h limit
              </p>
            </div>

            {/* PM10 Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>PM10</span>
                <span className="text-[10px] text-slate-400">Coarse</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-display">
                {currentPm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Dust & Road Grit
              </p>
            </div>

            {/* Respirator Requirement */}
            <div className="col-span-2 sm:col-span-1 bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center text-xs font-bold text-amber-900 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-700 shrink-0" aria-hidden="true" />
                <span>Mask Standard</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                {currentAqi > 150 ? 'N95 / FFP2 Only' : 'Surgical / KN95'}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Cloth masks fail against fine PM2.5.
              </p>
            </div>
          </div>
        </div>

        {/* 24-Hour Winter Inversion Profile Bar Chart */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-sky-600" aria-hidden="true" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Winter Boundary Inversion Forecast
              </h2>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center">
                <Sun className="w-3 h-3 text-emerald-600 mr-1" />
                Midday Lift (12-3 PM)
              </span>
              <span className="inline-flex items-center">
                <Moon className="w-3 h-3 text-purple-600 mr-1" />
                Evening Inversion (5-9 PM)
              </span>
            </div>
          </div>

          {/* Bar timeline */}
          <div
            className="flex items-end gap-1.5 h-28 pt-4 px-1 overflow-x-auto"
            role="region"
            aria-label="Hourly air quality forecast chart"
            tabIndex={0}
          >
            {hourly.slice(0, 14).map((h, idx) => {
              const heightPercent = Math.min(100, Math.max(15, Math.round((h.aqi / maxHourlyAqi) * 100)));
              
              // Color coding based on inversion context
              let barColor = 'bg-rose-500 hover:bg-rose-600';
              let isSafeWindow = false;
              let isInversionTrap = false;

              if (h.hour >= 12 && h.hour <= 15) {
                isSafeWindow = true;
                barColor = 'bg-emerald-500 hover:bg-emerald-600';
              } else if (h.hour >= 17 && h.hour <= 21) {
                isInversionTrap = true;
                barColor = 'bg-purple-600 hover:bg-purple-700';
              } else if (h.aqi < 150) {
                barColor = 'bg-amber-400 hover:bg-amber-500';
              }

              return (
                <div
                  key={`${h.time}-${idx}`}
                  className="flex-1 min-w-[32px] sm:min-w-[42px] flex flex-col items-center group relative cursor-pointer"
                  title={`${h.time} — AQI ${h.aqi} (${isSafeWindow ? 'Solar Ventilation Window' : isInversionTrap ? 'Evening Ground Inversion' : 'Normal Trapping'})`}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                    {h.time}: AQI {h.aqi}
                  </div>

                  <div className="w-full h-20 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${barColor}`}
                      role="img"
                      aria-label={`${h.time}: AQI ${h.aqi}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1.5 group-hover:text-slate-900 font-medium">
                    {h.time}
                  </span>
                  <span className="text-[9px] font-bold text-slate-700">
                    {h.aqi}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-end">
            <Info className="w-3 h-3 mr-1" />
            Green bars indicate optimal solar dispersion for brief aeration or grocery runs.
          </p>
        </div>
      </div>
    </article>
  );
};
