'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import styles from './mobile-cards-scroller.module.scss';

export interface MobileCardsScrollerProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  speed?: number;
  resumeDelay?: number;
}

export default function MobileCardsScroller({
  children,
  className,
  itemClassName,
  speed = 0.9,
  resumeDelay = 1200,
}: MobileCardsScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setARef = useRef<HTMLDivElement>(null);
  const setBRef = useRef<HTMLDivElement>(null);

  const currentOffsetRef = useRef(0);
  const setWidthRef = useRef(0);

  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const hasDraggedRef = useRef(false);
  const isIntersectingRef = useRef(true);

  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const childArray = React.Children.toArray(children);

  const renderPositions = useCallback(() => {
    const W = setWidthRef.current;
    if (W <= 0 || !setARef.current || !setBRef.current) return;

    let s = currentOffsetRef.current % (2 * W);
    if (s < 0) s += 2 * W;

    let posA = -s;
    if (posA < -W) posA += 2 * W;

    let posB = W - s;
    if (posB < -W) posB += 2 * W;

    const roundA = Math.round(posA * 100) / 100;
    const roundB = Math.round(posB * 100) / 100;

    setARef.current.style.transform = `translateX(${roundA}px)`;
    setBRef.current.style.transform = `translateX(${roundB}px)`;
  }, []);

  const updateSetWidth = useCallback(() => {
    if (!setARef.current) return;
    const measured = setARef.current.offsetWidth || setARef.current.scrollWidth;
    if (measured > 0) {
      setWidthRef.current = measured;
      renderPositions();
    }
  }, [renderPositions]);

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

  useEffect(() => {
    updateSetWidth();

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
        isIntersectingRef.current &&
        setWidthRef.current > 0
      ) {
        const delta = (speed * dt) / (1000 / 60);
        currentOffsetRef.current += delta;
        renderPositions();
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && setARef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateSetWidth();
      });
      resizeObserver.observe(setARef.current);
    }

    const handleWindowResize = () => {
      updateSetWidth();
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
  }, [speed, renderPositions, updateSetWidth]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pauseAutoScroll();
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startOffsetRef.current = currentOffsetRef.current;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if not supported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasDraggedRef.current = true;
    }
    currentOffsetRef.current = startOffsetRef.current - deltaX;
    renderPositions();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      pauseAutoScroll();
      currentOffsetRef.current += e.deltaX;
      renderPositions();
      scheduleResume(resumeDelay);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      pauseAutoScroll();
      currentOffsetRef.current += 150;
      renderPositions();
      scheduleResume(resumeDelay);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      pauseAutoScroll();
      currentOffsetRef.current -= 150;
      renderPositions();
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
      onPointerCancel={handlePointerUp}
      onTouchStart={pauseAutoScroll}
      onTouchEnd={() => scheduleResume(resumeDelay)}
      onMouseEnter={pauseAutoScroll}
      onMouseLeave={() => scheduleResume(1000)}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onClickCapture={handleClickCapture}
      tabIndex={0}
      role="region"
      aria-label="Features carousel"
    >
      {/* Set A: Primary set, in layout flow */}
      <div ref={setARef} className={styles.setA}>
        {childArray.map((child, i) => (
          <div key={`orig-${i}`} className={clsx(styles.item, itemClassName)}>
            {child}
          </div>
        ))}
      </div>
      {/* Set B: Detached duplicate set, positioned absolutely */}
      <div ref={setBRef} className={styles.setB} aria-hidden="true">
        {childArray.map((child, i) => (
          <div key={`clone-${i}`} className={clsx(styles.item, itemClassName)} tabIndex={-1}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
