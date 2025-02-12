import { EventType } from "@/types/event";
import React, { useRef, useState } from "react";
import {
  Animated,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface category {
  name: string;
  value: number;
}

interface Props {
  data: category[];
  width: DimensionValue;
  // setMenu?: (value: EventType) => void;
  setMenu?: (value: EventType | ((prev: EventType) => EventType)) => void;
}

const Dropdown = ({ data, width, setMenu }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectMenu, setSelectMenu] = useState("메뉴선택");
  const animation = useRef(new Animated.Value(0)).current; // 애니메이션 초기값 (0: 안 보임)

  const toggleDropdown = () => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: -10,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    } else {
      setIsVisible(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSelect = (value: number, name: string) => {
    toggleDropdown();
    setSelectMenu(name);
    if (setMenu) {
      setMenu((prev: EventType) => ({
        ...prev,
        category: value,
      }));
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.button}>
        <Text
          style={[
            styles.buttonText,
            selectMenu === "메뉴선택" && { color: "#666" },
          ]}
        >
          {selectMenu}
        </Text>
      </TouchableOpacity>

      {isVisible && (
        <TouchableWithoutFeedback onPress={toggleDropdown} accessible={false}>
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.dropdown,
                {
                  opacity: animation.interpolate({
                    inputRange: [-10, 0],
                    outputRange: [0, 1],
                  }),
                },
                { transform: [{ translateY: animation }] },
              ]}
            >
              {data.map((item) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value, item.name)}
                  style={styles.item}
                  key={item.value}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(216,216,216)",
  },
  buttonText: {
    // color: "white",
    // fontSize: 16,
    // color: "#666",
  },
  overlay: {
    position: "absolute",
    // top: "50%",
    top: "102%",
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
  dropdown: {
    // width: 150,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    elevation: 5, // Android 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  item: {
    padding: 10,
    alignItems: "center",
  },
});

export default Dropdown;
