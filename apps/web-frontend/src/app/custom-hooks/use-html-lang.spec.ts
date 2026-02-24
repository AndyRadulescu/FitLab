import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { useHtmlLang } from './use-html-lang';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('useHtmlLang', () => {
  let mockI18n: { language: any; dir: any; };

  beforeEach(() => {
    mockI18n = {
      language: 'en',
      dir: vi.fn().mockReturnValue('ltr'),
    };
    useTranslation.mockReturnValue({ i18n: mockI18n });

    document.documentElement.lang = '';
    document.documentElement.dir = '';
  });

  it('should update html lang and dir attributes on mount', () => {
    renderHook(() => useHtmlLang());

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('should update attributes when language changes', () => {
    const { rerender } = renderHook(() => useHtmlLang());

    mockI18n.language = 'ar';
    mockI18n.dir.mockReturnValue('rtl');

    rerender();
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });
});
