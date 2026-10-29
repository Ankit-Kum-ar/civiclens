import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { radius } from "@/theme/colors";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "First name is required";
    if (!lastName.trim()) next.lastName = "Last name is required";
    if (!email.trim() || !email.includes("@")) next.email = "Please enter a valid email address";
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      next.password = "Password must contain a letter and a number";
    }
    if (!agreeTerms) next.agreeTerms = "You must agree to the Terms & Conditions";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setGeneralError(null);
    try {
      await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        agreeTerms,
      });
      router.replace("/");
    } catch (e: unknown) {
      setGeneralError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 40 }}>
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 20,
              padding: 24,
              minHeight: 160,
              justifyContent: "flex-end",
              overflow: "hidden",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 22, marginBottom: 6 }}>
              Empowering Citizens, Fixing Infrastructure
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>
              Join our smart civic network to report hazards and track verified municipal repairs.
            </Text>
          </View>

          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.foreground }}>
            Create an account
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 14, marginBottom: 4 }}>
            Already have an account?{" "}
            <Text
              style={{ color: colors.primary, fontWeight: "600" }}
              onPress={() => router.push("/login")}
            >
              Log in
            </Text>
          </Text>

          {generalError ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: `${colors.destructive}4D`,
                backgroundColor: `${colors.destructive}1A`,
                borderRadius: radius.xl,
                padding: 12,
              }}
            >
              <Text style={{ color: colors.destructive, fontSize: 13 }}>{generalError}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                error={errors.firstName}
                editable={!loading}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                error={errors.lastName}
                editable={!loading}
              />
            </View>
          </View>

          <Input
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            editable={!loading}
          />
          <Input
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            editable={!loading}
            rightSlot={
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
            }
          />

          <Pressable
            onPress={() => setAgreeTerms((v) => !v)}
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
          >
            <View
              style={{
                height: 18,
                width: 18,
                marginTop: 2,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: agreeTerms ? colors.primary : colors.card,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {agreeTerms ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
            </View>
            <Text style={{ flex: 1, fontSize: 12, color: colors.mutedForeground, lineHeight: 18 }}>
              I agree to the{" "}
              <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                Terms & Conditions
              </Text>
            </Text>
          </Pressable>
          {errors.agreeTerms ? (
            <Text style={{ color: colors.destructive, fontSize: 12 }}>{errors.agreeTerms}</Text>
          ) : null}

          <Button title="Create account" loading={loading} onPress={onSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
