import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFetchClients } from './useFetchClients';
import { fetchCheckins, fetchClientIds, fetchWeights } from '../firestore/queries';
import { userStore } from '../store/user.store';

// Mock dependencies
vi.mock('../firestore/queries', () => ({
  fetchCheckins: vi.fn(),
  fetchClientIds: vi.fn(),
  fetchWeights: vi.fn(),
}));

const mockSetUserList = vi.fn();
vi.mock('../store/user.store', () => ({
  userStore: vi.fn(),
}));

describe('useFetchClients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the mock for userStore selector
    vi.mocked(userStore).mockImplementation((selector: any) => 
      selector({ setUserList: mockSetUserList })
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
    expect(fetchClientIds).not.toHaveBeenCalled();
  });

  it('should fetch enriched client data successfully', async () => {
    const mockClients = [{ id: 'client1', name: 'Client 1' }];
    const mockCheckins = [{ id: 'checkin1', note: 'Feeling good' }];
    const mockWeights = [{ id: 'weight1', weight: 80 }];

    vi.mocked(fetchClientIds).mockResolvedValue(mockClients);
    vi.mocked(fetchCheckins).mockResolvedValue(mockCheckins);
    vi.mocked(fetchWeights).mockResolvedValue(mockWeights);

    const { result } = renderHook(() => useFetchClients('coach123'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

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
  });

  it('should handle permission-denied error', async () => {
    vi.mocked(fetchClientIds).mockRejectedValue({ code: 'permission-denied' });

    const { result } = renderHook(() => useFetchClients('coach123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain('Permission Required');
  });

  it('should handle generic errors', async () => {
    vi.mocked(fetchClientIds).mockRejectedValue(new Error('Something went wrong'));

    const { result } = renderHook(() => useFetchClients('coach123'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain('Something went wrong');
  });
});
