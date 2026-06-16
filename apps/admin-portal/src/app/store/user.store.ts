import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { AllUserData } from '@my-org/core';

interface UserStore {
  user: User | null;
  userList: AllUserData[] | null;
  setUser: (user: User | null) => void;
  setUserList: (userList: AllUserData[] | null) => void;
  updateUserInList: (userId: string, data: Partial<AllUserData>) => void;
  delete(): void;
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: null,
      userList: null,
      setUser: (user) => set({ user }),
      setUserList: (userList) => set({ userList }),
      updateUserInList: (userId, data) => set((state) => ({
        userList: state.userList?.map((u) => (u.userId === userId || u.id === userId) ? { ...u, ...data } : u) || null
      })),
      delete: () => set(() => ({ user: null, userList: null }))
    }), {
      name: 'admin-user-store'
    })
  )
);
