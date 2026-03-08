import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../app';
import { Layout } from '../pages/layout';
import { ErrorPage } from '@my-org/shared-ui';
import { AuthPage } from './auth-page';
import { LoginPage, RegisterPage } from '@my-org/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/dashboard',
        element: <Layout />
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
    ]
  },
]);
