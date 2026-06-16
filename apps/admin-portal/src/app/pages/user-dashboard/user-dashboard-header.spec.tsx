import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserDashboardHeader } from './user-dashboard-header';
import { userStore } from '../../store/user.store';

// Mock dependencies
vi.mock('../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../../firestore/queries', () => ({
  updateUserName: vi.fn(),
}));

describe('UserDashboardHeader', () => {
  const mockOnBack = vi.fn();
  const mockUpdateUserInList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the mock for userStore selector
    vi.mocked(userStore).mockImplementation((selector: any) =>
      selector({ updateUserInList: mockUpdateUserInList })
    );
  });

  it('should render user displayName when available', () => {
    const user = { userId: '123', displayName: 'John Doe', email: 'john@example.com' } as any;
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText(/Dashboard of/i)).toBeTruthy();
    expect(screen.getAllByText('john@example.com').length).toBeGreaterThan(0);
    expect(screen.getByText('123')).toBeTruthy();
  });

  it('should render email as title when displayName is missing', () => {
    const user = { userId: '123', email: 'john@example.com' } as any;
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.getAllByText('john@example.com').length).toBeGreaterThan(0);
    expect(screen.getByText(/Dashboard of/i)).toBeTruthy();
  });

  it('should render "User" as title when both displayName and email are missing', () => {
    const user = { userId: '123' } as any;
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.getByText(/^User$/)).toBeTruthy();
    expect(screen.getByText(/Dashboard of/i)).toBeTruthy();
  });

  it('should call onBack when back button is clicked', () => {
    const user = { userId: '123' } as any;
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should not render email section if email is missing', () => {
    const user = { userId: '123' } as any;
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.queryByText('Email:')).toBeNull();
  });

  it('should not render ID section if userId is missing', () => {
    const user = { email: 'john@example.com' } as any;
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.queryByText('User ID:')).toBeNull();
  });
});
