import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export interface CopyButtonProps {
  text: string;
  className?: string;
  buttonClassName?: string;
  copiedDuration?: number;
  showFeedbackText?: boolean;
  'aria-label'?: string;
}

export function CopyButton({
  text,
  className = '',
  buttonClassName = '',
  copiedDuration = 2000,
  showFeedbackText = false,
  'aria-label': ariaLabel = 'Copy to clipboard',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), copiedDuration);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };


  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : ariaLabel}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 p-2 rounded-lg transition-all duration-200 cursor-pointer',
        copied
          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
          : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-gray-100',
        buttonClassName,
        className
      )}
    >
      {copied ? (
        <>
          <Check size={16} className="text-emerald-600 dark:text-emerald-400 transition-transform scale-110" />
          {showFeedbackText && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Copied!</span>
          )}
        </>
      ) : (
        <>
          <Copy size={16} className="transition-transform" />
          {showFeedbackText && (
            <span className="text-xs font-semibold">Copy</span>
          )}
        </>
      )}
    </button>
  );
}
