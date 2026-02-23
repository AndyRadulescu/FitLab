import { NavigateFunction, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';

export function assertAuthenticated(
  navigate: NavigateFunction,
  user?: firebase.User
): asserts user is firebase.User & { uid: string } {

  if (!user || !user.uid) {
    navigate('/auth/login', { replace: true });
    throw new Error('Auth Assertion Failed: Redirecting to login.');
  }
}

export function useRequireAuth(user?: firebase.User): asserts user is firebase.User {
  const navigate = useNavigate();

  assertAuthenticated(navigate, user);
}
