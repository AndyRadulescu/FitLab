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

  it('should return an empty array and zero diff when no data is present', () => {
    (userStore as any).mockImplementation((selector: any) => selector({ weights: [] }));

    const { result } = renderHook(() => useWeightChartData());
    expect(result.current.chartData).toEqual([]);
    expect(result.current.weightDiff).toBe(0);
  });

  it('should sort and return data points with weightDiff', () => {
    const weights = [
      { createdAt: new Date('2026-02-10').toISOString(), weight: 70 },
      { createdAt: new Date('2026-02-11').toISOString(), weight: 71 },
      { createdAt: new Date('2026-02-09').toISOString(), weight: 69 },
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData('all'));

    expect(result.current.chartData.length).toBe(3);
    expect(result.current.chartData[0].weight).toBe(69);
    expect(result.current.chartData[2].weight).toBe(71);
    expect(result.current.weightDiff).toBe(2); // 71 - 69
  });

  it('should deduplicate entries and return correct diff', () => {
    const weights = [
      { createdAt: new Date('2026-02-10T08:00:00').toISOString(), weight: 70 },
      { createdAt: new Date('2026-02-10T10:00:00').toISOString(), weight: 72 },
      { createdAt: new Date('2026-02-11T10:00:00').toISOString(), weight: 74 },
    ];

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData('all'));

    expect(result.current.chartData.length).toBe(2);
    expect(result.current.weightDiff).toBe(2); // 74 - 72
  });

  it('should limit the results to the last 10 entries when no timeRange is provided', () => {
    const weights = Array.from({ length: 15 }, (_, i) => ({
      createdAt: new Date(`2026-01-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`).toISOString(),
      weight: 60 + i
    }));

    (userStore as any).mockImplementation((selector: any) => selector({ weights }));

    const { result } = renderHook(() => useWeightChartData());

    expect(result.current.chartData.length).toBe(10);
    expect(result.current.weightDiff).toBe(9); // 74 - 65
  });
});
