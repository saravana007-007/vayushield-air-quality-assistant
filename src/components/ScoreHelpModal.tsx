import React, { useRef } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ScoreHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreHelpModal: React.FC<ScoreHelpModalProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useModalAccessibility(isOpen, onClose, containerRef);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="score-help-title"
    >
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close calculation explanation"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="score-help-title" className="text-lg font-bold text-slate-900 font-display">
              How the Protection Score is Calculated
            </h2>
            <p className="text-xs text-slate-500">
              100% transparent algorithmic weighting based on building physics.
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            The <strong>Family Smog Protection Score</strong> measures how effectively your
            household envelope and daily behaviors isolate you from ambient winter particulate:
          </p>

          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
              <span className="font-semibold text-slate-900">1. Baseline Indoor Shelter</span>
              <span className="font-mono font-bold text-slate-800">20%</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
              <span className="font-semibold text-slate-900">2. Active HEPA Air Purifier</span>
              <span className="font-mono font-bold text-emerald-700">+15%</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
              <span className="font-semibold text-slate-900">
                3. Non-Combustion Stove (Electric/Induction)
              </span>
              <span className="font-mono font-bold text-emerald-700">+5%</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
              <span className="font-semibold text-slate-900">
                4. Four Completed Indoor Micro-Hacks
              </span>
              <span className="font-mono font-bold text-sky-700">+30% (7.5% each)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">5. Four Adopted Smog Swaps</span>
              <span className="font-mono font-bold text-sky-700">+30% (7.5% each)</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
            <strong className="font-bold block mb-0.5">🌱 Daily CO₂ Saved Calculation:</strong>
            Each adopted swap pulls directly from our validated Catalog (e.g. carpooling saves ~3.2
            kg CO₂/day, avoided backyard waste burning saves ~4.8 kg CO₂/day). All figures are
            clearly codified estimates.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
