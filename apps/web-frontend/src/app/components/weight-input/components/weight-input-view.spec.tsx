// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WeightInputView } from './weight-input-view';
import '@testing-library/jest-dom/vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ 
    t: (key: string, options?: any) => {
        if (options && options.weight !== undefined) {
            return `${key} ${options.weight}`;
        }
        return key;
    } 
  }),
}));

describe('WeightInputView', () => {
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly with weight', () => {
    const todayWeight = { id: '1', weight: 80, createdAt: new Date() };
    render(<WeightInputView todayWeight={todayWeight} onEdit={mockOnEdit} />);
    
    expect(screen.getByText(/dashboard.weight.value 80/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /common.edit/i })).toBeInTheDocument();
  });

  it('renders correctly without weight', () => {
    render(<WeightInputView todayWeight={undefined} onEdit={mockOnEdit} />);
    
    expect(screen.getByText(/dashboard.weight.value/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /common.edit/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const todayWeight = { id: '1', weight: 80, createdAt: new Date() };
    render(<WeightInputView todayWeight={todayWeight} onEdit={mockOnEdit} />);
    
    const editBtn = screen.getByRole('button', { name: /common.edit/i });
    fireEvent.click(editBtn);
    
    expect(mockOnEdit).toHaveBeenCalled();
  });
});
