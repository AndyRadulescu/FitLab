import { CheckInFormData } from '../routes/checkIn/checkIn-page';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

export type CheckInFormDataDto = CheckInFormData & { createdAt: Date, id: string };
export type CheckInFormDataDtoFirebase = CheckInFormData & { createdAt: Timestamp, id: string };

interface CheckinStore {
  checkins: CheckInFormDataDto[];
  upsertCheckin: (checkin: CheckInFormDataDto) => void;
  setCheckin: (checkin: CheckInFormDataDto[]) => void;
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
    setCheckin: (checkins) => set((state) => ({ checkins }))
  })));
