import { useState, useRef } from 'react';
import type { ActionPlan, AirQualityData, ChatMessage, HouseholdProfile } from '../types';
import type { SupportedLanguage } from '../i18n';
import { askVayu } from '../services/geminiService';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';
import { startVoiceRecognition } from '../utils/speech';

function createWelcomeMessage(lang: string, aqi: number, city: string): ChatMessage {
  const welcome = lang === 'hi'
    ? `हाँ, मैं आपके परिवार की मदद के लिए तैयार हूँ। वर्तमान AQI (${aqi}) को देखते हुए, खिड़कियां, बच्चों के खेलने या मास्क के बारे में कुछ भी पूछें।`
    : `Yes, I am ready to advise your household. I have factored in your live ${city} AQI (${aqi}) and your home setup. Ask me any immediate question regarding windows, toddler play, or mask selection.`;

  return {
    id: 'welcome',
    role: 'model',
    content: welcome,
    timestamp: 'Now',
  };
}

interface UseAskVayuChatOptions {
  airData: AirQualityData;
  profile: HouseholdProfile;
  plan: ActionPlan;
  currentLang: SupportedLanguage;
}

/**
 * Manage Ask Vayu chat message thread, submission, and voice recognition.
 */
export function useAskVayuChat({ airData, profile, plan, currentLang }: UseAskVayuChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(currentLang, airData.currentAqi, airData.cityName),
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isAnswering) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAnswering(true);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const reply = await askVayu(textToSend.trim(), airData, profile, plan, currentLang);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      logger.warn('Ask Vayu submit error:', getErrorMessage(err));
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: 'Wait, an unexpected connection issue occurred. In severe smog, always keep windows shut and wear certified N95 respirators outdoors.',
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAnswering(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      stopVoiceRef.current?.();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      stopVoiceRef.current = startVoiceRecognition(
        currentLang,
        (transcript) => {
          setIsRecording(false);
          setInputQuery(transcript);
          void handleSend(transcript);
        },
        (err) => {
          setIsRecording(false);
          logger.warn('Voice recognition error:', err);
        },
        () => setIsRecording(false)
      );
    }
  };

  return {
    messages,
    inputQuery,
    setInputQuery,
    isAnswering,
    isRecording,
    messagesEndRef,
    handleSend,
    handleToggleVoice,
  };
}
