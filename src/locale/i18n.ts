import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getDeviceLanguage } from "../utils/localization";

import cs from "./cs.json";
import en from "./en.json";

const resources = {
  en: { translation: en },
  cs: { translation: cs },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "cs"],
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;
