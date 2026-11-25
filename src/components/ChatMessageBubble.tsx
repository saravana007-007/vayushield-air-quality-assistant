import React from 'react';
import { Sparkles, User, Volume2 } from 'lucide-react';
import type { ChatMessage } from '../types';
import type { SupportedLanguage } from '../i18n';
import { speakText } from '../utils/speech';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  currentLang: SupportedLanguage;
}

/**
 * Individual chat message bubble for Ask Vayu consultations with optional text-to-speech playback.
 */
export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, currentLang }) => {
  const isBot = message.role === 'model';

  return (
    <div className={`flex items-start space-x-2.5 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
          isBot ? 'bg-sky-100 text-sky-800' : 'bg-slate-800 text-white'
        }`}
        aria-hidden="true"
      >
        {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[85%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
          isBot
            ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
            : 'bg-sky-600 text-white rounded-tr-sm'
        }`}
      >
        {message.content}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50">
          <span className={`text-[10px] ${isBot ? 'text-slate-400' : 'text-sky-200'}`}>
            {message.timestamp}
          </span>
          {isBot && (
            <button
              type="button"
              onClick={() => speakText(message.content, currentLang)}
              className="p-1 text-slate-400 hover:text-sky-600 rounded"
              title="Read this answer aloud"
              aria-label="Read this answer aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
