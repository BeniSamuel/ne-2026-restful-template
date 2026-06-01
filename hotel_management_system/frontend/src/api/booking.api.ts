import { apiClient } from "./http";
import { useBookingStore, type Booking } from "../store/booking.store";

export type BookingPayload = {
  checkInDate: string;
  checkOutDate: string;
  hotelId: number;
};

export const bookingApi = {
  async cancelBooking(id: number) {
    const response = await apiClient.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  async checkOutBooking(id: number) {
    const response = await apiClient.patch<Booking>(`/bookings/${id}/check-out`);
    return response.data;
  },

  async createBooking(payload: BookingPayload) {
    const response = await apiClient.post<Booking>("/bookings", payload);
    await this.fetchMine();
    return response.data;
  },

  async deleteBooking(id: number) {
    const response = await apiClient.delete<{ message: string }>(`/bookings/${id}`);
    await this.fetchAll();
    return response.data;
  },

  async fetchAll() {
    useBookingStore.getState().setLoading(true);
    try {
      const response = await apiClient.get<Booking[]>("/bookings");
      useBookingStore.getState().setBookings(response.data);
      return response.data;
    } finally {
      useBookingStore.getState().setLoading(false);
    }
  },

  async fetchMine() {
    useBookingStore.getState().setLoading(true);
    try {
      const response = await apiClient.get<Booking[]>("/bookings/mine");
      useBookingStore.getState().setBookings(response.data);
      return response.data;
    } finally {
      useBookingStore.getState().setLoading(false);
    }
  },

  async updateBooking(id: number, payload: Partial<BookingPayload>) {
    const response = await apiClient.patch<Booking>(`/bookings/${id}`, payload);
    await this.fetchAll();
    return response.data;
  },
};
