import { Card } from "heroui-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useItemsStore } from "../store/itemsStore";
import { TIME_SLOTS } from "../utils/constants";
import { isItemActiveToday } from "../utils/item";

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const items = useItemsStore((s) => s.items);
  const itemsForToday = items.filter((item) => isItemActiveToday(item));

  return (
    <View
      className="flex-1 bg-background px-4 py-6"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView>
        {TIME_SLOTS.map((slot) => {
          const slotItems = itemsForToday.filter((item) =>
            item.timesOfDay?.includes(slot)
          );

          if (slotItems.length === 0) return;

          return (
            <View key={slot} className="mb-6">
              <Text className="text-xl font-semibold text-foreground mb-2">
                {t(`items.timeSlots.${slot}`)}
              </Text>
              {slotItems.map((item) => (
                <Card key={item.id} className="mb-2" variant="quaternary">
                  <Card.Body className="flex flex-row justify-between">
                    <Text className="text-sm font-semibold text-foreground">
                      {item.name}
                    </Text>
                    {item.amount > 1 && (
                      <Text className="text-sm font-semibold text-foreground">
                        {t("items.amount")}: {item.amount}
                      </Text>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
