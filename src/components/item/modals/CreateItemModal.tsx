import { useItemsStore } from "@/src/store/itemsStore";
import { CycleType, Item, TimeSlot } from "@/src/types/item";
import { CYCLE_TYPES, TIME_SLOTS, WEEKDAY_VALUES } from "@/src/utils/constants";
import { useNewItemSchema } from "@/src/utils/validation/useNewItemSchema";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useField, useForm } from "@tanstack/react-form";
import { Button, Dialog, Select } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { TextField } from "../../common/TextField";

interface Props {
  open: boolean;
  data: Item | null;
  onClose: () => void;
}

export const CreateItemModal = ({ open, data, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const newItemSchema = useNewItemSchema();
  const addItem = useItemsStore((s) => s.addItem);
  const updateItem = useItemsStore((s) => s.updateItem);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const pickerLocale = i18n.language?.startsWith("cs") ? "cs-CZ" : "en-US";

  const formatStartDate = (value?: string) => {
    if (!value) return t("items.createModal.startDatePlaceholder");
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  };

  const defaultValues = data
    ? {
        name: data.name,
        amount: data.amount,
        cycle: {
          type: {
            value: data.cycle.type,
            label: t(`items.cycleTypes.${data.cycle.type}`),
          },
          startDate: data.cycle.startDate,
          onDurationDays: data.cycle.onDurationDays,
          offDurationDays: data.cycle.offDurationDays,
          daysOfWeek: data.cycle.daysOfWeek,
        },
        timesOfDay: data.timesOfDay,
        archived: data.archived,
      }
    : {
        name: "",
        amount: 1,
        cycle: {
          type: {
            value: "continuous",
            label: t("items.cycleTypes.continuous"),
          },
          startDate: new Date().toISOString(),
          onDurationDays: undefined,
          offDurationDays: undefined,
          daysOfWeek: [],
        },
        timesOfDay: ["morning"] as Item["timesOfDay"],
        archived: false,
      };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log("odesílám", value);
      const body: Omit<Item, "id"> = {
        name: value.name,
        amount: value.amount,
        cycle: {
          type: value.cycle.type.value as CycleType,
          startDate: value.cycle.startDate,
          onDurationDays: value.cycle.onDurationDays,
          offDurationDays: value.cycle.offDurationDays,
          daysOfWeek: value.cycle.daysOfWeek,
        },
        timesOfDay: value.timesOfDay,
        archived: false,
      };

      if (data) {
        updateItem(data.id, body);
      } else {
        addItem(body);
      }
      onClose();
    },
  });

  const handleStartDateChange = (_: any, date?: Date) => {
    if (Platform.OS === "android") setShowStartDatePicker(false);

    if (!date) return;

    const iso = date.toISOString();
    form.setFieldValue("cycle.startDate", iso);
  };

  const cycleValue = useField({ form, name: "cycle.type" }).state.value;

  return (
    <Dialog isOpen={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content style={{ maxHeight: 600 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView>
              <View className="mb-8 gap-1.5">
                <Dialog.Title>{t("items.createModal.title")}</Dialog.Title>

                <form.Field
                  name="name"
                  validators={{ onChange: newItemSchema.shape.name }}
                >
                  {({ state, handleBlur, handleChange }) => (
                    <TextField
                      required
                      label={t("items.createModal.nameLabel")}
                      placeholder={t("items.createModal.namePlaceholder")}
                      keyboardType="default"
                      autoCapitalize="none"
                      value={state.value}
                      onChangeText={handleChange}
                      onBlur={handleBlur}
                      error={state.meta.errors[0]?.message}
                    />
                  )}
                </form.Field>

                <form.Field name="amount">
                  {(field) => (
                    <TextField
                      required
                      label={t("items.createModal.amountLabel")}
                      placeholder={t("items.createModal.amountPlaceholder")}
                      keyboardType="numeric"
                      value={field.state.value?.toString() ?? ""}
                      onChangeText={(text) => field.handleChange(Number(text))}
                      containerClassName="mt-2"
                    />
                  )}
                </form.Field>

                <form.Field name="timesOfDay">
                  {(field) => {
                    const selected = field.state.value ?? [];

                    const toggle = (slot: TimeSlot) => {
                      const isSelected = selected.includes(slot);
                      const next = isSelected
                        ? selected.filter((s) => s !== slot)
                        : [...selected, slot];

                      field.handleChange(next);
                    };

                    return (
                      <View className="mt-4">
                        <Text className="text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">
                          {t("items.createModal.timesOfDayLabel")}
                        </Text>

                        <View className="flex-row flex-wrap gap-2">
                          {TIME_SLOTS.map((option) => {
                            const isSelected = selected.includes(option);

                            return (
                              <Button
                                key={option}
                                className={`h-8 px-3 rounded-full border ${
                                  isSelected
                                    ? "bg-indigo-600 border-indigo-500"
                                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                                }`}
                                onPress={() => toggle(option)}
                              >
                                <Text
                                  className={`text-sm ${
                                    isSelected
                                      ? "text-white"
                                      : "text-zinc-900 dark:text-zinc-100"
                                  }`}
                                >
                                  {t(`items.timeSlots.${option}`)}
                                </Text>
                              </Button>
                            );
                          })}
                        </View>
                      </View>
                    );
                  }}
                </form.Field>

                <form.Field name="cycle.type">
                  {(field) => (
                    <View className="mt-4">
                      <Text className="text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">
                        {t("items.createModal.cycleTypeLabel")}
                      </Text>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value ?? { label: "", value: "" })
                        }
                      >
                        <Select.Trigger asChild>
                          <Button
                            variant="secondary"
                            className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                          >
                            <Text className="text-sm text-zinc-900 dark:text-zinc-100">
                              {field.state.value.label}
                            </Text>
                          </Button>
                        </Select.Trigger>

                        <Select.Portal>
                          <Select.Overlay className="bg-black/30" />
                          <Select.Content
                            width={260}
                            placement="bottom"
                            align="end"
                            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                          >
                            {CYCLE_TYPES.map((option) => (
                              <Select.Item
                                key={option}
                                value={option}
                                label={t(`items.cycleType.${option}`)}
                                className="text-zinc-900 dark:text-zinc-100"
                              />
                            ))}
                          </Select.Content>
                        </Select.Portal>
                      </Select>
                    </View>
                  )}
                </form.Field>

                {cycleValue.value === "onOff" && (
                  <form.Field name="cycle.startDate">
                    {(field) => (
                      <View className="mt-4">
                        <Text className="text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">
                          {t("items.createModal.startDateLabel")}
                        </Text>

                        <Button
                          variant="secondary"
                          className="w-full justify-start border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                          onPress={() =>
                            setShowStartDatePicker((prev) => !prev)
                          }
                        >
                          <Text className="text-sm text-zinc-900 dark:text-zinc-100">
                            {formatStartDate(field.state.value)}
                          </Text>
                        </Button>

                        {showStartDatePicker && (
                          <View className="mt-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
                            <DateTimePicker
                              mode="date"
                              locale={pickerLocale}
                              display={
                                Platform.OS === "ios" ? "spinner" : "default"
                              }
                              value={
                                field.state.value
                                  ? new Date(field.state.value)
                                  : new Date()
                              }
                              onChange={(event, date) => {
                                handleStartDateChange(event, date);
                              }}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </form.Field>
                )}

                {cycleValue.value === "onOff" && (
                  <>
                    <form.Field name="cycle.onDurationDays">
                      {(field) => (
                        <TextField
                          label={t("items.createModal.onDurationLabel")}
                          placeholder={t(
                            "items.createModal.onDurationPlaceholder"
                          )}
                          keyboardType="numeric"
                          enablesReturnKeyAutomatically
                          value={field.state.value?.toString() ?? ""}
                          onChangeText={(text) =>
                            field.handleChange(text ? Number(text) : undefined)
                          }
                          containerClassName="mt-4"
                        />
                      )}
                    </form.Field>

                    <form.Field name="cycle.offDurationDays">
                      {(field) => (
                        <TextField
                          label={t("items.createModal.offDurationLabel")}
                          placeholder={t(
                            "items.createModal.offDurationPlaceholder"
                          )}
                          keyboardType="numeric"
                          value={field.state.value?.toString() ?? ""}
                          onChangeText={(text) =>
                            field.handleChange(text ? Number(text) : undefined)
                          }
                          containerClassName="mt-4"
                        />
                      )}
                    </form.Field>
                  </>
                )}

                {cycleValue.value === "specificDaysOfWeek" && (
                  <form.Field name="cycle.daysOfWeek">
                    {(field) => {
                      const selected: number[] = field.state.value ?? [];

                      const toggle = (day: number) => {
                        const isSelected = selected.includes(day);
                        const next = isSelected
                          ? selected.filter((d) => d !== day)
                          : [...selected, day];
                        field.handleChange(next);
                      };

                      return (
                        <View className="mt-4">
                          <Text className="text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">
                            {t("items.createModal.daysOfWeekLabel")}
                          </Text>

                          <View className="flex-row flex-wrap gap-2">
                            {WEEKDAY_VALUES.map((day) => {
                              const isSelected = selected.includes(day);

                              return (
                                <Button
                                  key={day}
                                  className={`h-8 px-3 rounded-full border ${
                                    isSelected
                                      ? "bg-emerald-600 border-emerald-500"
                                      : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                                  }`}
                                  onPress={() => toggle(day)}
                                >
                                  <Text
                                    className={`text-sm ${
                                      isSelected
                                        ? "text-white"
                                        : "text-zinc-900 dark:text-zinc-100"
                                    }`}
                                  >
                                    {t(`items.weekdayShort.${day}`)}
                                  </Text>
                                </Button>
                              );
                            })}
                          </View>
                        </View>
                      );
                    }}
                  </form.Field>
                )}

                <View className="flex-row justify-between gap-3">
                  <Button
                    variant="tertiary"
                    onPress={onClose}
                    className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                  >
                    <Text className="text-zinc-900 dark:text-zinc-100">
                      {t("common.cancel")}
                    </Text>
                  </Button>

                  <form.Subscribe
                    selector={(state) => ({
                      canSubmit: state.canSubmit,
                      isSubmitting: state.isSubmitting,
                    })}
                  >
                    {({ isSubmitting }) => (
                      <Button
                        isDisabled={isSubmitting}
                        onPress={() => form.handleSubmit()}
                        className={`flex-1 ${
                          isSubmitting
                            ? "bg-indigo-600/50"
                            : "bg-indigo-600 active:bg-indigo-700"
                        }`}
                      >
                        <Text className="text-white">{t("common.save")}</Text>
                      </Button>
                    )}
                  </form.Subscribe>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
