import { Button, Select, Surface } from "heroui-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { SwitchField } from "../components/common/SwitchField";
import { useSettingsStore } from "../store/settingsStore";
import { SelectOption } from "../types/heroui";
import { LANGUAGE_OPTIONS } from "../utils/constants";
import { useColorMode } from "../utils/hooks/useColorMode";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useColorMode();

  const {
    theme,
    language,
    // notificationsEnabled,
    setTheme,
    setLanguage,
    // setNotificationsEnabled,
  } = useSettingsStore();

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((l) => l.value === language) ?? LANGUAGE_OPTIONS[0];

  const handleChangeTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    Uniwind.setTheme(nextTheme);
    setTheme(nextTheme);
  };

  const handleChangeLanguage = (option: SelectOption) => {
    const lang = LANGUAGE_OPTIONS.find((l) => l.value === option?.value);
    if (!lang) return;

    setLanguage(lang.value);
    i18n.changeLanguage(lang.value);
  };

  return (
    <View
      className="flex-1 bg-background px-4 py-6"
      style={{ paddingTop: insets.top }}
    >
      <Text className="mb-6 text-2xl font-semibold text-foreground">
        {t("settings.title")}
      </Text>
      <View className="gap-4">
        <Surface variant="quaternary">
          <SwitchField
            isSelected={isDarkMode}
            onSelectedChange={handleChangeTheme}
            title={t("settings.apperance")}
            description={t(`settings.${isDarkMode ? "dark" : "light"}`)}
          />
        </Surface>

        {/* TODO: set notifications */}
        {/* <Surface variant="quaternary">
          <SwitchField
            isSelected={notificationsEnabled}
            onSelectedChange={setNotificationsEnabled}
            title={t("settings.notifications")}
            description={t(
              `common.${notificationsEnabled ? "turnOn" : "turnOff"}`
            )}
          />
        </Surface> */}

        <Surface variant="quaternary">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-base font-semibold text-foreground">
                {t("settings.language")}
              </Text>
              <Text className="text-sm text-gray-400">
                {selectedLanguage.label}
              </Text>
            </View>
            <Select
              value={selectedLanguage}
              onValueChange={handleChangeLanguage}
            >
              <Select.Trigger asChild>
                <Button variant="secondary" className="min-w-[120px]">
                  <Text className="text-sm text-accent">
                    {selectedLanguage.label}
                  </Text>
                </Button>
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content width={220} placement="bottom" align="end">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>
          </View>
        </Surface>
      </View>
    </View>
  );
}
