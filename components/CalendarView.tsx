import { holidayItemType, useCalendarUiStore } from "@/stores/calendarStore";
import React from "react";
import { View } from "react-native";
import Weekdays from "./Weekdays";
import MonthCalendar from "./MonthCalendar";
import { useCalendarArray } from "@/hooks/useCalendarArray";
import WeekCalendar from "./WeekCalendar";
import { StyleSheet } from "react-native";
import { Dayjs } from "dayjs";
import { CalendarItem } from "./Calendar";

interface Props {
  currentDate: Dayjs;
  currentWeekIndex: number;
  calendarWidth: number;
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
  item: CalendarItem;
}

const CalendarView = React.memo(
  ({
    currentDate,
    currentWeekIndex,
    calendarWidth,
    getHolidayInfo,
    item,
  }: Props) => {
    const { isMonthView } = useCalendarUiStore();
    const currentMonth = useCalendarArray(currentDate);
    const currentWeek = currentMonth[currentWeekIndex] || currentMonth[0];

    return isMonthView ? (
      <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
        <Weekdays />
        <MonthCalendar
          date={useCalendarArray(item.date)}
          currentDate={item.date}
          getHolidayInfo={getHolidayInfo}
        />
      </View>
    ) : (
      <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
        <Weekdays />
        <WeekCalendar
          currentWeek={currentWeek}
          currentDate={item.date}
          getHolidayInfo={getHolidayInfo}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  calendarWrapper: {
    minHeight: 300,
    alignSelf: "flex-start",
    color: "#999",
    height: "auto",
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgb(216,216,216)",
  },
});

export default CalendarView;
