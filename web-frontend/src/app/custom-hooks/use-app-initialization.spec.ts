import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppInitialization } from './use-app-initialization';
import { userStore } from '../store/user.store';
import { checkinStore } from '../store/checkin.store';
import { useNavigate } from 'react-router-dom';
import { getDocs } from 'firebase/firestore';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getDocs: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../firestore/queries', () => ({
  getStartDataQuery: vi.fn(),
  getCheckinQuery: vi.fn(),
}));

describe('useAppInitialization', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    userStore.setState({ user: undefined, initData: undefined });
    checkinStore.setState({ checkins: [] });
  });

  it('should redirect to login if no user is present', async () => {
    renderHook(() => useAppInitialization());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
    });
  });

  it('should successfully complete the loading cycle', async () => {
    const mockUser = { uid: '123' };
    userStore.setState({ user: mockUser as any, initData: undefined });
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          id: 'mock-id',
          data: () => ({
            some: 'data',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() },
          }),
        },
      ],
    } as any);

    const { result } = renderHook(() => useAppInitialization());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 1000 });

    expect(result.current.hasInitData).toBe(true);
  });

  it('should skip loading if initData already exists', () => {
    userStore.setState({ initData: { some: 'data' } as any });

    const { result } = renderHook(() => useAppInitialization());

    expect(result.current.isLoading).toBe(false);
    expect(getDocs).not.toHaveBeenCalled();
  });
});
