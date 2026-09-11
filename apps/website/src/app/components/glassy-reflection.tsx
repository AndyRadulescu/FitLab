import React from 'react';
import clsx from 'clsx';

interface GlassyReflectionProps {
  lineClassName?: string;
  glowClassName?: string;
  showOnMobile?: boolean;
  showGlowOnMobile?: boolean;
  showLineOnMobile?: boolean;
  showGlow?: boolean;
  showLine?: boolean;
}

export function GlassyReflection({
  lineClassName = 'left-12 right-12',
  glowClassName,
  showOnMobile = false,
  showGlowOnMobile,
  showLineOnMobile,
  showGlow = true,
  showLine = true,
}: GlassyReflectionProps = {}) {
  const isGlowOnMobile = showGlowOnMobile ?? showOnMobile;
  const isLineOnMobile = showLineOnMobile ?? showOnMobile;

  return (
    <>
      {/* Top specular reflection highlight line */}
      {showLine && (
        <div
          className={clsx(
            'pointer-events-none absolute top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent',
            isLineOnMobile ? 'block' : 'hidden md:block',
            lineClassName
          )}
          aria-hidden="true"
        />
      )}

      {/* Top center spotlight glow (Resend style) */}
      {showGlow && (
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 -top-1 left-1/2 h-[200px] w-full max-w-[200px] md:max-w-[400px]',
            isGlowOnMobile ? 'block' : 'hidden md:block',
            glowClassName
          )}
          style={{
            background:
              'conic-gradient(from 90deg at 50% 50%, #00000000 50%),radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)',
          }}
        />
      )}
    </>
  );
}

export default GlassyReflection;
