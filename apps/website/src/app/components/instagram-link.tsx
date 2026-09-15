'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

export interface InstagramLinkProps {
  className?: string;
  showLabel?: boolean;
  label?: string;
  iconSize?: number;
}

export default function InstagramLink({
  className,
  showLabel = true,
  label = '@dianabucelea',
  iconSize = 13,
}: InstagramLinkProps) {
  return (
    <a
      href="https://www.instagram.com/dianabucelea/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram @dianabucelea"
      title="Follow @dianabucelea on Instagram"
      className={clsx(
        'group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200',
        className
      )}
    >
      <span className="relative flex items-center justify-center w-5 h-5 rounded-[6px] bg-zinc-900 border border-zinc-800 group-hover:border-transparent group-hover:bg-gradient-to-tr group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] transition-all duration-300 flex-shrink-0">
        <Image
          src="/insta-white.svg"
          alt="Instagram"
          width={iconSize}
          height={iconSize}
          className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
        />
      </span>
      {showLabel && (
        <span className="group-hover:text-white transition-colors font-medium">
          {label}
        </span>
      )}
    </a>
  );
}

export { InstagramLink };
