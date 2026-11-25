import React, { useEffect, useRef } from 'react';
import { X, Send, AlertCircle, Bot, Loader2, Mic, MicOff } from 'lucide-react';
import type { ActionPlan, AirQualityData, HouseholdProfile } from '../types';
import type { UiTranslations, SupportedLanguage } from '../i18n';
import { isSpeechRecognitionSupported } from '../utils/speech';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { useAskVayuChat } from '../hooks/useAskVayuChat';
import { ChatMessageBubble } from './ChatMessageBubble';

interface AskVayuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  airData: AirQualityData;
  profile: HouseholdProfile;
  plan: ActionPlan;
  currentLang: SupportedLanguage;
  t: UiTranslations;
}

/**
 * Slide-over chat drawer for 3-sentence household air quality consultations.
 */
export const AskVayuDrawer: React.FC<AskVayuDrawerProps> = ({
  isOpen,
  onClose,
  airData,
  profile,
  plan,
  currentLang,
  t,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useModalAccessibility(isOpen, onClose, containerRef);

  const {
    messages,
    inputQuery,
    setInputQuery,
    isAnswering,
    isRecording,
    messagesEndRef,
    handleSend,
    handleToggleVoice,
  } = useAskVayuChat({ airData, profile, plan, currentLang });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const chips =
    currentLang === 'hi'
      ? [
          'क्या शाम को बच्चे पार्क जा सकते हैं?',
          'खाना बनाते समय खिड़की खोलें या बंद रखें?',
          'क्या कपड़े का मास्क स्मॉग से बचाता है?',
        ]
      : [
          'Can my toddler play in the park at 4 PM?',
          'Should I open the windows while cooking?',
          'Is a double cloth mask enough for my walk?',
        ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-vayu-drawer-title"
    >
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="ask-vayu-drawer-title"
                className="text-base font-bold font-display text-slate-900"
              >
                {t.askVayuTitle}
              </h2>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {airData.cityName} (AQI {airData.currentAqi})
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Medical Advice Disclaimer */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/80 flex items-center space-x-2 text-[11px] text-amber-900">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{t.disclaimerText}</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
          {messages.map((m) => (
            <ChatMessageBubble key={m.id} message={m} currentLang={currentLang} />
          ))}

          {isAnswering && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 pl-9">
              <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              <span>Vayu is answering in 3 sentences...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Question Chips */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
            Quick Questions:
          </span>
          <div className="flex flex-col gap-1.5">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                disabled={isAnswering}
                className="text-left text-xs bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl p-2.5 text-slate-700 transition-colors shadow-2xs disabled:opacity-50 font-medium"
              >
                👉 {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form with Voice Support */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="p-3.5 border-t border-slate-200 bg-white"
        >
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.askPlaceholder}
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              disabled={isAnswering}
            />

            {isSpeechRecognitionSupported() && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-3 rounded-2xl transition-colors shadow-2xs ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={isRecording ? 'Listening... click to stop' : 'Click to speak'}
                aria-label={isRecording ? 'Listening... click to stop' : 'Click to speak'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <button
              type="submit"
              disabled={!inputQuery.trim() || isAnswering}
              className="p-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-2xl shadow-xs transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1.5">{t.askContextNotice}</p>
        </form>
      </div>
    </div>
  );
};
