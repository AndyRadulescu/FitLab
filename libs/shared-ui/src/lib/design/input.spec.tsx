/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './input';
import '@testing-library/jest-dom/vitest';

describe('Input', () => {
  it('should render label and input field correctly', () => {
    render(<Input label="Username" name="username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
  });

  it('should display error message when provided', () => {
    render(<Input label="Email" name="email" error="Invalid email address" />);

    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('should not render info icon if infoText is not provided', () => {
    render(<Input label="Test" name="test" />);

    expect(screen.queryByTestId('info-icon')).not.toBeInTheDocument();
  });

  it('should show popover when clicking the info icon and close it when clicking again', () => {
    const infoText = "This is a helpful tip.";
    render(<Input label="Measurement" name="measure" infoText={infoText} />);

    const icon = screen.getByTestId('info-icon');

    // Initially popover should not be visible
    expect(screen.queryByTestId('info-popover')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(icon);
    expect(screen.getByTestId('info-popover')).toBeInTheDocument();
    expect(screen.getByText(infoText)).toBeInTheDocument();

    // Click again to close
    fireEvent.click(icon);
    expect(screen.queryByTestId('info-popover')).not.toBeInTheDocument();
  });

  it('should close popover when clicking outside', () => {
    const infoText = "This is a helpful tip.";
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Input label="Measurement" name="measure" infoText={infoText} />
      </div>
    );

    const icon = screen.getByTestId('info-icon');

    // Open popover
    fireEvent.click(icon);
    expect(screen.getByTestId('info-popover')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('info-popover')).not.toBeInTheDocument();
  });
});
