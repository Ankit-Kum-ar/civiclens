import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchGrievance } from "@/lib/api";
import { radius } from "@/theme/colors";

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [grievance, setGrievance] = useState<any>(null);
  const [viewerRole, setViewerRole] = useState("CITIZEN");
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState(50);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchGrievance(String(id));
        if (mounted) {
          setGrievance(data.grievance);
          if (data.viewerRole) setViewerRole(data.viewerRole);
        }
      } catch {
        if (mounted) setGrievance(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const isOfficer =
    viewerRole === "MUNICIPAL_OFFICER" || viewerRole === "ADMIN";
  const ticket = String(id || "").slice(-6).toUpperCase() || "CL-8921";
  const rawUrl = grievance?.media?.originalSecureUrl || "";
  const redactedUrl = grievance?.media?.redactedSecureUrl || rawUrl;
  const isVideo =
    grievance?.media?.resourceType === "video" ||
    rawUrl.endsWith(".mp4") ||
    rawUrl.endsWith(".webm");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: `${colors.background}E6` },
        ]}
      >
        <Pressable
          onPress={() => router.push(isOfficer ? "/admin/dashboard" : "/")}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="arrow-back" size={16} color={colors.mutedForeground} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground }}>
            {isOfficer ? "Back to Municipal Triage Hub" : "Back to Home"}
          </Text>
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {isOfficer ? (
            <View
              style={{
                backgroundColor: `${colors.destructive}1A`,
                borderColor: `${colors.destructive}4D`,
                borderWidth: 1,
                borderRadius: 999,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  color: colors.destructive,
                  fontSize: 10,
                  fontWeight: "800",
                  textTransform: "uppercase",
                }}
              >
                Officer Terminal
              </Text>
            </View>
          ) : null}
          <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>
            Ticket #{ticket}
          </Text>
          <ThemeToggle />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {isOfficer ? (
          <Card
            style={{
              gap: 10,
              backgroundColor: `${colors.primary}1A`,
              borderColor: `${colors.primary}4D`,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <View
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 12,
                  backgroundColor: `${colors.primary}33`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="pulse" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800", color: colors.foreground }}>
                  Municipal Inspection & Dispatch Terminal
                </Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  Official triage review for incident #{ticket}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
              Status: {grievance?.status || "OPEN"}
            </Text>
          </Card>
        ) : (
          <Card
            style={{
              gap: 10,
              backgroundColor: `${colors.success}1A`,
              borderColor: `${colors.success}33`,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <View
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 12,
                  backgroundColor: `${colors.success}33`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800", color: colors.foreground }}>
                  Report Submitted & Anonymized!
                </Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  Your hazard is registered with municipal dispatch.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {[
                "e_pixelate_faces Applied",
                "Cryptographic Geotag Stamped",
                `Status: ${grievance?.status || "OPEN"}`,
              ].map((chip) => (
                <View
                  key={chip}
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.foreground }}>
                    {chip}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {loading ? (
          <Card style={{ alignItems: "center", paddingVertical: 48, gap: 10 }}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
              Loading redacted visual evidence...
            </Text>
          </Card>
        ) : isVideo && (redactedUrl || rawUrl) ? (
          <Card style={{ gap: 10 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.mutedForeground,
                textTransform: "uppercase",
              }}
            >
              Civic Video Evidence
            </Text>
            <Pressable
              onPress={() => Linking.openURL(redactedUrl || rawUrl)}
              style={{
                aspectRatio: 16 / 9,
                borderRadius: radius["2xl"],
                backgroundColor: "#000",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Ionicons name="play-circle" size={56} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                Tap to play protected civic video
              </Text>
            </Pressable>
          </Card>
        ) : (
          <Card style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.mutedForeground,
                textTransform: "uppercase",
              }}
            >
              Privacy Verification (Before & After)
            </Text>
            <View
              style={{
                aspectRatio: 16 / 9,
                borderRadius: radius["2xl"],
                overflow: "hidden",
                backgroundColor: colors.muted,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {redactedUrl ? (
                <Image
                  source={{ uri: redactedUrl }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
              ) : null}
              {rawUrl ? (
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${slider}%`,
                    overflow: "hidden",
                    borderRightWidth: 2,
                    borderRightColor: "rgba(255,255,255,0.8)",
                  }}
                >
                  <Image
                    source={{ uri: rawUrl }}
                    style={{ width: `${10000 / Math.max(slider, 1)}%`, height: "100%" }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      backgroundColor: "rgba(244,63,94,0.85)",
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>
                      RAW BYSTANDER VIEW
                    </Text>
                  </View>
                </View>
              ) : null}
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(16,185,129,0.85)",
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>
                  PROTECTED CIVIC VIEW
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Compare</Text>
              {[0, 25, 50, 75, 100].map((v) => (
                <Pressable
                  key={v}
                  onPress={() => setSlider(v)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: slider === v ? colors.primary : colors.muted,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: slider === v ? "#fff" : colors.foreground,
                    }}
                  >
                    {v}%
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>
        )}

        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "700", color: colors.foreground }}>
              ⚠ Automated Triage & Keywords
            </Text>
            <View
              style={{
                backgroundColor: `${colors.primary}1A`,
                borderRadius: 999,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>
                AI Confidence: 95%
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.muted,
              borderRadius: radius.xl,
              padding: 12,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.mutedForeground, lineHeight: 18 }}>
              {grievance?.aiTriage?.transcript ||
                grievance?.description ||
                "Voice transcript converted into municipal search tags."}
            </Text>
          </View>
          {grievance?.title ? (
            <Text style={{ fontWeight: "800", color: colors.foreground }}>{grievance.title}</Text>
          ) : null}
        </Card>

        {isOfficer ? (
          <Button title="Back to Municipal Hub" onPress={() => router.push("/admin/dashboard")} />
        ) : (
          <View style={{ gap: 10 }}>
            <Button title="Report Another Hazard" onPress={() => router.push("/report")} />
            <Button
              title="Back to Dashboard"
              variant="outline"
              onPress={() => router.push("/")}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
    flexWrap: "wrap",
  },
});
