// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckInForm } from './checkin-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkinSchema, CheckInFormData } from '../types';
import '@testing-library/jest-dom/vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey, children }: any) => <span>{i18nKey || children}</span>,
}));

vi.mock('../../../components/image/image-uploader', () => ({
  ImageUploader: ({ onChange }: any) => (
    <button onClick={() => onChange(['img1.jpg', 'img2.jpg', 'img3.jpg'])} data-testid="uploader">
      Upload Mock
    </button>
  ),
}));

const defaultFormValues: CheckInFormData = {
  kg: 70,
  breastSize: 90,
  waistSize: 80,
  hipSize: 100,
  buttSize: 100,
  leftThigh: 60,
  rightThigh: 60,
  leftArm: 30,
  rightArm: 30,
  hoursSlept: 8,
  planAccuracy: 10,
  energyLevel: 8,
  moodCheck: 9,
  dailySteps: 10000,
  imgUrls: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
};

const FormWrapper = ({ props, onSubmit }: any) => {
  const methods = useForm<CheckInFormData>({
    resolver: zodResolver(checkinSchema),
    defaultValues: defaultFormValues
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

    expect(screen.getByLabelText('checkin.measures.kg')).toBeInTheDocument();
    expect(screen.getByLabelText('checkin.measures.waist')).toBeInTheDocument();
    expect(screen.getByLabelText('checkin.steps')).toBeInTheDocument();
  });

  it('shows "Check-in" translation key on button when isEdit is false', () => {
    render(<FormWrapper props={defaultProps} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /checkin.button/i })).toBeInTheDocument();
  });

  it('shows "checkin.save" translation key on button when isEdit is true', () => {
    render(<FormWrapper props={{ ...defaultProps, isEdit: true }} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('checkin.save')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', async () => {
    render(<FormWrapper props={defaultProps} onSubmit={mockOnSubmit} />);

    const kgInput = screen.getByLabelText('checkin.measures.kg');
    fireEvent.change(kgInput, { target: { value: '75' } });

    const submitBtn = screen.getByRole('button', { name: /checkin.button/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnSubmit.mock.calls[0][0].kg).toBe(75);
    });
  });

  it('disables the submit button while isSubmitting is true', async () => {
    const slowSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<FormWrapper props={defaultProps} onSubmit={slowSubmit} />);

    const submitBtn = screen.getByRole('button', { name: /checkin.button/i });
    fireEvent.click(submitBtn);
    expect(submitBtn).toBeDisabled();
  });
});
