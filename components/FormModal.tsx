import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  PanResponder,
  Animated,
} from "react-native";
import Dropdown from "./Dropdown";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { EventType } from "@/types/event";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useDeviceStore } from "@/stores/deviceStore";
import { useEventStore } from "@/stores/eventStore";

const category = [
  {
    name: "휴가",
    value: 10,
  },
  {
    name: "출장",
    value: 20,
  },
  {
    name: "외근",
    value: 30,
  },
  {
    name: "연장근무",
    value: 40,
  },
];

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hours24 = Math.floor(i / 2);
  const strHours24 = String(hours24).padStart(2, "0");
  const hours12 = String(hours24 % 12 === 0 ? 12 : hours24 % 12);
  const minutes = i % 2 === 0 ? "00" : "30";
  const period = hours24 < 12 ? "오전" : "오후";

  return {
    time: `${strHours24}:${minutes}`,
    timetable: `${period} ${hours12}:${minutes}`,
    calculate: i * 30,
  };
});

const now = dayjs();
const nowMinutes = now.get("hour") * 60 + now.get("m");

const upcomingIndex = timeSlots.findIndex(
  (slot) => slot.calculate >= nowMinutes
);
const upcomingTimeSlot = timeSlots[upcomingIndex] || timeSlots[0];
const upcomingNextTimeSlot = timeSlots[(upcomingIndex + 1) % timeSlots.length];

const upcomingTimeMs = now
  .set("hour", parseInt(upcomingTimeSlot.time.split(":")[0]))
  .set("minute", parseInt(upcomingTimeSlot.time.split(":")[1]))
  .toDate()
  .getTime();

const upcomingNextTimeMs = now
  .set("hour", parseInt(upcomingNextTimeSlot.time.split(":")[0]))
  .set("minute", parseInt(upcomingNextTimeSlot.time.split(":")[1]))
  .toDate()
  .getTime();

interface Props {
  setView: (arg: boolean) => void;
}

