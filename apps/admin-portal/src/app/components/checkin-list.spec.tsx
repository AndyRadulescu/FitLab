import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CheckinList } from './checkin-list';
import { CheckInFormDataDto, WeightString } from '@my-org/core';

describe('CheckinList', () => {
  const mockOnSelectCheckin = vi.fn();

  const mockCheckins = [
    {
      id: 'c1',
      weightId: 'w1',
      createdAt: new Date('2024-01-01T10:00:00Z')
    },
    {
      id: 'c2',
      weightId: 'missingWeightId',
      createdAt: new Date('2024-01-08T10:00:00Z')
    }
  ] as CheckInFormDataDto[];

  const mockWeights = [
    {
      id: 'w1',
      weight: 80.5,
      createdAt: '2024-01-01T10:00:00Z'
    }
  ] as WeightString[];

  it('should render "No check-ins" message when array is empty', () => {
    render(<CheckinList checkins={[]} weights={[]} onSelectCheckin={mockOnSelectCheckin} />);
    expect(screen.getByText(/No check-ins found for this user/i)).toBeTruthy();
  });

  it('should render a list of check-ins', () => {
    render(<CheckinList checkins={mockCheckins} weights={mockWeights} onSelectCheckin={mockOnSelectCheckin} />);

    expect(screen.getByText('Monday, January 1, 2024')).toBeTruthy();
    expect(screen.getByText('Weight: 80.5 kg')).toBeTruthy();

    expect(screen.getByText('Monday, January 8, 2024')).toBeTruthy();
    expect(screen.getByText('No weight recorded')).toBeTruthy();
  });

  it('should call onSelectCheckin when a check-in is clicked', () => {
    render(<CheckinList checkins={mockCheckins} weights={mockWeights} onSelectCheckin={mockOnSelectCheckin} />);

    // The onClick is on the main wrapper div
    const checkinItem = screen.getByText('Monday, January 1, 2024').closest('.cursor-pointer');
    if (checkinItem) {
      fireEvent.click(checkinItem);
    }

    expect(mockOnSelectCheckin).toHaveBeenCalledWith('c1');
  });
});
