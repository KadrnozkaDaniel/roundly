import { CycleType, TimeSlot } from "../types/item";

export const LANGUAGE_OPTIONS = [
  { value: "cs", label: "Čeština" },
  { value: "en", label: "English" },
] as const;

export const TIME_SLOTS: TimeSlot[] = [
  "wakeUp",
  "morning",
  "noon",
  "evening",
  "beforeSleep",
] as const;

export const CYCLE_TYPES: CycleType[] = [
  "continuous",
  "onOff",
  "specificDaysOfWeek",
] as const;

export const WEEKDAY_VALUES = [1, 2, 3, 4, 5, 6, 0] as const;
