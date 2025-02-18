import {
  StoreEventType,
  useEventStore,
  useNowEventStore,
} from "@/stores/eventStore";
import dayjs from "dayjs";
import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

export const categoryArr: Record<string, string> = {
  10: "휴가",
  20: "출장",
  30: "외근",
  40: "연장근무",
};

const DetailEventModal = () => {
  const { DeleteEvent } = useEventStore();
  const { nowEvent, setNowEvent, showDetail, setShowDetail } =
    useNowEventStore();

  const deleteEvent = () => {
    Alert.alert(
      "일정 삭제",
      "일정을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: () => {
            DeleteEvent(nowEvent as StoreEventType);
            setShowDetail(false);
            setNowEvent(undefined);
          },
        },
      ],
      { cancelable: false }
    );
  };

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
      // useNativeDriver={false}
      // useNativeDriverForBackdrop={false}
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
          <View style={styles.time}>
            <Text style={styles.contentTitle}>일정 기간 {`\n`}</Text>
            <Text>
              {dayjs(nowEvent.startDateTime).format("YYYY년 MM월 DD일")}{" "}
              {dayjs(nowEvent.startDateTime).format("HH:mm")} -{" "}
              {dayjs(nowEvent.startDateTime).format("YYYY년 MM월 DD일") !==
                dayjs(nowEvent.endDateTime).format("YYYY년 MM월 DD일") &&
                dayjs(nowEvent.endDateTime).format("YYYY년 MM월 DD일")}{" "}
              {dayjs(nowEvent.endDateTime).format("HH:mm")}
            </Text>
          </View>
          {nowEvent.content !== "" && (
            <View>
              <Text style={styles.contentTitle}>일정 내용</Text>
              <Text>{nowEvent.content}</Text>
            </View>
          )}
        </View>
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[styles.btn, styles.deleteBtn]}
            onPress={deleteEvent}
          >
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
    flex: 1,
  },
  modalContent: {
    flex: 0.6,
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
  topBar: {
    width: 80,
    height: 3,
    backgroundColor: "grey",
    borderRadius: 10,
    flex: 0.01,
  },
  content: {
    flex: 1.2,
    width: "100%",
    height: "auto",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
    // minHeight: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  time: {
    height: "auto",
  },
  contentTitle: {
    fontSize: 18,
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
    flex: 0.14,
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
