import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Checkbox from "expo-checkbox";

interface Props {
  checked: boolean;
  setChecked: (arg: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
}

const CheckComponent = ({ checked, setChecked, children, disabled }: Props) => {
  return (
    <Pressable
      onPress={() => setChecked(!checked)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        pressed && !disabled && styles.pressed,
      ]}
      disabled={disabled}
    >
      <Checkbox
        value={checked}
        onValueChange={setChecked}
        color={checked ? "lightcoral" : undefined}
        style={[
          checked && styles.checked,
          disabled && styles.disabled,
          styles.checkbox,
          checked && disabled && styles.checkedAndDisabled,
        ]}
        disabled={disabled}
      />
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
  pressed: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "lightcoral",
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 10,
  },
  checked: {
    backgroundColor: "lightcoral",
    borderColor: "lightcoral",
  },
  disabled: {
    borderColor: "#9e9e9e9",
    backgroundColor: "#9e9e9e9",
  },
  checkedAndDisabled: {
    backgroundColor: "grey",
    borderColor: "grey",
  },
});

export default CheckComponent;
