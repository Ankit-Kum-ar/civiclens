import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { radius } from "@/theme/colors";

type Props = TextInputProps & {
  error?: string;
  rightSlot?: React.ReactNode;
};

export function Input({ error, rightSlot, style, ...props }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      <View style={{ position: "relative", justifyContent: "center" }}>
        <TextInput
          placeholderTextColor={colors.mutedForeground}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: error ? colors.destructive : colors.border,
              color: colors.foreground,
              paddingRight: rightSlot ? 44 : 14,
            },
            style,
          ]}
          {...props}
        />
        {rightSlot ? (
          <View style={styles.right}>{rightSlot}</View>
        ) : null}
      </View>
      {error ? (
        <Text style={{ color: colors.destructive, fontSize: 12, fontWeight: "500" }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  right: {
    position: "absolute",
    right: 12,
  },
});
