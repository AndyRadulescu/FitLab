import { Auth } from 'firebase/auth';
import { Analytics } from 'firebase/analytics';
import { TFunction } from 'i18next';
import { ReactNode, createContext, useContext } from 'react';

export type AuthErrorHandler = (err: any, translator: TFunction<'translation', undefined>) => void;

export interface AuthContextProps {
  auth: Auth;
  analytics: Analytics | null;
  handleAuthErrors: AuthErrorHandler;
  redirectPath: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children, ...props }: AuthContextProps & { children: ReactNode }) {
  return (
    <AuthContext.Provider value={props}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
