import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Uniwind } from "uniwind";
import "../../global.css";
import "../locale/i18n";
import { useSettingsStore } from "../store/settingsStore";

export default function RootLayout() {
  const { t, i18n } = useTranslation();
  const { theme, language } = useSettingsStore();

  useEffect(() => {
    Uniwind.setTheme(theme);
    i18n.changeLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, language]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <StatusBar style="auto" />
        <NativeTabs minimizeBehavior="onScrollDown">
          <NativeTabs.Trigger name="index">
            <Label>{t("tabs.home")}</Label>
            {Platform.select({
              ios: <Icon sf="house.fill" />,
              android: (
                <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
              ),
            })}
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="items">
            <Label>{t("tabs.items")}</Label>
            {Platform.select({
              ios: <Icon sf="list.bullet" />,
              android: (
                <Icon
                  src={
                    <VectorIcon
                      family={MaterialIcons}
                      name="format-list-bulleted"
                    />
                  }
                />
              ),
            })}
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="settings">
            <Label>{t("tabs.settings")}</Label>
            {Platform.select({
              ios: <Icon sf="gear" />,
              android: (
                <Icon
                  src={<VectorIcon family={MaterialIcons} name="settings" />}
                />
              ),
            })}
          </NativeTabs.Trigger>
        </NativeTabs>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
