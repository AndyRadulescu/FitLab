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
    (userStore as any).mockImplementation((selector: any) => selector({ 
      user: mockUser,
      weights: [] 
    }));
  });

  it('should initialize with null when no check-in or weight exists', () => {
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));

    const { result } = renderHook(() => useCheckInForm());

    expect(result.current.checkinData).toBeNull();
    expect(result.current.isEditingToday).toBe(false);
    expect(result.current.activeCheckinId).toBe('new-id-123');
  });

  it('should detect today\'s check-in and join with weight data', () => {
    const todayCheckin = { id: 'today-1', createdAt: today, weightId: 'w-1' };
    const todayWeight = { id: 'w-1', weight: 80, createdAt: today };
    
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [todayCheckin] }));
    (userStore as any).mockImplementation((selector: any) => selector({ 
      user: mockUser, 
      weights: [todayWeight] 
    }));

    const { result } = renderHook(() => useCheckInForm());

    expect(result.current.checkinData).toEqual({ ...todayCheckin, kg: 80 });
    expect(result.current.isEditingToday).toBe(true);
    expect(result.current.activeCheckinId).toBe('today-1');
  });

  it('should pre-fill today\'s weight even if no check-in exists yet', () => {
    const todayWeight = { id: 'w-1', weight: 78, createdAt: today };
    
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));
    (userStore as any).mockImplementation((selector: any) => selector({ 
      user: mockUser, 
      weights: [todayWeight] 
    }));

    const { result } = renderHook(() => useCheckInForm());

    expect(result.current.checkinData).toEqual({ kg: 78 });
    expect(result.current.isEditingToday).toBe(false);
    expect(result.current.activeCheckinId).toBe('new-id-123');
  });

  it('should prioritize checkinId from search params and join with correct weight', () => {
    const otherCheckin = { id: 'other-id', createdAt: new Date(2000, 1, 1), weightId: 'w-2' };
    const otherWeight = { id: 'w-2', weight: 90, createdAt: new Date(2000, 1, 1) };
    const todayCheckin = { id: 'today-1', createdAt: today, weightId: 'w-1' };

    (useSearchParams as any).mockReturnValue([new URLSearchParams('checkinId=other-id')]);
    (checkinStore as any).mockImplementation((selector: any) => selector({
      checkins: [todayCheckin, otherCheckin]
    }));
    (userStore as any).mockImplementation((selector: any) => selector({ 
      user: mockUser, 
      weights: [otherWeight] 
    }));

    const { result } = renderHook(() => useCheckInForm());

    expect(result.current.checkinData).toEqual({ ...otherCheckin, kg: 90 });
    expect(result.current.isEditingToday).toBe(false);
    expect(result.current.activeCheckinId).toBe('other-id');
  });

  it('should redirect to login on submit if no user is present', async () => {
    (userStore as any).mockImplementation((selector: any) => selector({ user: null, weights: [] }));
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));

    const { result } = renderHook(() => useCheckInForm());

    await act(async () => {
      try {
        await result.current.onSubmit({ kg: 70 } as any);
      } catch (e) {
        // Expected Auth Assertion Error
      }
    });

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
  });

  it('should use "add" strategy and pass weightId if today\'s weight already exists', async () => {
    const todayWeight = { id: 'w-1', weight: 75, createdAt: today };
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));
    (userStore as any).mockImplementation((selector: any) => selector({ 
      user: mockUser, 
      weights: [todayWeight] 
    }));
    
    const mockStrategy = { checkIn: vi.fn().mockResolvedValue(undefined) };
    (CheckInStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);

    const { result } = renderHook(() => useCheckInForm());

    const formData = { kg: 76, imgUrls: [] };
    await act(async () => {
      await result.current.onSubmit(formData as any);
    });

    expect(CheckInStrategyFactory.getStrategy).toHaveBeenCalledWith('add');
    expect(mockStrategy.checkIn).toHaveBeenCalledWith({
      data: { kg: 76, id: 'new-id-123', weightId: 'w-1' },
      userId: 'user123'
    });
  });

  it('should use "edit" strategy and pass existing weightId', async () => {
    const todayCheckin = { id: 'today-1', createdAt: today, weightId: 'w-1' };
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [todayCheckin] }));
    (userStore as any).mockImplementation((selector: any) => selector({ 
      user: mockUser, 
      weights: [{ id: 'w-1', weight: 80, createdAt: today }] 
    }));

    const mockStrategy = { checkIn: vi.fn().mockResolvedValue(undefined) };
    (CheckInStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);

    const { result } = renderHook(() => useCheckInForm());

    const formData = { kg: 82, imgUrls: [] };
    await act(async () => {
      await result.current.onSubmit(formData as any);
    });

    expect(CheckInStrategyFactory.getStrategy).toHaveBeenCalledWith('edit');
    expect(mockStrategy.checkIn).toHaveBeenCalledWith({
      data: { kg: 82, id: 'today-1', weightId: 'w-1' },
      userId: 'user123'
    });
  });
});
