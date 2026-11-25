// Speech utilities tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isSpeechSynthesisSupported,
  isSpeechRecognitionSupported,
  speakText,
  stopSpeech,
  startVoiceRecognition,
} from '../speech';

interface RecognitionLike {
  onresult: ((e: unknown) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
}

describe('utils/speech', () => {
  const originalSpeechSynthesis = window.speechSynthesis;
  let mockSpeak: ReturnType<typeof vi.fn>;
  let mockCancel: ReturnType<typeof vi.fn>;
  let mockGetVoices: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSpeak = vi.fn();
    mockCancel = vi.fn();
    mockGetVoices = vi.fn().mockReturnValue([
      { lang: 'en-US', name: 'Google US English' },
      { lang: 'hi-IN', name: 'Google Hindi' },
    ]);

    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      configurable: true,
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: mockGetVoices,
      },
    });

    // Mock SpeechSynthesisUtterance if missing (jsdom does not provide it)
    if (typeof globalThis.SpeechSynthesisUtterance === 'undefined') {
      class MockSpeechSynthesisUtterance {
        text: string;
        lang = 'en-US';
        rate = 1;
        pitch = 1;
        voice = null;
        onend: (() => void) | null = null;
        onerror: ((err: unknown) => void) | null = null;
        constructor(text: string) {
          this.text = text;
        }
      }
      Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
        value: MockSpeechSynthesisUtterance,
        configurable: true,
      });
    }
  });

  afterEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      configurable: true,
      value: originalSpeechSynthesis,
    });
    delete (window as unknown as Record<string, unknown>).SpeechRecognition;
    delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
  });

  describe('isSpeechSynthesisSupported', () => {
    it('returns true when speechSynthesis is available', () => {
      expect(isSpeechSynthesisSupported()).toBe(true);
    });
  });

  describe('speakText and stopSpeech', () => {
    it('cancels existing speech and speaks cleaned utterance', () => {
      const onEnd = vi.fn();
      const cancelFn = speakText('**Hello** `world` #heading', 'en', onEnd);

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalledTimes(1);

      const utterance = mockSpeak.mock.calls[0]?.[0] as SpeechSynthesisUtterance | undefined;
      expect(utterance).toBeDefined();
      expect(utterance?.text).toBe('Hello world heading');
      expect(utterance?.lang).toBe('en-US');

      utterance?.onend?.(new Event('end') as unknown as SpeechSynthesisEvent);
      expect(onEnd).toHaveBeenCalledTimes(1);

      cancelFn();
      expect(mockCancel).toHaveBeenCalledTimes(2);
    });

    it('handles utterance error event', () => {
      const onError = vi.fn();
      speakText('Test speech', 'en', undefined, onError);
      const utterance = mockSpeak.mock.calls[0]?.[0] as SpeechSynthesisUtterance | undefined;
      expect(utterance).toBeDefined();
      utterance?.onerror?.(new Event('error') as unknown as SpeechSynthesisErrorEvent);
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('sets Hindi voice metadata when requested', () => {
      speakText('नमस्ते', 'hi');
      const utterance = mockSpeak.mock.calls[0]?.[0] as SpeechSynthesisUtterance | undefined;
      expect(utterance).toBeDefined();
      expect(utterance?.lang).toBe('hi-IN');
      expect(utterance?.voice?.lang).toBe('hi-IN');
    });

    it('stopSpeech invokes speechSynthesis.cancel', () => {
      stopSpeech();
      expect(mockCancel).toHaveBeenCalled();
    });

    it('returns error when speechSynthesis is not supported', () => {
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        configurable: true,
        value: undefined,
      });
      const onError = vi.fn();
      const cancelFn = speakText('Test text', 'en', undefined, onError);
      expect(onError).toHaveBeenCalledWith('Speech synthesis not supported in this browser.');
      expect(typeof cancelFn).toBe('function');
    });
  });

  describe('startVoiceRecognition', () => {
    it('reports unsupported when no SpeechRecognition constructor exists', () => {
      expect(isSpeechRecognitionSupported()).toBe(false);
      const onError = vi.fn();
      startVoiceRecognition('en', vi.fn(), onError);
      expect(onError).toHaveBeenCalledWith('Speech recognition not supported in this browser.');
    });

    it('initiates recognition and delivers transcript on result', () => {
      const holder: { current: RecognitionLike | null } = { current: null };
      const mockStart = vi.fn();
      const mockStop = vi.fn();

      class MockRecognition {
        lang = 'en-US';
        continuous = false;
        interimResults = false;
        onresult: ((e: unknown) => void) | null = null;
        onerror: ((e: unknown) => void) | null = null;
        onend: (() => void) | null = null;
        start = mockStart;
        stop = mockStop;
        constructor() {
          holder.current = this;
        }
      }

      (window as unknown as Record<string, unknown>).SpeechRecognition = MockRecognition;
      expect(isSpeechRecognitionSupported()).toBe(true);

      const onResult = vi.fn();
      const onEnd = vi.fn();
      const stopFn = startVoiceRecognition('hi', onResult, undefined, onEnd);

      expect(mockStart).toHaveBeenCalledTimes(1);
      expect(holder.current).not.toBeNull();

      // Trigger result
      holder.current?.onresult?.({ results: [[{ transcript: 'दिल्ली का प्रदूषण' }]] });
      expect(onResult).toHaveBeenCalledWith('दिल्ली का प्रदूषण');

      // Trigger end
      holder.current?.onend?.();
      expect(onEnd).toHaveBeenCalledTimes(1);

      // Stop recognition
      stopFn();
      expect(mockStop).toHaveBeenCalledTimes(1);
    });

    it('handles recognition error event', () => {
      const holder: { current: RecognitionLike | null } = { current: null };
      const mockStart = vi.fn();
      const mockStop = vi.fn();

      class MockRecognition {
        lang = 'en-US';
        continuous = false;
        interimResults = false;
        onresult: ((e: unknown) => void) | null = null;
        onerror: ((e: unknown) => void) | null = null;
        onend: (() => void) | null = null;
        start = mockStart;
        stop = mockStop;
        constructor() {
          holder.current = this;
        }
      }

      (window as unknown as Record<string, unknown>).webkitSpeechRecognition = MockRecognition;
      const onError = vi.fn();
      startVoiceRecognition('en', vi.fn(), onError);

      holder.current?.onerror?.({ error: 'not-allowed' });
      expect(onError).toHaveBeenCalledWith('not-allowed');
    });
  });
});
