import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../app';
import { Layout } from '../pages/layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
