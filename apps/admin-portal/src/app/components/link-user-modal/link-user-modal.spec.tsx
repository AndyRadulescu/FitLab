import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LinkUserModal } from './link-user-modal';
import { userStore } from '../../store/user.store';

// Mock queries
vi.mock('../../firestore/queries', () => ({
  fetchUserInfo: vi.fn(),
  fetchCheckins: vi.fn(),
  fetchWeights: vi.fn(),
  linkClient: vi.fn(),
}));

vi.mock('@my-org/shared-ui', async () => {
  const actual = await vi.importActual('@my-org/shared-ui');
  return {
    ...actual,
    Modal: ({ children, isOpen }: any) => (isOpen ? <div data-testid="modal">{children}</div> : null),
  };
});

vi.mock('../../store/user.store', () => ({
  userStore: vi.fn(),
}));


describe('LinkUserModal', () => {
  const mockOnClose = vi.fn();
  const mockAddUserToList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userStore).mockImplementation((selector: any) =>
      selector({
        addUserToList: mockAddUserToList,
      })
    );
  });

  it('should render modal content when isOpen is true', () => {
    render(<LinkUserModal isOpen={true} onClose={mockOnClose} coachId="coach123" />);

    expect(screen.getByText('Link New Client')).toBeTruthy();
    expect(screen.getByLabelText(/User ID/i)).toBeTruthy();
    expect(screen.getByText('Link Client')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(<LinkUserModal isOpen={true} onClose={mockOnClose} coachId="coach123" />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show error when user is not found in Firestore', async () => {
    const { fetchUserInfo } = await import('../../firestore/queries');
    vi.mocked(fetchUserInfo).mockResolvedValue(null);

    render(<LinkUserModal isOpen={true} onClose={mockOnClose} coachId="coach123" />);

    const input = screen.getByLabelText(/User ID/i);
    fireEvent.change(input, { target: { value: 'non-existent-user' } });

    const submitButton = screen.getByText('Link Client');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchUserInfo).toHaveBeenCalledWith('non-existent-user');
      expect(screen.getByText(/User not found with this ID/i)).toBeTruthy();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('should successfully link user when user exists', async () => {
    const mockUser = {
      id: 'client123',
      userId: 'client123',
      displayName: 'Alice Johnson',
      email: 'alice@example.com',
    } as any;
    const mockCheckins = [{ id: 'c1', note: 'Good week' }] as any;
    const mockWeights = [{ id: 'w1', weight: 65 }] as any;

    const { fetchUserInfo, linkClient, fetchCheckins, fetchWeights } = await import(
      '../../firestore/queries'
    );
    vi.mocked(fetchUserInfo).mockResolvedValue(mockUser);
    vi.mocked(linkClient).mockResolvedValue(undefined);
    vi.mocked(fetchCheckins).mockResolvedValue(mockCheckins);
    vi.mocked(fetchWeights).mockResolvedValue(mockWeights);

    render(<LinkUserModal isOpen={true} onClose={mockOnClose} coachId="coach123" />);

    const input = screen.getByLabelText(/User ID/i);
    fireEvent.change(input, { target: { value: 'client123' } });

    const submitButton = screen.getByText('Link Client');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchUserInfo).toHaveBeenCalledWith('client123');
      expect(linkClient).toHaveBeenCalledWith('coach123', 'client123');
      expect(fetchCheckins).toHaveBeenCalledWith('client123');
      expect(fetchWeights).toHaveBeenCalledWith('client123');
      expect(mockAddUserToList).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'client123',
          connectionStatus: 'active',
          checkins: mockCheckins,
          weights: mockWeights,
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
