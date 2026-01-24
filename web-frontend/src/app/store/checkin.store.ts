import { CheckInFormData } from '../routes/checkIn/checkIn-page';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

export type CheckInFormDataDto = CheckInFormData & { createdAt: Date, id: string };
export type CheckInFormDataDtoFirebase = CheckInFormData & { createdAt: Timestamp, id: string };

interface CheckinStore {
  checkins: CheckInFormDataDto[];
  addCheckin: (checkin: CheckInFormDataDto) => void;
  setCheckin: (checkin: CheckInFormDataDto[]) => void;
}

export const checkinStore = create<CheckinStore>()(
  devtools((set) => ({
    checkins: [],
    addCheckin: (checkin) =>
      set((state) => ({
        checkins: [checkin, ...state.checkins]
      })),
    setCheckin: (checkins) => set((state) => ({ checkins }))
  })));
