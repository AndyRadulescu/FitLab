// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  supportedLocales,
  defaultLocale,
  isValidLocale,
  normalizeLocale,
} from './utils';

describe('i18n utils', () => {
  describe('constants', () => {
    it('should define supportedLocales containing en and ro', () => {
      expect(supportedLocales).toEqual(['en', 'ro']);
    });

    it('should set defaultLocale to en', () => {
      expect(defaultLocale).toBe('en');
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
});
