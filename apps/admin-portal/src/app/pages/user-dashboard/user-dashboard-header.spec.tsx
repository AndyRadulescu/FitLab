import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserDashboardHeader } from './user-dashboard-header';
import { userStore } from '../../store/user.store';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../../firestore/queries', () => ({
  updateUserName: vi.fn(),
  unlinkClient: vi.fn(),
}));

describe('UserDashboardHeader', () => {
  const mockOnBack = vi.fn();
  const mockUpdateUserInList = vi.fn();
  const mockRemoveUserFromList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the mock for userStore selector
    vi.mocked(userStore).mockImplementation((selector: any) => 
      selector({ 
        updateUserInList: mockUpdateUserInList,
        removeUserFromList: mockRemoveUserFromList,
        user: { uid: 'coach123' }
      })
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

  it('should call unlinkClient and removeUserFromList when Unlink button is clicked and confirmed', async () => {
    const user = { userId: '123', displayName: 'John Doe' } as any;
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { unlinkClient } = await import('../../firestore/queries');
    vi.mocked(unlinkClient).mockResolvedValue(undefined);
    
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    const unlinkButton = screen.getByText(/Unlink User/i);
    fireEvent.click(unlinkButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(unlinkClient).toHaveBeenCalledWith('coach123', '123');
      expect(mockRemoveUserFromList).toHaveBeenCalledWith('123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});