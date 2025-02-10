import { holidayItemType } from "@/stores/calendarStore";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

interface propsType {
  date: Dayjs[][];
  currentDate: Dayjs;
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
  // event: eventType[] | undefined;
}

const MonthCalendar = ({ date, currentDate, getHolidayInfo }: propsType) => {
  // console.log(cellSize);
  // const {}
  return (
    <>
      {date.map((week: Dayjs[], idx) => (
        <View key={idx} style={styles.dayWrapper}>
          {week.map((day, index) => {
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
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: "100%",
  },
  dayWrapper: {
    width: "100%",
    flexDirection: "row",
  },
  day: {
    height: 60,
    flex: 1,
    textAlign: "center",
    fontFamily: "NanumBarunGothic",
    // paddingTop: 5,
    // paddingBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 16,
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
  grey: {
    opacity: 0.5,
  },
});

export default MonthCalendar;
