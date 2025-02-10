import Calendar from "@/components/calendar";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const windowHeight = Dimensions.get("window").height;

const Index = () => {
  return (
    <View style={styles.container}>
      {/* <Text>홈화면</Text> */}
      <Calendar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: windowHeight,
    height: "100%",
  },
});

export default Index;
