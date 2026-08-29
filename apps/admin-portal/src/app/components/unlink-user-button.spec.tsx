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
  linkClient: vi.fn(),
}));

describe('UnlinkUserButton', () => {
  const mockUpdateUserInList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userStore).mockImplementation((selector: any) => 
      selector({ 
        updateUserInList: mockUpdateUserInList,
        user: { uid: 'coach123' }
      })
    );
  });

  it('should render the unlink button for active client', () => {
    render(<UnlinkUserButton userId="123" displayName="John Doe" connectionStatus="active" />);
    expect(screen.getByText(/Unlink User/i)).toBeTruthy();
  });

  it('should render the link button for unlinked client', () => {
    render(<UnlinkUserButton userId="123" displayName="John Doe" connectionStatus="unlinked" />);
    expect(screen.getByText(/Link User/i)).toBeTruthy();
  });

  it('should call unlinkClient and updateUserInList when unlink is clicked and confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { unlinkClient } = await import('../firestore/queries');
    vi.mocked(unlinkClient).mockResolvedValue(undefined);
    
    render(<UnlinkUserButton userId="123" displayName="John Doe" connectionStatus="active" />);

    const unlinkButton = screen.getByText(/Unlink User/i);
    fireEvent.click(unlinkButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('John Doe'));
      expect(unlinkClient).toHaveBeenCalledWith('coach123', '123');
      expect(mockUpdateUserInList).toHaveBeenCalledWith('123', { connectionStatus: 'unlinked' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not call unlinkClient if not confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { unlinkClient } = await import('../firestore/queries');
    
    render(<UnlinkUserButton userId="123" displayName="John Doe" connectionStatus="active" />);

    const unlinkButton = screen.getByText(/Unlink User/i);
    fireEvent.click(unlinkButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(unlinkClient).not.toHaveBeenCalled();
    expect(mockUpdateUserInList).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should call linkClient and updateUserInList when link is clicked and confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { linkClient } = await import('../firestore/queries');
    vi.mocked(linkClient).mockResolvedValue(undefined);
    
    render(<UnlinkUserButton userId="123" displayName="John Doe" connectionStatus="unlinked" />);

    const linkButton = screen.getByText(/Link User/i);
    fireEvent.click(linkButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('John Doe'));
      expect(linkClient).toHaveBeenCalledWith('coach123', '123');
      expect(mockUpdateUserInList).toHaveBeenCalledWith('123', { connectionStatus: 'active' });
    });
  });
});

