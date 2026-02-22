import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import { StartPageFormData } from '../routes/start-page/start-page';

export type StartPageFormDataDto = Omit<StartPageFormData, 'dateOfBirth'> & { dateOfBirth?: string };
export type Weight = { id: string; weight: number, createdAt: Date, updatedAt?: Date, from?: 'checkin' | 'weight' };

interface UserStore {
  user?: firebase.User;
  weights: Weight[];
  userData?: StartPageFormDataDto;
  setUser: (user?: firebase.User) => void,
  setUserData: (user?: StartPageFormDataDto) => void,
  setWeights: (user?: Weight[]) => void,
  addWeight: (weight: Weight) => void;
  updateWeight: (weight: Weight) => void;
  delete(): void;
}

export const userStore = create<UserStore>()(
  devtools(
    persist((set) => ({
      user: undefined,
      weights: [],
      userData: undefined,
      setUser: (user?: firebase.User) => set((state) => {
        return { ...state, user, isLoggedIn: !!user };
      }),
      setUserData: (initData?: StartPageFormDataDto) => set((state) => {
        return { ...state, userData: initData };
      }),
      setWeights: (weights?: Weight[]) => set((state) => ({ weights: weights ?? [] })),
      addWeight: (weight: Weight) => set((state) => ({ weights: [...state.weights, weight] })),
      delete: () => set(() => ({ user: undefined, userData: undefined, weights: [] })),
      updateWeight: (weight: Weight) => set((state) => ({
        weights: state.weights.map(w => w.id === weight.id ? weight : w)
      }))
    }), {
      name: 'user-store'
    })));
