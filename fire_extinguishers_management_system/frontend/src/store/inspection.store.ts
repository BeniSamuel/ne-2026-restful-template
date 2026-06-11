import { create } from "zustand";

export type InspectionStatus = "SCHEDULED" | "PASSED" | "FAILED" | "CANCELLED";

export type Inspection = {
  id: string;
  extinguisherId: string;
  inspectorId: string;
  scheduledDate: string;
  inspectionStatus: InspectionStatus;
  notes?: string;
};

type InspectionStore = {
  inspections: Inspection[];
  isLoading: boolean;
  setInspections: (inspections: Inspection[]) => void;
  setLoading: (isLoading: boolean) => void;
};

export const useInspectionStore = create<InspectionStore>((set) => ({
  inspections: [],
  isLoading: false,
  setInspections: (inspections) => set({ inspections }),
  setLoading: (isLoading) => set({ isLoading }),
}));
