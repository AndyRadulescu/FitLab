import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export interface Option<T> {
  label: string;
  value: T;
  info?: string;
}

export interface OptionSelectorProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  infoText?: string;
  error?: string;
  className?: string;
}

export function OptionSelector<T extends string | number>({
  options,
  value,
  onChange,
  label,
  infoText,
  error,
  className,
}: OptionSelectorProps<T>) {
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
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
          </label>
          {infoText && (
            <div className="relative flex items-center">
              <button
                type="button"
                ref={iconRef}
                onClick={(e) => {
                  e.preventDefault();
                  setIsPopoverOpen(!isPopoverOpen);
                }}
                className={clsx(
                  'p-1 rounded-full transition-colors',
                  isPopoverOpen
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                )}
                aria-label="Info"
              >
                <HelpCircle size={14} />
              </button>
              {isPopoverOpen && (
                <div
                  ref={popoverRef}
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

      <div className="flex bg-gray-100 dark:bg-zinc-900/50 rounded-xl p-1 border border-gray-200 dark:border-zinc-700">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              'flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-200',
              value === option.value
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-950 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {options.find((o) => o.value === value)?.info && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 italic mt-2 px-1">
          {options.find((o) => o.value === value)?.info}
        </p>
      )}

      {error && (
        <p className="text-red-500 text-[11px] mt-2 font-semibold px-1 flex items-center uppercase tracking-wide">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5" />
          {error}
        </p>
      )}
    </div>
  );
}
