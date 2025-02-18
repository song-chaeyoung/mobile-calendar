import Checkbox from "expo-checkbox";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  selected: number | null;
  setSelected: (arg: number) => void;
  children: ReactNode;
  index: number;
  disabled?: boolean;
}

const RadioButton = ({
  selected,
  setSelected,
  children,
  index,
  disabled,
}: Props) => {
  const checked = selected === index;

  return (
    <Pressable
      onPress={() => setSelected(index)}
      style={[
        styles.container,
        checked && styles.checked,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.box,
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cdd3dd",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    borderColor: "#36bffa",
  },
  disabled: {
    borderColor: "gray",
    backgroundColor: "#e0e0e0",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#36bffa",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
  labelDisabled: {
    color: "#cdd3dd",
  },
});

export default RadioButton;
