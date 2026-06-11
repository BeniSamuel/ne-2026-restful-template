import { apiClient } from "./http";
import { useUserStore, type User } from "../store/user.store";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type SetupPasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};

type LoginResponse = {
  accessToken: string;
  user: User;
};

export const authApi = {
  async login(payload: LoginPayload) {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload);
    useUserStore.getState().setSession(response.data.accessToken, response.data.user);
    return response.data;
  },

  async signup(payload: SignupPayload) {
    const response = await apiClient.post<User>("/auth/register", payload);
    return response.data;
  },

  async setupPassword(payload: SetupPasswordPayload) {
    const response = await apiClient.post("/auth/setup-password", payload);
    return response.data;
  },
};
