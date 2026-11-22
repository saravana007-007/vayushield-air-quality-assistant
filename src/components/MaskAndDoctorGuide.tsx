import React from 'react';
import type { UiTranslations } from '../i18n';
import { ShieldCheck, XCircle, Stethoscope, Check } from 'lucide-react';

interface MaskAndDoctorGuideProps {
  t: UiTranslations;
}

export const MaskAndDoctorGuide: React.FC<MaskAndDoctorGuideProps> = ({ t }) => {
  return (
    <div className="space-y-6">
      {/* 1. Mask Guide Card */}
      <section aria-labelledby="mask-guide-title" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-sky-100 text-sky-800 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 id="mask-guide-title" className="text-base sm:text-lg font-bold font-display text-slate-900">
              {t.maskGuideTitle}
            </h3>
            <p className="text-xs text-slate-500">Visual comparison of mask protection against fine PM2.5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* N95 Box */}
          <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 flex items-start space-x-3.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-bold text-emerald-950 block">
                N95 / FFP2 Respirator (WORKS ✅)
              </span>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {t.n95Works}
              </p>
              <span className="text-[11px] font-bold text-emerald-800 block pt-1">
                {t.n95Tip || '👉 Pinch metal nose-clip tightly for zero gap.'}
              </span>
            </div>
          </div>

          {/* Cloth/Surgical Box */}
          <div className="bg-rose-50/70 border-2 border-rose-300 rounded-2xl p-4 flex items-start space-x-3.5">
            <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0 mt-0.5">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-bold text-rose-950 block">
                Cloth / Surgical Masks (FAILS ❌)
              </span>
              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                {t.clothFails}
              </p>
              <span className="text-[11px] font-bold text-rose-800 block pt-1">
                {t.clothTip || '👉 Fine PM2.5 soot passes easily through fabric weave.'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. When to See a Doctor Box */}
      <section aria-labelledby="doctor-title" className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-amber-600 text-white rounded-2xl shrink-0 mt-0.5" aria-hidden="true">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 id="doctor-title" className="text-base sm:text-lg font-bold font-display text-amber-950">
              {t.seeDoctorTitle}
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 font-semibold leading-relaxed">
              {t.doctorWarningSymptoms}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-amber-900">
              {t.doctorSymptomsList?.map((symptom, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white/90 rounded-xl border border-amber-300 shadow-2xs">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
