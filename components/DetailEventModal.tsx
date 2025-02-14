import { useNowEventStore } from "@/stores/eventStore";
import dayjs from "dayjs";
import React from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Platform, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

export const categoryArr: Record<string, string> = {
  10: "휴가",
  20: "출장",
  30: "외근",
  40: "연장근무",
};

const DetailEventModal = () => {
  const { nowEvent, showDetail, setShowDetail } = useNowEventStore();

  if (!nowEvent) {
    return null;
  }

  return (
    <Modal
      isVisible={showDetail}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
      animationInTiming={300}
      animationOutTiming={300}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.5}
      swipeThreshold={100}
      onSwipeComplete={() => setShowDetail(false)}
      onBackdropPress={() => setShowDetail(false)}
      swipeDirection="down"
    >
      <View style={styles.modalContent}>
        <View style={styles.topBar}></View>
        <View style={styles.content}>
          <View
            style={[
              styles.category,
              categoryStyles[nowEvent.category as keyof typeof categoryStyles],
            ]}
          >
            <Text>{nowEvent?.category && categoryArr[nowEvent.category]}</Text>
          </View>
          <Text style={styles.title}>{nowEvent?.title}</Text>
          <Text>
            일정 시간
            <Text>
              {dayjs(nowEvent.startDateTime).format("YYYY년 MM월 DD일")}{" "}
              {dayjs(nowEvent.startDateTime).format("HH:mm")} -{" "}
              {dayjs(nowEvent.startDateTime).format("YYYY년 MM월 DD일") !==
                dayjs(nowEvent.endDateTime).format("YYYY년 MM월 DD일") &&
                dayjs(nowEvent.endDateTime).format("YYYY년 MM월 DD일")}{" "}
              {dayjs(nowEvent.endDateTime).format("HH:mm")}
            </Text>
          </Text>
          <Text>일정 내용 : {nowEvent.content}</Text>
        </View>
        <View style={styles.btnGroup}>
          <TouchableOpacity style={[styles.btn, styles.deleteBtn]}>
            <Text style={styles.btnText}>삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.editBtn]}>
            <Text style={styles.btnText}>수정</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    // justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  topBar: {
    width: 80,
    height: 3,
    backgroundColor: "grey",
    borderRadius: 10,
  },
  modalContent: {
    width: "100%",
    // height: 400,
    marginTop: "10%",
    height: "60%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    gap: 40,
    // justifyContent: "center",
  },
  content: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
    minHeight: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  category: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
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
  btnGroup: {
    flexDirection: "row",
    gap: 20,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "lightcoral",
  },
  editBtn: {
    backgroundColor: "beige",
  },
  btnText: {
    fontSize: 16,
  },
});

const categoryStyles = StyleSheet.create({
  10: { backgroundColor: "lightcoral" },
  20: { backgroundColor: "lightsalmon" },
  30: { backgroundColor: "lightpink" },
  40: { backgroundColor: "lightskyblue" },
});

export default DetailEventModal;
