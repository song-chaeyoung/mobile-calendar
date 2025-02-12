import { Platform } from "react-native";
import { create } from "zustand";

interface UseDeviceStoreType {
  ios: boolean;
  setIos: () => void;
}

export const useDeviceStore = create<UseDeviceStoreType>((set) => ({
  ios: Platform.OS === "ios",
  setIos: () => {
    if (Platform.OS === "ios") {
      set({ ios: true });
    }
  },
}));
