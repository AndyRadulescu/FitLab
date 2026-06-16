import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { AllUserData } from '@my-org/core';

interface UserStore {
  user: User | null;
  userList: AllUserData[] | null;
  setUser: (user: User | null) => void;
  setUserList: (user: AllUserData[] | null) => void;
  delete(): void;
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: null,
      userList: null,
      setUser: (user) => set({ user }),
      setUserList: (userList) => set({ userList }),
      delete: () => set(() => ({ user: null, userList: null }))
    }), {
      name: 'admin-user-store'
    })
  )
);
