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
} from "react-native";
// import Picker from "react-native-picker-select";

interface Props {
  setView: (arg: boolean) => void;
}

const FormModal = ({ setView }: Props) => {
  const [keyboardStatus, setKeyboardStatus] = useState("Keyboard Hidden");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Modal
      transparent={false}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>일정 추가하기</Text>
          <View style={styles.content}>
            <View style={styles.contentBox}>
              <Text>카테고리</Text>
              {/* <Picker
                // placeholder={label : "선택해주세요", value : 00}
                onValueChange={(value) => console.log(value)}
                items={[
                  { label: "휴가", value: 10, key: 10 },
                  { label: "출장", value: 20, key: 20 },
                  { label: "외근", value: 30, key: 30 },
                  { label: "연장근무", value: 40, key: 40 },
                ]}
              /> */}
            </View>
            <View style={styles.contentBox}>
              <Text>일정 제목</Text>
              <TextInput
                style={styles.textInput}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="일정제목"
              />
            </View>
            <View style={styles.contentBox}>
              <Text>일정 날짜</Text>
              <TextInput
                style={styles.textInput}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="일정날짜"
              />
              <TextInput
                style={styles.textInput}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="일정날짜"
              />
            </View>
            <View style={styles.contentBox}>
              <Text>일정 시간</Text>
              <TextInput
                style={styles.textInput}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="일정시간"
              />
            </View>
            <View style={styles.contentBox}>
              <Text>일정 내용</Text>
              <TextInput
                style={styles.textInput}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="일정내용"
              />
            </View>
          </View>
          <View style={styles.btnGroup}>
            <Button title="취소" onPress={() => setView(false)} />
            <Button title="등록" />
          </View>
          <Text></Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    gap: 40,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  content: {
    gap: 20,
  },
  contentBox: {
    width: "100%",
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    // backgroundColor: "lightblue",
    // height: 100,
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(216,216,216)",
    width: "80%",
  },
  btnGroup: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});

export default FormModal;
