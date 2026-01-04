import ErrorPage from './error-page';
import { AuthPage } from './auth/auth-page';
import { createBrowserRouter } from 'react-router-dom';
import App from '../app';
import { isAuthenticated } from './isAuthenticated';
import { LoginPage } from './auth/login-page';
import { RegisterPage } from './auth/register-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: isAuthenticated,
    errorElement: <ErrorPage />
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
