import ErrorPage from './error-page';
import { AuthPage } from './auth/auth-page';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../app';
import { isAuthenticated } from './auth/isAuthenticated';
import { LoginPage } from './auth/login-page';
import { RegisterPage } from './auth/register-page';
import { CheckInPage } from './checkIn/checkIn-page';
import { Dashboard } from './dashboard/dashboard';
import { ProfilePage } from './profile/profile-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: isAuthenticated,
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
      }
    ]
  }
]);
