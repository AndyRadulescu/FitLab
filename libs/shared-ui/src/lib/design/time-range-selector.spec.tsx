/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TimeRangeSelector } from './time-range-selector';
import '@testing-library/jest-dom/vitest';

describe('TimeRangeSelector', () => {
  afterEach(cleanup);
  
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

  it('should show custom date picker when "Custom Range" is clicked', () => {
    render(<TimeRangeSelector {...defaultProps} />);
    
    // Open popover
    fireEvent.click(screen.getByRole('button'));
    
    // Click "Custom Range"
    fireEvent.click(screen.getByText('Custom Range'));
    
    // Menu should be gone and replaced with date picker content
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    
    // Check if "Done" button is present (part of my custom picker UI)
    expect(screen.getByText('Done')).toBeInTheDocument();
    
    // Check for some react-date-range indicator (like a month name)
    // react-date-range usually renders month names
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    // We use getAllByText because the month name might appear in multiple places (header, calendar)
    expect(screen.getAllByText(new RegExp(currentMonth, 'i')).length).toBeGreaterThan(0);
  });

  it('should render selected custom range in the trigger', () => {
    const customRange = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-10'),
    };
    render(<TimeRangeSelector {...defaultProps} value={customRange} />);
    
    // Should show the formatted date range
    // Based on my implementation: value.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    const startStr = customRange.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const endStr = customRange.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    expect(screen.getByText(`${startStr} - ${endStr}`)).toBeInTheDocument();
  });

  it('should not show "Custom Range" option when allowCustomRange is false', () => {
    render(<TimeRangeSelector {...defaultProps} allowCustomRange={false} />);
    
    // Open popover
    fireEvent.click(screen.getByRole('button'));
    
    // "Custom Range" should not be present
    expect(screen.queryByText('Custom Range')).not.toBeInTheDocument();
  });
});
