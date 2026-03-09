import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface UserStore {
  user: User | null;
  isAdmin: boolean | null;
  setUser: (user: User | null) => void;
  setAdmin: (isAdmin: boolean) => void;
  delete(): void;
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: null,
      isAdmin: null,
      setUser: (user: User | null) => set((state) => ({ ...state, user })),
      setAdmin: (isAdmin: boolean) => set((state) => ({ ...state, isAdmin })),
      delete: () => set(() => ({ user: null, isAdmin: null })),
    }), {
      name: 'admin-user-store'
    })
  )
);
