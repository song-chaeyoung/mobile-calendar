import CheckComponent from "@/components/CheckComponent";
import PickerExample from "@/components/PickerExample";
import RadioButton from "@/components/RadioButton";
import Select from "@/components/Select";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab2 = () => {
  // const [isChecked, setChecked] = useState(false);
  const [checked, setChecked] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <CheckComponent
          checked={checked[1]}
          setChecked={() => setChecked((prev) => ({ ...prev, 1: !prev[1] }))}
          children={"CHECK1"}
        />
        <CheckComponent
          checked={checked[2]}
          setChecked={() => setChecked((prev) => ({ ...prev, 2: !prev[2] }))}
          children={"CHECK2"}
        />
        <CheckComponent
          checked={checked[3]}
          setChecked={() => setChecked((prev) => ({ ...prev, 3: !prev[3] }))}
          children={"CHECK3"}
        />

        <RadioButton
          selected={selected}
          setSelected={setSelected}
          children={"Radio1"}
          index={0}
        />
        <RadioButton
          selected={selected}
          setSelected={setSelected}
          children={"Radio2"}
          index={1}
        />
        <RadioButton
          selected={selected}
          setSelected={setSelected}
          children={"Radio3"}
          index={2}
        />
        <Select />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Tab2;
