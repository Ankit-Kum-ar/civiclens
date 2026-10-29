import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { radius } from "@/theme/colors";

export function Card({ style, ...props }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius["2xl"],
    padding: 16,
  },
});
