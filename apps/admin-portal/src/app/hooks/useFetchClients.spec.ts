import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFetchClients } from './useFetchClients';
import { fetchCheckins, fetchClientIds, fetchUserInfo, fetchWeights } from '../firestore/queries';
import { userStore } from '../store/user.store';

// Mock dependencies
vi.mock('../firestore/queries', () => ({
  fetchUserInfo: vi.fn(),
  fetchCheckins: vi.fn(),
  fetchClientIds: vi.fn(),
  fetchWeights: vi.fn(),
}));

const mockSetUserList = vi.fn();
const mockSetUserProfile = vi.fn();
vi.mock('../store/user.store', () => ({
  userStore: vi.fn(),
}));

describe('useFetchClients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the mock for userStore selector
    vi.mocked(userStore).mockImplementation((selector: any) => 
      selector({
        setUserList: mockSetUserList,
        setUserProfile: mockSetUserProfile,
      })
    );
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not fetch if coachId is undefined', async () => {
    const { result } = renderHook(() => useFetchClients(undefined));
    
    expect(result.current.loading).toBe(false);
    expect(fetchUserInfo).not.toHaveBeenCalled();
    expect(fetchClientIds).not.toHaveBeenCalled();
  });

  it('should block fetching and set isUnauthorized if user does not have isCoach or isAdmin', async () => {
    vi.mocked(fetchUserInfo).mockResolvedValue({
      id: 'user123',
      userId: 'user123',
      isCoach: false,
      isAdmin: false,
    } as any);

    const { result } = renderHook(() => useFetchClients('user123'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchUserInfo).toHaveBeenCalledWith('user123');
    expect(result.current.isUnauthorized).toBe(true);
    expect(fetchClientIds).not.toHaveBeenCalled();
    expect(mockSetUserList).toHaveBeenCalledWith(null);
  });

  it('should fetch enriched client data successfully if user is a coach (isCoach: true)', async () => {
    const mockProfile = { id: 'coach123', isCoach: true, isAdmin: false } as any;
    const mockClients = [{ id: 'client1', name: 'Client 1' }];
    const mockCheckins = [{ id: 'checkin1', note: 'Feeling good' }];
    const mockWeights = [{ id: 'weight1', weight: 80 }];

    vi.mocked(fetchUserInfo).mockResolvedValue(mockProfile);
    vi.mocked(fetchClientIds).mockResolvedValue(mockClients as any);
    vi.mocked(fetchCheckins).mockResolvedValue(mockCheckins as any);
    vi.mocked(fetchWeights).mockResolvedValue(mockWeights as any);

    const { result } = renderHook(() => useFetchClients('coach123'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchUserInfo).toHaveBeenCalledWith('coach123');
    expect(mockSetUserProfile).toHaveBeenCalledWith(mockProfile);
    expect(fetchClientIds).toHaveBeenCalledWith('coach123');
    expect(fetchCheckins).toHaveBeenCalledWith('client1');
    expect(fetchWeights).toHaveBeenCalledWith('client1');

    expect(mockSetUserList).toHaveBeenCalledWith([
      {
        ...mockClients[0],
        checkins: mockCheckins,
        weights: mockWeights,
      },
    ]);
    expect(result.current.error).toBeNull();
    expect(result.current.isUnauthorized).toBe(false);
  });

  it('should fetch enriched client data successfully if user is an admin (isAdmin: true)', async () => {
    const mockProfile = { id: 'admin123', isCoach: false, isAdmin: true } as any;
    const mockClients = [{ id: 'client1', name: 'Client 1' }];
    const mockCheckins = [{ id: 'checkin1', note: 'Feeling good' }];
    const mockWeights = [{ id: 'weight1', weight: 80 }];

    vi.mocked(fetchUserInfo).mockResolvedValue(mockProfile);
    vi.mocked(fetchClientIds).mockResolvedValue(mockClients as any);
    vi.mocked(fetchCheckins).mockResolvedValue(mockCheckins as any);
    vi.mocked(fetchWeights).mockResolvedValue(mockWeights as any);

    const { result } = renderHook(() => useFetchClients('admin123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchUserInfo).toHaveBeenCalledWith('admin123');
    expect(fetchClientIds).toHaveBeenCalledWith('admin123');
    expect(result.current.isUnauthorized).toBe(false);
  });

  it('should handle permission-denied error', async () => {
    vi.mocked(fetchUserInfo).mockResolvedValue({ id: 'coach123', isCoach: true } as any);
    vi.mocked(fetchClientIds).mockRejectedValue({ code: 'permission-denied' });

    const { result } = renderHook(() => useFetchClients('coach123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain('Permission Required');
    expect(result.current.isUnauthorized).toBe(true);
  });

  it('should handle generic errors', async () => {
    vi.mocked(fetchUserInfo).mockResolvedValue({ id: 'coach123', isCoach: true } as any);
    vi.mocked(fetchClientIds).mockRejectedValue(new Error('Something went wrong'));

    const { result } = renderHook(() => useFetchClients('coach123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain('Something went wrong');
  });
});