const FormModal = ({ setView }: Props) => {
  dayjs.locale("ko");
  const { ios } = useDeviceStore();
  const { PostEvent } = useEventStore();

  // const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const [showPicker, setShowPicker] = useState({
    type: null as "startDate" | "startTime" | "endDate" | "endTime" | null,
    show: false,
  });

  const [form, setForm] = useState<EventType>({
    category: null,
    title: "",
    content: "",
    startDateTime: upcomingTimeMs,
    endDateTime: upcomingNextTimeMs,
  });

  const [currentPickerType, setCurrentPickerType] = useState<string | null>(
    null
  );

  useEffect(() => {
    const thirtyMinutesInMs = 30 * 60 * 1000;

    setForm((prev) => ({
      ...prev,
      endDateTime: (form.startDateTime as number) + thirtyMinutesInMs,
    }));
  }, [form.startDateTime]);

  const showDatePicker = (
    type: "startDate" | "startTime" | "endDate" | "endTime"
  ) => {
    setCurrentPickerType(type);
    setShowPicker({ type, show: true });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const pickerType = ios ? currentPickerType : showPicker.type;

    if (!ios) {
      setShowPicker({ type: null, show: false });
    }

    if (!selectedDate) return;
    if (event.type === "dismissed") return;

    if (!pickerType) return;

    const isStart = pickerType.includes("start");
    const currentDate = new Date(
      isStart ? form.startDateTime : form.endDateTime
    );
    let newDate = new Date(selectedDate);

    if (pickerType.includes("Date")) {
      newDate.setHours(currentDate.getHours());
      newDate.setMinutes(currentDate.getMinutes());
    } else {
      newDate = new Date(currentDate);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    }

    if (isStart) {
      if (newDate.getTime() >= form.endDateTime) {
        const endDateTime = new Date(newDate.getTime() + 30 * 60 * 1000);
        setForm((prev) => ({
          ...prev,
          startDateTime: newDate.getTime(),
          endDateTime: endDateTime.getTime(),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          startDateTime: newDate.getTime(),
        }));
      }
    } else {
      if (newDate.getTime() <= form.startDateTime) {
        Alert.alert("알림", "종료 시간은 시작 시간보다 늦어야 합니다.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        endDateTime: newDate.getTime(),
      }));
    }
  };

  const handleSubmit = () => {
    if (form.category === null) {
      Alert.alert("카테고리를 선택해주세요");
      return;
    }

    if (form.title === "") {
      Alert.alert("제목을 기입해주세요.");
      return;
    }

    PostEvent(form);
    setView(false);
  };

  const handleEdit = () => {};

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: (_, gestureState) => {
  //       console.log("panResponder 시작");
  //       console.log(gestureState.dy);
  //       return gestureState.dy > 10; // 아래로 이동하면 터치 감지
  //     },
  //     onPanResponderMove: (_, gestureState) => {
  //       if (gestureState.dy > 0) {
  //         translateY.setValue(gestureState.dy);
  //       }
  //     },
  //     onPanResponderRelease: (_, gestureState) => {
  //       if (gestureState.dy > 100) {
  //         // 일정 거리 이상 스와이프하면 모달 닫기
  //         Animated.timing(translateY, {
  //           toValue: 300, // 바깥으로 나가는 애니메이션
  //           duration: 200,
  //           useNativeDriver: true,
  //         }).start(() => setView(false));
  //       } else {
  //         // 다시 제자리로 돌아옴
  //         Animated.timing(translateY, {
  //           toValue: 0,
  //           duration: 200,
  //           useNativeDriver: true,
  //         }).start();
  //       }
  //     },
  //   })
  // ).current;

  const renderDateTimePicker = (type: string, value: Date) => {
    const isDatePicker = type.includes("Date");
    const isStart = type.includes("start");
    const dateValue = new Date(isStart ? form.startDateTime : form.endDateTime);

    if (ios) {
      return (
        <View style={styles.iosPickerWrapper}>
          <RNDateTimePicker
            value={dateValue}
            mode={isDatePicker ? "date" : "time"}
            display="default"
            onTouchStart={() => showDatePicker(type as any)}
            onChange={(event, date) => {
              setCurrentPickerType(type);
              handleDateChange(event, date);
            }}
            minuteInterval={30}
            locale="ko-KR"
            themeVariant="light"
          />
        </View>
      );
    }

    return (
      <View>
        <Text
          onPress={() => showDatePicker(type as any)}
          style={styles.timeItem}
        >
          {dayjs(dateValue).format(isDatePicker ? "YYYY.MM.DD" : "HH:mm")}
        </Text>
        {showPicker.show && showPicker.type === type && (
          <RNDateTimePicker
            value={dateValue}
            mode={isDatePicker ? "date" : "time"}
            display="spinner"
            onChange={handleDateChange}
            minuteInterval={30}
            locale="ko-KR"
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      transparent={false}
      animationType="slide"
      // style={styles.modal}
      presentationStyle="formSheet"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={ios ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.container}>
                <View style={styles.topBar}></View>
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>일정 추가하기</Text>
                  <View style={styles.content}>
                    <View style={styles.contentBox}>
                      <Text style={styles.textLabel}>카테고리</Text>
                      {/* <PickerExample /> */}
                      <Dropdown data={category} width="70%" setMenu={setForm} />
                    </View>
                    <View style={styles.contentBox}>
                      <Text style={styles.textLabel}>일정 제목</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="일정제목"
                        placeholderTextColor={"#666"}
                        onChangeText={(value) =>
                          setForm((prev) => ({ ...prev, title: value }))
                        }
                      />
                    </View>
                    <View style={styles.contentBox}>
                      <Text style={styles.textLabel}>일정 시작</Text>
                      <View style={ios ? styles.iosTimeBox : styles.timeBox}>
                        {renderDateTimePicker(
                          "startDate",
                          new Date(form.startDateTime)
                        )}
                        {renderDateTimePicker(
                          "startTime",
                          new Date(form.startDateTime)
                        )}
                      </View>
                    </View>
                    <View style={styles.contentBox}>
                      <Text style={styles.textLabel}>일정 종료</Text>
                      <View style={ios ? styles.iosTimeBox : styles.timeBox}>
                        {renderDateTimePicker(
                          "endDate",
                          new Date(form.endDateTime)
                        )}
                        {renderDateTimePicker(
                          "endTime",
                          new Date(form.endDateTime)
                        )}
                      </View>
                    </View>
                    <View style={styles.contentBox}>
                      <Text style={styles.textLabel}>일정 내용</Text>
                      <TextInput
                        style={styles.textArea}
                        placeholder="일정내용"
                        multiline={true}
                        onChangeText={(value) =>
                          setForm((prev) => ({ ...prev, content: value }))
                        }
                      />
                    </View>
                    <View style={styles.contentBox}>
                      <Text style={styles.textLabel}>참석자</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="참석자 목록"
                      />
                    </View>
                  </View>
                  <View style={styles.btnGroup}>
                    <Button title="취소" onPress={() => setView(false)} />
                    <Button title="등록" onPress={handleSubmit} />
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // modal: {
  //   flex: 0.6,
  // },
  container: {
    marginTop: 25,
    alignItems: "center",
  },
  topBar: {
    width: 80,
    height: 3,
    backgroundColor: "grey",
    borderRadius: 10,
  },
  contentContainer: {
    // marginTop: 20,
    marginBottom: 60,
    padding: 50,
    gap: 60,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  content: {
    gap: 30,
  },
  contentBox: {
    width: "100%",
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textLabel: {
    width: 70,
  },
  textInput: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(216,216,216)",
    width: "70%",
  },
  textArea: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(216,216,216)",
    width: "70%",
    textAlignVertical: "top",
  },
  timeBox: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iosTimeBox: {
    flexDirection: "row",
    marginLeft: -20,
    justifyContent: "space-between",
  },
  iosPickerWrapper: {
    width: 130,
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden",
  },
  timeItem: {
    // border: 1,
    backgroundColor: "#efefef",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
});

export default FormModal;
