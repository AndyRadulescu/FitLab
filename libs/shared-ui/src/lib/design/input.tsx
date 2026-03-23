import { forwardRef, InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  infoText?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, infoText, className, ...props }, ref) => {
    const id = props.id || props.name;
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);

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
      <div className={clsx('mb-6 relative w-full', className)}>
        {label && (
          <div className="flex items-center justify-between mb-2 px-1">
            <label
              htmlFor={id}
              className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              {label}
            </label>
            {infoText && (
              <div className="relative flex items-center">
                <button
                  type="button"
                  ref={iconRef}
                  data-testid="info-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPopoverOpen(!isPopoverOpen);
                  }}
                  className={clsx(
                    "p-1 rounded-full transition-colors",
                    isPopoverOpen
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  )}
                  aria-label="Info"
                >
                  <HelpCircle size={14} />
                </button>
                {isPopoverOpen && (
                  <div
                    ref={popoverRef}
                    data-testid="info-popover"
                    className="absolute z-50 w-64 p-4 mt-2 text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl shadow-2xl top-full right-0 animate-in fade-in zoom-in duration-200"
                  >
                    <div className="absolute -top-1.5 right-2 w-3 h-3 bg-white dark:bg-zinc-800 border-l border-t border-gray-100 dark:border-zinc-700 rotate-45" />
                    {infoText}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="relative group">
          <input
            id={id}
            className={clsx(
              "appearance-none border w-full py-3 px-4 rounded-xl text-gray-700 dark:text-gray-100 leading-tight focus:outline-none transition-all duration-200",
              "bg-white dark:bg-zinc-900/50",
              "border-gray-200 dark:border-zinc-700 group-hover:border-gray-300 dark:group-hover:border-zinc-600",
              "focus:border-amber-500/50 dark:focus:border-amber-400/50 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-400/5",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""
            )}
            ref={ref}
            {...props}
          />
        </div>

        {error && (
          <p className="text-red-500 text-[11px] mt-2 font-semibold px-1 flex items-center uppercase tracking-wide">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
