import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import firebase from 'firebase/compat/app';

interface UserStore {
  user?: firebase.User;
  isLoggedIn: boolean;
  setUser: (user?: firebase.User) => void,
}

export const userStore = create<UserStore>()(
  persist((set) => ({
    token: undefined,
    isLoggedIn: false,
    setUser: (user?: firebase.User) => set((state) => {
      return { user, isLoggedIn: !!user };
    }),
  }), {
    name: 'user-store'
  }));
