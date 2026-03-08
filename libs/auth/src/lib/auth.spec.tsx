/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoginPage } from './login-page';
import { RegisterPage } from './register-page';
import { AuthPage } from './auth-page';
import { AuthProvider } from './types';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithRedirect, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signInWithRedirect: vi.fn(),
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  FacebookAuthProvider: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
  Trans: ({ i18nKey, children }: any) => <span>{children || i18nKey}</span>,
}));

// Mock shared-ui components
vi.mock('@my-org/shared-ui', () => ({
  Input: vi.fn(({ placeholder, type, error, ...props }: any) => (
    <div>
      <input placeholder={placeholder} type={type} {...props} />
      {error && <span>{error}</span>}
    </div>
  )),
  Button: ({ children, disabled, onClick, buttonType }: any) => (
    <button disabled={disabled} onClick={onClick} type={buttonType}>{children}</button>
  ),
  Card: ({ children }: any) => <div>{children}</div>,
  SocialButton: ({ socialType, onClick }: any) => (
    <button data-testid={`social-${socialType}`} onClick={onClick}>{socialType}</button>
  ),
  LanguageToggle: () => <div data-testid="language-toggle" />,
}));

const mockAuth = { languageCode: '' } as any;
const mockAnalytics = {} as any;
const mockHandleAuthErrors = vi.fn();

describe('Auth Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  describe('LoginPage', () => {
    const renderLoginPage = () => render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth} analytics={mockAnalytics} handleAuthErrors={mockHandleAuthErrors} redirectPath="/">
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    it('should render login form', () => {
      renderLoginPage();
      expect(screen.getByPlaceholderText('auth.email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('auth.password')).toBeInTheDocument();
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it('should call signInWithEmailAndPassword on submit', async () => {
      (signInWithEmailAndPassword as any).mockResolvedValue({});
      renderLoginPage();

      fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('auth.password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText(/Login/i));

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123');
      });
    });
  });

  describe('RegisterPage', () => {
    const renderRegisterPage = () => render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth} analytics={mockAnalytics} handleAuthErrors={mockHandleAuthErrors} redirectPath="/">
          <RegisterPage />
        </AuthProvider>
      </MemoryRouter>
    );

    it('should render register form', () => {
      renderRegisterPage();
      expect(screen.getByPlaceholderText('auth.email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('auth.password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('auth.confirm-password')).toBeInTheDocument();
    });

    it('should call createUserWithEmailAndPassword on submit', async () => {
      (createUserWithEmailAndPassword as any).mockResolvedValue({});
      renderRegisterPage();

      fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('auth.password'), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByPlaceholderText('auth.confirm-password'), { target: { value: 'Password123!' } });
      fireEvent.click(screen.getByText(/Register/i));

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'Password123!');
      });
    });
  });

  describe('AuthPage', () => {
    it('should render social buttons and language toggle', () => {
      render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={
              <AuthPage 
                user={null} 
                auth={mockAuth} 
                analytics={mockAnalytics} 
                handleAuthErrors={mockHandleAuthErrors} 
                redirectPath="/dashboard" 
              />
            } />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('social-google')).toBeInTheDocument();
      expect(screen.getByTestId('social-facebook')).toBeInTheDocument();
      expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
    });

    it('should call signInWithRedirect when social button clicked', () => {
      render(
        <MemoryRouter>
          <AuthPage 
            user={null} 
            auth={mockAuth} 
            analytics={mockAnalytics} 
            handleAuthErrors={mockHandleAuthErrors} 
            redirectPath="/dashboard" 
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('social-google'));
      expect(signInWithRedirect).toHaveBeenCalled();
      expect(logEvent).toHaveBeenCalledWith(mockAnalytics, 'google-login');
    });
  });
});
