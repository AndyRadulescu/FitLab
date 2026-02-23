// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWeightChartData } from './use-weight-chart-data';
import { userStore } from '../../../store/user.store';
import { checkinStore } from '../../../store/checkin.store';

vi.mock('../../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../../../store/checkin.store', () => ({
  checkinStore: vi.fn(),
}));

describe('useWeightChartData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty array when no data is present', () => {
    (userStore as any).mockImplementation((selector: any) => selector({ weights: [] }));
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));

    const { result } = renderHook(() => useWeightChartData());
    expect(result.current).toEqual([]);
  });

  it('should merge and sort weights from both stores', () => {
    const weights = [
      { createdAt: new Date('2026-02-10'), weight: 70 },
    ];
    const checkins = [
      { createdAt: new Date('2026-02-11'), kg: 71 },
      { createdAt: new Date('2026-02-09'), kg: 69 },
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins }));

    const { result } = renderHook(() => useWeightChartData());

    expect(result.current.length).toBe(3);
    expect(result.current[0].weight).toBe(69);
    expect(result.current[1].weight).toBe(70);
    expect(result.current[2].weight).toBe(71);
  });

  it('should deduplicate entries for the same day, keeping the latest', () => {
    const weights = [
      { createdAt: new Date('2026-02-10T08:00:00'), weight: 70 },
    ];
    const checkins = [
      { createdAt: new Date('2026-02-10T10:00:00'), kg: 72 },
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins }));

    const { result } = renderHook(() => useWeightChartData());

    expect(result.current.length).toBe(1);
    expect(result.current[0].weight).toBe(72);
  });

  it('should limit the results to the last 10 entries', () => {
    const weights = Array.from({ length: 15 }, (_, i) => ({
      createdAt: new Date(`2026-01-${i + 1}`),
      weight: 60 + i
    }));

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));
    (checkinStore as any).mockImplementation((selector: any) => selector({ checkins: [] }));

    const { result } = renderHook(() => useWeightChartData());

    expect(result.current.length).toBe(10);
    expect(result.current[9].weight).toBe(74);
  });
});
