import { Entypo } from "@expo/vector-icons";
import { Button, Card, Chip, Switch } from "heroui-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { Item, TimeSlot } from "../../types/item";
import { TIME_SLOTS, WEEKDAY_VALUES } from "../../utils/constants";

interface Props {
  data: Item;
  onArchivedChange?: (archived: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MedicationItem = ({
  data,
  onArchivedChange,
  onEdit,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  const { name, timesOfDay, cycle, archived } = data;

  const isArchived = !!archived;

  const timeSlotToLabel: Record<TimeSlot, string> = TIME_SLOTS.reduce(
    (acc, slot) => {
      acc[slot] = t(`items.timeSlots.${slot}`);
      return acc;
    },
    {} as Record<TimeSlot, string>
  );

  const weekdayLabelMap: Record<number, string> = WEEKDAY_VALUES.reduce(
    (acc, day) => {
      acc[day] = t(`items.weekdayShort.${day}`);
      return acc;
    },
    {} as Record<number, string>
  );

  let scheduleLabel: string;
  if (cycle.type === "specificDaysOfWeek") {
    if (!cycle.daysOfWeek || cycle.daysOfWeek.length === 0) {
      scheduleLabel = t("items.schedule.specificDaysMissing");
    } else {
      const days = cycle.daysOfWeek
        .map((d) => weekdayLabelMap[d] ?? String(d))
        .join(", ");
      scheduleLabel = t("items.schedule.daysOfWeek", { days });
    }
  } else {
    scheduleLabel = t("items.schedule.everyDay");
  }

  let cycleLabel: string;
  switch (cycle.type) {
    case "continuous":
      cycleLabel = t("items.cycle.continuous");
      break;
    case "onOff":
      if (cycle.onDurationDays && cycle.offDurationDays) {
        cycleLabel = t("items.cycle.onOff", {
          on: cycle.onDurationDays,
          off: cycle.offDurationDays,
        });
      } else {
        cycleLabel = t("items.cycle.onOffMissing");
      }
      break;
    case "specificDaysOfWeek":
      cycleLabel = t("items.cycle.specificDaysOfWeek");
      break;
    default:
      cycleLabel = t("items.cycle.unknown");
      break;
  }

  const timesOfDayChips =
    !timesOfDay || timesOfDay.length === 0 ? (
      <Text className="text-foreground text-xs">{t("items.noTime")}</Text>
    ) : (
      <View className="flex-row flex-wrap gap-1 mt-1">
        {timesOfDay.map((time) => (
          <Chip key={time} size="sm" variant="soft" color="default">
            {timeSlotToLabel[time]}
          </Chip>
        ))}
      </View>
    );

  return (
    <Card className="flex mb-2 rounded-2xl" variant="quaternary">
      <Card.Header className="flex-row justify-between items-center gap-2">
        <Text
          numberOfLines={1}
          className="text-foreground font-semibold text-base flex-1 pr-2"
        >
          {name}
        </Text>

        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-foreground mr-1">
            {t("items.archive")}
          </Text>
          <Switch
            isSelected={isArchived}
            onSelectedChange={(value) => onArchivedChange?.(value)}
          />
        </View>
      </Card.Header>

      <Card.Body className="gap-2 mt-1">
        <View className="flex flex-row items-center gap-4">
          <Text className="text-xs text-foreground mb-1">
            {t("items.timeOfUse")}
          </Text>
          {timesOfDayChips}
        </View>

        <View className="flex mt-1 flex-row gap-4">
          <Text className="text-xs text-foreground mb-1">
            {t("items.frequency")}
          </Text>
          <Chip size="sm" variant="soft">
            {scheduleLabel}
          </Chip>
        </View>

        <View className="flex flex-row mt-1 gap-4">
          <Text className="text-xs text-foreground mb-1">
            {t("items.cycleUsage")}
          </Text>
          <Chip size="sm" variant="soft">
            {cycleLabel}
          </Chip>
        </View>

        {isArchived && (
          <View className="mt-2">
            <Chip size="sm" color="warning" variant="soft">
              {t("items.archived")}
            </Chip>
          </View>
        )}
      </Card.Body>

      <Card.Footer className="flex-row justify-between w-full gap-2 mt-2">
        <Button
          size="sm"
          variant="danger-soft"
          className="text-danger-500"
          onPress={onDelete}
          isDisabled={!onDelete}
        >
          <Entypo name="trash" size={24} color="black" />
          <Button.Label>{t("common.delete")}</Button.Label>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={onEdit}
          isDisabled={!onEdit}
        >
          <Entypo name="edit" size={24} color="black" />
          <Button.Label>{t("items.edit")}</Button.Label>
        </Button>
      </Card.Footer>
    </Card>
  );
};
