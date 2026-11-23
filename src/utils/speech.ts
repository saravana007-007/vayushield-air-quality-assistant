// VayuShield Web Speech Utilities
// Provides SpeechSynthesis (Read Aloud) and SpeechRecognition (Voice Input)

import type { SupportedLanguage } from '../i18n';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { logger } from './logger';

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

/**
 * Reads text aloud using browser SpeechSynthesis in the selected language
 */
export function speakText(
  text: string,
  lang: SupportedLanguage = 'en',
  onEnd?: () => void,
  onError?: (err: any) => void
): () => void {
  if (!isSpeechSynthesisSupported()) {
    onError?.('Speech synthesis not supported in this browser.');
    return () => {};
  }

  window.speechSynthesis.cancel(); // Stop any existing speech

  const cleanText = text.replace(/[#*_`]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);

  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === lang);
  utterance.lang = langMeta ? langMeta.speechLang : 'en-US';
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Try finding matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchVoice = voices.find(v => v.lang.startsWith(langMeta?.speechLang || 'en'));
  if (matchVoice) {
    utterance.voice = matchVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    logger.warn('Speech synthesis error:', e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  // Return cancel function
  return () => {
    window.speechSynthesis.cancel();
  };
}

export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Starts browser SpeechRecognition for voice input
 */
export function startVoiceRecognition(
  lang: SupportedLanguage,
  onResult: (transcript: string) => void,
  onError?: (err: any) => void,
  onEnd?: () => void
): () => void {
  if (!isSpeechRecognitionSupported()) {
    onError?.('Speech recognition not supported in this browser.');
    return () => {};
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === lang);
  recognition.lang = langMeta ? langMeta.speechLang : 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0]?.[0]?.transcript || '';
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    logger.warn('Speech recognition error:', event);
    onError?.(event.error);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  try {
    recognition.start();
  } catch (err) {
    onError?.(err);
  }

  return () => {
    try {
      recognition.stop();
    } catch (e) {
      // ignore
    }
  };
}
