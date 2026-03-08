import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { initFirebaseAuth } from './init-firebase-auth';
import { router } from './app/routes/router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

await initFirebaseAuth();

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
