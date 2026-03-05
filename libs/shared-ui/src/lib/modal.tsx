import React, { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, children, className, showCloseButton = true }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={clsx(
        "m-auto bg-transparent p-0 outline-none backdrop:bg-black/80 backdrop:backdrop-blur-sm",
        "w-full h-full md:w-[80vw] md:h-[80vh] md:max-w-5xl md:max-h-[90vh]",
        className
      )}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-full w-full flex items-center justify-center">
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          )}
          <div className="flex h-full w-full items-center justify-center p-2 md:p-4">
            {children}
          </div>
        </div>
      </div>
    </dialog>
  );
}
