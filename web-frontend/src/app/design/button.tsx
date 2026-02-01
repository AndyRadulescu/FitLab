import { ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  type: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
};


export function Button({ children, type, disabled }: ButtonProps) {
  return (
    <button
      className={clsx('w-full pointer py-3 px-4 rounded-full text-center',
        type === 'primary' ? 'primary-gradient' : type === 'secondary' ? 'bg-secondary' : 'bg-tertiary',
        disabled ? 'opacity-50 cursor-not-allowed' : '')}
      disabled={disabled}>
      <h1 className={clsx(
        type === 'tertiary' ? 'text-gray-600 dark:text-gray-100' : 'text-gray-800 dark:text-gray-100')}>
        {children}
      </h1>
    </button>
  );
}
