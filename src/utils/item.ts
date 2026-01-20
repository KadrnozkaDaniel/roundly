import { differenceInCalendarDays } from "date-fns";
import { CycleConfig, Item } from "../types/item";
import { parseIsoDate } from "./date";

const isOnOffActiveToday = (cycle: CycleConfig, today: Date) => {
  const { onDurationDays, offDurationDays, startDate } = cycle;

  if (!onDurationDays || !offDurationDays) {
    return true;
  }

  const start = parseIsoDate(startDate);
  if (!start) return true;

  const diffDays = differenceInCalendarDays(today, start);

  if (diffDays < 0) return false;

  const cycleLength = onDurationDays + offDurationDays;
  if (cycleLength <= 0) return true;

  const positionInCycle = diffDays % cycleLength;

  return positionInCycle < onDurationDays;
};

export const isItemActiveToday = (item: Item) => {
  if (item.archived) return false;

  const { cycle } = item;
  const today = new Date();

  if (cycle.type === "specificDaysOfWeek") {
    const days = cycle.daysOfWeek;
    if (days && days.length > 0) {
      const todayWeekday = today.getDay();
      if (!days.includes(todayWeekday)) {
        return false;
      }
    }
    return true;
  }

  if (cycle.type === "onOff") {
    return isOnOffActiveToday(cycle, today);
  }

  return true;
};
