import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { router } from './app/routes/router';
import { initFirebaseAuth } from './init-firebase-auth';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

await initFirebaseAuth();

root.render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
