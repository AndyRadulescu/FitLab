import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  className?: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  buttonType?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
}

export function Button({ children, type, disabled, onClick, buttonType, className, icon, ...rest }: ButtonProps) {
  return (
    <button
      type={buttonType}
      onClick={onClick}
      className={clsx(
        'w-full pointer py-3 px-4 rounded-full text-center transition-all duration-200 font-bold text-lg flex items-center justify-center gap-2',
        type === 'primary' && 'primary-gradient hover:shadow-lg',
        type === 'secondary' && 'bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700',
        type === 'tertiary' && 'primary-text-gradient',
        type === 'danger' && 'hover:bg-red-700 border-red-700 border-1 bg-red-100 dark:bg-inherit',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        type === 'tertiary' ? 'text-gray-600 dark:text-gray-100' :
          type === 'danger' ? 'text-red-600 dark:text-red-500 hover:text-white' :
            type === 'secondary' ? 'text-gray-700 dark:text-gray-400' :
              'text-gray-800 dark:text-gray-950',
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
