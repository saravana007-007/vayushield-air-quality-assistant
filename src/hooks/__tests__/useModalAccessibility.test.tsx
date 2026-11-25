import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useModalAccessibility } from '../useModalAccessibility';

const TestModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useModalAccessibility(isOpen, onClose, containerRef);

  if (!isOpen) return null;
  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      <button type="button">First</button>
      <button type="button">Last</button>
    </div>
  );
};

describe('hooks/useModalAccessibility', () => {
  it('closes on Escape, traps Tab and Shift+Tab focus, and restores focus on close', () => {
    const onClose = vi.fn();
    const trigger = document.createElement('button');
    trigger.textContent = 'Trigger';
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(<TestModal isOpen={true} onClose={onClose} />);

    const first = screen.getByText('First');
    const last = screen.getByText('Last');

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<TestModal isOpen={false} onClose={onClose} />);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});
