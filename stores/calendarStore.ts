import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Holiday_API_KEY } from "@/services/env";
import { HOLIDAY_API } from "@env";

interface UiState {
  isMonthView: boolean;
  setIsMonthView: (arg: boolean) => void;
}

export const useCalendarUiStore = create<UiState>()(
  persist(
    (set) => ({
      isMonthView: true,
      setIsMonthView: (arg) => set({ isMonthView: arg }),
    }),
    {
      name: "calendar-ui-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export interface holidayItemType {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: number;
  seq: number;
}

interface CalendarStoreType {
  holiday: holidayItemType[] | undefined;
  cache: Record<string, holidayItemType[]>;
  fetchHoliday: (year: number, month: number) => Promise<void>;
}

export const useHolidayStore = create<CalendarStoreType>((set, get) => ({
  holiday: [],
  cache: {},
  fetchHoliday: async (year: number, month: number) => {
    // console.log(year, month);
    const cacheKey = `${year}-${month}`;
    const cachedDate = get().cache[cacheKey];

    if (cachedDate) {
      set({ holiday: cachedDate });
      return;
    }

    let prevMonth: string | number = Number(month) - 1;
    let nextMonth: string | number = Number(month) + 1;
    const prevYear = prevMonth == 0 ? Number(year) - 1 : year;
    const nextYear = nextMonth == 13 ? Number(year) + 1 : year;

    prevMonth = prevMonth == 0 ? "12" : prevMonth.toString().padStart(2, "0");
    nextMonth = nextMonth == 13 ? "01" : nextMonth.toString().padStart(2, "0");

    try {
      const [lastHoliday, currentHoliday, nextHoliday] = await Promise.all([
        fetch(
          `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${HOLIDAY_API}&solYear=${prevYear}&solMonth=${prevMonth}&_type=json`
        ),
        fetch(
          `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${HOLIDAY_API}&solYear=${year}&solMonth=${month
            .toString()
            .padStart(2, "0")}&_type=json`
        ),
        fetch(
          `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${HOLIDAY_API}&solYear=${nextYear}&solMonth=${nextMonth}&_type=json`
        ),
      ]);

      const [lastJson, currentJson, nextJson] = await Promise.all([
        lastHoliday.json(),
        currentHoliday.json(),
        nextHoliday.json(),
      ]);

      const lastItems = lastJson.response.body.items.item || [];
      const currentItems = currentJson.response.body.items.item || [];
      const nextItems = nextJson.response.body.items.item || [];

      const holidayItems = [
        ...(Array.isArray(lastItems) ? lastItems : [lastItems]),
        ...(Array.isArray(currentItems) ? currentItems : [currentItems]),
        ...(Array.isArray(nextItems) ? nextItems : [nextItems]),
      ];

      set((state) => ({
        holiday: holidayItems,
        cache: {
          ...state.cache,
          [cacheKey]: holidayItems,
        },
      }));
    } catch (err) {
      console.log(err);
      set({ holiday: [] });
    }
    // finally {
    // set({ isLoading: false });
    // }
  },
}));
