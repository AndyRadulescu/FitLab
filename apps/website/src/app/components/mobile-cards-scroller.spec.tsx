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

  it('handles keyboard navigation with arrow keys', () => {
    render(
      <MobileCardsScroller resumeDelay={1500}>
        <div>Key Card</div>
      </MobileCardsScroller>
    );

    const container = screen.getByRole('region', { name: 'Features carousel' });

    // Arrow Right
    fireEvent.keyDown(container, { key: 'ArrowRight' });

    // Arrow Left
    fireEvent.keyDown(container, { key: 'ArrowLeft' });

    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });

  it('handles horizontal wheel events', () => {
    render(
      <MobileCardsScroller resumeDelay={1500}>
        <div>Wheel Card</div>
      </MobileCardsScroller>
    );

    const container = screen.getByRole('region', { name: 'Features carousel' });

    fireEvent.wheel(container, { deltaX: 50, deltaY: 0 });

    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });

  it('handles desktop mouse pointer drag interactions', () => {
    render(
      <MobileCardsScroller resumeDelay={1500}>
        <div>Drag Card</div>
      </MobileCardsScroller>
    );

    const container = screen.getByRole('region', { name: 'Features carousel' });

    // Pointer down with mouse
    fireEvent.pointerDown(container, { pointerType: 'mouse', button: 0, clientX: 100 });

    // Pointer move
    fireEvent.pointerMove(container, { pointerType: 'mouse', clientX: 50 });

    // Pointer up
    fireEvent.pointerUp(container, { pointerType: 'mouse', clientX: 50 });

    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });

  it('handles pointer cancel gracefully', () => {
    render(
      <MobileCardsScroller resumeDelay={1500}>
        <div>Cancel Card</div>
      </MobileCardsScroller>
    );

    const container = screen.getByRole('region', { name: 'Features carousel' });

    fireEvent.pointerDown(container, { pointerType: 'mouse', button: 0, clientX: 100 });
    fireEvent.pointerCancel(container, { pointerType: 'mouse' });

    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });
});

