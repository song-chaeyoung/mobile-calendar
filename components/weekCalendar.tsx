import { holidayItemType } from "@/stores/calendarStore";
import { useEventStore } from "@/stores/eventStore";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface propsType {
  currentDate: Dayjs;
  currentWeek: Dayjs[];
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
  // event: eventType[] | undefined;
}

const WeekCalendar = ({
  currentDate,
  currentWeek,
  getHolidayInfo,
}: propsType) => {
  const { event, selectDay, setSelectDay } = useEventStore();

  return (
    <View style={styles.weekContainer}>
      {currentWeek.map((day: Dayjs, index) => {
        const firstChild = index === 0;
        const lastChild = index === 6;
        const holidayInfo = getHolidayInfo(day);
        const dayKey = day.format("YYMMDD");
        const dayEvents =
          event?.filter(
            (item) =>
              dayjs(item.startDateTime).format("YYMMDD") <= dayKey &&
              dayKey <= dayjs(item.endDateTime).format("YYMMDD")
          ) || [];

        const sortedEvent = [...dayEvents].sort(
          (a, b) => a.startDateTime - b.startDateTime
        );

        const sliceEvent =
          sortedEvent.length >= 7 ? sortedEvent.slice(0, 7) : sortedEvent;

        return (
          <View
            key={index}
            style={[
              styles.day,
              selectDay === day.format("YYMMDD") && styles.selectDay,
              dayKey === dayjs().format("YYMMDD") && styles.today,
              lastChild && styles.lastChildBox,
            ]}
            onTouchStart={() => setSelectDay(day.format("YYMMDD"))}
          >
            <Text
              style={[
                firstChild && styles.firstChild,
                lastChild && styles.lastChild,
                currentDate.month() !== day.month() && styles.grey,
                holidayInfo && styles.holiday,
                currentDate.month() !== day.month() && { opacity: 0.5 },
              ]}
            >
              {day.get("date")}
            </Text>
            <Text
              style={[
                styles.holidayName,
                currentDate.month() !== day.month() && { opacity: 0.5 },
              ]}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {holidayInfo && holidayInfo.dateName}
            </Text>
            <View style={styles.eventItemWrapper}>
              {sliceEvent.map((event) => (
                <View
                  key={event.id}
                  style={[
                    styles.eventItem,
                    categoryStyles[
                      event.category as keyof typeof categoryStyles
                    ],
                  ]}
                >
                  <Text numberOfLines={1} ellipsizeMode={"tail"}>
                    {event.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  weekContainer: {
    width: "100%",
    flexDirection: "row",
    // paddingLeft: 10,
  },
  day: {
    minHeight: 300,
    flex: 1,
    textAlign: "center",
    fontFamily: "NanumBarunGothic",
    paddingTop: 5,
    paddingBottom: 15,
    paddingHorizontal: 5,
    fontSize: 16,
    borderRightWidth: 1,
    borderRightColor: "rgb(216,216,216)",
  },
  firstChild: {
    color: "red",
  },
  lastChild: {
    color: "blue",
  },
  lastChildBox: {
    borderRightWidth: 0,
  },
  holiday: {
    color: "red",
  },
  holidayName: {
    fontSize: 10,
    color: "red",
  },
  today: {
    backgroundColor: "lightblue",
  },
  selectDay: {
    backgroundColor: "rgba(220,220,220,0.5)",
  },
  grey: {
    opacity: 0.5,
  },
  eventItemWrapper: {
    gap: 6,
  },
  10: {
    backgroundColor: "lightcoral",
  },
  20: {
    backgroundColor: "lightsalmon",
  },
  30: {
    backgroundColor: "lightpink",
  },
  40: {
    backgroundColor: "lightskyblue",
  },
  eventItem: {
    padding: 4,
    borderRadius: 6,
  },
});

const categoryStyles = StyleSheet.create({
  10: { backgroundColor: "lightcoral" },
  20: { backgroundColor: "lightsalmon" },
  30: { backgroundColor: "lightpink" },
  40: { backgroundColor: "lightskyblue" },
});

export default WeekCalendar;
