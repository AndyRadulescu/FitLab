// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StartForm } from './start-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startPageSchema, StartPageFormData } from '../types';
import '@testing-library/jest-dom/vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey, children }: any) => <span>{i18nKey || children}</span>,
}));

const FormWrapper = ({ onSubmit }: any) => {
  const methods = useForm<StartPageFormData>({
    resolver: zodResolver(startPageSchema),
  });
  return <StartForm formMethods={methods} onSubmit={onSubmit} />;
};

describe('StartForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders all start form inputs', () => {
    render(<FormWrapper onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('start.dateOfBirth')).toBeInTheDocument();
    expect(screen.getByLabelText('start.startingWeight')).toBeInTheDocument();
    expect(screen.getByLabelText('start.height')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted with valid data', async () => {
    render(<FormWrapper onSubmit={mockOnSubmit} />);

    const dobInput = screen.getByLabelText('start.dateOfBirth');
    const weightInput = screen.getByLabelText('start.startingWeight');
    const heightInput = screen.getByLabelText('start.height');

    fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
    fireEvent.change(weightInput, { target: { value: '80' } });
    fireEvent.change(heightInput, { target: { value: '180' } });

    const submitBtn = screen.getByRole('button', { name: /start/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.weight).toBe(80);
      expect(submittedData.height).toBe(180);
      expect(submittedData.dateOfBirth).toBeInstanceOf(Date);
    });
  });

  it('disables the submit button while isSubmitting is true', async () => {
    const slowSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<FormWrapper onSubmit={slowSubmit} />);

    // Fill the form to make it valid
    fireEvent.change(screen.getByLabelText('start.dateOfBirth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('start.startingWeight'), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText('start.height'), { target: { value: '180' } });

    const submitBtn = screen.getByRole('button', { name: /start/i });
    fireEvent.click(submitBtn);
    expect(submitBtn).toBeDisabled();
  });
});
