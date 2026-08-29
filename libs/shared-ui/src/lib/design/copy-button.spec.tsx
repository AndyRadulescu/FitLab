/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CopyButton } from './copy-button';

describe('CopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should render the copy button', () => {
    render(<CopyButton text="test-id-123" />);

    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeTruthy();
  });

  it('should copy text and show copied state when clicked', async () => {
    render(<CopyButton text="test-id-123" showFeedbackText={true} />);

    const button = screen.getByRole('button');
    expect(screen.getByText('Copy')).toBeTruthy();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-id-123');
    expect(screen.getByText('Copied!')).toBeTruthy();

    // Fast-forward timer to verify reset
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('should not call clipboard when text is empty', async () => {
    render(<CopyButton text="" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });
});
