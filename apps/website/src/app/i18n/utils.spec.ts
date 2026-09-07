// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  supportedLocales,
  defaultLocale,
  isValidLocale,
  normalizeLocale,
  detectClientLanguage,
} from './utils';

describe('i18n utils', () => {
  describe('constants', () => {
    it('should define supportedLocales containing en and ro', () => {
      expect(supportedLocales).toEqual(['en', 'ro']);
    });

    it('should set defaultLocale to ro', () => {
      expect(defaultLocale).toBe('ro');
    });
  });

  describe('isValidLocale', () => {
    it('should return true for valid supported locales', () => {
      expect(isValidLocale('en')).toBe(true);
      expect(isValidLocale('ro')).toBe(true);
    });

    it('should return false for invalid or unsupported locales', () => {
      expect(isValidLocale('fr')).toBe(false);
      expect(isValidLocale('es')).toBe(false);
      expect(isValidLocale('de')).toBe(false);
      expect(isValidLocale('en-US')).toBe(false);
    });

    it('should return false for null, undefined, or empty string', () => {
      expect(isValidLocale(null)).toBe(false);
      expect(isValidLocale(undefined)).toBe(false);
      expect(isValidLocale('')).toBe(false);
    });
  });

  describe('normalizeLocale', () => {
    it('should return en for exact en match', () => {
      expect(normalizeLocale('en')).toBe('en');
    });

    it('should return ro for exact ro match', () => {
      expect(normalizeLocale('ro')).toBe('ro');
    });

    it('should normalize regional English variants to en', () => {
      expect(normalizeLocale('en-US')).toBe('en');
      expect(normalizeLocale('en-GB')).toBe('en');
      expect(normalizeLocale('en-CA')).toBe('en');
      expect(normalizeLocale('en-AU')).toBe('en');
    });

    it('should normalize regional Romanian variants to ro', () => {
      expect(normalizeLocale('ro-RO')).toBe('ro');
      expect(normalizeLocale('ro-MD')).toBe('ro');
    });

    it('should be case-insensitive and handle whitespace', () => {
      expect(normalizeLocale('EN')).toBe('en');
      expect(normalizeLocale('RO-md')).toBe('ro');
      expect(normalizeLocale('  en-us  ')).toBe('en');
    });

    it('should return null for unsupported languages', () => {
      expect(normalizeLocale('fr')).toBe(null);
      expect(normalizeLocale('fr-FR')).toBe(null);
      expect(normalizeLocale('de-DE')).toBe(null);
      expect(normalizeLocale('es')).toBe(null);
      expect(normalizeLocale('it-IT')).toBe(null);
    });

    it('should return null for null, undefined, or empty string', () => {
      expect(normalizeLocale(null)).toBe(null);
      expect(normalizeLocale(undefined)).toBe(null);
      expect(normalizeLocale('')).toBe(null);
      expect(normalizeLocale('   ')).toBe(null);
    });
  });

  describe('detectClientLanguage', () => {
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
      configurable: true,
    });

    const originalNavigatorLanguages = navigator.languages;
    const originalNavigatorLanguage = navigator.language;

    const mockLanguages = (languages: readonly string[] | undefined, language?: string) => {
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
      mockLanguages(originalNavigatorLanguages, originalNavigatorLanguage);
    });

    it('should return saved language from localStorage if valid', () => {
      localStorageMock.setItem('language', 'en');
      expect(detectClientLanguage()).toBe('en');
    });

    it('should normalize saved regional language from localStorage', () => {
      localStorageMock.setItem('language', 'ro-MD');
      expect(detectClientLanguage()).toBe('ro');
    });

    it('should fall through if localStorage contains unsupported language', () => {
      localStorageMock.setItem('language', 'fr-FR');
      mockLanguages(['en-US'], 'en-US');
      expect(detectClientLanguage()).toBe('en');
    });

    it('should handle localStorage throwing an error gracefully', () => {
      vi.spyOn(localStorageMock, 'getItem').mockImplementationOnce(() => {
        throw new Error('Access denied');
      });
      mockLanguages(['en-US'], 'en-US');
      expect(detectClientLanguage()).toBe('en');
    });

    it('should detect language from navigator.languages (ro-MD -> ro)', () => {
      mockLanguages(['ro-MD', 'en-US'], 'ro-MD');
      expect(detectClientLanguage()).toBe('ro');
    });

    it('should detect language from navigator.languages (en-US -> en)', () => {
      mockLanguages(['en-US', 'ro-RO'], 'en-US');
      expect(detectClientLanguage()).toBe('en');
    });

    it('should skip unsupported browser languages and select the first supported', () => {
      mockLanguages(['fr-FR', 'de-DE', 'ro-MD', 'en-US'], 'fr-FR');
      expect(detectClientLanguage()).toBe('ro');
    });

    it('should fallback to navigator.language if navigator.languages is undefined', () => {
      mockLanguages(undefined, 'en-GB');
      expect(detectClientLanguage()).toBe('en');
    });

    it('should fallback to defaultLocale (ro) if no languages match', () => {
      mockLanguages(['fr-FR', 'es-ES'], 'fr-FR');
      expect(detectClientLanguage()).toBe('ro');
    });

    it('should fallback to defaultLocale if navigator languages are empty', () => {
      mockLanguages([], '');
      expect(detectClientLanguage()).toBe('ro');
    });
  });
});
