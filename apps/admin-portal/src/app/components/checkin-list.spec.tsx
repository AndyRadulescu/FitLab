import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckinList } from './checkin-list';

describe('CheckinList', () => {
  const mockOnSelectCheckin = vi.fn();

  const mockCheckins = [
    {
      id: 'c1',
      kg: 80.5,
      createdAt: { toDate: () => new Date('2024-01-01T10:00:00Z') },
    },
    {
      id: 'c2',
      kg: null,
      createdAt: { toDate: () => new Date('2024-01-08T10:00:00Z') },
    },
  ];

  it('should render "No check-ins" message when array is empty', () => {
    render(<CheckinList checkins={[]} onSelectCheckin={mockOnSelectCheckin} />);
    expect(screen.getByText(/No check-ins found for this user/i)).toBeTruthy();
  });

  it('should render a list of check-ins', () => {
    render(<CheckinList checkins={mockCheckins} onSelectCheckin={mockOnSelectCheckin} />);
    
    expect(screen.getByText('Monday, January 1, 2024')).toBeTruthy();
    expect(screen.getByText('Weight: 80.5 kg')).toBeTruthy();
    
    expect(screen.getByText('Monday, January 8, 2024')).toBeTruthy();
    expect(screen.getByText('No weight recorded')).toBeTruthy();
  });

  it('should call onSelectCheckin when a check-in is clicked', () => {
    render(<CheckinList checkins={mockCheckins} onSelectCheckin={mockOnSelectCheckin} />);
    
    const firstCheckin = screen.getByText('Monday, January 1, 2024').closest('div[onClick]') || screen.getByText('Monday, January 1, 2024').parentElement?.parentElement?.parentElement;
    
    // The onClick is on the main wrapper div
    const checkinItem = screen.getByText('Monday, January 1, 2024').closest('.cursor-pointer');
    if (checkinItem) {
      fireEvent.click(checkinItem);
    }
    
    expect(mockOnSelectCheckin).toHaveBeenCalledWith('c1');
  });
});
