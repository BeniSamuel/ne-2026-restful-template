import { apiClient } from "./http";
import { useHotelStore, type Hotel } from "../store/hotel.store";

const fallbackHotels: Hotel[] = [
  { availability: "AVAILABLE", id: 1, location: "Kigali", name: "Template Hotel", rooms: 24 },
  { availability: "AVAILABLE", id: 2, location: "Musanze", name: "Exam Demo Lodge", rooms: 12 },
];

export const hotelApi = {
  async fetchHotels() {
    useHotelStore.getState().setLoading(true);

    try {
      const response = await apiClient.get<Hotel[]>("/hotels");
      useHotelStore.getState().setHotels(response.data);
      return response.data;
    } catch {
      useHotelStore.getState().setHotels(fallbackHotels);
      return fallbackHotels;
    } finally {
      useHotelStore.getState().setLoading(false);
    }
  },

  async createHotel(payload: Pick<Hotel, "location" | "name" | "rooms">) {
    const response = await apiClient.post<Hotel>("/hotels", payload);
    await this.fetchHotels();
    return response.data;
  },

  async deleteHotel(id: number) {
    const response = await apiClient.delete<{ message: string }>(`/hotels/${id}`);
    await this.fetchHotels();
    return response.data;
  },

  async updateHotel(id: number, payload: Partial<Pick<Hotel, "location" | "name" | "rooms">>) {
    const response = await apiClient.patch<Hotel>(`/hotels/${id}`, payload);
    await this.fetchHotels();
    return response.data;
  },
};
