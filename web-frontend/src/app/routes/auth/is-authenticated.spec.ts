import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isAuthenticated } from './is-authenticated';
import { redirect } from 'react-router';

vi.mock('react-router', () => ({
  redirect: vi.fn((url) => ({ tablet: 'redirect', url }))
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
    const mockStore = JSON.stringify({ state: { user: { uid: null } } });
    localStorage.setItem('user-store', mockStore);

    await isAuthenticated();
    expect(redirect).toHaveBeenCalledWith('/auth/login');
  });

  it('should redirect if user-store is malformed JSON', async () => {
    localStorage.setItem('user-store', '{ malformed json }');

    await isAuthenticated();
    expect(redirect).toHaveBeenCalledWith('/auth/login');
  });

  it('should redirect if state or user is missing', async () => {
    localStorage.setItem('user-store', JSON.stringify({ someOther: 'data' }));
    await isAuthenticated();
    expect(redirect).toHaveBeenCalledWith('/auth/login');

    vi.clearAllMocks();
    localStorage.setItem('user-store', JSON.stringify({ state: { something: 'else' } }));
    await isAuthenticated();
    expect(redirect).toHaveBeenCalledWith('/auth/login');
  });

  it('should return isAuthenticated true if uid exists', async () => {
    const mockStore = JSON.stringify({ state: { user: { uid: 'user_123' } } });
    localStorage.setItem('user-store', mockStore);

    const result = await isAuthenticated();

    expect(result).toEqual({ isAuthenticated: true });
    expect(redirect).not.all;
  });
});
