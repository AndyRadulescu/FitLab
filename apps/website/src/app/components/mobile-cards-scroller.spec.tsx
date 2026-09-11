// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import MobileCardsScroller from './mobile-cards-scroller';

describe('MobileCardsScroller', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders children with accessible region and cloned set for loop', () => {
    render(
      <MobileCardsScroller>
        <div>Card 1</div>
        <div>Card 2</div>
      </MobileCardsScroller>
    );

    expect(screen.getByRole('region', { name: 'Features carousel' })).toBeDefined();

    // Primary set + clone set = 2 instances of each text
    const card1Elements = screen.getAllByText('Card 1');
    expect(card1Elements.length).toBe(2);

    const card2Elements = screen.getAllByText('Card 2');
    expect(card2Elements.length).toBe(2);
  });

  it('handles touch start and touch end interaction', () => {
    render(
      <MobileCardsScroller resumeDelay={2000}>
        <div>Interactive Card</div>
      </MobileCardsScroller>
    );

    const container = screen.getByRole('region', { name: 'Features carousel' });

    // Touch start pauses
    fireEvent.touchStart(container);

    // Touch end schedules resume
    fireEvent.touchEnd(container);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
  });

  it('handles mouse enter and mouse leave hover states', () => {
    render(
      <MobileCardsScroller resumeDelay={2000}>
        <div>Hover Card</div>
      </MobileCardsScroller>
    );

    const container = screen.getByRole('region', { name: 'Features carousel' });

    fireEvent.mouseEnter(container);
    fireEvent.mouseLeave(container);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
  });
});
