import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (<div>Register
      <div className="w-full justify-center flex">
        <Link to={'/auth/login'}>Login</Link>
      </div>
    </div>
  );
}
