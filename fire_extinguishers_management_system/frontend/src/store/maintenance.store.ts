import { create } from "zustand";

export type MaintenanceRecord = {
  id: string;
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  conditionNoted: string;
  actionDate: string;
};

type MaintenanceStore = {
  records: MaintenanceRecord[];
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  setRecords: (records: MaintenanceRecord[]) => void;
};

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  records: [],
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  setRecords: (records) => set({ records }),
}));
