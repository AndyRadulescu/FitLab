import { forwardRef, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className={'mb-4'}>
        {label && <label className="block text-gold-700 dark:text-gray-100 text-sm font-bold mb-2">{label}</label>}
        <input
          className={`appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline border-top border-gray-400
           + ${error ? 'border-red-500' : ''}`}
          ref={ref} {...props} />

        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
