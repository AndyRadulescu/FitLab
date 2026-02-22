/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { AuthPage } from './auth-page';
import { userStore } from '../../store/user.store';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { handleAuthErrors } from '../../core/error-handler';
import { useLocation, Navigate } from 'react-router-dom';
import { auth } from '../../../init-firebase-auth';
import '@testing-library/jest-dom/vitest';

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  FacebookAuthProvider: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
}));

vi.mock('../../../init-firebase-auth', () => ({
  auth: { languageCode: '' },
  analytics: {},
}));

vi.mock('../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
    Navigate: vi.fn(() => <div data-testid="navigate" />),
    Outlet: () => <div data-testid="outlet" />,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
  Trans: ({ i18nKey, children }: any) => <span>{children || i18nKey}</span>,
}));

vi.mock('../../components/design/social-button', () => ({
  SocialButton: ({ socialType }: any) => <div data-testid={`social-button-${socialType}`} />,
}));

vi.mock('../../components/language-toggle', () => ({
  LanguageToggle: () => <div data-testid="language-toggle" />,
}));

vi.mock('../../analytics-tracker', () => ({
  AnalyticsTracker: () => <div data-testid="analytics-tracker" />,
}));

vi.mock('../../core/error-handler', () => ({
  handleAuthErrors: vi.fn(),
}));

vi.mock('../../custom-hooks/use-html-lang', () => ({
  useHtmlLang: vi.fn(),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLocation as Mock).mockReturnValue({ pathname: '/auth' });
    (userStore as unknown as Mock).mockImplementation((selector: any) => selector({ user: null }));
  });

  afterEach(() => {
    cleanup();
  });

  it('should render correctly', () => {
    render(<AuthPage />);
    expect(screen.getByTestId('analytics-tracker')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByTestId('social-button-google')).toBeInTheDocument();
    expect(screen.getByTestId('social-button-facebook')).toBeInTheDocument();
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('should redirect to "/" if user is already logged in', () => {
    (userStore as unknown as Mock).mockImplementation((selector: any) => selector({ user: { uid: '123' } }));
    render(<AuthPage />);
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/',
        replace: true,
        state: { from: { pathname: '/auth' } }
      }),
      undefined
    );
  });

  it('should call signInWithPopup with Google provider when Google button is clicked', async () => {
    (signInWithPopup as Mock).mockResolvedValue({});
    render(<AuthPage />);

    const googleButton = screen.getByTestId('social-button-google').parentElement!;
    fireEvent.click(googleButton);

    expect(auth.languageCode).toBe('en');
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'google-login');
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.any(GoogleAuthProvider));
  });

  it('should call signInWithPopup with Facebook provider when Facebook button is clicked', async () => {
    (signInWithPopup as Mock).mockResolvedValue({});
    render(<AuthPage />);

    const facebookButton = screen.getByTestId('social-button-facebook').parentElement!;
    fireEvent.click(facebookButton);

    expect(auth.languageCode).toBe('en');
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'facebook-login');
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.any(FacebookAuthProvider));
  });

  it('should handle errors when signInWithPopup fails', async () => {
    const error = new Error('Auth failed');
    (signInWithPopup as Mock).mockRejectedValue(error);
    render(<AuthPage />);

    const googleButton = screen.getByTestId('social-button-google').parentElement!;
    fireEvent.click(googleButton);

    // Wait for the promise to reject
    await vi.waitFor(() => {
        expect(handleAuthErrors).toHaveBeenCalledWith(error, expect.any(Function));
    });
  });
});
