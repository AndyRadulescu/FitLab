/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimeRangeSelector } from './time-range-selector';
import '@testing-library/jest-dom/vitest';

describe('TimeRangeSelector', () => {
  const defaultProps = {
    value: '1w' as const,
    onChange: vi.fn(),
  };

  it('should render the current value', () => {
    render(<TimeRangeSelector {...defaultProps} />);
    expect(screen.getByText('1w')).toBeInTheDocument();
  });

  it('should open the popover when clicking the trigger button', () => {
    render(<TimeRangeSelector {...defaultProps} />);
    
    // Popover should be hidden initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Click trigger
    fireEvent.click(screen.getByRole('button'));

    // Popover should be visible
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(within(menu).getByText('4w')).toBeInTheDocument();
    expect(within(menu).getByText('6m')).toBeInTheDocument();
    expect(within(menu).getByText('all')).toBeInTheDocument();
  });

  it('should call onChange and close popover when an option is clicked', () => {
    const onChange = vi.fn();
    render(<TimeRangeSelector {...defaultProps} onChange={onChange} />);

    // Open popover
    fireEvent.click(screen.getByRole('button'));

    // Click an option in the menu
    const menu = screen.getByRole('menu');
    fireEvent.click(within(menu).getByText('4w'));

    expect(onChange).toHaveBeenCalledWith('4w');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should close the popover when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <TimeRangeSelector {...defaultProps} />
      </div>
    );

    // Open popover
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should apply custom trigger and active option classes', () => {
    const triggerClass = 'custom-trigger-class';
    const activeClass = 'custom-active-class';
    
    render(
      <TimeRangeSelector 
        {...defaultProps} 
        triggerClassName={triggerClass}
        activeOptionClassName={activeClass}
      />
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass(triggerClass);

    // Open popover to check active class
    fireEvent.click(trigger);
    
    const menu = screen.getByRole('menu');
    const activeOption = within(menu).getByRole('menuitem', { name: '1w' });
    expect(activeOption).toHaveClass(activeClass);
  });
});
