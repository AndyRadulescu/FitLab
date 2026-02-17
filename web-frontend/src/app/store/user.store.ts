import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import { StartPageFormData } from '../routes/start-page/start-page';

export type StartPageFormDataDto = Omit<StartPageFormData, 'dateOfBirth'> & { dateOfBirth?: string };
export type Weight = { weight: number, createdAt: Date, updatedAt?: Date };

interface UserStore {
  user?: firebase.User;
  weight: Weight[];
  userData?: StartPageFormDataDto;
  isLoggedIn: boolean;
  setUser: (user?: firebase.User) => void,
  setUserData: (user?: StartPageFormDataDto) => void,
  setWeights: (user?: Weight[]) => void,
  addWeight: (weight: Weight) => void
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: undefined,
      weight: [],
      userData: undefined,
      isLoggedIn: false,
      setUser: (user?: firebase.User) => set((state) => {
        return { ...state, user, isLoggedIn: !!user };
      }),
      setUserData: (initData?: StartPageFormDataDto) => set((state) => {
        return { ...state, userData: initData };
      }),
      setWeights: (weights?: Weight[]) => set((state) => ({ weight: weights ?? [] })),
      addWeight: (weight: Weight) => set((state) => ({ weight: [...state.weight, weight] }))
    }), {
      name: 'user-store'
    })));
