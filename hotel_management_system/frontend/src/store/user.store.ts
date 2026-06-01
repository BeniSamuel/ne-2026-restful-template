import { create } from "zustand";

export type Role = "ADMIN" | "CLIENT";

export type User = {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  role: Role;
};

type UserStore = {
  accessToken: string | null;
  currentUser: User | null;
  rememberMe: boolean;
  logout: () => void;
  setRememberMe: (rememberMe: boolean) => void;
  setSession: (accessToken: string, user: User) => void;
};

const savedSession = localStorage.getItem("hotel-session");
const initialSession = savedSession
  ? (JSON.parse(savedSession) as { accessToken: string; currentUser: User })
  : null;

export const useUserStore = create<UserStore>((set) => ({
  accessToken: initialSession?.accessToken ?? null,
  currentUser: initialSession?.currentUser ?? null,
  rememberMe: true,
  logout: () => {
    localStorage.removeItem("hotel-session");
    set({ accessToken: null, currentUser: null });
  },
  setRememberMe: (rememberMe) => set({ rememberMe }),
  setSession: (accessToken, currentUser) => {
    localStorage.setItem("hotel-session", JSON.stringify({ accessToken, currentUser }));
    set({ accessToken, currentUser });
  },
}));
