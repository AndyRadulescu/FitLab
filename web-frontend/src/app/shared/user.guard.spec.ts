import { describe, it, expect, vi } from 'vitest';
import { assertAuthenticated } from './user.guard';

describe('assertAuthenticated', () => {
  it('should not throw if user and uid exist', () => {
    const mockNavigate = vi.fn();
    const mockUser = { uid: '123' } as any;

    expect(() => assertAuthenticated(mockNavigate, mockUser)).not.toThrow();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should throw and navigate if user is missing', () => {
    const mockNavigate = vi.fn();

    expect(() => assertAuthenticated(mockNavigate, undefined))
      .toThrow('Auth Assertion Failed: Redirecting to login.');

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
  });

  it('should throw and navigate if uid is missing', () => {
    const mockNavigate = vi.fn();
    const mockUser = { email: 'test@test.com' } as any;

    expect(() => assertAuthenticated(mockNavigate, mockUser))
      .toThrow('Auth Assertion Failed: Redirecting to login.');
  });
});
