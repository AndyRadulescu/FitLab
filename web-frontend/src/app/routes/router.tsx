import ErrorPage from './error-page';
import { LoginPage } from './login/login-page';
import { createBrowserRouter } from 'react-router-dom';
import App from '../app';
import { isAuthenticated } from './isAuthenticated';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    loader: isAuthenticated,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
]);
