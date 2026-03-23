import { Loader2 } from 'lucide-react';
import { Trans } from 'react-i18next';

export interface LoadingScreenProps {
  fullScreen?: boolean;
}

export function LoadingScreen({ fullScreen = true }: LoadingScreenProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gray-500/20 animate-ping duration-1000 scale-150" />

        <div className="relative bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
          <Loader2 className="w-10 h-10 text-gray-500 primary-text-dark animate-spin" />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-gray-100 uppercase">
          <Trans i18nKey="common.loading" defaultValue="Loading">Loading</Trans>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          <Trans i18nKey="common.pleaseWait" defaultValue="Please wait..." >Please wait...</Trans>
        </p>
      </div>
    </div>
  );
}
