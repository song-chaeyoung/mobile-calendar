import { EventType } from "@/types/event";
import dayjs from "dayjs";
import { create } from "zustand";

export interface StoreEventType extends EventType {
  id: number;
}

interface UseEventStoreType {
  event: StoreEventType[] | [];
  PostEvent: (arg: EventType) => void;
  PatchEvent: (arg: StoreEventType) => void;
  DeleteEvent: (arg: StoreEventType) => void;
  selectDay: string;
  setSelectDay: (arg: string) => void;
  selectedEvent: StoreEventType[] | [];
  setSelectedEvent: () => void;
}

export const useEventStore = create<UseEventStoreType>((set, get) => ({
  event: [],

  PostEvent: (arg) => {
    const newData = { ...arg, id: Number(new Date()) };

    set((state) => {
      const updatedEvent = [...state.event, newData];

      return { event: updatedEvent };
    });
  },

  PatchEvent: (arg) => {
    const index = get().event.findIndex((item) => item.id === arg.id);

    if (index !== -1) {
      set((state) => ({
        event: state.event.map((item, i) => (i === index ? arg : item)),
      }));
    } else {
      console.error("이벤트를 찾을 수 없습니다.");
    }
  },

  DeleteEvent: (arg) => {
    const newEvent = get().event.filter((item) => item.id !== arg.id);
    set({ event: newEvent });
  },

  selectDay: dayjs().format("YYMMDD"),
  setSelectDay: (arg) => {
    set({ selectDay: arg });
  },
  selectedEvent: [],
  setSelectedEvent: () => {
    const selectDay = get().selectDay;

    const newSelectDay = get().event.filter(
      (item) =>
        dayjs(item.startDateTime).format("YYMMDD") <= selectDay &&
        selectDay <= dayjs(item.endDateTime).format("YYMMDD")
    );

    set({ selectedEvent: newSelectDay });
  },
}));

interface nowEventStoreType {
  showDetail: boolean;
  setShowDetail: (arg: boolean) => void;
  edit: boolean;
  setEdit: (arg: boolean) => void;
  nowEvent: StoreEventType | undefined;
  setNowEvent: (arg: StoreEventType) => void;
}

export const useNowEventStore = create<nowEventStoreType>((set) => ({
  showDetail: false,
  setShowDetail: (arg) => set({ showDetail: arg }),
  edit: false,
  setEdit: (arg) => set({ edit: arg }),
  nowEvent: undefined,
  setNowEvent: (data) => set({ nowEvent: data }),
}));
