import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CheckinDetailModal } from './checkin-detail-modal';
import { useCheckinImages } from './checkin-detail-modal/use-checkin-images';

// Mock sub-components and hooks
vi.mock('./checkin-detail-modal/use-checkin-images', () => ({
  useCheckinImages: vi.fn(),
}));

vi.mock('@my-org/shared-ui', async () => {
  const actual = await vi.importActual('@my-org/shared-ui');
  return {
    ...actual,
    Modal: ({ children, isOpen }: any) => isOpen ? <div data-testid="modal">{children}</div> : null,
    LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
  };
});

describe('CheckinDetailModal', () => {
  const mockOnClose = vi.fn();
  // Use a local date (Jan 1, 2024 at 12:00 PM) to avoid timezone shifts in tests
  const mockCheckin = {
    id: 'c1',
    userId: 'u1',
    planAccuracy: 9,
    energyLevel: 8,
    moodCheck: 7,
    hoursSlept: 8,
    dailySteps: 10000,
    kg: 75,
    createdAt: { toDate: () => new Date(2024, 0, 1, 12, 0, 0) },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 13, 0, 0)); // Set "now" to slightly after the check-in
    (useCheckinImages as any).mockReturnValue({ imgUrls: {}, loadingImages: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render when isOpen is false', () => {
    render(<CheckinDetailModal checkin={mockCheckin} isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByTestId('modal')).toBeNull();
  });

  it('should render loading state', () => {
    render(<CheckinDetailModal checkin={mockCheckin} isOpen={true} onClose={mockOnClose} loading={true} />);
    expect(screen.getByTestId('loading-screen')).toBeTruthy();
  });

  it('should render check-in details on success', () => {
    render(<CheckinDetailModal checkin={mockCheckin} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Check-in Details')).toBeTruthy();
    expect(screen.getByText(/Monday, January 1, 2024/i)).toBeTruthy();
    expect(screen.getByText('Lifestyle Stats')).toBeTruthy();
    expect(screen.getByText('Body Measurements')).toBeTruthy();
  });

  it('should call onClose when close button is clicked', () => {
    render(<CheckinDetailModal checkin={mockCheckin} isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByText('Close Preview');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render empty state when checkin is missing', () => {
    render(<CheckinDetailModal checkin={null} isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Check-in data not found.')).toBeTruthy();
  });
});
