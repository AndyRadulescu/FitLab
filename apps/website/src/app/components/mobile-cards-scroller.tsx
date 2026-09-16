'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import styles from './mobile-cards-scroller.module.scss';

export interface MobileCardsScrollerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  resumeDelay?: number;
}

export default function MobileCardsScroller({
  children,
  className,
  speed = 0.6,
  resumeDelay = 2500,
}: MobileCardsScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const currentOffsetRef = useRef(0);
  const wrapWidthRef = useRef(0);

  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const momentumRafRef = useRef<number | null>(null);
  const hasDraggedRef = useRef(false);
  const isIntersectingRef = useRef(true);

  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const childArray = React.Children.toArray(children);

  const applyTransform = useCallback((offset: number) => {
    const track = trackRef.current;
    if (!track) return;
    const x = -Math.round(offset * 100) / 100;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
    (track.style as CSSStyleDeclaration & { webkitTransform?: string }).webkitTransform =
      `translate3d(${x}px, 0, 0)`;
  }, []);

  const updateWrapWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || childArray.length === 0) return;
    const firstOrig = track.children[0] as HTMLElement | undefined;
    const firstClone = track.children[childArray.length] as HTMLElement | undefined;
    if (firstClone && firstOrig) {
      const dist = firstClone.offsetLeft - firstOrig.offsetLeft;
      if (dist > 0) {
        wrapWidthRef.current = dist;
        return;
      }
    }
    const half = track.scrollWidth / 2;
    if (half > 0) {
      wrapWidthRef.current = half;
    }
  }, [childArray.length]);

  const pauseAutoScroll = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const scheduleResume = useCallback(
    (delay = resumeDelay) => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      resumeTimeoutRef.current = setTimeout(() => {
        isPausedRef.current = false;
      }, delay);
    },
    [resumeDelay]
  );

  const runMomentum = useCallback(
    (initialVx: number) => {
      if (momentumRafRef.current) {
        cancelAnimationFrame(momentumRafRef.current);
      }
      let vx = initialVx;
      let lastTime = performance.now();

      const momentumStep = (now: number) => {
        if (isDraggingRef.current) {
          momentumRafRef.current = null;
          return;
        }

        const dt = Math.min(now - lastTime, 64);
        lastTime = now;

        const delta = vx * dt;
        let newOffset = currentOffsetRef.current - delta;
        const wrapWidth = wrapWidthRef.current;
        if (wrapWidth > 0) {
          newOffset = ((newOffset % wrapWidth) + wrapWidth) % wrapWidth;
        }
        currentOffsetRef.current = newOffset;
        applyTransform(newOffset);

        const friction = Math.pow(0.92, dt / 16.67);
        vx *= friction;

        if (Math.abs(vx) > 0.05) {
          momentumRafRef.current = requestAnimationFrame(momentumStep);
        } else {
          momentumRafRef.current = null;
          scheduleResume(resumeDelay);
        }
      };

      momentumRafRef.current = requestAnimationFrame(momentumStep);
    },
    [applyTransform, resumeDelay, scheduleResume]
  );

  // Auto-scroll loop using requestAnimationFrame with delta-time calculation
  useEffect(() => {
    updateWrapWidth();

    let lastFrameTime = performance.now();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const step = (now: number) => {
      const dt = Math.min(now - lastFrameTime, 100);
      lastFrameTime = now;

      if (
        !prefersReducedMotion &&
        !isPausedRef.current &&
        !isDraggingRef.current &&
        !momentumRafRef.current &&
        isIntersectingRef.current &&
        wrapWidthRef.current > 0
      ) {
        const delta = (speed * dt) / (1000 / 60);
        let newOffset = currentOffsetRef.current + delta;
        const wrapWidth = wrapWidthRef.current;
        if (wrapWidth > 0) {
          newOffset = ((newOffset % wrapWidth) + wrapWidth) % wrapWidth;
        }
        currentOffsetRef.current = newOffset;
        applyTransform(newOffset);
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateWrapWidth();
      });
      resizeObserver.observe(trackRef.current);
    }

    const handleWindowResize = () => {
      updateWrapWidth();
    };
    window.addEventListener('resize', handleWindowResize);

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isIntersectingRef.current = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(containerRef.current);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (momentumRafRef.current) {
        cancelAnimationFrame(momentumRafRef.current);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      window.removeEventListener('resize', handleWindowResize);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [speed, applyTransform, updateWrapWidth]);

  // Bullet-proof WebKit/iOS touch gesture handling with directional locking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartOffset = 0;
    let isTouchDragging = false;
    let touchIntent: 'horizontal' | 'vertical' | null = null;
    let lastTouchX = 0;
    let lastTouchTime = 0;
    let recentVelocities: number[] = [];

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) return;
      const touch = e.touches ? e.touches[0] : null;
      if (!touch) return;

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      lastTouchX = touch.clientX;
      lastTouchTime = performance.now();
      touchStartOffset = currentOffsetRef.current;
      isTouchDragging = false;
      touchIntent = null;
      recentVelocities = [];

      if (momentumRafRef.current) {
        cancelAnimationFrame(momentumRafRef.current);
        momentumRafRef.current = null;
      }
      pauseAutoScroll();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) return;
      const touch = e.touches ? e.touches[0] : null;
      if (!touch) return;

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (touchIntent === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) >= Math.abs(dx)) {
          touchIntent = 'vertical';
          return;
        } else {
          touchIntent = 'horizontal';
          isTouchDragging = true;
          isDraggingRef.current = true;
          setIsDragging(true);
          hasDraggedRef.current = true;
        }
      }

      if (touchIntent === 'horizontal') {
        if (e.cancelable) {
          e.preventDefault();
        }
        const wrapWidth = wrapWidthRef.current;
        let newOffset = touchStartOffset - dx;
        if (wrapWidth > 0) {
          newOffset = ((newOffset % wrapWidth) + wrapWidth) % wrapWidth;
        }
        currentOffsetRef.current = newOffset;
        applyTransform(newOffset);

        const now = performance.now();
        const dt = now - lastTouchTime;
        if (dt > 8) {
          const v = (touch.clientX - lastTouchX) / dt;
          recentVelocities.push(v);
          if (recentVelocities.length > 5) {
            recentVelocities.shift();
          }
          lastTouchX = touch.clientX;
          lastTouchTime = now;
        }
      }
    };

    const onTouchEnd = () => {
      if (touchIntent === 'horizontal' || isTouchDragging) {
        isDraggingRef.current = false;
        setIsDragging(false);

        let avgVelocity = 0;
        if (recentVelocities.length > 0) {
          avgVelocity =
            recentVelocities.reduce((sum, v) => sum + v, 0) / recentVelocities.length;
        }

        if (Math.abs(avgVelocity) > 0.15) {
          runMomentum(avgVelocity);
        } else {
          scheduleResume(resumeDelay);
        }

        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 80);
      } else {
        scheduleResume(resumeDelay);
      }

      touchIntent = null;
      isTouchDragging = false;
    };

    const onTouchCancel = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      touchIntent = null;
      isTouchDragging = false;
      scheduleResume(resumeDelay);
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [applyTransform, pauseAutoScroll, resumeDelay, runMomentum, scheduleResume]);

  // Pointer drag events for desktop mouse users
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (e.button !== 0) return;

    pauseAutoScroll();
    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startOffsetRef.current = currentOffsetRef.current;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored for environments where setPointerCapture isn't supported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || e.pointerType === 'touch') return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasDraggedRef.current = true;
    }
    const wrapWidth = wrapWidthRef.current;
    let newOffset = startOffsetRef.current - deltaX;
    if (wrapWidth > 0) {
      newOffset = ((newOffset % wrapWidth) + wrapWidth) % wrapWidth;
    }
    currentOffsetRef.current = newOffset;
    applyTransform(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || e.pointerType === 'touch') return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    scheduleResume(resumeDelay);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 80);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || e.pointerType === 'touch') return;
    isDraggingRef.current = false;
    setIsDragging(false);
    scheduleResume(resumeDelay);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      pauseAutoScroll();
      const wrapWidth = wrapWidthRef.current;
      let newOffset = currentOffsetRef.current + e.deltaX;
      if (wrapWidth > 0) {
        newOffset = ((newOffset % wrapWidth) + wrapWidth) % wrapWidth;
      }
      currentOffsetRef.current = newOffset;
      applyTransform(newOffset);
      scheduleResume(resumeDelay);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      pauseAutoScroll();
      const wrapWidth = wrapWidthRef.current;
      let newOffset = currentOffsetRef.current + 150;
      if (wrapWidth > 0) {
        newOffset = ((newOffset % wrapWidth) + wrapWidth) % wrapWidth;
      }
      currentOffsetRef.current = newOffset;
      applyTransform(newOffset);
      scheduleResume(resumeDelay);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      pauseAutoScroll();
      const wrapWidth = wrapWidthRef.current;
      let newOffset = currentOffsetRef.current - 150;
      if (wrapWidth > 0) {
        newOffset = ((newOffset % wrapWidth) + wrapWidth) % wrapWidth;
      }
      currentOffsetRef.current = newOffset;
      applyTransform(newOffset);
      scheduleResume(resumeDelay);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx(styles.container, isDragging && styles.isDragging, className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onTouchStart={pauseAutoScroll}
      onTouchEnd={() => scheduleResume(resumeDelay)}
      onMouseEnter={pauseAutoScroll}
      onMouseLeave={() => {
        if (!isDraggingRef.current) {
          scheduleResume(1000);
        }
      }}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onClickCapture={handleClickCapture}
      tabIndex={0}
      role="region"
      aria-label="Features carousel"
    >
      <div ref={trackRef} className={styles.track}>
        {/* Primary set */}
        {childArray.map((child, i) => (
          <div key={`orig-${i}`} className={styles.item}>
            {child}
          </div>
        ))}
        {/* Cloned set for seamless infinite wrap */}
        {childArray.map((child, i) => (
          <div key={`clone-${i}`} className={styles.item} aria-hidden="true">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
