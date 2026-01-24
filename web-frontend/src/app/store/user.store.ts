import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import { StartPageFormData } from '../routes/start-page/start-page';

export type StartPageFormDataDto = Omit<StartPageFormData, 'dateOfBirth'> & { dateOfBirth?: string };

interface UserStore {
  user?: firebase.User;
  initData?: StartPageFormDataDto;
  isLoggedIn: boolean;
  setUser: (user?: firebase.User) => void,
  setInitData: (user?: StartPageFormDataDto) => void,
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: undefined,
      initData: undefined,
      isLoggedIn: false,
      setUser: (user?: firebase.User) => set((state) => {
        return { ...state, user, isLoggedIn: !!user };
      }),
      setInitData: (initData?: StartPageFormDataDto) => set((state) => {
        return { ...state, initData: initData };
      })
    }), {
      name: 'user-store'
    })));
