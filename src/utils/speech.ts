// VayuShield Web Speech Utilities
// Provides SpeechSynthesis (Read Aloud) and SpeechRecognition (Voice Input)

import type { SupportedLanguage } from '../i18n';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { logger } from './logger';
import { getErrorMessage } from './errors';

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const synth = (window as unknown as { speechSynthesis?: { cancel?: () => void } })
    .speechSynthesis;
  return Boolean(synth) && typeof synth?.cancel === 'function';
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    (('SpeechRecognition' in window &&
      Boolean((window as unknown as WindowWithSpeechRecognition).SpeechRecognition)) ||
      ('webkitSpeechRecognition' in window &&
        Boolean((window as unknown as WindowWithSpeechRecognition).webkitSpeechRecognition)))
  );
}

/**
 * Reads text aloud using browser SpeechSynthesis in the selected language
 */
export function speakText(
  text: string,
  lang: SupportedLanguage = 'en',
  onEnd?: () => void,
  onError?: (err: unknown) => void
): () => void {
  if (!isSpeechSynthesisSupported()) {
    onError?.('Speech synthesis not supported in this browser.');
    return () => {};
  }

  window.speechSynthesis.cancel(); // Stop any existing speech

  const cleanText = text.replace(/[#*_`]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);

  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  utterance.lang = langMeta ? langMeta.speechLang : 'en-US';
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Try finding matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchVoice = voices.find((v) => v.lang.startsWith(langMeta?.speechLang ?? 'en'));
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
  onError?: (err: unknown) => void,
  onEnd?: () => void
): () => void {
  if (!isSpeechRecognitionSupported()) {
    onError?.('Speech recognition not supported in this browser.');
    return () => {};
  }

  const win = window as unknown as WindowWithSpeechRecognition;
  const SpeechRecognitionClass = win.SpeechRecognition ?? win.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    onError?.('Speech recognition constructor not available.');
    return () => {};
  }

  const recognition = new SpeechRecognitionClass();

  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  recognition.lang = langMeta ? langMeta.speechLang : 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0]?.[0]?.transcript ?? '';
    onResult(transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    logger.warn('Speech recognition error:', event.error);
    onError?.(event.error);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  try {
    recognition.start();
  } catch (err: unknown) {
    onError?.(err);
  }

  return () => {
    try {
      recognition.stop();
    } catch (err: unknown) {
      logger.warn('Recognition stop error:', getErrorMessage(err));
    }
  };
}
