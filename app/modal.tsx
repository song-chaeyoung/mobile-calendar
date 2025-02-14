import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface PropsType {
  children: ReactNode;
}

const ModalScreen = ({ children }: PropsType) => {
  const isPresented = router.canGoBack();

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        {children}
        {isPresented && (
          <Button title="닫기" onPress={() => router.dismiss()} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  title: { fontSize: 24, marginBottom: 20 },
  dismissLink: { fontSize: 18, color: "blue" },
});

export default ModalScreen;
