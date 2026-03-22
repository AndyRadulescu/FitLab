import { StrictMode, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { router } from './app/routes/router';
import { initFirebaseAuth } from './init-firebase-auth';
import './i18n';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import { LoadingScreen } from '@my-org/shared-ui';

import { setupGlobalErrorHandlers } from './app/core/error-logger';
import { GlobalErrorBoundary } from './app/core/global-error-boundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

await initFirebaseAuth();
setupGlobalErrorHandlers();

root.render(
  <StrictMode>
    <GlobalErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </GlobalErrorBoundary>
  </StrictMode>
);

serviceWorkerRegistration.register();
