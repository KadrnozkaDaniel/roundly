export type TimeSlot =
  | "wakeUp"
  | "morning"
  | "noon"
  | "evening"
  | "beforeSleep";

export type CycleType = "continuous" | "onOff" | "specificDaysOfWeek";

export interface CycleConfig {
  type: CycleType;
  startDate: string;
  onDurationDays?: number;
  offDurationDays?: number;
  daysOfWeek?: number[];
}

export interface Item {
  id: string;
  name: string;
  amount: number;
  cycle: CycleConfig;
  timesOfDay: TimeSlot[];
  archived?: boolean;
}
