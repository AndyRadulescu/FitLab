import { ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'danger';
  disabled?: boolean;
};

export function Button({ children, type, disabled }: ButtonProps) {
  return (
    <button
      className={clsx(
        'w-full pointer py-3 px-4 rounded-full text-center transition-colors text-md',
        type === 'primary' && 'primary-gradient',
        type === 'secondary' && 'bg-secondary',
        type === 'tertiary' && 'bg-tertiary',
        type === 'danger' && 'hover:bg-red-700 border-red-700 border-1 bg-red-100 dark:bg-inherit',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        type === 'tertiary' ? 'text-gray-600 dark:text-gray-100' :
          type === 'danger' ? 'text-red-600 dark:text-red-500 hover:text-white' :
            'text-gray-800 dark:text-gray-100'
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
