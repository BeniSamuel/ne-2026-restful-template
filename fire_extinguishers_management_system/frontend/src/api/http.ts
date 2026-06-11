import axios from "axios";
import { useUserStore } from "../store/user.store";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = useUserStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
