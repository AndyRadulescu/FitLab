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
        type === 'primary' ? 'bg-primary' : type === 'secondary' ? 'bg-secondary' : 'bg-tertiary',
        disabled ? 'opacity-50 cursor-not-allowed' : '')}
      disabled={disabled}>
      <h1 className={clsx(
        type === 'tertiary' ? 'text-gray-600' : 'bg-gradient-to-r from-orange-300 via-orange-100 to-orange-300 bg-clip-text text-transparent')}>
        {children}
      </h1>
    </button>
  );
}
