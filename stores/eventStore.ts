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

    // set((state) => ({ event: [...state.event, newData] }));

    set((state) => {
      console.log(
        "Before update:",
        state.event.map((e) => e.startDateTime)
      );
      const updatedEvent = [...state.event, newData];
      console.log(
        "After update:",
        updatedEvent.map((e) => e.startDateTime)
      );
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

export const useSelectdayEventStore = () => {};
