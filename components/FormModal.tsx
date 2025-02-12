import React, { useEffect, useState } from "react";
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
} from "react-native";
import Dropdown from "./Dropdown";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { EventType } from "@/types/event";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useDeviceStore } from "@/stores/deviceStore";

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

  const [showPicker, setShowPicker] = useState({
    type: null as "startDate" | "startTime" | "endDate" | "endTime" | null,
    show: false,
  });

  const [form, setForm] = useState<EventType>({
    category: null,
    title: "",
    content: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: upcomingTimeMs,
    endTime: upcomingNextTimeMs,
  });
  const [minDate, setMinDate] = useState(form.startDate);

  useEffect(() => {
    const thirtyMinutesInMs = 30 * 60 * 1000;

    setForm((prev) => ({
      ...prev,
      endTime: (form.startTime as number) + thirtyMinutesInMs,
    }));
  }, [form.startTime]);

  console.log(form);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      endDate: form.startDate,
    }));

    setMinDate(form.startDate);
  }, [form.startDate]);

  // console.log(form.startDate);

  // const handleDateChange = (event: any, selectedDate?: Date) => {
  //   setShowPicker({ type: null, show: false });

  //   if (event.type === "dismissed" || !selectedDate) return;

  //   const { type } = showPicker;
  //   if (!type) return;

  //   setForm((prev) => ({
  //     ...prev,
  //     [type]: selectedDate.getTime(),
  //   }));
  // };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log(event.timeStamp);
    if (!ios) {
      setShowPicker({ type: null, show: false });
    }

    if (!selectedDate) return;

    if (event.type === "dismissed") return;

    const { type } = showPicker;
    if (!type) return;

    if (!ios) {
      setForm((prev) => ({
        ...prev,
        [type]: selectedDate.getTime(),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [type]: event.timeStamp,
      }));
    }
  };

  const showDatePicker = (
    type: "startDate" | "startTime" | "endDate" | "endTime"
  ) => {
    setShowPicker({ type, show: true });
  };

  const renderDateTimePicker = (type: string, value: Date) => {
    const isDatePicker = type.includes("Date");

    if (ios) {
      return (
        <RNDateTimePicker
          value={value}
          mode={isDatePicker ? "date" : "time"}
          display="default"
          onChange={handleDateChange}
          minuteInterval={30}
          locale="ko-KR"
          textColor="#000"
        />
      );
    }

    return (
      <View>
        <Text
          onPress={() => showDatePicker(type as any)}
          style={styles.timeItem}
        >
          {dayjs(value).format(isDatePicker ? "YYYY-MM-DD" : "HH:mm")}
        </Text>

        {showPicker.show && showPicker.type === type && (
          <RNDateTimePicker
            value={value}
            mode={isDatePicker ? "date" : "time"}
            display="spinner"
            onChange={handleDateChange}
            minuteInterval={30}
            locale="ko-KR"
            minimumDate={type === "endDate" ? (minDate as Date) : undefined}
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      transparent={false}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={ios ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SafeAreaView>
            <View style={styles.container}>
              <Text style={styles.title}>일정 추가하기</Text>
              <View style={styles.content}>
                <View style={styles.contentBox}>
                  <Text style={styles.textLabel}>카테고리</Text>
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
                      new Date(form.startDate)
                    )}
                    {renderDateTimePicker(
                      "startTime",
                      new Date(form.startTime)
                    )}
                  </View>
                </View>
                <View style={styles.contentBox}>
                  <Text style={styles.textLabel}>일정 종료</Text>
                  <View style={ios ? styles.iosTimeBox : styles.timeBox}>
                    {renderDateTimePicker("endDate", new Date(form.endDate))}
                    {renderDateTimePicker("endTime", new Date(form.endTime))}
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
                <Button title="등록" />
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 50,
    gap: 60,
    // flex: 1,
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
    width: "50%",
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
