import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../app';
import { Layout } from '../pages/layout';
import { ErrorPage } from '@my-org/shared-ui';

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
        path: '/',
        element: <Layout />
      }
    ]
  },
]);
