import { ReactNode } from "react";
import clsx from 'clsx';

type CardProps = {
  isDanger?: boolean;
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" , isDanger = false}: CardProps) {
  return (
    <div className={`rounded-xl bg-gray-100 dark:bg-gray-800 border-solid border-1 border-gray-600 shadow-md p-4 ${className} ${clsx({ 'border-red-500': isDanger })}`}>
      {children}
    </div>
  );
}
