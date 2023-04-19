import { addDays } from "date-fns";
import { create } from "zustand";

interface RangeDatePickerStore {
  date: {
    from: Date;
    to: Date;
  };
  setDate: (date: { from: Date; to: Date }) => void;
}

export const useRangeDatePickerStore = create<RangeDatePickerStore>((set) => ({
  date: {
    from: new Date(),
    to: addDays(new Date(), 20),
  },
  setDate: (date: { from: Date; to: Date }) => {
    set((state) => ({
      date,
    }));
  },
}));
