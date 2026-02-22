// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageToggle } from './language-toggle';
import { useTranslation } from 'react-i18next';
import { logEvent } from 'firebase/analytics';
import '@testing-library/jest-dom/vitest';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn()
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

vi.mock('../../../init-firebase-auth', () => ({
  analytics: {}
}));

describe('LanguageToggle', () => {
  const mockI18n = {
    language: 'ro',
    changeLanguage: vi.fn().mockResolvedValue(undefined)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useTranslation as any).mockReturnValue({ i18n: mockI18n });
  });

  it('should render Română (EN) when language is ro', () => {
    mockI18n.language = 'ro';
    render(<LanguageToggle />);

    expect(screen.getByText('Română')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should render English (RO) when language is en', () => {
    mockI18n.language = 'en';
    render(<LanguageToggle />);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('RO')).toBeInTheDocument();
  });

  it('should toggle language from ro to en and save to localStorage', async () => {
    mockI18n.language = 'ro';
    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('language')).toBe('en');
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'language-switch', {
      language: 'en'
    });
  });

  it('should toggle language from en to ro and save to localStorage', async () => {
    mockI18n.language = 'en';
    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ro');
    expect(localStorage.getItem('language')).toBe('ro');
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'language-switch', {
      language: 'ro'
    });
  });

  it('should handle regional english codes (en-US)', async () => {
    mockI18n.language = 'en-US';
    render(<LanguageToggle />);

    expect(screen.getByText('English')).toBeInTheDocument();

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ro');
  });
});
