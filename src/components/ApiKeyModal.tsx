import React, { useState, useEffect, useRef } from 'react';
import { X, Key, ShieldCheck, AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';
import { getSessionApiKey, setSessionApiKey } from '../services/geminiService';
import { GEMINI_MODEL, GEMINI_FALLBACK_MODEL } from '../config';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const active = getSessionApiKey();
      setInputKey(active || '');
      setSavedSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionApiKey(inputKey.trim() || null);
    setSavedSuccess(true);
    onKeyUpdated();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setSessionApiKey(null);
    setInputKey('');
    setSavedSuccess(false);
    onKeyUpdated();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-sky-500"
          aria-label="Close API Key Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 id="api-key-modal-title" className="text-lg font-bold text-slate-900 font-display">
              Gemini API Key Settings
            </h2>
            <p className="text-xs text-slate-500">
              Primary: <code className="text-slate-700 font-semibold">{GEMINI_MODEL}</code> | Fallback: <code className="text-slate-700">{GEMINI_FALLBACK_MODEL}</code>
            </p>
          </div>
        </div>

        {/* Memory Security Badge */}
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-relaxed">
            <strong className="font-semibold text-emerald-900">Zero-Storage In-Memory Security:</strong> Any key you enter is held strictly in browser JavaScript runtime memory. It is <span className="underline font-semibold">never logged, never saved to disk, and never stored in localStorage</span>. Refreshing the browser clears it completely.
          </div>
        </div>

        {/* Production Architecture Disclaimer */}
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong className="font-semibold text-amber-900">Production Architecture Notice:</strong> In client-side web apps, browser-held keys are visible in the DevTools Network tab. For production deployments, requests should route through a secure backend proxy (e.g. Google Cloud Run or Firebase Functions) where secrets remain hidden.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="gemini-api-key" className="block text-sm font-semibold text-slate-700 mb-1">
              Google AI Studio Key
            </label>
            <input
              ref={inputRef}
              id="gemini-api-key"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono placeholder:text-slate-400"
              autoComplete="off"
              spellCheck="false"
            />
            <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500">
              <span>Leave blank to use Demo Mode (bundled realistic plans).</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:text-sky-800 inline-flex items-center"
              >
                Get a free key <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {savedSuccess && (
            <div className="mb-4 p-2.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-center">
              Key updated in memory successfully!
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {inputKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center text-xs font-medium text-rose-600 hover:text-rose-800 p-2 rounded-lg hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear Memory Key
              </button>
            ) : <span />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-colors focus:ring-2 focus:ring-sky-500"
              >
                Save to Memory
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
