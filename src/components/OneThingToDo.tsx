import React from 'react';
import type { UiTranslations } from '../i18n';
import { Star } from 'lucide-react';

interface OneThingToDoProps {
  oneThing: string;
  t: UiTranslations;
}

export const OneThingToDo: React.FC<OneThingToDoProps> = ({ oneThing, t }) => {
  if (!oneThing) return null;

  return (
    <div
      role="region"
      aria-labelledby="one-thing-heading"
      className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden"
    >
      <div className="flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
          <Star className="w-6 h-6 text-white fill-white" />
        </div>
        <div className="space-y-1">
          <span id="one-thing-heading" className="text-xs uppercase font-extrabold tracking-wider text-amber-100 block">
            {t.oneThingTitle}
          </span>
          <p className="text-lg sm:text-2xl font-black font-display leading-snug tracking-tight">
            "{oneThing}"
          </p>
        </div>
      </div>
    </div>
  );
};
