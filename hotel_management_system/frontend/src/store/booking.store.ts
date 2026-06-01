import { create } from "zustand";
import type { Hotel } from "./hotel.store";
import type { User } from "./user.store";

export type BookingStatus = "ACTIVE" | "CHECKED_OUT" | "CANCELLED";

export type Booking = {
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  hotel: Hotel;
  id: number;
  reportGenerated: boolean;
  status: BookingStatus;
  user: User;
};

type BookingStore = {
  bookings: Booking[];
  isLoading: boolean;
  setBookings: (bookings: Booking[]) => void;
  setLoading: (isLoading: boolean) => void;
};

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  isLoading: false,
  setBookings: (bookings) => set({ bookings }),
  setLoading: (isLoading) => set({ isLoading }),
}));
