import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  token: string;
  isLoggedIn: boolean;
  setToken: (token: string) => void,
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const userStore = create<UserStore>()(
  persist((set) => ({
    token: '',
    isLoggedIn: false,
    setToken: (token: string) => set((state) => ({ token })),
    setIsLoggedIn: (isLoggedIn: boolean) => set((state) => ({ isLoggedIn }))
  }), {
    name: 'user-store'
  }));
