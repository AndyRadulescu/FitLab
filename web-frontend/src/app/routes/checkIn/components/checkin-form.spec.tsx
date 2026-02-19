import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckInForm } from './checkin-form';
import { useForm } from 'react-hook-form';
import { ReactNode } from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('../../../components/image/image-uploader', () => ({
  ImageUploader: ({ onChange }: any) => (
    <button onClick={() => onChange(['https://test.com/img.jpg'])} data-testid="uploader">
      Upload Mock
    </button>
  ),
}));

const FormWrapper = ({ props, onSubmit }: any) => {
  const methods = useForm({
    defaultValues: {
      kg: 70,
      breastSize: 90,
      imgUrls: [],
    }
  });
  return <CheckInForm {...props} formMethods={methods} onSubmit={onSubmit} />;
};

describe('CheckInForm', () => {
  const mockUser = { uid: 'user123' } as any;
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    user: mockUser,
    activeCheckinId: 'checkin-456',
    isEdit: false,
  };

  it('renders all measurement inputs', () => {
    render(<FormWrapper props={defaultProps} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('checkin.measures.kg')).toBeDefined();
    expect(screen.getByLabelText('checkin.measures.waist')).toBeDefined();
    expect(screen.getByLabelText('checkin.steps')).toBeDefined();
  });

  it('shows "Check-in" text on button when isEdit is false', () => {
    render(<FormWrapper props={defaultProps} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /check-in/i })).toBeDefined();
  });

  it('shows "Save" text on button when isEdit is true', () => {
    render(<FormWrapper props={{ ...defaultProps, isEdit: true }} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('checkin.save')).toBeDefined();
  });

  it('calls onSubmit with form data when submitted', async () => {
    render(<FormWrapper props={defaultProps} onSubmit={mockOnSubmit} />);

    const kgInput = screen.getByLabelText('checkin.measures.kg');
    fireEvent.change(kgInput, { target: { value: '75' } });

    const submitBtn = screen.getByRole('button', { name: /check-in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit.mock.calls[0][0].kg).toBe(75);
    });
  });

  it('disables the submit button while isSubmitting is true', async () => {
    const slowSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<FormWrapper props={defaultProps} onSubmit={slowSubmit} />);

    const submitBtn = screen.getByRole('button', { name: /check-in/i });
    fireEvent.click(submitBtn);
    expect(submitBtn).toBeDisabled();
  });
});
