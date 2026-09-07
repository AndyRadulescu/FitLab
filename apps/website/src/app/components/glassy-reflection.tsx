import React from 'react';
import clsx from 'clsx';

interface GlassyReflectionProps {
  className?: string;
  lineClassName?: string;
}

export function GlassyReflection({
  lineClassName = 'left-12 right-12',
}: GlassyReflectionProps = {}) {
  return (
    <>
      {/* Top specular reflection highlight line - Desktop only */}
      <div
        className={clsx(
          'hidden md:block pointer-events-none absolute top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent',
          lineClassName
        )}
        aria-hidden="true"
      />
    </>
  );
}

export default GlassyReflection;
