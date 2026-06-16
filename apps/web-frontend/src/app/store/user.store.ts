import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import { StartPageFormDataDto, UserStore, Weight } from '@my-org/core';

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
      })),
      deleteWeight: (id: string) => set((state) => ({
        weights: state.weights.filter(w => w.id !== id)
      }))
    }), {
      name: 'user-store'
    })));
