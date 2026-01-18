import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl bg-gray-100 shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}
