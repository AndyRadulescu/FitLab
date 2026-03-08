import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../app';
import { Layout } from '../pages/layout';
import { ErrorPage } from '@my-org/shared-ui';
import { AuthPage } from './auth-page';
import { LoginPage, RegisterPage } from '@my-org/auth';
import { isAuthenticated } from '@my-org/core';
import { userStore } from '../store/user.store';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: () => isAuthenticated(!!userStore.getState().user),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/dashboard',
        element: <Layout />
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
