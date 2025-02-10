import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          //header 표시 안하기
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
