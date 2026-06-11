import { create } from "zustand";

export type Extinguisher = {
  id: string;
  serialNumber: string;
  location: string;
  type: "WATER" | "CARBON_DIOXIDE" | "FOAM" | "DRY_CHEMICAL";
  size: "2.5_LBS" | "5_LBS" | "9_LBS" | "12_LBS";
  installationDate: string;
  expiryDate: string;
  status: "ACTIVE" | "EXPIRED" | "UNDER_MAINTENANCE" | "DECOMMISSIONED";
};

type ExtinguisherStore = {
  extinguishers: Extinguisher[];
  isLoading: boolean;
  setExtinguishers: (extinguishers: Extinguisher[]) => void;
  setLoading: (isLoading: boolean) => void;
};

export const useExtinguisherStore = create<ExtinguisherStore>((set) => ({
  extinguishers: [],
  isLoading: false,
  setExtinguishers: (extinguishers) => set({ extinguishers }),
  setLoading: (isLoading) => set({ isLoading }),
}));
