// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WeightInputForm } from './weight-input-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { weightSchema, WeightFormData } from '../types';
import '@testing-library/jest-dom/vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const FormWrapper = ({ onSave, onCancel }: any) => {
  const methods = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema),
    defaultValues: { weight: 80 }
  });
  return <WeightInputForm formMethods={methods} onSave={onSave} onCancel={onCancel} />;
};

describe('WeightInputForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly', () => {
    render(<FormWrapper onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText('dashboard.weight.placeholder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /common.save/i })).toBeInTheDocument();
  });

  it('calls onSave with valid data', async () => {
    render(<FormWrapper onSave={mockOnSave} onCancel={mockOnCancel} />);
    const input = screen.getByLabelText('dashboard.weight.placeholder');
    fireEvent.change(input, { target: { value: '85' } });
    
    const submitBtn = screen.getByRole('button', { name: /common.save/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({ weight: 85 }, expect.anything());
    });
  });

  it('calls onCancel when X is clicked', () => {
    render(<FormWrapper onSave={mockOnSave} onCancel={mockOnCancel} />);
    const closeBtn = screen.getByTestId('close-icon'); // Assuming X has data-testid or we can query by container
    // Let's query by svg
    const svg = document.querySelector('svg');
    fireEvent.click(svg!.parentElement!);
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
