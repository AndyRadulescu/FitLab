// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MetallicButton from './metallic-button';

describe('MetallicButton', () => {
  it('renders as an anchor when href is provided', () => {
    render(
      <MetallicButton href="https://example.com" target="_blank">
        Click Me
      </MetallicButton>
    );

    const anchor = screen.getByRole('link', { name: 'Click Me' });
    expect(anchor).toBeDefined();
    expect(anchor.getAttribute('href')).toBe('https://example.com');
    expect(anchor.getAttribute('target')).toBe('_blank');
  });

  it('renders as a button when href is not provided and responds to clicks', () => {
    const handleClick = vi.fn();
    render(<MetallicButton onClick={handleClick}>Submit</MetallicButton>);

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeDefined();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders an optional icon alongside the label', () => {
    render(
      <MetallicButton icon={<span data-testid="test-icon">→</span>}>
        With Icon
      </MetallicButton>
    );

    expect(screen.getByText('With Icon')).toBeDefined();
    expect(screen.getByTestId('test-icon')).toBeDefined();
  });
});
