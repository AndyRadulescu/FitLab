import { forwardRef, InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  infoText?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, infoText, ...props }, ref) => {
    const id = props.id || props.name;
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          popoverRef.current && 
          !popoverRef.current.contains(event.target as Node) &&
          iconRef.current &&
          !iconRef.current.contains(event.target as Node)
        ) {
          setIsPopoverOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className={'mb-4 relative'}>
        {label && (
          <div className="flex items-center mb-2">
            <label htmlFor={id} className="block text-gold-700 dark:text-gray-100 text-sm font-bold">
              {label}
            </label>
            {infoText && (
              <div className="relative ml-2 flex items-center">
                <div 
                  ref={iconRef}
                  data-testid="info-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPopoverOpen(!isPopoverOpen);
                  }}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <HelpCircle size={16} />
                </div>
                {isPopoverOpen && (
                  <div 
                    ref={popoverRef}
                    data-testid="info-popover"
                    className="absolute z-50 w-64 p-3 mt-2 text-sm font-normal text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl top-full left-0 sm:left-auto"
                  >
                    {infoText}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <input
          id={id}
          className={`appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline border-top border-gray-400/30
           + ${error ? 'border-red-500' : ''}`}
          ref={ref} {...props} />

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
