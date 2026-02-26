// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWeightInputForm } from './use-weight-input-form';
import { userStore } from '../../../store/user.store';
import { checkinStore } from '../../../store/checkin.store';
import { WeightStrategyFactory } from '../../../core/weight-strategy/weight-strategy';

vi.mock('../../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../../../store/checkin.store', () => ({
  checkinStore: vi.fn(),
}));

vi.mock('../../../core/weight-strategy/weight-strategy', () => ({
  WeightStrategyFactory: {
    getStrategy: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('useWeightInputForm', () => {
  const mockUser = { uid: 'user123' };
  
  beforeEach(() => {
    vi.clearAllMocks();
    (userStore as any).mockReturnValue({ weights: [], user: mockUser });
    (checkinStore as any).mockReturnValue({ checkins: [] });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWeightInputForm());
    expect(result.current.isEditable).toBe(true);
    expect(result.current.todayWeight).toBeUndefined();
  });

  it('should detect today weight and set editable to false', async () => {
    const today = new Date();
    const todayWeight = { id: '1', weight: 80, createdAt: today };
    (userStore as any).mockReturnValue({ weights: [todayWeight], user: mockUser });

    const { result } = renderHook(() => useWeightInputForm());

    expect(result.current.todayWeight).toBeDefined();
    expect(result.current.isEditable).toBe(false);
    expect(result.current.formMethods.getValues('weight')).toBe(80);
  });

  it('should call add strategy when saving new weight', async () => {
    const mockStrategy = { weight: vi.fn().mockResolvedValue(undefined) };
    (WeightStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);

    const { result } = renderHook(() => useWeightInputForm());

    await act(async () => {
      await result.current.handleSave({ weight: 85 });
    });

    expect(WeightStrategyFactory.getStrategy).toHaveBeenCalledWith('add');
    expect(mockStrategy.weight).toHaveBeenCalledWith({ weight: 85 }, 'user123', expect.any(Function));
    expect(result.current.isEditable).toBe(false);
  });

  it('should call edit strategy when updating today weight', async () => {
    const today = new Date();
    const todayWeight = { id: '1', weight: 80, createdAt: today };
    (userStore as any).mockReturnValue({ weights: [todayWeight], user: mockUser });

    const mockStrategy = { weight: vi.fn().mockResolvedValue(undefined) };
    (WeightStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);

    const { result } = renderHook(() => useWeightInputForm());

    await act(async () => {
      await result.current.handleSave({ weight: 82 });
    });

    expect(WeightStrategyFactory.getStrategy).toHaveBeenCalledWith('edit');
    expect(mockStrategy.weight).toHaveBeenCalledWith(expect.objectContaining({ weight: 82, id: '1' }), 'user123', expect.any(Function));
  });
});
