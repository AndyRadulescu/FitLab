// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Footer from './footer';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Footer', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders copyright and privacy links', () => {
    render(<Footer locale="en" />);

    expect(screen.getByText(/AMAZONIA - FITLAB/i)).toBeDefined();
    expect(screen.getByText('Privacy Policy')).toBeDefined();
    expect(screen.getByText('Terms of use')).toBeDefined();
    expect(screen.getByText('Data Deletion')).toBeDefined();
    expect(screen.getByText('Contact')).toBeDefined();
  });

  it('renders the stylish Synapse Labs credit section with correct URL', () => {
    render(<Footer locale="en" />);

    const synapseLink = screen.getByRole('link', {
      name: /crafted by synapse labs @andy radulescu/i,
    });
    expect(synapseLink).toBeDefined();
    expect(synapseLink.getAttribute('href')).toBe('https://www.synapselabs.org/');
    expect(synapseLink.getAttribute('target')).toBe('_blank');
    expect(synapseLink.getAttribute('rel')).toContain('noopener');

    expect(screen.getByText('synapse labs')).toBeDefined();
    expect(screen.getByText('@andy radulescu')).toBeDefined();
  });
});
