import { auth } from '../../../init-firebase-auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Input } from '../../design/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { handleAuthErrors } from './error-handler';

const loginSchema = z.object({
  email: z.email('errors.email.invalid'),
  password: z.string().min(6, 'errors.password.min')
    .max(30, 'errors.password.max')
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const onLogInWithEmailAndPassword = (data: LoginFormData) => {
    void signInWithEmailAndPassword(auth, data.email, data.password).catch((err) => {
      handleAuthErrors(err, t);
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <form onSubmit={handleSubmit(data => onLogInWithEmailAndPassword(data))}>
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
      <button
        className="w-full hover:bg-amber-500 text-white pointer font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-amber-300 to-red-900"
        disabled={isSubmitting}>
        <Trans i18nKey="auth.login">Login</Trans>
      </button>
      <div className="w-full justify-center flex">
        <Link to={'/auth/register'}>
          <Trans i18nKey="auth.register">Register</Trans>
        </Link>
      </div>
    </form>
  );
}
