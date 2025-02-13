import { useEventStore } from "@/stores/eventStore";
import dayjs from "dayjs";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const EventList = () => {
  const { selectDay, selectedEvent } = useEventStore();

  const sortedEvent = [...selectedEvent].sort(
    (a, b) => a.startDateTime - b.startDateTime
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectDay}의 일정</Text>
      <ScrollView contentInset={{ top: 10, left: 10 }}>
        <View style={styles.itemBox}>
          {sortedEvent.map((event) => (
            <View key={event.id} style={styles.item}>
              <View style={styles.itemLeft}>
                <View
                  style={[
                    styles.categoryItem,
                    styles[event.category as keyof typeof styles],
                  ]}
                ></View>
                <Text>{event.title}</Text>
              </View>
              <Text>
                {dayjs(event.startDateTime).format("HH:mm")} -{" "}
                {dayjs(event.endDateTime).format("HH:mm")}
              </Text>
              {/* <Text>}</Text> */}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "62%",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#999",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    gap: 5,
  },
  categoryItem: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  10: {
    backgroundColor: "lightcoral",
  },
  20: {
    backgroundColor: "lightsalmon",
  },
  30: {
    backgroundColor: "lightpink",
  },
  40: {
    backgroundColor: "lightskyblue",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemBox: {
    paddingBottom: 100,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#aaa",
  },
});

export default EventList;
