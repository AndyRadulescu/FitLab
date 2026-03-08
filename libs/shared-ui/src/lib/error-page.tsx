import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error) ? error.statusText : 'Unknown Error';

  return (
    <div id="error-page" className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Oops!</h1>
      <p className="text-lg text-gray-700 dark:text-gray-400 mb-2">Sorry, an unexpected error has occurred.</p>
      <p className="text-sm italic text-gray-500">
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
