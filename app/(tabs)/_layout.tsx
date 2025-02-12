import { useDeviceStore } from "@/stores/deviceStore";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { useEffect } from "react";

const TabsLayout = () => {
  const { setIos, ios } = useDeviceStore();
  const [fontsLoaded] = useFonts({
    NanumBarunGothic: require("../../assets/fonts/NanumBarunGothic.ttf"),
    NanumBarunGothicBold: require("../../assets/fonts/NanumBarunGothicBold.ttf"),
    NanumBarunGothicLight: require("../../assets/fonts/NanumBarunGothicLight.ttf"),
    NanumBarunGothicUltraLight: require("../../assets/fonts/NanumBarunGothicUltraLight.ttf"),
  });

  useEffect(() => {
    setIos();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          // headerTitle: "home page",
          headerShown: false,
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          // headerTitle: "user page",
          headerShown: false,
          title: "SubHome",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
