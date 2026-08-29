import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User as AuthUser } from 'firebase/auth';
import { AllUserData, User as CoreUser } from '@my-org/core';

interface UserStore {
  user: AuthUser | null;
  userProfile: CoreUser | null;
  userList: AllUserData[] | null;
  setUser: (user: AuthUser | null) => void;
  setUserProfile: (userProfile: CoreUser | null) => void;
  setUserList: (userList: AllUserData[] | null) => void;
  updateUserInList: (userId: string, data: Partial<AllUserData>) => void;
  addUserToList: (user: AllUserData) => void;
  removeUserFromList: (userId: string) => void;
  delete(): void;
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: null,
      userProfile: null,
      userList: null,
      setUser: (user) => set({ user }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setUserList: (userList) => set({ userList }),
      updateUserInList: (userId, data) => set((state) => ({
        userList: state.userList?.map((u) => (u.userId === userId || u.id === userId) ? { ...u, ...data } : u) || null
      })),
      addUserToList: (user) => set((state) => {
        const exists = state.userList?.some((u) => (u.userId === user.userId || u.id === user.id || u.userId === user.id || u.id === user.userId));
        if (exists) {
          return {
            userList: state.userList?.map((u) => (u.userId === user.userId || u.id === user.id || u.userId === user.id || u.id === user.userId) ? { ...u, ...user } : u) || [user]
          };
        }
        return {
          userList: state.userList ? [user, ...state.userList] : [user]
        };
      }),
      removeUserFromList: (userId) => set((state) => ({
        userList: state.userList?.filter((u) => u.userId !== userId && u.id !== userId) || null
      })),
      delete: () => set(() => ({ user: null, userProfile: null, userList: null }))
    }), {
      name: 'admin-user-store'
    })
  )
);
