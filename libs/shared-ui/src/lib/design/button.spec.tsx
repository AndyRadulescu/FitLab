/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';
import '@testing-library/jest-dom/vitest';

describe('Button', () => {
  it('should render children correctly', () => {
    render(<Button type="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    render(
      <Button type="primary" icon={<span data-testid="test-icon">icon</span>}>
        With Icon
      </Button>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('should apply correct classes for primary type', () => {
    render(<Button type="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary-gradient');
  });

  it('should apply correct classes for secondary type', () => {
    render(<Button type="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button type="primary" disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });
});
