import { AuthErrorCodes, AuthError } from 'firebase/auth';
import { TFunction } from 'i18next';

export const handleAuthErrors = (err: AuthError, translator: TFunction<'translation', unknown>) => {
  switch (err.code) {
    case AuthErrorCodes.NEED_CONFIRMATION:
      return alert(translator('errors.credentials.exists'));
    case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
      return alert(translator('errors.credentials.invalid'));
    case AuthErrorCodes.EMAIL_EXISTS:
      return alert(translator('errors.email.alreadyExists'));
    case AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
      return alert(translator('errors.credential.old'))
    default:
      alert(translator('errors.unknown'));
  }
};
