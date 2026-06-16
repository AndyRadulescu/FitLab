import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnlinkUserButton } from './unlink-user-button';
import { userStore } from '../store/user.store';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../firestore/queries', () => ({
  unlinkClient: vi.fn(),
}));

describe('UnlinkUserButton', () => {
  const mockRemoveUserFromList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userStore).mockImplementation((selector: any) => 
      selector({ 
        removeUserFromList: mockRemoveUserFromList,
        user: { uid: 'coach123' }
      })
    );
  });

  it('should render the unlink button', () => {
    render(<UnlinkUserButton userId="123" displayName="John Doe" />);
    expect(screen.getByText(/Unlink User/i)).toBeTruthy();
  });

  it('should call unlinkClient and removeUserFromList when clicked and confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { unlinkClient } = await import('../firestore/queries');
    vi.mocked(unlinkClient).mockResolvedValue(undefined);
    
    render(<UnlinkUserButton userId="123" displayName="John Doe" />);

    const unlinkButton = screen.getByText(/Unlink User/i);
    fireEvent.click(unlinkButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('John Doe'));
      expect(unlinkClient).toHaveBeenCalledWith('coach123', '123');
      expect(mockRemoveUserFromList).toHaveBeenCalledWith('123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not call unlinkClient if not confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { unlinkClient } = await import('../firestore/queries');
    
    render(<UnlinkUserButton userId="123" displayName="John Doe" />);

    const unlinkButton = screen.getByText(/Unlink User/i);
    fireEvent.click(unlinkButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(unlinkClient).not.toHaveBeenCalled();
    expect(mockRemoveUserFromList).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
