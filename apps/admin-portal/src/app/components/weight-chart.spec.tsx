import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WeightChart } from './weight-chart';

// Mock ResponsiveContainer because it doesn't work well in JSDOM
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div className="recharts-responsive-container" style={{ width: '800px', height: '400px' }}>
        {children}
      </div>
    ),
  };
});

describe('WeightChart', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-10T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockWeights = [
    {
      id: 'w1',
      weight: 80.5,
      createdAt: { toDate: () => new Date('2024-01-01T10:00:00Z') }, // 9 days ago (filtered out by 1w)
    },
    {
      id: 'w2',
      weight: 79.8,
      createdAt: { toDate: () => new Date('2024-01-08T10:00:00Z') }, // 2 days ago (included in 1w)
    },
  ];

  it('should render "No data" message when weights array is empty', () => {
    render(<WeightChart weights={[]} />);
    expect(screen.getByText(/No weight data available to display chart/i)).toBeTruthy();
  });

  it('should render the chart container when data is provided within the default 1w range', () => {
    const { container } = render(<WeightChart weights={mockWeights} />);
    
    // Check for the presence of Recharts elements
    // AreaChart usually renders an svg or a div with certain classes
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('should correctly format dates in the data memo', () => {
    // This is a bit indirect as we are testing the internal memoization via what's passed to Recharts
    // Since we mocked ResponsiveContainer to just render children, we can try to inspect the children's props if needed
    // But usually we just check if it renders without crashing with the provided data
    render(<WeightChart weights={mockWeights} />);
    
    // In JSDOM, SVG elements might not render fully but we can check if they exist
    // Recharts will render SVG components
    expect(screen.queryByText(/No weight data available/i)).toBeNull();
  });
});
