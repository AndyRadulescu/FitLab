import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteUserModal } from './delete-user-modal';
import { deleteUserByAdmin } from '../../firestore/queries';

// Mock queries
vi.mock('../../firestore/queries', () => ({
  deleteUserByAdmin: vi.fn(),
}));

vi.mock('@my-org/shared-ui', async () => {
  const actual = await vi.importActual('@my-org/shared-ui');
  return {
    ...actual,
    Modal: ({ children, isOpen }: any) => (isOpen ? <div data-testid="modal">{children}</div> : null),
  };
});

describe('DeleteUserModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal content when isOpen is true', () => {
    render(
      <DeleteUserModal
        isOpen={true}
        onClose={mockOnClose}
        userId="user-123"
        displayName="John Doe"
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Delete User Account')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('This action cannot be undone')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <DeleteUserModal
        isOpen={true}
        onClose={mockOnClose}
        userId="user-123"
        displayName="John Doe"
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call deleteUserByAdmin and onSuccess when Delete User button is clicked', async () => {
    vi.mocked(deleteUserByAdmin).mockResolvedValue(undefined);

    render(
      <DeleteUserModal
        isOpen={true}
        onClose={mockOnClose}
        userId="user-123"
        displayName="John Doe"
        onSuccess={mockOnSuccess}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete user/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteUserByAdmin).toHaveBeenCalledWith('user-123');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should display error message if deleteUserByAdmin fails', async () => {
    vi.mocked(deleteUserByAdmin).mockRejectedValue(new Error('Firebase deletion failed'));

    render(
      <DeleteUserModal
        isOpen={true}
        onClose={mockOnClose}
        userId="user-123"
        displayName="John Doe"
        onSuccess={mockOnSuccess}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete user/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteUserByAdmin).toHaveBeenCalledWith('user-123');
      expect(screen.getByText(/Failed to delete user: Firebase deletion failed/i)).toBeTruthy();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
