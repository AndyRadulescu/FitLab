import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export type TimeRange = '1w' | '4w' | '6m' | 'all';

export interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  activeOptionClassName?: string;
}

export function TimeRangeSelector({
  value,
  onChange,
  className,
  triggerClassName,
  popoverClassName,
  activeOptionClassName,
}: TimeRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options: { label: string; value: TimeRange }[] = [
    { label: '1w', value: '1w' },
    { label: '4w', value: '4w' },
    { label: '6m', value: '6m' },
    { label: 'all', value: 'all' },
  ];

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={clsx('relative inline-block text-left', className)} ref={popoverRef}>
      <button
        type="button"
        className={clsx(
          'inline-flex items-center justify-between w-full rounded-md px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
          triggerClassName
            ? triggerClassName
            : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-amber-300'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className={clsx(
            'absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            popoverClassName ? popoverClassName : 'bg-white dark:bg-zinc-800'
          )}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-150',
                  value === option.value
                    ? activeOptionClassName
                      ? activeOptionClassName
                      : 'bg-gray-100 dark:bg-gray-700 font-bold'
                    : ''
                )}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
