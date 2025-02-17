import PickerExample from "@/components/PickerExample";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab2 = () => {
  const [isChecked, setChecked] = useState(false);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          // disabled
        />
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            },
            styles.wrapperCustom,
          ]}
        >
          {({ pressed }) => (
            <Text style={styles.text}>{pressed ? "Pressed!" : "Press Me"}</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  checkbox: {
    margin: 8,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
});

export default Tab2;
