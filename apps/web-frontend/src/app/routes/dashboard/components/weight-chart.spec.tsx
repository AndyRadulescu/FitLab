// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeightChart } from './weight-chart';
import { useWeightChartData } from '../hooks/use-weight-chart-data';
import '@testing-library/jest-dom/vitest';
import { ReactNode } from 'react';

vi.mock('../hooks/use-weight-chart-data', () => ({
  useWeightChartData: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

describe('WeightChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the chart and selector when data is present', () => {
    (useWeightChartData as any).mockReturnValue({
      chartData: [{ date: '2/10/2026', weight: 70, timestamp: 123 }],
      weightDiff: 0
    });

    render(<WeightChart />);
    expect(screen.getByText('dashboard.journey')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByText('1w')).toBeInTheDocument();
  });

  it('should render the weight difference when data exists', () => {
    (useWeightChartData as any).mockReturnValue({
      chartData: [
        { date: '2/10/2026', weight: 70, timestamp: 123 },
        { date: '2/11/2026', weight: 72, timestamp: 456 }
      ],
      weightDiff: 2
    });

    render(<WeightChart />);
    expect(screen.getByText('+2.0 kg')).toBeInTheDocument();
  });
});
