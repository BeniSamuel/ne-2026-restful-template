import { create } from "zustand";

export type Report = {
  generatedAt: string;
  id: number;
  periodEnd: string;
  periodStart: string;
  totalBookings: number;
  totalCheckedOutBookings: number;
};

type ReportStore = {
  reports: Report[];
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  setReports: (reports: Report[]) => void;
};

export const useReportStore = create<ReportStore>((set) => ({
  reports: [],
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  setReports: (reports) => set({ reports }),
}));
