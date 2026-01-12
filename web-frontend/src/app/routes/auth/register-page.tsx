import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { auth } from '../../../init-firebase-auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { Input } from '../../design/input';
import firebase from 'firebase/compat/app';
import AuthError = firebase.auth.AuthError;
import { handleAuthErrors } from './error-handler';

const registerSchema = z.object({
  email: z.email('errors.email.invalid'),
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

  const onRegisterWithEmailAndPassword = (data: RegisterFormData) => {
    createUserWithEmailAndPassword(auth, data.email, data.password).catch((err: AuthError) => {
      handleAuthErrors(err, t)
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
      Register
      <Input
        placeholder={t('auth.email', 'Email')}
        type="email"
        {...register('email')}
        error={errors.email?.message && t(errors.email.message)}
      />
      <Input
        placeholder={t('auth.password', 'Password')}
        type="password"
        {...register('password')}
        error={errors.password?.message && t(errors.password.message)}
      />
      <Input
        placeholder={t('auth.confirm-password', 'Confirm password')}
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message && t(errors.confirmPassword.message)}
      />
      <button
        className="w-full hover:bg-amber-500 text-white pointer font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-amber-300 to-red-900"
        disabled={isSubmitting}>
        <Trans i18nKey="auth.regiser">Register</Trans>
      </button>
      <div className="w-full justify-center flex">
        <Link to={'/auth/login'}><Trans i18nKey="auth.login">Login</Trans></Link>
      </div>
    </form>
  );
}
