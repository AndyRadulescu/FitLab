import { StrictMode, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { initFirebaseAuth } from './init-firebase-auth';
import { router } from './app/routes/router';
import './i18n';
import './styles.scss';
import { LoadingScreen } from '@my-org/shared-ui';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

await initFirebaseAuth();

root.render(
  <StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
);
