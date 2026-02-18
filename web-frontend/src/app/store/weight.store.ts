import { create } from 'zustand';
import { userStore } from './user.store';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import { WEIGHT_TABLE, getWeightQuery } from '../firestore/queries';
import { getDocs } from 'firebase/firestore';

interface WeightState {
  weight: number | null;
  isUpdatedToday: boolean;
  fetchWeight: () => Promise<void>;
  saveWeight: (weight: number) => Promise<void>;
}

export const useWeightStore = create<WeightState>((set, get) => ({
  weight: null,
  isUpdatedToday: false,
  fetchWeight: async () => {
    const user = userStore.getState().user;
    if (!user) return;

    const querySnapshot = await getDocs(getWeightQuery(user));
    if (!querySnapshot.empty) {
      const latestWeight = querySnapshot.docs[0].data();
      const today = new Date().toDateString();
      const lastUpdate = latestWeight.createdAt.toDate().toDateString();
      set({
        weight: latestWeight.weight,
        isUpdatedToday: today === lastUpdate,
      });
    }
  },
  saveWeight: async (weight: number) => {
    const user = userStore.getState().user;
    if (!user) return;

    await addDoc(collection(db, WEIGHT_TABLE), {
      userId: user.uid,
      weight,
      createdAt: serverTimestamp(),
    });

    set({ weight, isUpdatedToday: true });
  },
}));
