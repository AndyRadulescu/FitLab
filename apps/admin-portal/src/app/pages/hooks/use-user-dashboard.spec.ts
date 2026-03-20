import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserDashboard } from './use-user-dashboard';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserInfo, fetchCheckins, fetchWeights } from '../../firestore/queries';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../../firestore/queries', () => ({
  fetchUserInfo: vi.fn(),
  fetchCheckins: vi.fn(),
  fetchWeights: vi.fn(),
}));

describe('useUserDashboard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('should initialize with loading state', async () => {
    (useParams as any).mockReturnValue({ userId: 'user123' });
    (fetchUserInfo as any).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useUserDashboard());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('should fetch and map data correctly on success', async () => {
    (useParams as any).mockReturnValue({ userId: 'user123' });
    
    const mockUser = { id: 'user123', displayName: 'John Doe' };
    const mockCheckins = [
      { id: 'c1', weightId: 'w1', note: 'Feeling good' },
      { id: 'c2', kg: 80, note: 'Legacy checkin' }
    ];
    const mockWeights = [
      { id: 'w1', weight: 85 }
    ];

    (fetchUserInfo as any).mockResolvedValue(mockUser);
    (fetchCheckins as any).mockResolvedValue(mockCheckins);
    (fetchWeights as any).mockResolvedValue(mockWeights);

    const { result } = renderHook(() => useUserDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.weights).toEqual(mockWeights);
    expect(result.current.checkins).toEqual([
      { id: 'c1', weightId: 'w1', note: 'Feeling good', kg: 85 },
      { id: 'c2', kg: 80, note: 'Legacy checkin' }
    ]);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors during data fetching', async () => {
    (useParams as any).mockReturnValue({ userId: 'user123' });
    (fetchUserInfo as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUserDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load user data: Network error');
    expect(result.current.user).toBeNull();
  });

  it('should provide selectedCheckin when checkinId is present', async () => {
    (useParams as any).mockReturnValue({ userId: 'user123', checkinId: 'c1' });
    
    const mockCheckins = [{ id: 'c1', note: 'Checkin 1' }, { id: 'c2', note: 'Checkin 2' }];
    (fetchUserInfo as any).mockResolvedValue({ id: 'user123' });
    (fetchCheckins as any).mockResolvedValue(mockCheckins);
    (fetchWeights as any).mockResolvedValue([]);

    const { result } = renderHook(() => useUserDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.selectedCheckin).toEqual({ id: 'c1', note: 'Checkin 1', kg: undefined });
  });

  it('should handle navigation: handleCloseModal', async () => {
    (useParams as any).mockReturnValue({ userId: 'user123' });
    const { result } = renderHook(() => useUserDashboard());

    result.current.handleCloseModal();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/user123');
  });

  it('should handle navigation: handleSelectCheckin', async () => {
    (useParams as any).mockReturnValue({ userId: 'user123' });
    const { result } = renderHook(() => useUserDashboard());

    result.current.handleSelectCheckin('c55');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/user123/c55');
  });

  it('should handle navigation: handleGoBack', async () => {
    (useParams as any).mockReturnValue({ userId: 'user123' });
    const { result } = renderHook(() => useUserDashboard());

    result.current.handleGoBack();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
