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

  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

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

  // Auto-scroll loop using requestAnimationFrame
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let isIntersecting = true;
    let observer: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          isIntersecting = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const step = () => {
      if (!isPausedRef.current && !isDraggingRef.current && isIntersecting && container && track) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          container.scrollLeft += speed;
          if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
          } else if (container.scrollLeft <= 0) {
            container.scrollLeft += halfWidth;
          }
        }
      }
      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (observer) {
        observer.disconnect();
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [speed]);

  // Pointer drag events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only respond to primary button / touch
    if (e.button !== 0) return;
    pauseAutoScroll();
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    scrollStartRef.current = containerRef.current?.scrollLeft ?? 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored for environments where setPointerCapture isn't supported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current || !trackRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    let newScrollLeft = scrollStartRef.current - deltaX;

    const halfWidth = trackRef.current.scrollWidth / 2;
    if (halfWidth > 0) {
      if (newScrollLeft >= halfWidth) {
        newScrollLeft -= halfWidth;
        scrollStartRef.current -= halfWidth;
      } else if (newScrollLeft < 0) {
        newScrollLeft += halfWidth;
        scrollStartRef.current += halfWidth;
      }
    }

    containerRef.current.scrollLeft = newScrollLeft;
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
  };

  const handlePointerCancel = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    scheduleResume(resumeDelay);
  };

  const childArray = React.Children.toArray(children);

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
