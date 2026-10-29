import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { radius } from "@/theme/colors";

export function ThemeToggle() {
  const { colors, isDark, toggle } = useTheme();
  return (
    <Pressable
      onPress={toggle}
      style={{
        height: 36,
        width: 36,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons
        name={isDark ? "sunny-outline" : "moon-outline"}
        size={16}
        color={colors.mutedForeground}
      />
    </Pressable>
  );
}
