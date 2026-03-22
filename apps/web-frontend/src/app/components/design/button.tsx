import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  className?: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  buttonType?: 'button' | 'submit' | 'reset';
}

export function Button({ children, type, disabled, onClick, buttonType, className, ...rest }: ButtonProps) {
  return (
    <button
      type={buttonType}
      onClick={onClick}
      className={clsx(
        'w-full pointer py-3 px-4 rounded-full text-center transition-colors font-bold text-lg',
        type === 'primary' && 'primary-gradient',
        type === 'secondary' && 'bg-secondary',
        type === 'tertiary' && 'primary-text-gradient',
        type === 'danger' && 'hover:bg-red-700 border-red-700 border-1 bg-red-100 dark:bg-inherit',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        type === 'tertiary' ? 'text-gray-600 dark:text-gray-100' :
          type === 'danger' ? 'text-red-600 dark:text-red-500 hover:text-white' :
            'text-gray-800 dark:text-gray-950',
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
