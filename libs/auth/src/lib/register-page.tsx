import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { logEvent } from 'firebase/analytics';
import { Input, Button } from '@my-org/shared-ui';
import { useAuth } from './types';

const registerSchema = z.object({
  email: z.string().email('errors.email.invalid'),
  password: z.string()
    .min(6, 'errors.password.min')
    .max(30, 'errors.password.max')
    .regex(/[A-Z]/, 'errors.password.uppercase')
    .regex(/[a-z]/, 'errors.password.lowercase')
    .regex(/[0-9]/, 'errors.password.number')
    .regex(/[!@#$%^&*]/, 'errors.password.special'),
  confirmPassword: z.string()
})
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'errors.password.mismatch'
      });
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const { auth, analytics, handleAuthErrors } = useAuth();

  const onRegisterWithEmailAndPassword = (data: RegisterFormData) => {
    if (analytics) {
      logEvent(analytics, 'email-password-register');
    }
    createUserWithEmailAndPassword(auth, data.email, data.password).catch((err: AuthError) => {
      handleAuthErrors(err, t);
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  return (
    <form onSubmit={handleSubmit(data => onRegisterWithEmailAndPassword(data))}>
      <Input
        placeholder={t('auth.email', 'Email')}
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message && t(errors.email.message)}
      />
      <Input
        placeholder={t('auth.password', 'Password')}
        type="password"
        autoComplete="new-password"
        {...register('password')}
        error={errors.password?.message && t(errors.password.message)}
      />
      <Input
        placeholder={t('auth.confirm-password', 'Confirm password')}
        type="password"
        autoComplete="new-password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message && t(errors.confirmPassword.message)}
      />
      <Button type="primary" disabled={isSubmitting} buttonType={'submit'}>
        <Trans i18nKey="auth.register">Register</Trans>
      </Button>
      <Button type="tertiary" buttonType={'button'}>
        <Link to={'/auth/login'}><Trans i18nKey="auth.login">Login</Trans></Link>
      </Button>
    </form>
  );
}
