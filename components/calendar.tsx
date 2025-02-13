import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "dayjs/locale/ko";
import {
  holidayItemType,
  useCalendarUiStore,
  useHolidayStore,
} from "../stores/calendarStore";
import FormModal from "./FormModal";
import Weekdays from "./Weekdays";
import WeekCalendar from "./WeekCalendar";
import MonthCalendar from "./MonthCalendar";
import { useEventStore } from "@/stores/eventStore";

const Calendar = () => {
  dayjs.locale("ko");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { isMonthView, setIsMonthView } = useCalendarUiStore();
  const { holiday, fetchHoliday } = useHolidayStore();
  const { event, selectDay, setSelectedEvent } = useEventStore();

  const screenWidth = Dimensions.get("window").width;
  const scrollWidth = screenWidth * 3;

  const calendarWidth = screenWidth - 20;
  const translateX = useRef(new Animated.Value(0)).current;
  const [translateValue, setTranslateValue] = useState(0);

  const [view, setView] = useState(false);

  useEffect(() => {
    setSelectedEvent();
  }, [selectDay, event]);

  useEffect(() => {
    translateX.addListener(({ value }) => {
      setTranslateValue(value);
    });
    return () => {
      translateX.removeAllListeners();
    };
  }, []);

  const animateTransition = useCallback(
    (direction: "left" | "right") => {
      const toValue = direction === "right" ? -screenWidth : screenWidth;

      translateX.setValue(0);

      Animated.timing(translateX, {
        toValue: toValue,
        useNativeDriver: true,
        duration: 500,
      }).start(() => {
        if (isMonthView === true) {
          if (direction === "right") {
            setCurrentDate((prev) => prev.add(1, "month"));
          } else {
            setCurrentDate((prev) => prev.subtract(1, "month"));
          }
        } else if (isMonthView === false) {
          if (direction === "right") {
            setCurrentDate((prev) => prev.add(1, "week"));
          } else {
            setCurrentDate((prev) => prev.subtract(1, "week"));
          }
        }
        translateX.setValue(0);
      });
    },
    [screenWidth, isMonthView]
  );

  const getMonthData = (date: Dayjs) => {
    const firstDay = date.startOf("month").startOf("week");
    const lastDay = date.endOf("month").endOf("week");
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

  const prevDate = useMemo(() => {
    const prevMonth = currentDate.subtract(1, "month");
    return getMonthData(prevMonth);
  }, [currentDate]);

  const nextDate = useMemo(() => {
    const nextMonth = currentDate.add(1, "month");
    return getMonthData(nextMonth);
  }, [currentDate]);

  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const firstDayOfMonth = useMemo(
    () =>
      dayjs()
        .year(year)
        .month(month - 1)
        .startOf("month"),
    [year, month]
  );
  const startDay = useMemo(() => {
    return firstDayOfMonth.startOf("week");
  }, [firstDayOfMonth]);

  const lastDayOfMonth = useMemo(
    () =>
      dayjs()
        .year(year)
        .month(month - 1)
        .endOf("month"),
    [year, month]
  );
  const endDay = useMemo(() => {
    return lastDayOfMonth.endOf("week");
  }, [lastDayOfMonth]);

  const date = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    let currentDate = startDay;

    while (currentDate.isBefore(endDay) || currentDate.isSame(endDay, "day")) {
      currentWeek.push(currentDate);

      if (currentWeek.length === 7 || currentDate.day() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate = currentDate.add(1, "day");
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [startDay, endDay]);

  const handlePrevMonth = useCallback(() => {
    animateTransition("left");
  }, [animateTransition]);

  const handleNextMonth = useCallback(() => {
    animateTransition("right");
  }, [animateTransition]);

  // Week Calendar
  const currentWeekIndex = date.findIndex((week) =>
    week.some((day: Dayjs) => day.isSame(currentDate, "day"))
  );

  const currentWeek = date[currentWeekIndex] || date[0];
  const prevWeek =
    currentWeekIndex > 0
      ? date[currentWeekIndex - 1]
      : getMonthData(currentDate.subtract(1, "month")).slice(-1)[0];
  const nextWeek =
    currentWeekIndex < date.length - 1
      ? date[currentWeekIndex + 1]
      : getMonthData(currentDate.add(1, "month"))[0];

  const handlePrevWeek = useCallback(() => {
    animateTransition("left");
  }, [animateTransition]);

  const handleNextWeek = useCallback(() => {
    animateTransition("right");
  }, [animateTransition]);

  useEffect(() => {
    getMonthData(currentDate);
  }, []);

  // HOLIDAY
  useEffect(() => {
    fetchHoliday(currentDate.get("year"), currentDate.get("month"));
    getMonthData(currentDate);
  }, [currentDate]);

  const getHolidayInfo = useCallback(
    (day: Dayjs): holidayItemType | undefined => {
      if (!holiday || !Array.isArray(holiday)) return undefined;

      const formatDate = day.format("YYYYMMDD");

      return holiday.find((item) => `${item.locdate}` === formatDate);
    },
    [holiday]
  );

  // TOUCH EVENT
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20
          );
        },

        onPanResponderGrant: (_, gestureState) => {
          if (
            Math.abs(gestureState.dx) > 20 ||
            Math.abs(gestureState.dy) > 20
          ) {
            translateX.setValue(-screenWidth);
          }
        },

        onPanResponderMove: (_, gestureState) => {
          // translateX.setValue(+gestureState.dx);
          if (Math.abs(gestureState.dx) > 20) {
            translateX.setValue(gestureState.dx);
          }
        },

        onPanResponderRelease: (_, gestureState) => {
          if (Math.abs(gestureState.dx) > screenWidth * 0.3) {
            if (gestureState.dx > 0) {
              if (isMonthView) handlePrevMonth();
              else handlePrevWeek();
            } else {
              if (isMonthView) handleNextMonth();
              else handleNextWeek();
            }
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [
      handlePrevMonth,
      handleNextMonth,
      handleNextWeek,
      handlePrevWeek,
      screenWidth,
      isMonthView,
    ]
  );

  return (
    <>
      {view && <FormModal setView={setView} />}
      <View style={styles.calendarConainer}>
        <View style={styles.changeBtnGroup}>
          <TouchableOpacity
            style={[
              styles.changeBtn,
              styles.changeBtn1,
              isMonthView && styles.active,
            ]}
            onPress={() => setIsMonthView(true)}
          >
            <Text style={[styles.btnText, isMonthView && styles.textActive]}>
              월간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.changeBtn,
              styles.changeBtn2,
              !isMonthView && styles.active,
            ]}
            onPress={() => setIsMonthView(false)}
          >
            <Text style={[styles.btnText, !isMonthView && styles.textActive]}>
              주간
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.addBtn} onPress={() => setView(true)}>
          일정 추가하기
        </Text>
        <View style={styles.controlContainer}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>
              {year}년 {month}월 {!isMonthView && `${currentWeekIndex + 1}주차`}
            </Text>
          </View>
          <View style={styles.controlBox}>
            <TouchableOpacity
              style={styles.contorlBtn}
              onPress={isMonthView ? handlePrevMonth : handlePrevWeek}
            >
              <Text style={styles.btnText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contorlBtn}
              onPress={isMonthView ? handleNextMonth : handleNextWeek}
            >
              <Text style={styles.btnText}>▶</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contorlBtn}
              onPress={() => {
                setCurrentDate(dayjs());
              }}
            >
              <Text style={styles.btnText}>오늘</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isMonthView ? (
          <View
            {...panResponder.panHandlers}
            style={[styles.calendarSlider, { width: calendarWidth }]}
          >
            <Animated.View
              style={{
                flexDirection: "row",
                transform: [{ translateX: translateValue }],
                width: scrollWidth,
              }}
            >
              <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
                <Weekdays />
                <View style={styles.monthContainer}>
                  <MonthCalendar
                    date={prevDate}
                    currentDate={currentDate.subtract(1, "month")}
                    getHolidayInfo={getHolidayInfo}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.calendarWrapper,
                  { width: calendarWidth, height: "auto" },
                ]}
              >
                <Weekdays />
                <View style={styles.monthContainer}>
                  <MonthCalendar
                    date={date}
                    currentDate={currentDate}
                    getHolidayInfo={getHolidayInfo}
                  />
                </View>
              </View>
              <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
                <Weekdays />
                <View style={styles.monthContainer}>
                  <MonthCalendar
                    date={nextDate}
                    currentDate={currentDate.add(1, "month")}
                    getHolidayInfo={getHolidayInfo}
                  />
                </View>
              </View>
            </Animated.View>
          </View>
        ) : (
          <View
            {...panResponder.panHandlers}
            style={[styles.calendarSlider, { width: calendarWidth }]}
          >
            <Animated.View
              style={{
                flexDirection: "row",
                transform: [{ translateX: translateValue }],
                width: scrollWidth,
              }}
            >
              <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
                <Weekdays />
                <WeekCalendar
                  currentWeek={prevWeek}
                  currentDate={currentDate.subtract(1, "week")}
                  getHolidayInfo={getHolidayInfo}
                />
              </View>
              <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
                <Weekdays />
                <WeekCalendar
                  currentWeek={currentWeek}
                  currentDate={currentDate}
                  getHolidayInfo={getHolidayInfo}
                />
              </View>
              <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
                <Weekdays />
                <WeekCalendar
                  currentWeek={nextWeek}
                  currentDate={currentDate.add(1, "week")}
                  getHolidayInfo={getHolidayInfo}
                />
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  calendarConainer: {
    marginTop: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  addBtn: {
    // width: "100%",
    alignSelf: "flex-end",
    marginRight: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 1,
    fontSize: 16,
    // borderWidth: 1,
    // borderColor: "rgb(216,216,216)",
  },
  changeBtnGroup: {
    flexDirection: "row",
  },
  changeBtn: {
    backgroundColor: "#f2f2f2",
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 10,
  },
  changeBtn1: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  changeBtn2: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  btnText: {
    fontSize: 16,
  },
  active: {
    backgroundColor: "#555",
  },
  textActive: {
    color: "#fff",
  },
  controlContainer: {
    position: "relative",
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleBox: {
    // position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
  },
  title: {
    fontSize: 20,
    fontFamily: "NanumBarunGothic",
  },
  controlBox: {
    flexDirection: "row",
    // gap: 5,
    // paddingHorizontal: 10,
    // gap: 1,
  },
  contorlBtn: {
    // width: 30,
    // height: 20,
    // width: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 1,
  },
  calendarSlider: {
    // overflow: "hidden",
    // width: "100%",
    alignItems: "center",
  },
  calendarWrapper: {
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
  firstChild: {
    color: "red",
  },
  lastChild: {
    color: "blue",
  },

  monthContainer: {
    // width: "33.33%",
  },
});

export default Calendar;
