import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isAuthenticated } from './is-authenticated';
import { redirect } from 'react-router';

vi.mock('react-router', () => ({
  redirect: vi.fn((url) => ({ tablet: 'redirect', url }))
}));

describe('isAuthenticated()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect if hasUser is false', () => {
    const result = isAuthenticated(false);

    expect(redirect).toHaveBeenCalledWith('/auth/login');
    expect(result).toEqual(redirect('/auth/login'));
  });

  it('should redirect to custom path if provided', () => {
    const customPath = '/custom-login';
    const result = isAuthenticated(false, customPath);

    expect(redirect).toHaveBeenCalledWith(customPath);
    expect(result).toEqual(redirect(customPath));
  });

  it('should return isAuthenticated true if hasUser is true', () => {
    const result = isAuthenticated(true);

    expect(result).toEqual({ isAuthenticated: true });
    expect(redirect).not.toHaveBeenCalled();
  });
});
