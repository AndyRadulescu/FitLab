import { Trans } from 'react-i18next';

export function Dashboard() {
  return <div className="h-svh flex justify-center items-center">
    <p><Trans i18nKey="dashboard.nothingYet">Noting to show yet</Trans></p>
  </div>;
}
