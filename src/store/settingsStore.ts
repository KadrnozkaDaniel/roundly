import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AppLanguage, getDeviceLanguage } from "../utils/localization";

export type AppTheme = "light" | "dark";

const getSystemTheme = (): AppTheme => {
  const scheme = Appearance.getColorScheme();
  return scheme === "dark" ? "dark" : "light";
};

interface SettingsState {
  theme: AppTheme;
  language: AppLanguage;
  notificationsEnabled: boolean;

  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: AppLanguage) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: getSystemTheme(),
      language: getDeviceLanguage(),
      notificationsEnabled: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
