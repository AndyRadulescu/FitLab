// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageToggle } from './language-toggle';
import { logEvent } from 'firebase/analytics';
import '@testing-library/jest-dom/vitest';

const mockI18n = {
  language: 'en',
  changeLanguage: vi.fn().mockResolvedValue(undefined),
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
  Trans: ({ i18nKey, children }: any) => <span data-testid={i18nKey}>{children || i18nKey}</span>,
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

vi.mock('../../../init-firebase-auth', () => ({
  analytics: {}
}));

describe('LanguageToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockI18n.language = 'en';
  });

  it('should render correct status when language is ro', () => {
    mockI18n.language = 'ro';
    render(<LanguageToggle />);

    expect(screen.getByText('ENGLISH')).toBeInTheDocument();
    expect(screen.getByText('ROMÂNĂ')).toBeInTheDocument();
    expect(screen.getByText('Acum vizualizezi în Română')).toBeInTheDocument();
  });

  it('should render correct status when language is en', () => {
    mockI18n.language = 'en';
    render(<LanguageToggle />);

    expect(screen.getByText('ENGLISH')).toBeInTheDocument();
    expect(screen.getByText('ROMÂNĂ')).toBeInTheDocument();
    expect(screen.getByText('Currently viewing in English')).toBeInTheDocument();
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

    expect(screen.getByText('Currently viewing in English')).toBeInTheDocument();

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ro');
  });
});
