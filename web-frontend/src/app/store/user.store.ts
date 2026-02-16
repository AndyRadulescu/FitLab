import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import { StartPageFormData } from '../routes/start-page/start-page';

export type StartPageFormDataDto = Omit<StartPageFormData, 'dateOfBirth'> & { dateOfBirth?: string };

interface UserStore {
  user?: firebase.User;
  userData?: StartPageFormDataDto;
  isLoggedIn: boolean;
  setUser: (user?: firebase.User) => void,
  setUserData: (user?: StartPageFormDataDto) => void,
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: undefined,
      userData: undefined,
      isLoggedIn: false,
      setUser: (user?: firebase.User) => set((state) => {
        return { ...state, user, isLoggedIn: !!user };
      }),
      setUserData: (initData?: StartPageFormDataDto) => set((state) => {
        return { ...state, userData: initData };
      })
    }), {
      name: 'user-store'
    })));
