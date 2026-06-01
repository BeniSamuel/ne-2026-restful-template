import { apiClient } from "./http";
import type { User } from "../store/user.store";

export const userApi = {
  async me() {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  },
};
