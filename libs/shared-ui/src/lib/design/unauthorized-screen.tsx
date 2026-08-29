import React, { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './button';
import { Trans } from 'react-i18next';
import clsx from 'clsx';

export interface UnauthorizedScreenProps {
  title?: string;
  description?: ReactNode;
  onLogout?: () => void;
  logoutButtonText?: string;
  className?: string;
  fullScreen?: boolean;
}

export function UnauthorizedScreen({
  title = 'Coach Privileges Required',
  description,
  onLogout,
  logoutButtonText,
  className = '',
  fullScreen = true,
}: UnauthorizedScreenProps) {
  const containerClasses = clsx(
    'flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-950',
    fullScreen ? 'min-h-screen' : 'w-full h-full min-h-[400px]',
    className
  );

  return (
    <div className={containerClasses} data-testid="unauthorized-screen">
      <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-500/20 shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-2">
          {title}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {description || (
            <p>
              This portal is restricted to coaches and administrators. Your account does not currently have coach privileges enabled.
            </p>
          )}
        </div>
        {onLogout && (
          <div className="flex justify-center gap-3">
            <Button
              type="secondary"
              buttonType="button"
              onClick={onLogout}
              className="!w-auto text-sm py-2 px-6"
            >
              {logoutButtonText || <Trans i18nKey="auth.logout" defaultValue="Sign Out">Sign Out</Trans>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
