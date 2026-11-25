import React from 'react';
import { Zap } from 'lucide-react';
import type { UiTranslations } from '../i18n';

interface PresetButtonsProps {
  isPresetActive?: boolean;
  activePresetId?: string;
  t: UiTranslations;
  onSelectPreset: (presetKey: string) => void;
}

/**
 * Quick 1-click pollution preset buttons for Delhi, Lahore, and Moderate Haze.
 */
export const PresetButtons: React.FC<PresetButtonsProps> = ({
  isPresetActive,
  activePresetId,
  t,
  onSelectPreset,
}) => (
  <div className="flex items-center flex-wrap gap-2" role="group" aria-label="Quick pollution presets">
    <span className="text-xs font-bold text-slate-500 flex items-center uppercase tracking-wider mr-1">
      <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" aria-hidden="true" />
      Presets:
    </span>

    <button
      type="button"
      onClick={() => onSelectPreset('delhi-severe')}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-2xs focus:ring-2 focus:ring-purple-500 ${
        isPresetActive && activePresetId === 'delhi-severe'
          ? 'bg-purple-900 text-white border-purple-900 ring-2 ring-purple-400'
          : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
      }`}
    >
      {t.presetDelhi}
    </button>

    <button
      type="button"
      onClick={() => onSelectPreset('lahore-hazardous')}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-2xs focus:ring-2 focus:ring-rose-500 ${
        isPresetActive && activePresetId === 'lahore-hazardous'
          ? 'bg-rose-900 text-white border-rose-900 ring-2 ring-rose-400'
          : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
      }`}
    >
      {t.presetLahore}
    </button>

    <button
      type="button"
      onClick={() => onSelectPreset('moderate-haze')}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-2xs focus:ring-2 focus:ring-amber-500 ${
        isPresetActive && activePresetId === 'moderate-haze'
          ? 'bg-amber-800 text-white border-amber-800 ring-2 ring-amber-400'
          : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
      }`}
    >
      {t.presetModerate}
    </button>
  </div>
);
