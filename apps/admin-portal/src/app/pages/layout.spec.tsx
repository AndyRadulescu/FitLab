import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Layout } from './layout';
import { useFetchClients } from '../hooks/useFetchClients';
import { userStore } from '../store/user.store';
import { signOut } from 'firebase/auth';

vi.mock('../hooks/useFetchClients', () => ({
  useFetchClients: vi.fn(),
}));

vi.mock('../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet">Dashboard Content</div>,
  useNavigate: () => vi.fn(),
}));

vi.mock('react-i18next', () => ({
  Trans: ({ children, defaultValue }: any) => defaultValue || children || null,
}));


vi.mock('@my-org/shared-ui', async () => {
  const actual = await vi.importActual('@my-org/shared-ui');
  return {
    ...actual,
    LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
  };
});

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userStore).mockImplementation((selector: any) =>
      selector({ user: { uid: 'coach123' } })
    );
  });

  it('should render loading screen when loading is true', () => {
    vi.mocked(useFetchClients).mockReturnValue({
      loading: true,
      error: null,
      isUnauthorized: false,
    });

    render(<Layout />);
    expect(screen.getByTestId('loading-screen')).toBeTruthy();
  });

  it('should render UnauthorizedScreen when isUnauthorized is true', () => {
    vi.mocked(useFetchClients).mockReturnValue({
      loading: false,
      error: null,
      isUnauthorized: true,
    });

    render(<Layout />);
    expect(screen.getByTestId('unauthorized-screen')).toBeTruthy();
    expect(screen.getByText('Coach Privileges Required')).toBeTruthy();
  });

  it('should call signOut when Logout is clicked in UnauthorizedScreen', async () => {
    vi.mocked(useFetchClients).mockReturnValue({
      loading: false,
      error: null,
      isUnauthorized: true,
    });

    render(<Layout />);
    const signOutBtn = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(signOutBtn);

    expect(signOut).toHaveBeenCalled();
  });

  it('should render error screen when error is present', () => {
    vi.mocked(useFetchClients).mockReturnValue({
      loading: false,
      error: 'Network connection failed',
      isUnauthorized: false,
    });

    render(<Layout />);
    expect(screen.getByText('Initialization Error')).toBeTruthy();
    expect(screen.getByText('Network connection failed')).toBeTruthy();
  });

  it('should render main layout and outlet when authorized and loaded', () => {
    vi.mocked(useFetchClients).mockReturnValue({
      loading: false,
      error: null,
      isUnauthorized: false,
    });

    render(<Layout />);
    expect(screen.getByText('Admin Portal')).toBeTruthy();
    expect(screen.getByTestId('outlet')).toBeTruthy();
  });
});
