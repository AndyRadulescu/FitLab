import { CheckInFormData } from '../routes/checkIn/checkIn-page';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

export type CheckInFormDataDto = Omit<CheckInFormData, 'imgUrls'> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
export type CheckInPayload = Omit<CheckInFormData, 'imgUrls'> & {
  id: string;
  userId: string;
};
export type CheckInFormDataDtoFirebase = CheckInFormData & { createdAt: Timestamp, updatedAt: Timestamp, id: string };

interface CheckinStore {
  checkins: CheckInFormDataDto[];
  upsertCheckin: (checkin: CheckInFormDataDto) => void;
  deleteCheckin: (id: string) => void;
  setCheckin: (checkin: CheckInFormDataDto[]) => void;
  delete: () => void;
}

export const checkinStore = create<CheckinStore>()(
  devtools((set) => ({
    checkins: [],
    upsertCheckin: (data) =>
      set((state) => {
        const isNew = !state.checkins.some((item) => item.id === data.id);

        return {
          checkins: isNew
            ? [data, ...state.checkins]
            : state.checkins.map((item) =>
              item.id === data.id ? { ...item, ...data } : item
            )
        };
      }),
    deleteCheckin: (id: string) =>
      set((state) => ({
        checkins: state.checkins.filter((item) => item.id !== id)
      })),
    setCheckin: (checkins) => set((state) => ({ checkins })),
    delete: () => set(() => ({ checkins: [] }))
  })));
