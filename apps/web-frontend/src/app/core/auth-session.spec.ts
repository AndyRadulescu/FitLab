import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAuthSessionStale } from './auth-session';
import { getAuth } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

describe('isAuthSessionStale', () => {
  const mockT = vi.fn((key, def) => def);
  const mockNavigate = vi.fn();
  const mockOnLogout = vi.fn();
  const mockAuth = {
    currentUser: null as any,
    signOut: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getAuth as any).mockReturnValue(mockAuth);
    vi.stubGlobal('window', { confirm: vi.fn() });
    vi.useFakeTimers();
  });

  it('should return false if no user is logged in', async () => {
    mockAuth.currentUser = null;
    const result = await isAuthSessionStale(mockT as any, mockNavigate, mockOnLogout);
    expect(result).toBe(false);
  });

  it('should return false if session is fresh (less than 5 minutes)', async () => {
    const now = Date.now();
    mockAuth.currentUser = {
      metadata: {
        lastSignInTime: new Date(now - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      },
    };

    const result = await isAuthSessionStale(mockT as any, mockNavigate, mockOnLogout);
    expect(result).toBe(false);
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('should return true and prompt logout if session is stale (more than 5 minutes)', async () => {
    const now = Date.now();
    mockAuth.currentUser = {
      metadata: {
        lastSignInTime: new Date(now - 6 * 60 * 1000).toISOString(), // 6 minutes ago
      },
    };
    (window.confirm as any).mockReturnValue(true);

    const result = await isAuthSessionStale(mockT as any, mockNavigate, mockOnLogout);
    
    expect(result).toBe(true);
    expect(window.confirm).toHaveBeenCalled();
    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
  });

  it('should return true but not logout if user cancels confirm prompt', async () => {
    const now = Date.now();
    mockAuth.currentUser = {
      metadata: {
        lastSignInTime: new Date(now - 10 * 60 * 1000).toISOString(), // 10 minutes ago
      },
    };
    (window.confirm as any).mockReturnValue(false);

    const result = await isAuthSessionStale(mockT as any, mockNavigate, mockOnLogout);
    
    expect(result).toBe(true);
    expect(window.confirm).toHaveBeenCalled();
    expect(mockAuth.signOut).not.toHaveBeenCalled();
    expect(mockOnLogout).not.toHaveBeenCalled();
  });
});
