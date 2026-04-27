/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TimeToCheckin } from './time-to-checkin';
import '@testing-library/jest-dom/vitest';

describe('TimeToCheckin', () => {
  const mockNow = new Date('2026-04-27T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render N/A when data is empty', () => {
    render(<TimeToCheckin data={[]} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should render N/A when data is null', () => {
    // @ts-expect-error testing null input
    render(<TimeToCheckin data={null} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should show days remaining when check-in is upcoming', () => {
    // Last check-in was 5 days ago. Next one is in 2 days.
    const lastCheckinDate = new Date(mockNow);
    lastCheckinDate.setDate(lastCheckinDate.getDate() - 5);

    const mockData: any[] = [
      { id: '1', createdAt: lastCheckinDate }
    ];

    render(<TimeToCheckin data={mockData} />);
    
    expect(screen.getByText('2d')).toBeInTheDocument();
    expect(screen.queryByText('-')).not.toBeInTheDocument();
    
    const container = screen.getByText('2d');
    expect(container).not.toHaveClass('text-red-500');
  });

  it('should show negative days when check-in is overdue', () => {
    // Last check-in was 10 days ago. Next one was due 3 days ago.
    const lastCheckinDate = new Date(mockNow);
    lastCheckinDate.setDate(lastCheckinDate.getDate() - 10);

    const mockData: any[] = [
      { id: '1', createdAt: lastCheckinDate }
    ];

    render(<TimeToCheckin data={mockData} />);
    
    expect(screen.getByText('-3d')).toBeInTheDocument();
    
    const container = screen.getByText('-3d');
    expect(container).toHaveClass('text-red-500');
  });

  it('should use the most recent check-in to calculate next check-in', () => {
    // Multiple check-ins. Most recent was 3 days ago. Next is in 4 days.
    const olderCheckin = new Date(mockNow);
    olderCheckin.setDate(olderCheckin.getDate() - 10);

    const recentCheckin = new Date(mockNow);
    recentCheckin.setDate(recentCheckin.getDate() - 3);

    const mockData: any[] = [
      { id: '1', createdAt: olderCheckin },
      { id: '2', createdAt: recentCheckin }
    ];

    render(<TimeToCheckin data={mockData} />);
    
    expect(screen.getByText('4d')).toBeInTheDocument();
  });

  it('should handle exactly 7 days ago as 0 days remaining', () => {
    const lastCheckinDate = new Date(mockNow);
    lastCheckinDate.setDate(lastCheckinDate.getDate() - 7);

    const mockData: any[] = [
      { id: '1', createdAt: lastCheckinDate }
    ];

    render(<TimeToCheckin data={mockData} />);
    
    expect(screen.getByText('0d')).toBeInTheDocument();
  });
});
