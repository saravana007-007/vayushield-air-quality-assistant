import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatMessageBubble } from '../ChatMessageBubble';
import * as speechUtils from '../../utils/speech';

describe('components/ChatMessageBubble speak button', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads a bot answer aloud in the current language', () => {
    const speakSpy = vi.spyOn(speechUtils, 'speakText').mockReturnValue(() => {});

    render(
      <ChatMessageBubble
        message={{
          id: 'bot-1',
          role: 'model',
          content: 'Keep the windows shut.',
          timestamp: '9:30',
        }}
        currentLang="hi"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Read this answer aloud' }));
    expect(speakSpy).toHaveBeenCalledWith('Keep the windows shut.', 'hi');
  });

  it('does not offer the speak button for user messages', () => {
    render(
      <ChatMessageBubble
        message={{ id: 'user-1', role: 'user', content: 'Can I go out?', timestamp: '9:31' }}
        currentLang="en"
      />
    );

    expect(screen.queryByRole('button', { name: 'Read this answer aloud' })).toBeNull();
  });
});
