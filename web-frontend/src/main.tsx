import { StrictMode, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { router } from './app/routes/router';
import { initFirebaseAuth } from './init-firebase-auth';
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

await initFirebaseAuth();

root.render(
  <StrictMode>
    <Suspense fallback="loading...">
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
