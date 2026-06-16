// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckinItem } from './checkin-item';
import { userStore } from '../../store/user.store';
import { CheckInStrategyFactory } from '../../core/checkin-strategy/checkin-strategy';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import { CheckInFormDataDto } from '@my-org/core';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  }),
}));

vi.mock('../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../../core/checkin-strategy/checkin-strategy', () => ({
  CheckInStrategyFactory: {
    getStrategy: vi.fn(),
  },
}));

vi.mock('lucide-react', () => ({
  Bed: () => <span data-testid="bed-icon" />,
  Footprints: () => <span data-testid="footprints-icon" />,
  Ruler: () => <span data-testid="ruler-icon" />,
  Trash: () => <span data-testid="trash-icon" />,
  Weight: () => <span data-testid="weight-icon" />,
  Zap: () => <span data-testid="zap-icon" />,
}));

vi.mock('../image/images-display', () => ({
  ImagesDisplay: () => <div data-testid="images-display" />,
}));

vi.mock('./calculate-cm', () => ({
  calculateCm: vi.fn(() => 500),
}));

describe('CheckinItem', () => {
  const mockCheckin: CheckInFormDataDto = {
    id: 'checkin-123',
    userId: 'user-456',
    weightId: 'weight-789',
    createdAt: new Date('2026-03-12T10:00:00Z'),
    updatedAt: new Date('2026-03-12T10:00:00Z'),
    hoursSlept: 8,
    dailySteps: 10000,
    energyLevel: 7,
    breastSize: 0,
    waistSize: 0,
    hipSize: 0,
    buttSize: 0,
    leftThigh: 0,
    rightThigh: 0,
    leftArm: 0,
    rightArm: 0,
    planAccuracy: 0,
    moodCheck: 0,
    imgUrls: []
  };

  const mockWeights = [
    { id: 'weight-789', weight: 75.5, createdAt: new Date() }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (userStore as any).mockImplementation((selector: any) => selector({ weights: mockWeights }));
  });

  it('renders check-in details correctly', () => {
    render(
      <MemoryRouter>
        <CheckinItem checkin={mockCheckin} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mar 12/i)).toBeInTheDocument();
    expect(screen.getByText(/75\.5/)).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument(); // from calculateCm mock
    expect(screen.getByText('8')).toBeInTheDocument(); // hoursSlept
    expect(screen.getByText('10000')).toBeInTheDocument(); // dailySteps
    expect(screen.getByText('7')).toBeInTheDocument(); // energyLevel
    expect(screen.getByTestId('images-display')).toBeInTheDocument();
  });

  it('renders "-" if weight is not found in store', () => {
    (userStore as any).mockImplementation((selector: any) => selector({ weights: [] }));

    render(
      <MemoryRouter>
        <CheckinItem checkin={mockCheckin} />
      </MemoryRouter>
    );

    expect(screen.getByText(/-/i)).toBeInTheDocument();
  });

  it('returns null if userId is missing', () => {
    const checkinNoUser = { ...mockCheckin, userId: undefined };
    const { container } = render(
      <MemoryRouter>
        <CheckinItem checkin={checkinNoUser as any} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls delete strategy when trash icon is clicked and confirmed', () => {
    const mockStrategy = { checkIn: vi.fn() };
    (CheckInStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter>
        <CheckinItem checkin={mockCheckin} />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByTestId('trash-icon').closest('div');
    fireEvent.click(deleteBtn!);

    expect(confirmSpy).toHaveBeenCalledWith('checkin.delete');
    expect(CheckInStrategyFactory.getStrategy).toHaveBeenCalledWith('delete');
    expect(mockStrategy.checkIn).toHaveBeenCalledWith({
      data: mockCheckin,
      userId: 'user-456'
    });
  });

  it('does not call delete strategy if confirm is cancelled', () => {
    const mockStrategy = { checkIn: vi.fn() };
    (CheckInStrategyFactory.getStrategy as any).mockReturnValue(mockStrategy);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <MemoryRouter>
        <CheckinItem checkin={mockCheckin} />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByTestId('trash-icon').closest('div');
    fireEvent.click(deleteBtn!);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockStrategy.checkIn).not.toHaveBeenCalled();
  });

  it('has a link to the check-in edit page', () => {
    render(
      <MemoryRouter>
        <CheckinItem checkin={mockCheckin} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/check-in?checkinId=checkin-123');
  });
});
