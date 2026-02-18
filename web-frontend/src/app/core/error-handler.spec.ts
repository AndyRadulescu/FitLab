import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleAuthErrors } from './error-handler'
import { AuthErrorCodes } from '@firebase/auth';

describe('handleAuthErrors', () => {
  const mockT = vi.fn((key: string) => key) as any;

  const alertSpy = vi.spyOn(window, 'alert').mockReturnValue();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should alert the "credential old" message when code is CREDENTIAL_TOO_OLD_LOGIN_AGAIN', () => {
    const mockError = { code: AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN } as any;
    handleAuthErrors(mockError, mockT);
    expect(mockT).toHaveBeenCalledWith('errors.credential.old');
    expect(alertSpy).toHaveBeenCalledWith('errors.credential.old');
  });

  it('should alert the "invalid credentials" message for INVALID_LOGIN_CREDENTIALS', () => {
    const mockError = { code: AuthErrorCodes.INVALID_LOGIN_CREDENTIALS } as any;
    handleAuthErrors(mockError, mockT);
    expect(mockT).toHaveBeenCalledWith('errors.credentials.invalid');
    expect(alertSpy).toHaveBeenCalledWith('errors.credentials.invalid');
  });

  it('should alert the "email already exists" message for EMAIL_EXISTS', () => {
    const mockError = { code: AuthErrorCodes.EMAIL_EXISTS } as any;
    handleAuthErrors(mockError, mockT);
    expect(mockT).toHaveBeenCalledWith('errors.email.alreadyExists');
    expect(alertSpy).toHaveBeenCalledWith('errors.email.alreadyExists');
  });

  it('should alert the "unknown error" message for unhandled error codes', () => {
    const mockError = { code: 'some-random-error' } as any;
    handleAuthErrors(mockError, mockT);
    expect(mockT).toHaveBeenCalledWith('errors.unknown');
    expect(alertSpy).toHaveBeenCalledWith('errors.unknown');
  });
});
