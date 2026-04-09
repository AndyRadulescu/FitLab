// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWeightChartData } from './use-weight-chart-data';
import { userStore } from '../../../store/user.store';

vi.mock('../../../store/user.store', () => ({
  userStore: vi.fn(),
}));

describe('useWeightChartData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return an empty array when no data is present', () => {
    (userStore as any).mockImplementation((selector: any) => selector({ weights: [] }));

    const { result } = renderHook(() => useWeightChartData());
    expect(result.current).toEqual([]);
  });

  it('should sort weights from the store', () => {
    const weights = [
      { createdAt: new Date('2026-02-10').toISOString(), weight: 70 },
      { createdAt: new Date('2026-02-11').toISOString(), weight: 71 },
      { createdAt: new Date('2026-02-09').toISOString(), weight: 69 },
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData('all'));

    expect(result.current.length).toBe(3);
    expect(result.current[0].weight).toBe(69);
    expect(result.current[1].weight).toBe(70);
    expect(result.current[2].weight).toBe(71);
  });

  it('should deduplicate entries for the same day, keeping the latest', () => {
    const weights = [
      { createdAt: new Date('2026-02-10T08:00:00').toISOString(), weight: 70 },
      { createdAt: new Date('2026-02-10T10:00:00').toISOString(), weight: 72 },
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData('all'));

    expect(result.current.length).toBe(1);
    expect(result.current[0].weight).toBe(72);
  });

  it('should limit the results to the last 10 entries when no timeRange is provided', () => {
    const weights = Array.from({ length: 15 }, (_, i) => ({
      createdAt: new Date(`2026-01-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`).toISOString(),
      weight: 60 + i
    }));

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData());

    expect(result.current.length).toBe(10);
    expect(result.current[9].weight).toBe(74);
  });

  it('should filter by 1w range', () => {
    const weights = [
      { createdAt: new Date('2026-02-14').toISOString(), weight: 70 }, // In range
      { createdAt: new Date('2026-02-05').toISOString(), weight: 65 }, // Out of range
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData('1w'));

    expect(result.current.length).toBe(1);
    expect(result.current[0].weight).toBe(70);
  });

  it('should filter by 4w range', () => {
    const weights = [
      { createdAt: new Date('2026-02-01').toISOString(), weight: 70 }, // In range
      { createdAt: new Date('2026-01-01').toISOString(), weight: 65 }, // Out of range
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData('4w'));

    expect(result.current.length).toBe(1);
    expect(result.current[0].weight).toBe(70);
  });
});
