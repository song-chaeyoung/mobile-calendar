import ModalScreen from "@/app/modal";
import { useEventStore, useNowEventStore } from "@/stores/eventStore";
import dayjs from "dayjs";
import { Link } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const EventList = () => {
  const { selectDay, selectedEvent } = useEventStore();
  const { nowEvent, setNowEvent, setShowDetail } = useNowEventStore();
  // const [isShow, setIsShow] = useState(false);

  const sortedEvent = [...selectedEvent].sort(
    (a, b) => a.startDateTime - b.startDateTime
  );

  // console.log(nowEvent);

  return (
    <>
      {/* {isShow && <ModalScreen children={<Text>event list</Text>} />} */}
      <View style={styles.container}>
        <Text style={styles.title}>{selectDay}의 일정</Text>
        <ScrollView
          contentInset={{ bottom: 30 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          // contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.itemBox}>
            {sortedEvent.map((event) => (
              // <Link href={"/modal"} key={event.id} style={{ width: "100%" }}>
              <View
                key={event.id}
                style={styles.item}
                onTouchStart={() => {
                  setShowDetail(true);
                  setNowEvent(event);
                  // setIsShow((prev) => !prev);
                }}
              >
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
              </View>
              // </Link>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // position: "absolute",
    // top: "62%",
    width: "100%",
    // height: "38%",
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
