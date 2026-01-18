import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './design/navbar';

export function App() {
  const { t } = useTranslation(); // don't remove this; used to init i18n

  return (
    <div className="m-4 pb-[90px]">
      <Outlet />
      <Navbar />
    </div>
  );
}

export default App;
