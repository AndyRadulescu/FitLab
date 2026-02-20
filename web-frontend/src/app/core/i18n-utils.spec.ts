import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getInitialLanguage } from './i18n-utils';

describe('getInitialLanguage', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  const originalNavigatorLanguages = navigator.languages;
  const originalNavigatorLanguage = navigator.language;

  const mockLanguages = (languages: string[], language: string) => {
    Object.defineProperty(navigator, 'languages', {
      value: languages,
      configurable: true,
    });
    Object.defineProperty(navigator, 'language', {
      value: language,
      configurable: true,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'languages', {
      value: originalNavigatorLanguages,
      configurable: true,
    });
    Object.defineProperty(navigator, 'language', {
      value: originalNavigatorLanguage,
      configurable: true,
    });
  });

  it('should return saved language from localStorage if present', () => {
    localStorageMock.setItem('language', 'en');
    expect(getInitialLanguage()).toBe('en');
  });

  it('should return the first supported browser language (ro)', () => {
    mockLanguages(['ro-MD', 'en-US'], 'ro-MD');
    expect(getInitialLanguage()).toBe('ro');
  });

  it('should return the first supported browser language (en)', () => {
    mockLanguages(['en-GB', 'ro-RO'], 'en-GB');
    expect(getInitialLanguage()).toBe('en');
  });

  it('should skip unsupported browser languages and return the first supported one', () => {
    mockLanguages(['fr-FR', 'de-DE', 'ro-RO'], 'fr-FR');
    expect(getInitialLanguage()).toBe('ro');
  });

  it('should fallback to "ro" if no supported language is found in navigator.languages', () => {
    mockLanguages(['fr-FR', 'de-DE'], 'fr-FR');
    expect(getInitialLanguage()).toBe('ro');
  });

  it('should use navigator.language if navigator.languages is not available', () => {
    // navigator.languages is not available on some browsers
    Object.defineProperty(navigator, 'languages', {
        value: undefined,
        configurable: true,
      });
    Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });
    expect(getInitialLanguage()).toBe('en');
  });

  it('should return "ro" if navigator.language is also not supported', () => {
    Object.defineProperty(navigator, 'languages', {
        value: undefined,
        configurable: true,
      });
    Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });
    expect(getInitialLanguage()).toBe('ro');
  });
});
