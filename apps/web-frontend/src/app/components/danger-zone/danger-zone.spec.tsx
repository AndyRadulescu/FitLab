import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DangerZone } from './danger-zone';
import { userStore } from '../../store/user.store';
import { deleteAccount } from '../../routes/profile/danger/delele-account';
import { isAuthSessionStale } from '../../core/auth-session';
import { assertAuthenticated } from '../../shared/user.guard';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../../routes/profile/danger/delele-account', () => ({
  deleteAccount: vi.fn(),
}));

vi.mock('../../core/auth-session', () => ({
  isAuthSessionStale: vi.fn(),
}));

vi.mock('../../shared/user.guard', () => ({
  assertAuthenticated: vi.fn(),
}));

describe('DangerZone', () => {
  const mockUser = { uid: 'user123' };
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (userStore as any).mockImplementation((selector: any) => 
      selector({ user: mockUser, setUser: mockSetUser })
    );
    vi.stubGlobal('confirm', vi.fn());
    vi.stubGlobal('prompt', vi.fn());
  });

  it('should render collapsed by default', () => {
    render(
      <MemoryRouter>
        <DangerZone />
      </MemoryRouter>
    );
    expect(screen.queryByText('profile.deleteAccount')).toBeNull();
  });

  it('should expand when header is clicked', () => {
    render(
      <MemoryRouter>
        <DangerZone />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/profile.danger/i));
    expect(screen.getAllByText('profile.deleteAccount').length).toBeGreaterThan(0);
  });

  it('should stop deletion if session is stale', async () => {
    (isAuthSessionStale as any).mockResolvedValue(true);
    
    render(
      <MemoryRouter>
        <DangerZone />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText(/profile.danger/i));
    const deleteBtn = screen.getByTestId('delete-account-button');
    fireEvent.click(deleteBtn);

    expect(assertAuthenticated).toHaveBeenCalled();
    expect(isAuthSessionStale).toHaveBeenCalled();
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('should proceed with deletion on user confirmation and correct prompt', async () => {
    (isAuthSessionStale as any).mockResolvedValue(false);
    (window.confirm as any).mockReturnValue(true);
    (window.prompt as any).mockReturnValue('delete account');
    (deleteAccount as any).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <DangerZone />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText(/profile.danger/i));
    const deleteBtn = screen.getByTestId('delete-account-button');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteAccount).toHaveBeenCalledWith('user123', expect.any(Function));
      expect(mockSetUser).toHaveBeenCalledWith(undefined);
    });
  });

  it('should NOT delete if user cancels confirmation', async () => {
    (isAuthSessionStale as any).mockResolvedValue(false);
    (window.confirm as any).mockReturnValue(false);

    render(
      <MemoryRouter>
        <DangerZone />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText(/profile.danger/i));
    const deleteBtn = screen.getByTestId('delete-account-button');
    fireEvent.click(deleteBtn);

    expect(deleteAccount).not.toHaveBeenCalled();
  });

  it('should NOT delete if user types wrong prompt text', async () => {
    (isAuthSessionStale as any).mockResolvedValue(false);
    (window.confirm as any).mockReturnValue(true);
    (window.prompt as any).mockReturnValue('wrong text');

    render(
      <MemoryRouter>
        <DangerZone />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText(/profile.danger/i));
    const deleteBtn = screen.getByTestId('delete-account-button');
    fireEvent.click(deleteBtn);

    expect(deleteAccount).not.toHaveBeenCalled();
  });
});
