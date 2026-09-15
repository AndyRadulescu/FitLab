// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Navbar from './navbar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('Navbar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders brand logo and nav links', () => {
    render(<Navbar locale="en" />);

    expect(screen.getByText('Amazonia')).toBeDefined();
    expect(screen.getByText('FitLab')).toBeDefined();
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About Me').length).toBeGreaterThan(0);
  });

  it('renders Instagram link pointing to Diana Bucelea profile', () => {
    render(<Navbar locale="en" />);

    const instagramLinks = screen.getAllByRole('link', { name: /instagram/i });
    expect(instagramLinks.length).toBeGreaterThan(0);
    instagramLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBe('https://www.instagram.com/dianabucelea/');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    });
  });

  it('toggles mobile menu on button click', () => {
    render(<Navbar locale="en" />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeDefined();

    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /close menu/i })).toBeDefined();
  });
});
