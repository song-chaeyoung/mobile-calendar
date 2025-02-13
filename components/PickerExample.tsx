import { Picker, PickerIOS } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const PickerExample = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
        style={styles.picker}
        mode="dropdown"
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Python" value="python" />
      </Picker>
      {/* <PickerIOS
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
        style={styles.picker}
      >
        <PickerIOS.Item label="Java" value="java" />
        <PickerIOS.Item label="JavaScript" value="js" />
        <PickerIOS.Item label="Python" value="python" />
      </PickerIOS> */}
      <Text>selectedLanguage : {selectedLanguage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
});

export default PickerExample;
