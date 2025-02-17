import Calendar from "@/components/Calendar";
import EventList from "@/components/EventList";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const windowHeight = Dimensions.get("window").height;

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar />
        </View>
        <View style={styles.listContainer}>
          <EventList />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: windowHeight,
    height: "100%",
  },
  calendarContainer: {
    flex: 1.5,
  },
  listContainer: {
    flex: 1,
  },
});

export default Index;
