import { holidayItemType } from "@/stores/calendarStore";
import { StoreEventType, useEventStore } from "@/stores/eventStore";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface propsType {
  date: Dayjs[][];
  currentDate: Dayjs;
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
  // event: eventType[] | undefined;
}

const MonthCalendar = ({ date, currentDate, getHolidayInfo }: propsType) => {
  const { event, selectDay, setSelectDay } = useEventStore();

  return (
    <>
      {date.map((week: Dayjs[], idx) => (
        <View key={idx} style={styles.dayWrapper}>
          {week.map((day, index) => {
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

            const sortedEvent =
              dayEvents.length >= 5 ? dayEvents.slice(0, 4) : dayEvents;

            return (
              <View
                key={index}
                style={[
                  styles.day,
                  selectDay === day.format("YYMMDD") && styles.selectDay,
                  dayKey === dayjs().format("YYMMDD") && styles.today,
                ]}
                onTouchEnd={() => setSelectDay(day.format("YYMMDD"))}
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
                  {sortedEvent.map((event: StoreEventType) => (
                    <View
                      key={event.id}
                      style={[
                        styles.eventItem,
                        styles[event.category as keyof typeof styles],
                      ]}
                    ></View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    // height: "fit-content",
  },
  dayWrapper: {
    width: "100%",
    flexDirection: "row",
  },
  day: {
    height: 50,
    flex: 1,
    textAlign: "center",
    fontFamily: "NanumBarunGothic",
    // paddingTop: 5,
    // paddingBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  firstChild: {
    color: "red",
  },
  lastChild: {
    color: "blue",
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
    flexDirection: "row",
    gap: 4,
  },
  eventItem: {
    width: 6,
    height: 6,
    borderRadius: 10,
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
});

export default MonthCalendar;
