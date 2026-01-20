import { getLocales } from "expo-localization";

export type AppLanguage = "cs" | "en";

export const getDeviceLanguage = () => {
  const locales = getLocales();
  const langCode = locales[0]?.languageCode ?? "en";

  if (langCode === "cs") return "cs";
  return "en";
};
