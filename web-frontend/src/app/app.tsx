import { useTranslation } from 'react-i18next';
import { Main } from './routes/main';
import { StartPage } from './routes/start-page/start-page';
import { AnalyticsTracker } from './analytics-tracker';
import { useAppInitialization } from './custom-hooks/use-app-initialization';

export function App() {
  useTranslation(); // don't remove this; used to init i18n
  const { isLoading, hasInitData } = useAppInitialization();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!hasInitData) {
    return <StartPage />;
  }
  return (
    <>
      <AnalyticsTracker />
      <div className="lg:mx-[10%] xl:mx-[20%]">
        <Main />
      </div>
    </>
  );
}

export default App;
