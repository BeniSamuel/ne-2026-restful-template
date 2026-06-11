import { apiClient } from "./http";
import type { User } from "../store/user.store";

export const userApi = {
  async me() {
    const response = await apiClient.get<{ data: User }>("/users/profile");
    return response.data.data;
  },

  async fetchUsers() {
    const response = await apiClient.get<{ data: User[] }>("/users");
    return response.data.data;
  },
};
