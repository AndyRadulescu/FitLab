import { auth } from '../../../init-firebase-auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Input } from '../../design/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {

  const onSignInWithEmailAndPassword = (data: FormData) => {
    console.log(data);
    void signInWithEmailAndPassword(auth, data.email, data.password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      console.log(errorMessage);
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  return (
    <form className="mb-6 px-4" onSubmit={handleSubmit(data => onSignInWithEmailAndPassword(data))}>
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <button
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-violet-500 to-fuchsia-500"
        disabled={isSubmitting}>
        Login
      </button>
      <div className="w-full justify-center flex">
        <Link to={'/auth/register'}>Register</Link>
      </div>
    </form>
  );
}
