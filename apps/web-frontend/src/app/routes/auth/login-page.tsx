import { analytics, auth } from '../../../init-firebase-auth';
import { sendPasswordResetEmail, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Input } from '../../components/design/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { handleAuthErrors } from '../../core/error-handler';
import { Button } from '../../components/design/button';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.email('errors.email.invalid'),
  password: z.string().min(6, 'errors.password.min')
    .max(30, 'errors.password.max')
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const onLogInWithEmailAndPassword = (data: LoginFormData) => {
    if (analytics) {
      logEvent(analytics, 'email-password-login');
    }
    void signInWithEmailAndPassword(auth, data.email, data.password).catch((err) => {
      handleAuthErrors(err, t);
    });
  };

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onForgotPassword = async () => {
    const email = getValues('email');
    const isValid = await trigger('email');
    if (!isValid) return;

    if (analytics) {
      logEvent(analytics, 'forgot-password');
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert(t('auth.forgot.emailSent'));
    } catch (err: unknown) {
      handleAuthErrors(err as AuthError, t);
    }
  };

  return (
    <form onSubmit={handleSubmit(data => onLogInWithEmailAndPassword(data))}>
      <Input
        placeholder={t('auth.email', 'Email')}
        type="email"
        {...register('email')}
        error={errors.email?.message && t(errors.email.message)}
      />
      <div className="relative">
        <Input
          placeholder={t('auth.password', 'Password')}
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={errors.password?.message && t(errors.password.message)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[10px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className={'mb-4 flex flex-row justify-end'}>
        <button type="button" onClick={() => void onForgotPassword()} className="text-sm text-gray-900 underline font-semibold -mt-2">
          <Trans i18nKey="auth.forgot">Forgot Password?</Trans>
        </button>
      </div>
      <Button disabled={isSubmitting} type="primary" buttonType={'submit'}>
        <Trans i18nKey="auth.login">Login</Trans>
      </Button>
      <Button type="tertiary" buttonType={'button'}>
        <Link to={'/auth/register'}>
          <Trans i18nKey="auth.register">Register</Trans>
        </Link>
      </Button>
    </form>
  );
}
