// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import InstagramLink from './instagram-link';

describe('InstagramLink', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Instagram link with label by default', () => {
    render(<InstagramLink />);

    const link = screen.getByRole('link', { name: /instagram/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://www.instagram.com/dianabucelea/');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(screen.getByText('@dianabucelea')).toBeDefined();
  });

  it('renders icon-only mode when showLabel is false', () => {
    render(<InstagramLink showLabel={false} />);

    const link = screen.getByRole('link', { name: /instagram/i });
    expect(link).toBeDefined();
    expect(screen.queryByText('Instagram')).toBeNull();
  });

  it('supports custom label', () => {
    render(<InstagramLink label="Urmărește-mă" />);

    expect(screen.getByText('Urmărește-mă')).toBeDefined();
  });
});
