import React from 'react';
import type { UiTranslations } from '../i18n';
import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface DosAndDontsProps {
  dos: string[];
  donts: string[];
  t: UiTranslations;
}

export const DosAndDonts: React.FC<DosAndDontsProps> = ({ dos, donts, t }) => {
  if ((!dos || dos.length === 0) && (!donts || donts.length === 0)) {
    return null;
  }

  return (
    <section aria-labelledby="dos-donts-title" className="space-y-4">
      <div>
        <h3 id="dos-donts-title" className="text-lg sm:text-xl font-bold font-display text-slate-900">
          {t.dosAndDontsTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Quick rules for simple family compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Do's Card */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold font-display text-base mb-3">
            <ThumbsUp className="w-5 h-5 text-emerald-700" />
            <span>{t.dosTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950 font-medium">
            {dos.map((item) => (
              <li key={item} className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts Card */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-rose-900 font-bold font-display text-base mb-3">
            <ThumbsDown className="w-5 h-5 text-rose-700" />
            <span>{t.dontsTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-rose-950 font-medium">
            {donts.map((item) => (
              <li key={item} className="flex items-start space-x-2.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
