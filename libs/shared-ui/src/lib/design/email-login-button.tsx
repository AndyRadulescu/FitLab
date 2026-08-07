import { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import { Button } from './button';

export type EmailLoginButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  buttonType?: 'button' | 'submit' | 'reset';
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function EmailLoginButton({
  disabled,
  onClick,
  buttonType = 'submit',
  badge,
  children,
  className,
}: EmailLoginButtonProps) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      type="primary"
      buttonType={buttonType}
      className={className}
      badge={badge}
    >
      {children || <Trans i18nKey="auth.login">Login</Trans>}
    </Button>
  );
}
