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

  it('should return an empty array and zero diff/avg when no data is present', () => {
    (userStore as any).mockImplementation((selector: any) => selector({ weights: [] }));

    const { result } = renderHook(() => useWeightChartData());
    expect(result.current.chartData).toEqual([]);
    expect(result.current.weightDiff).toBe(0);
    expect(result.current.averageWeight).toBe(0);
  });

  it('should sort and return data points with weightDiff and averageWeight', () => {
    const weights = [
      { createdAt: new Date('2026-02-10').toISOString(), weight: 70 },
      { createdAt: new Date('2026-02-11').toISOString(), weight: 71 },
      { createdAt: new Date('2026-02-09').toISOString(), weight: 69 },
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData('all'));

    expect(result.current.chartData.length).toBe(3);
    expect(result.current.weightDiff).toBe(2); // 71 - 69
    expect(result.current.averageWeight).toBe(70); // (69+70+71)/3
  });
});
