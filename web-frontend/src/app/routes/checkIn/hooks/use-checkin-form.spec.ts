// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCheckInForm } from './use-checkin-form';
import { userStore } from '../../../store/user.store';
import { checkinStore } from '../../../store/checkin.store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckInStrategyFactory } from '../../../core/checkin-strategy/checkin-strategy';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('../../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../../../store/checkin.store', () => ({
  checkinStore: vi.fn(),
}));

vi.mock('../../../core/checkin-strategy/checkin-strategy', () => ({
  CheckInStrategyFactory: {
    getStrategy: vi.fn(),
  },
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: () => ({ id: 'new-id-123' }),
}));

vi.mock('../../../../init-firebase-auth', () => ({
  db: {},
}));

describe('useCheckInForm', () => {
  const mockNavigate = vi.fn();
  const mockUser = { uid: 'user123' };
  const today = new Date();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useSearchParams as any).mockReturnValue([new URLSearchParams()]);
    (userStore as any).mockImplementation((selector: any) => selector({ user: mockUser }));
  });

  it('should initialize with default values when no check-in exists', () => {
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));

    const { result } = renderHook(() => useCheckInForm());

    expect(result.current.checkinData).toBeUndefined();
    expect(result.current.isEditingToday).toBe(false);
    expect(result.current.activeCheckinId).toBe('new-id-123');
  });

  it('should detect today\'s check-in and set edit mode', () => {
    const todayCheckin = { id: 'today-1', createdAt: today, kg: 80 };
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [todayCheckin] }));

    const { result } = renderHook(() => useCheckInForm());

    expect(result.current.checkinData).toEqual(todayCheckin);
    expect(result.current.isEditingToday).toBe(true);
    expect(result.current.activeCheckinId).toBe('today-1');
  });

  it('should prioritize checkinId from search params', () => {
    const otherCheckin = { id: 'other-id', createdAt: new Date(2000, 1, 1), kg: 90 };
    const todayCheckin = { id: 'today-1', createdAt: today, kg: 80 };

    (useSearchParams as any).mockReturnValue([new URLSearchParams('checkinId=other-id')]);
    (checkinStore as any).mockImplementation((selector: any) => selector({
      checkins: [todayCheckin, otherCheckin]
    }));

    const { result } = renderHook(() => useCheckInForm());

    expect(result.current.checkinData).toEqual(otherCheckin);
    expect(result.current.isEditingToday).toBe(false);
    expect(result.current.activeCheckinId).toBe('other-id');
  });

  it('should redirect to login on submit if no user is present', async () => {
    (userStore as any).mockImplementation((selector: any) => selector({ user: null }));
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));

    const { result } = renderHook(() => useCheckInForm());

    await act(async () => {
      await result.current.onSubmit({ kg: 70 } as any);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
  });

  it('should use "add" strategy for new check-in', async () => {
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));
    const mockStrategy = { checkIn: vi.fn().mockResolvedValue(undefined) };
    (CheckInStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);

    const { result } = renderHook(() => useCheckInForm());

    const formData = { kg: 75, imgUrls: [] };
    await act(async () => {
      await result.current.onSubmit(formData as any);
    });

    expect(CheckInStrategyFactory.getStrategy).toHaveBeenCalledWith('add');
    expect(mockStrategy.checkIn).toHaveBeenCalledWith({
      data: { kg: 75, id: 'new-id-123' },
      userId: 'user123'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/', { replace: true });
  });

  it('should use "edit" strategy for existing check-in', async () => {
    const todayCheckin = { id: 'today-1', createdAt: today };
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [todayCheckin] }));
    const mockStrategy = { checkIn: vi.fn().mockResolvedValue(undefined) };
    (CheckInStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);

    const { result } = renderHook(() => useCheckInForm());

    const formData = { kg: 82, imgUrls: [] };
    await act(async () => {
      await result.current.onSubmit(formData as any);
    });

    expect(CheckInStrategyFactory.getStrategy).toHaveBeenCalledWith('edit');
    expect(mockStrategy.checkIn).toHaveBeenCalledWith({
      data: { kg: 82, id: 'today-1' },
      userId: 'user123'
    });
  });
});
