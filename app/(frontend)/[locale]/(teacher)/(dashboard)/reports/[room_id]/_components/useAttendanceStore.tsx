import { create } from "zustand";

type AttendanceStore = {
	data: any | null;
	setData: (data: any) => void;
};

export const useAttendanceStore = create<AttendanceStore>((set) => ({
	data: null,
	setData: (data) => set({ data }),
}));
