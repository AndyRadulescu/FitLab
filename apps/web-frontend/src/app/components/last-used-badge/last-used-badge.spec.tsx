/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LastUsedBadge } from './last-used-badge';
import '@testing-library/jest-dom/vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback || key,
  }),
}));

describe('LastUsedBadge', () => {
  it('should render default "Last used" text and badge container', () => {
    render(<LastUsedBadge />);
    const badge = screen.getByTestId('last-used-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Last used');
  });

  it('should render custom label when provided', () => {
    render(<LastUsedBadge label="Recently used" />);
    const badge = screen.getByTestId('last-used-badge');
    expect(badge).toHaveTextContent('Recently used');
  });

  it('should apply variant class name correctly', () => {
    render(<LastUsedBadge variant="inline" />);
    const badge = screen.getByTestId('last-used-badge');
    expect(badge).toHaveClass('last-used-badge--inline');
  });
});
