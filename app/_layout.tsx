import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            //header 표시 안하기
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
