import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const DropDownSelect = () => {
  const [isOpen, setIsOpen] = useState(false); // 옵션 리스트 열기/닫기 상태
  const [selectedItem, setSelectedItem] = useState(null);

  const data = [
    { id: "1", value: "Option 1" },
    { id: "2", value: "Option 2" },
    { id: "3", value: "Option 3" },
  ];

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false); // 항목 선택 후 드롭다운 닫기
  };

  return (
    <View style={styles.container}>
      {/* 셀렉트 박스 버튼 */}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.selectBox}
      >
        <Text style={styles.selectText}>
          {selectedItem ? selectedItem.value : "Select an option"}
        </Text>
      </TouchableOpacity>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <View style={styles.dropdown}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.option}
              >
                <Text style={styles.optionText}>{item.value}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 200,
    maxHeight: 150, // 너무 많은 옵션이 있으면 스크롤 할 수 있도록 설정
    backgroundColor: "white",
    position: "absolute",
    top: 50, // select 박스 아래에 드롭다운을 위치시킴
    zIndex: 10,
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DropDownSelect;
