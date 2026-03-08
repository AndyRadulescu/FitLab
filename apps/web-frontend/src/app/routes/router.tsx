import { ErrorPage } from '@my-org/shared-ui';
import { AuthPage } from './auth/auth-page';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../app';
import { isAuthenticated } from '@my-org/core';
import { LoginPage, RegisterPage } from '@my-org/auth';
import { CheckInPage } from './checkIn/checkIn-page';
import { Dashboard } from './dashboard/dashboard';
import { ProfilePage } from './profile/profile-page';
import { userStore } from '../store/user.store';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: () => isAuthenticated(!!userStore.getState().user),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/check-in',
        element: <CheckInPage />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthPage />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        index: true,
        element: <Navigate to="/auth/login" replace />
      }
    ]
  }
]);
