import { create } from "zustand";
import { colors } from "../theme/color.theme";

type ThemeStore = {
  isSidebarCollapsed: boolean;
  primaryColor: string;
  setPrimaryColor: (primaryColor: string) => void;
  toggleSidebar: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  isSidebarCollapsed: true,
  primaryColor: colors.primary,
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
