import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  delete(): void;
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: null,
      setUser: (user: User | null) => set((state) => ({ ...state, user })),
      delete: () => set(() => ({ user: null })),
    }), {
      name: 'admin-user-store'
    })
  )
);
