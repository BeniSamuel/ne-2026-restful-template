import { create } from "zustand";

export type Hotel = {
  availability: "AVAILABLE" | "BOOKED";
  id: number;
  location: string;
  name: string;
  rooms: number;
};

type HotelStore = {
  hotels: Hotel[];
  isLoading: boolean;
  setHotels: (hotels: Hotel[]) => void;
  setLoading: (isLoading: boolean) => void;
};

export const useHotelStore = create<HotelStore>((set) => ({
  hotels: [],
  isLoading: false,
  setHotels: (hotels) => set({ hotels }),
  setLoading: (isLoading) => set({ isLoading }),
}));
