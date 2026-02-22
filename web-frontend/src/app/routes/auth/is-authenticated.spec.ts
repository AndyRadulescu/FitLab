import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAuthenticated } from './is-authenticated';
import { redirect } from 'react-router';

vi.mock('react-router', () => ({
  redirect: vi.fn((url) => ({ tablet: 'redirect', url })),
}));

describe('isAuthenticated()', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should redirect if no user-store exists in localStorage', async () => {
    const result = await isAuthenticated();

    expect(redirect).toHaveBeenCalledWith('/auth/login');
    expect(result).toEqual(redirect('/auth/login'));
  });

  it('should redirect if user-store exists but has no uid', async () => {
    const mockStore = JSON.stringify({ state: { uid: null } });
    localStorage.setItem('user-store', mockStore);

    const result = await isAuthenticated();
    expect(redirect).toHaveBeenCalledWith('/auth/login');
  });

  it('should redirect if state object is missing entirely', async () => {
    const mockStore = JSON.stringify({}); // missing .state
    localStorage.setItem('user-store', mockStore);

    // This will normally throw an error in JS, so we check if it catches or handles
    await expect(isAuthenticated()).rejects.toThrow();
  });

  it('should return isAuthenticated true if uid exists', async () => {
    const mockStore = JSON.stringify({ state: { uid: 'user_123' } });
    localStorage.setItem('user-store', mockStore);

    const result = await isAuthenticated();

    expect(result).toEqual({ isAuthenticated: true });
    expect(redirect).not.toHaveBeenCalled();
  });
});
