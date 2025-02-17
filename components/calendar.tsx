import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
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
import { useEventStore, useNowEventStore } from "@/stores/eventStore";
import DetailEventModal from "./DetailEventModal";

interface CalendarItem {
  id: "prev" | "current" | "next";
  date: Dayjs;
}

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const Calendar = () => {
  dayjs.locale("ko");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const flatListRef = useRef<FlatList>(null);

  const { isMonthView, setIsMonthView } = useCalendarUiStore();
  const { holiday, fetchHoliday } = useHolidayStore();
  const { event, selectDay, setSelectedEvent } = useEventStore();
  const { edit, showDetail } = useNowEventStore();

  const screenWidth = Dimensions.get("window").width;
  const calendarWidth = screenWidth - 20;

  const [view, setView] = useState(false);

  useEffect(() => {
    setSelectedEvent();
  }, [selectDay, event]);

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

  const getWeekData = useCallback((date: Dayjs) => {
    const monthData = getMonthData(date);

    const weekIndex = monthData.findIndex((week) =>
      week.some((day) => day.isSame(date, "day"))
    );

    return weekIndex !== -1 ? monthData[weekIndex] : monthData[0];
  }, []);

  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const handlePrev = useCallback(() => {
    setIsScrolling(true);

    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  }, []);

  const handleNext = useCallback(() => {
    setIsScrolling(true);

    flatListRef.current?.scrollToIndex({
      index: 2,
      animated: true,
    });
  }, []);

  // Week Calendar
  const currentWeekIndex = getMonthData(currentDate).findIndex((week) =>
    week.some((day: Dayjs) => day.isSame(currentDate, "day"))
  );

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

  // Touch Event
  const getCalendarData = useCallback(
    (date: Dayjs, isMonth: boolean): CalendarItem[] => {
      return [
        {
          id: "prev" as const,
          date: date.subtract(1, isMonth ? "month" : "week"),
        },
        { id: "current" as const, date: date },
        { id: "next" as const, date: date.add(1, isMonth ? "month" : "week") },
      ];
    },
    []
  );

  const [calendarData, setCalendarData] = useState(() =>
    getCalendarData(currentDate, isMonthView)
  );

  useEffect(() => {
    setCalendarData(getCalendarData(currentDate, isMonthView));
  }, [currentDate, isMonthView, getCalendarData]);

  const [isScrolling, setIsScrolling] = useState(false);
  const [needScroll, setNeedScroll] = useState(false);

  useEffect(() => {
    if (needScroll) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
      }, Platform.select({ ios: 0, android: 50 }));
      setNeedScroll(false);
      setIsScrolling(false);
    }
  }, [currentDate]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: ViewableItemsChanged) => {
      if (viewableItems.length === 0 || isScrolling) return;

      const newIndex = viewableItems[0].index;
      if (newIndex === undefined) return;

      if (newIndex === 0 || newIndex === 2) {
        setIsScrolling(true);
        setNeedScroll(true);

        setTimeout(() => {
          setCurrentDate((prev) =>
            newIndex == 0
              ? prev.subtract(1, isMonthView ? "month" : "week")
              : prev.add(1, isMonthView ? "month" : "week")
          );
        }, 50);
      }
    },
    [isMonthView, isScrolling]
  );

  const onViewableItemsChangedRef = useRef(onViewableItemsChanged);

  useEffect(() => {
    onViewableItemsChangedRef.current = onViewableItemsChanged;
  }, [onViewableItemsChanged]);

  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 0,
  });

  const renderCalendarItem: ListRenderItem<CalendarItem> = useCallback(
    ({ item }) => {
      if (isMonthView) {
        return (
          <View style={[styles.calendarWrapper, { width: calendarWidth }]}>
            <Weekdays />
            <MonthCalendar
              date={getMonthData(item.date)}
              currentDate={item.date}
              getHolidayInfo={getHolidayInfo}
            />
          </View>
        );
      } else {
        const monthData = getMonthData(item.date);
        const weekIndex = monthData.findIndex((week) =>
          week.some((day) => day.isSame(item.date, "day"))
        );
        const currentWeek = monthData[weekIndex] || monthData[0];
        return (
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
    },
    [isMonthView, calendarWidth, getWeekData, getHolidayInfo]
  );

  return (
    <>
      {view && <FormModal setView={setView} />}
      {showDetail && <DetailEventModal />}
      {/* <DetailEventModal visble={showDetail} /> */}
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
          <Text style={styles.title}>
            {year}년 {month}월 {!isMonthView && `${currentWeekIndex + 1}주차`}
          </Text>
          <View style={styles.controlBox}>
            <TouchableOpacity style={styles.contorlBtn} onPress={handlePrev}>
              <Text style={styles.btnText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contorlBtn} onPress={handleNext}>
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
        <View style={{ width: screenWidth }}>
          <FlatList<CalendarItem>
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            windowSize={3}
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={calendarData}
            renderItem={renderCalendarItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={1}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChangedRef.current}
            viewabilityConfig={viewabilityConfigRef.current}
            decelerationRate="fast"
            snapToInterval={screenWidth}
            disableIntervalMomentum={true}
            scrollEventThrottle={16}
          />
        </View>
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
  title: {
    fontSize: 20,
    fontFamily: "NanumBarunGothic",
  },
  controlBox: {
    flexDirection: "row",
  },
  contorlBtn: {
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
    alignItems: "center",
  },
  flatListContainer: {
    width: "100%",
    height: "auto",
    minHeight: 300,
  },
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
  firstChild: {
    color: "red",
  },
  lastChild: {
    color: "blue",
  },
});

export default Calendar;
