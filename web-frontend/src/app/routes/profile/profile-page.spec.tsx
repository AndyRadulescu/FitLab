/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { ProfilePage } from './profile-page';
import { auth, analytics } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

// State for mutable mock exports
const mockState = {
  analytics: {} as any,
};

// Top-level mocks (matching AuthPage pattern)
vi.mock('../../../init-firebase-auth', () => ({
  auth: {
    signOut: vi.fn(() => Promise.resolve()),
  },
  get analytics() { return mockState.analytics; },
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: any) => <span>{i18nKey}</span>,
}));

vi.mock('../../components/language-toggle/language-toggle', () => ({
  LanguageToggle: () => <div data-testid="language-toggle" />,
}));

vi.mock('../../components/danger-zone/danger-zone', () => ({
  DangerZone: () => <div data-testid="danger-zone" />,
}));

vi.mock('../../components/section-header', () => ({
  SectionHeader: ({ children }: any) => <div data-testid="section-header">{children}</div>,
}));

vi.mock('lucide-react', () => ({
  LogOutIcon: () => <div data-testid="logout-icon" />,
  Languages: () => <div data-testid="languages-icon" />,
}));

describe('ProfilePage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    mockState.analytics = { id: 'mock-analytics' }; // Default to non-null
  });

  afterEach(() => {
    cleanup();
  });

  it('should render correctly', () => {
    render(<ProfilePage />);
    
    expect(screen.getByTestId('section-header')).toHaveTextContent('profile.settings');
    expect(screen.getByText('profile.change.language')).toBeInTheDocument();
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    expect(screen.getByText('auth.signout')).toBeInTheDocument();
    expect(screen.getByTestId('danger-zone')).toBeInTheDocument();
  });

  it('should call signOut, log logout event and navigate to login on logout click', async () => {
    render(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /auth.signout/i });
    
    await act(async () => {
        fireEvent.click(logoutButton);
    });

    expect(auth.signOut).toHaveBeenCalled();
    expect(logEvent).toHaveBeenCalledWith(mockState.analytics, 'logout');
    
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
  });

  it('should still navigate even if analytics is null', async () => {
    mockState.analytics = null;

    render(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /auth.signout/i });
    
    await act(async () => {
        fireEvent.click(logoutButton);
    });

    expect(auth.signOut).toHaveBeenCalled();
    expect(logEvent).not.toHaveBeenCalled();
    
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
  });
});
