import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { radius } from "@/theme/colors";

// expo-linear-gradient may not be installed — fallback View if import fails at runtime
// We'll use a plain View gradient substitute to avoid extra dep issues
function AuthHero() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroGlow1} />
      <View style={styles.heroGlow2} />
      <View style={{ zIndex: 1, gap: 8 }}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>CL</Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>CivicLens</Text>
        </View>
        <View style={styles.heroBadge}>
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>Community First</Text>
        </View>
        <Text style={styles.heroQuote}>Empowering Citizens, Fixing Infrastructure</Text>
        <Text style={styles.heroSub}>
          Access your municipal ticket dashboard and track hazard resolutions in real time.
        </Text>
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fillCitizen = () => {
    setEmail("aarav.citizen@civiclens.gov");
    setPassword("Password123!");
    setRememberMe(true);
    setErrors({});
    setGeneralError(null);
    Alert.alert("Demo", "Citizen credentials loaded! Tap Log in.");
  };

  const fillOfficer = () => {
    setEmail("municipalofficer@civiclens.gov");
    setPassword("Password123!");
    setRememberMe(true);
    setErrors({});
    setGeneralError(null);
    Alert.alert("Demo", "Officer credentials loaded! Tap Log in.");
  };

  const onSubmit = async () => {
    const next: typeof errors = {};
    if (!email.trim() || !email.includes("@")) next.email = "Please enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setGeneralError(null);
    try {
      const user = await signIn(email.trim(), password);
      const role = user.role || "CITIZEN";
      if (role === "ADMIN" || role === "MUNICIPAL_OFFICER") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    } catch (e: unknown) {
      setGeneralError(e instanceof Error ? e.message : "Sign-in failed");
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
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <AuthHero />

          <View style={styles.form}>
            <Text style={[styles.title, { color: colors.foreground }]}>Welcome back</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 14, marginBottom: 16 }}>
              Don&apos;t have an account?{" "}
              <Text
                style={{ color: colors.primary, fontWeight: "600" }}
                onPress={() => router.push("/register")}
              >
                Sign up
              </Text>
            </Text>

            <View
              style={[
                styles.demoBox,
                { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}4D` },
              ]}
            >
              <View style={styles.demoHeader}>
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "800" }}>
                  ● DEMO CITIZEN ACCOUNT
                </Text>
                <Pressable
                  onPress={fillCitizen}
                  style={[
                    styles.autoFill,
                    { backgroundColor: colors.card, borderColor: `${colors.primary}4D` },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800" }}>
                    Auto-fill
                  </Text>
                </Pressable>
              </View>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                Email:{" "}
                <Text style={{ color: colors.primary, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
                  aarav.citizen@civiclens.gov
                </Text>
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                Password:{" "}
                <Text style={{ color: colors.primary, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
                  Password123!
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.demoBox,
                { backgroundColor: `${colors.warning}1A`, borderColor: `${colors.warning}4D` },
              ]}
            >
              <View style={styles.demoHeader}>
                <Text style={{ color: colors.warning, fontSize: 11, fontWeight: "800" }}>
                  ● DEMO MUNICIPAL OFFICER
                </Text>
                <Pressable
                  onPress={fillOfficer}
                  style={[
                    styles.autoFill,
                    { backgroundColor: colors.card, borderColor: `${colors.warning}4D` },
                  ]}
                >
                  <Text style={{ color: colors.warning, fontSize: 12, fontWeight: "800" }}>
                    Auto-fill
                  </Text>
                </Pressable>
              </View>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                Email:{" "}
                <Text style={{ color: colors.warning }}>municipalofficer@civiclens.gov</Text>
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                Password: <Text style={{ color: colors.warning }}>Password123!</Text>
              </Text>
            </View>

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

            <Input
              placeholder="Email address"
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

            <View style={styles.rowBetween}>
              <Pressable
                onPress={() => setRememberMe((v) => !v)}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: rememberMe ? colors.primary : colors.card,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {rememberMe ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                </View>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>Remember me</Text>
              </Pressable>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>Forgot password?</Text>
            </View>

            <Button title="Log in" loading={loading} onPress={onSubmit} />

            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={{ fontSize: 12, color: colors.mutedForeground, paddingHorizontal: 8 }}>
                Or log in with
              </Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

            <Button
              title="Continue with Google"
              variant="outline"
              onPress={() =>
                Alert.alert(
                  "Google Sign-In",
                  "Open the web app for Google OAuth, or use the demo credentials above."
                )
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  hero: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    minHeight: 220,
    overflow: "hidden",
    backgroundColor: "#4880FF",
    justifyContent: "flex-end",
  },
  heroGlow1: {
    position: "absolute",
    top: -40,
    left: -40,
    height: 160,
    width: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  heroGlow2: {
    position: "absolute",
    bottom: -40,
    right: -20,
    height: 180,
    width: 180,
    borderRadius: 90,
    backgroundColor: "rgba(98,38,239,0.45)",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 24 },
  brandMark: {
    height: 36,
    width: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroQuote: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 18 },
  form: { paddingHorizontal: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: "800" },
  demoBox: {
    borderWidth: 1,
    borderRadius: radius["2xl"],
    padding: 14,
    gap: 4,
  },
  demoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  autoFill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  divider: { flex: 1, height: StyleSheet.hairlineWidth },
});
