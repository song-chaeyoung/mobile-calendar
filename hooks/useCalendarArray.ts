import { Dayjs } from "dayjs";

export const useCalendarArray = (currentDate: Dayjs) => {
  const firstDay = currentDate.startOf("month").startOf("week");
  const lastDay = currentDate.endOf("month").endOf("week");
  const weeks = [];
  let currentWeek = [];
  let current = firstDay;

  while (current.isBefore(lastDay) || current.isSame(lastDay, "day")) {
    currentWeek.push(current);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    current = current.add(1, "day");
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  return weeks;
};
