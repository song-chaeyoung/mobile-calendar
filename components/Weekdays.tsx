import React from "react";
import { StyleSheet, Text, View } from "react-native";

const dayName = ["일", "월", "화", "수", "목", "금", "토"];

const Weekdays = () => {
  return (
    <View style={styles.weekdays}>
      {dayName.map((item, idx) => {
        const firstChild = idx === 0;
        const lastChild = idx === 6;
        return (
          <Text
            key={idx}
            style={[
              styles.weekdayText,
              firstChild && styles.firstChild,
              lastChild && styles.lastChild,
            ]}
          >
            {item}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  weekdays: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "beige",
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(216,216,216)",
  },
  weekdayText: {
    textAlign: "center",
    fontFamily: "NanumBarunGothic",
    flex: 1,
  },
  firstChild: {
    color: "red",
  },
  lastChild: {
    color: "blue",
  },
});

export default Weekdays;
