import { holidayItemType } from "@/stores/calendarStore";
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
  return (
    <View style={styles.weekContainer}>
      {currentWeek.map((day: Dayjs, index) => {
        const firstChild = index === 0;
        const lastChild = index === 6;
        const holidayInfo = getHolidayInfo(day);
        const dayKey = day.format("YYMMDD");

        return (
          <View
            key={index}
            style={[
              styles.day,
              dayKey === dayjs().format("YYMMDD") && styles.today,
              lastChild && styles.lastChildBox,
            ]}
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
  grey: {
    opacity: 0.5,
  },
});

export default WeekCalendar;
