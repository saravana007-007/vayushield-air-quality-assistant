import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import type { SupportedLanguage } from '../i18n';
import { SUPPORTED_LANGUAGES } from '../i18n';

interface LanguagePickerProps {
  currentLang: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  className?: string;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  currentLang,
  onSelectLanguage,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) ??
    SUPPORTED_LANGUAGES[0] ?? {
      code: 'en' as const,
      nativeName: 'English',
      englishName: 'English',
      dir: 'ltr' as const,
      speechLang: 'en-US',
    };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <Globe className="w-3.5 h-3.5 text-sky-700 shrink-0" />
        <span className="font-semibold">{activeLangMeta.nativeName}</span>
        <span className="text-[10px] text-slate-600 hidden xs:inline">
          ({activeLangMeta.englishName})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ListView Dropdown Overlay */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 sm:left-0 z-50 mt-1.5 w-60 rounded-2xl bg-white shadow-xl border border-slate-200 py-1.5 focus:outline-none animate-fadeIn divide-y divide-slate-100"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase font-extrabold tracking-wider text-slate-600 bg-slate-50/80">
            Choose Language / भाषा चुनें
          </div>
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((l) => {
              const isSelected = l.code === currentLang;
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-sky-50 text-sky-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold font-display">{l.nativeName}</span>
                    <span className="text-[11px] text-slate-600 font-normal">
                      {l.englishName} {l.dir === 'rtl' ? '(RTL Layout)' : ''}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-sky-700 text-white shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
