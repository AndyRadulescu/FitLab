import { Main } from './routes/main';
import { StartPage } from './routes/start-page/start-page';
import { AnalyticsTracker } from './analytics-tracker';
import { useAppInitialization } from './custom-hooks/use-app-initialization';
import { useHtmlLang } from './custom-hooks/use-html-lang';
import { LoadingScreen } from '@my-org/shared-ui';

export function App() {
  useHtmlLang();
  const { isLoading, hasInitData } = useAppInitialization();
  if (isLoading) {
    return <LoadingScreen />;
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
