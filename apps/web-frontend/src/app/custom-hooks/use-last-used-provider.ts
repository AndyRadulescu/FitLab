import { useState, useEffect } from 'react';

export const LAST_USED_PROVIDER_KEY = 'fitlab_last_used_login_provider';

export type AuthProviderType = 'facebook' | 'google' | 'email' | string;

export function getLastUsedProvider(): AuthProviderType | null {
  try {
    return localStorage.getItem(LAST_USED_PROVIDER_KEY);
  } catch {
    return null;
  }
}

export function setLastUsedProvider(provider: AuthProviderType): void {
  try {
    localStorage.setItem(LAST_USED_PROVIDER_KEY, provider);
    window.dispatchEvent(new Event('storage_last_used_provider'));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function useLastUsedProvider() {
  const [lastUsedProvider, setProviderState] = useState<AuthProviderType | null>(() => getLastUsedProvider());

  useEffect(() => {
    const handleStorageChange = () => {
      setProviderState(getLastUsedProvider());
    };

    window.addEventListener('storage_last_used_provider', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage_last_used_provider', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateProvider = (provider: AuthProviderType) => {
    setLastUsedProvider(provider);
    setProviderState(provider);
  };

  return {
    lastUsedProvider,
    setLastUsedProvider: updateProvider,
  };
}
