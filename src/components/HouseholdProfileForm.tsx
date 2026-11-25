import React from 'react';
import type { HouseholdProfile, HouseholdTag, StoveType, CommuteMode } from '../types';
import type { UiTranslations } from '../i18n';
import {
  Baby,
  Users,
  HeartPulse,
  Bike,
  Home,
  Wind,
  Flame,
  Compass,
  RefreshCw,
  PlusCircle,
  Edit3,
} from 'lucide-react';

interface HouseholdProfileFormProps {
  profile: HouseholdProfile;
  t: UiTranslations;
  onChangeProfile: (profile: HouseholdProfile) => void;
  onGeneratePlan: () => void;
  isLoading: boolean;
  statusMessage?: string;
}

export const HouseholdProfileForm: React.FC<HouseholdProfileFormProps> = ({
  profile,
  t,
  onChangeProfile,
  onGeneratePlan,
  isLoading,
  statusMessage,
}) => {
  const toggleTag = (tag: HouseholdTag) => {
    const exists = profile.tags.includes(tag);
    const updatedTags = exists ? profile.tags.filter((tId) => tId !== tag) : [...profile.tags, tag];
    onChangeProfile({
      ...profile,
      tags: updatedTags,
    });
  };

  const updateSetup = <K extends keyof HouseholdProfile['setup']>(
    key: K,
    value: HouseholdProfile['setup'][K]
  ) => {
    onChangeProfile({
      ...profile,
      setup: {
        ...profile.setup,
        [key]: value,
      },
    });
  };

  const tagList: {
    id: HouseholdTag;
    label: string;
    icon: React.FC<{ className?: string }>;
    emoji: string;
  }[] = [
    { id: 'toddler_kids', label: t.toddlersLabel, icon: Baby, emoji: '👶' },
    { id: 'elderly', label: t.elderlyLabel, icon: Users, emoji: '👵' },
    { id: 'asthma_respiratory', label: t.asthmaLabel, icon: HeartPulse, emoji: '🫁' },
    { id: 'outdoor_commuter', label: t.commuterLabel, icon: Bike, emoji: '🛵' },
    { id: 'wfh', label: t.wfhLabel, icon: Home, emoji: '🏠' },
    { id: 'other', label: t.otherConditionLabel, icon: PlusCircle, emoji: '✍️' },
  ];

  return (
    <section
      aria-labelledby="profile-form-title"
      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2
            id="profile-form-title"
            className="text-lg sm:text-xl font-bold font-display text-slate-900"
          >
            {t.profileTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.profileSubtitle}</p>
        </div>

        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-5 py-3 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-colors shadow-sm focus:ring-2 focus:ring-sky-500 shrink-0"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          {isLoading ? t.loadingPlan : t.updatePlanBtn}
        </button>
      </div>

      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className="my-3 px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-50 text-sky-800 border border-sky-200 flex items-center"
        >
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse mr-2" />
          {statusMessage}
        </div>
      )}

      {/* 1. Big Picture Buttons for Household Members */}
      <div className="mt-5">
        <span className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
          1. Tap Everyone Living In Your Home
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {tagList.map((tItem) => {
            const isSelected = profile.tags.includes(tItem.id);
            return (
              <button
                key={tItem.id}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => toggleTag(tItem.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 text-sky-950 ring-2 ring-sky-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-3xl select-none" role="img" aria-hidden="true">
                  {tItem.emoji}
                </span>
                <span className="text-xs sm:text-sm font-bold leading-tight block">
                  {tItem.label.split(' ')[0]} {tItem.label.split(' ')[1] || ''}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Tap to Add'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom "Other" Condition Input Box (Expands when "other" tag is selected) */}
        {profile.tags.includes('other') && (
          <div className="mt-3.5 p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl animate-fadeIn">
            <label
              htmlFor="custom-condition-input"
              className="block text-xs font-bold text-sky-950 mb-1 flex items-center"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
              <span>Describe other member or health vulnerability:</span>
            </label>
            <input
              id="custom-condition-input"
              type="text"
              value={profile.customTagDetails || ''}
              onChange={(e) => onChangeProfile({ ...profile, customTagDetails: e.target.value })}
              placeholder={t.otherConditionPlaceholder}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-sky-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}
      </div>

      {/* 2. Simple Equipment & Setup Controls */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <span className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
          2. Home Equipment & Travel
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Air Purifier Big Toggle */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">{t.purifierLabel}</span>
                <span className="text-xs text-slate-500">
                  {profile.setup.airPurifier ? 'Active HEPA filter' : 'No purifier'}
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={profile.setup.airPurifier}
              onClick={() => updateSetup('airPurifier', !profile.setup.airPurifier)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                profile.setup.airPurifier ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  profile.setup.airPurifier ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Stove Type with "Other" */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <label htmlFor="stove-select" className="text-xs font-bold text-slate-900">
                {t.stoveLabel}
              </label>
            </div>
            <select
              id="stove-select"
              value={profile.setup.stoveType}
              onChange={(e) => updateSetup('stoveType', e.target.value as StoveType)}
              className="w-full text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="gas">{t.stoveGas}</option>
              <option value="electric">{t.stoveElectric}</option>
              <option value="induction">{t.stoveInduction}</option>
              <option value="other">{t.stoveOther}</option>
            </select>
            {profile.setup.stoveType === 'other' && (
              <input
                type="text"
                value={profile.setup.customStove || ''}
                onChange={(e) => updateSetup('customStove', e.target.value)}
                placeholder="Mention stove type (e.g. wood, kerosene)..."
                className="w-full mt-1.5 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            )}
          </div>

          {/* Commute Mode with "Other" */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-purple-600" />
              <label htmlFor="commute-select" className="text-xs font-bold text-slate-900">
                {t.commuteLabel}
              </label>
            </div>
            <select
              id="commute-select"
              value={profile.setup.commuteMode}
              onChange={(e) => updateSetup('commuteMode', e.target.value as CommuteMode)}
              className="w-full text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="metro_bus">{t.commuteMetro}</option>
              <option value="car_cab">{t.commuteCar}</option>
              <option value="two_wheeler">{t.commuteBike}</option>
              <option value="walk_cycle">{t.commuteWalk}</option>
              <option value="other">{t.commuteOther}</option>
            </select>
            {profile.setup.commuteMode === 'other' && (
              <input
                type="text"
                value={profile.setup.customCommute || ''}
                onChange={(e) => updateSetup('customCommute', e.target.value)}
                placeholder="Mention travel mode (e.g. electric scooter)..."
                className="w-full mt-1.5 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
