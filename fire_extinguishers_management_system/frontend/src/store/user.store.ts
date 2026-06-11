import { create } from "zustand";

export type Role = "ADMIN" | "INSPECTOR" | "USER";

export type User = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: Role;
  accountStatus?: "ACTIVE" | "INACTIVE";
};

type UserStore = {
  accessToken: string | null;
  currentUser: User | null;
  rememberMe: boolean;
  logout: () => void;
  setRememberMe: (rememberMe: boolean) => void;
  setSession: (accessToken: string, user: User) => void;
};

const sessionKey = "fire-extinguisher-session";
const savedSession = localStorage.getItem(sessionKey);
const initialSession = savedSession
  ? (JSON.parse(savedSession) as { accessToken: string; currentUser: User })
  : null;

export const useUserStore = create<UserStore>((set) => ({
  accessToken: initialSession?.accessToken ?? null,
  currentUser: initialSession?.currentUser ?? null,
  rememberMe: true,
  logout: () => {
    localStorage.removeItem(sessionKey);
    set({ accessToken: null, currentUser: null });
  },
  setRememberMe: (rememberMe) => set({ rememberMe }),
  setSession: (accessToken, currentUser) => {
    localStorage.setItem(sessionKey, JSON.stringify({ accessToken, currentUser }));
    set({ accessToken, currentUser });
  },
}));
