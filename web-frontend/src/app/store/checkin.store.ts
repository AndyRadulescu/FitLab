import { CheckInFormData } from '../routes/checkIn/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type CheckInFormDataDto = Omit<CheckInFormData, 'imgUrls'> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
};

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
