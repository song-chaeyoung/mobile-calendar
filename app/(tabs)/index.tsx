import Calendar from "@/components/Calendar";
import EventList from "@/components/EventList";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const windowHeight = Dimensions.get("window").height;

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        {/* <Text>홈화면</Text> */}
        <Calendar />
        <EventList />
      </View>
    </SafeAreaView>
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
