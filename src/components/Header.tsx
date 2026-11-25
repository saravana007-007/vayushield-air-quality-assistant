import React from 'react';
import { Shield, Sparkles, MessageSquare, Share2, Type } from 'lucide-react';
import type { SupportedLanguage, UiTranslations } from '../i18n';
import { LanguagePicker } from './LanguagePicker';

export type TextSize = 'small' | 'medium' | 'large' | 'xlarge';

interface HeaderProps {
  isDemo: boolean;
  currentLang: SupportedLanguage;
  textSize: TextSize;
  t: UiTranslations;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onChangeTextSize: (size: TextSize) => void;
  onOpenChat: () => void;
  onOpenShare: () => void;
  onOpenScoreHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDemo,
  currentLang,
  textSize,
  t,
  onSelectLanguage,
  onChangeTextSize,
  onOpenChat,
  onOpenShare,
  onOpenScoreHelp: _onOpenScoreHelp,
}) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        Skip to main content
      </a>

      <header
        className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-100"
                aria-hidden="true"
              >
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 inline-block">
                    Vayu<span className="text-sky-700">Shield</span>
                  </h1>
                  {isDemo && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300"
                      title="Demo Mode: sample plans active"
                    >
                      <Sparkles className="w-3 h-3 mr-1 text-amber-600" aria-hidden="true" />
                      Demo
                    </span>
                  )}
                  {!isDemo && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      Live AI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">{t.tagline}</p>
              </div>
            </div>

            {/* Mobile Chat Quick Icon */}
            <div className="flex md:hidden items-center space-x-1.5">
              <button
                onClick={onOpenChat}
                className="p-2 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200"
                aria-label="Open Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center / Right: Language Picker + Text Size Selector + Action Buttons */}
          <div className="flex items-center flex-wrap justify-center md:justify-end gap-2 w-full md:w-auto">
            {/* Native Script Language Picker */}
            <LanguagePicker currentLang={currentLang} onSelectLanguage={onSelectLanguage} />

            {/* Text Size Selector Dropdown */}
            <div className="relative inline-flex items-center">
              <label htmlFor="text-size-select" className="sr-only">
                Choose Text Size
              </label>
              <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs hover:border-slate-400 focus-within:ring-2 focus-within:ring-purple-400 text-xs font-semibold text-slate-700">
                <Type className="w-3.5 h-3.5 mr-1.5 text-purple-600 shrink-0" aria-hidden="true" />
                <select
                  id="text-size-select"
                  value={textSize}
                  onChange={(e) => onChangeTextSize(e.target.value as TextSize)}
                  className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                  aria-label="Choose text size"
                >
                  <option value="small">Text: Small</option>
                  <option value="medium">Text: Medium</option>
                  <option value="large">Text: Large</option>
                  <option value="xlarge">Text: Extra Large</option>
                </select>
              </div>
            </div>

            {/* Share Card */}
            <button
              onClick={onOpenShare}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Ask Vayu Button (Desktop) */}
            <button
              onClick={onOpenChat}
              className="hidden md:inline-flex items-center px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-xl transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1 text-sky-700" />
              <span>Ask Vayu</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
