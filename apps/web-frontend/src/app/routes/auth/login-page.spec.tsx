/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoginPage } from './login-page';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { handleAuthErrors } from '@my-org/core';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
}));

vi.mock('../../../init-firebase-auth', () => ({
  auth: {},
  analytics: {},
}));

vi.mock('@my-org/core', () => ({
  handleAuthErrors: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  Eye: ({ size }: any) => <span aria-label="eye" data-size={size}>Eye</span>,
  EyeOff: ({ size }: any) => <span aria-label="eye-off" data-size={size}>EyeOff</span>,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey, children }: any) => <span>{children || i18nKey}</span>,
}));

// Mock components that might be problematic in jsdom if they use complex styles or icons
vi.mock('../../components/design/input', () => ({
  Input: vi.fn(({ placeholder, type, error, ...props }: any) => (
    <div>
      <input placeholder={placeholder} type={type} {...props} />
      {error && <span>{error}</span>}
    </div>
  )),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  it('should render login form correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('auth.email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('auth.password')).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password?/i)).toBeInTheDocument();
  });

  it('should call signInWithEmailAndPassword on form submit with valid data', async () => {
    (signInWithEmailAndPassword as any).mockResolvedValue({});
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('auth.password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
      expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'email-password-login');
    });
  });

  it('should handle login errors', async () => {
    const error = new Error('Login failed');
    (signInWithEmailAndPassword as any).mockRejectedValue(error);
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('auth.password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(handleAuthErrors).toHaveBeenCalledWith(error, expect.any(Function));
    });
  });

  it('should call sendPasswordResetEmail when forgot password is clicked with valid email', async () => {
    (sendPasswordResetEmail as any).mockResolvedValue({});
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/Forgot Password?/i));

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
      expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'forgot-password');
      expect(window.alert).toHaveBeenCalledWith('auth.forgot.emailSent');
    });
  });

  it('should not call sendPasswordResetEmail if email is invalid', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText(/Forgot Password?/i));

    await waitFor(() => {
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(screen.getByText('errors.email.invalid')).toBeInTheDocument();
    });
  });

  it('should handle errors when sendPasswordResetEmail fails', async () => {
    const error = new Error('Reset failed');
    (sendPasswordResetEmail as any).mockRejectedValue(error);
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/Forgot Password?/i));

    await waitFor(() => {
      expect(handleAuthErrors).toHaveBeenCalledWith(error, expect.any(Function));
    });
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('auth.password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button (it's the one with Eye/EyeOff icon)
    const toggleButton = screen.getByLabelText('eye').closest('button')!;
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('eye-off')).toBeInTheDocument();

    // Click to hide
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('eye')).toBeInTheDocument();
  });
});
