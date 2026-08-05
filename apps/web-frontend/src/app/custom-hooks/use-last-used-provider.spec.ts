/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useLastUsedProvider,
  getLastUsedProvider,
  setLastUsedProvider,
  LAST_USED_PROVIDER_KEY,
} from './use-last-used-provider';

describe('useLastUsedProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return null when no provider is saved', () => {
    expect(getLastUsedProvider()).toBeNull();
    const { result } = renderHook(() => useLastUsedProvider());
    expect(result.current.lastUsedProvider).toBeNull();
  });

  it('should return stored provider from localStorage', () => {
    localStorage.setItem(LAST_USED_PROVIDER_KEY, 'facebook');
    expect(getLastUsedProvider()).toBe('facebook');

    const { result } = renderHook(() => useLastUsedProvider());
    expect(result.current.lastUsedProvider).toBe('facebook');
  });

  it('should update provider when setLastUsedProvider is called', () => {
    const { result } = renderHook(() => useLastUsedProvider());

    act(() => {
      result.current.setLastUsedProvider('facebook');
    });

    expect(result.current.lastUsedProvider).toBe('facebook');
    expect(localStorage.getItem(LAST_USED_PROVIDER_KEY)).toBe('facebook');
  });

  it('should handle setLastUsedProvider standalone function', () => {
    setLastUsedProvider('google');
    expect(localStorage.getItem(LAST_USED_PROVIDER_KEY)).toBe('google');
  });
});
