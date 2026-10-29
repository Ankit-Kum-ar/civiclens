import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { radius } from "@/theme/colors";

type UserGrievance = {
  _id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  location: { address?: string; ward?: string; city?: string };
  media: { originalSecureUrl: string; redactedSecureUrl?: string };
  upvotesCount: number;
  createdAt: string;
};

export default function MyReportsScreen() {
  const { colors } = useTheme();
  const [tab, setTab] = useState<"submitted" | "endorsed">("submitted");
  const [submitted, setSubmitted] = useState<UserGrievance[]>([]);
  const [endorsed, setEndorsed] = useState<UserGrievance[]>([]);
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const paths = ["/api/mobile/my-reports", "/api/mobile/grievances/mine"];
        for (const path of paths) {
          const res = await apiFetch(path);
          if (res.ok) {
            const data = await res.json();
            if (mounted) {
              setSubmitted(data.submitted || []);
              setEndorsed(data.endorsed || []);
              setReputation(data.reputationPoints || 0);
            }
            break;
          }
        }
      } catch {
        // empty
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const list = tab === "submitted" ? submitted : endorsed;
  const activeCount = submitted.filter(
    (r) => r.status === "OPEN" || r.status === "IN_PROGRESS"
  ).length;

  const statusStyle = (status: string) => {
    if (status === "RESOLVED")
      return { bg: `${colors.success}1A`, fg: colors.success, border: `${colors.success}33` };
    if (status === "IN_PROGRESS")
      return { bg: `${colors.primary}1A`, fg: colors.primary, border: `${colors.primary}33` };
    return { bg: `${colors.warning}1A`, fg: colors.warning, border: `${colors.warning}33` };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: `${colors.card}E6` },
        ]}
      >
        <Pressable onPress={() => router.push("/")} style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="shield-checkmark" size={16} color="#fff" />
          </View>
          <Text style={{ fontWeight: "800", color: colors.foreground }}>CivicLens</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>/ Citizen Hub</Text>
        </Pressable>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <ThemeToggle />
          <Pressable
            onPress={() => router.push("/explore")}
            style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.foreground }}>
              Public Grid
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/report")}
            style={[styles.chip, { backgroundColor: colors.primary, borderColor: colors.primary }]}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>Report Hazard</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <View style={styles.metrics}>
              {[
                {
                  label: "Civic Reputation",
                  value: reputation,
                  sub: "+10 per report verified",
                  color: colors.primary,
                  icon: "ribbon" as const,
                },
                {
                  label: "My Reports",
                  value: submitted.length,
                  sub: "Incidents filed",
                  color: colors.success,
                  icon: "document-text" as const,
                },
                {
                  label: "In Progress",
                  value: activeCount,
                  sub: "Under municipal review",
                  color: colors.warning,
                  icon: "time" as const,
                },
                {
                  label: "Endorsed",
                  value: endorsed.length,
                  sub: "Community issues supported",
                  color: colors.success,
                  icon: "thumbs-up" as const,
                },
              ].map((m) => (
                <Card key={m.label} style={styles.metric}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{m.label}</Text>
                    <View
                      style={{
                        height: 28,
                        width: 28,
                        borderRadius: 8,
                        backgroundColor: `${m.color}1A`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name={m.icon} size={14} color={m.color} />
                    </View>
                  </View>
                  <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground }}>
                    {loading ? "—" : m.value}
                  </Text>
                  <Text style={{ fontSize: 11, color: m.color, fontWeight: "600" }}>{m.sub}</Text>
                </Card>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {(
                [
                  ["submitted", `My Reports (${submitted.length})`],
                  ["endorsed", `Endorsed by Me (${endorsed.length})`],
                ] as const
              ).map(([key, label]) => (
                <Pressable
                  key={key}
                  onPress={() => setTab(key)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: radius.xl,
                    backgroundColor: tab === key ? colors.primary : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "800",
                      color: tab === key ? "#fff" : colors.mutedForeground,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ padding: 40, alignItems: "center", gap: 8 }}>
              <ActivityIndicator color={colors.primary} />
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                Loading citizen reports...
              </Text>
            </View>
          ) : (
            <Card style={{ alignItems: "center", gap: 10, paddingVertical: 36 }}>
              <Ionicons name="document-text-outline" size={28} color={colors.mutedForeground} />
              <Text style={{ fontWeight: "700", color: colors.foreground }}>No reports found</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.mutedForeground,
                  textAlign: "center",
                  lineHeight: 18,
                }}
              >
                {tab === "submitted"
                  ? "You haven't filed any street hazard reports yet."
                  : "You haven't endorsed any neighborhood reports yet."}
              </Text>
              <Button title="File First Hazard" onPress={() => router.push("/report")} />
            </Card>
          )
        }
        renderItem={({ item }) => {
          const st = statusStyle(item.status);
          const img = item.media.redactedSecureUrl || item.media.originalSecureUrl;
          return (
            <Card style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                {img ? (
                  <Image
                    source={{ uri: img }}
                    style={{ width: 88, height: 64, borderRadius: 12, backgroundColor: "#000" }}
                  />
                ) : null}
                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "800",
                      color: colors.primary,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={{ fontWeight: "800", color: colors.foreground }} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground }} numberOfLines={1}>
                    📍 {item.location.address || item.location.ward || "New Delhi"}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: st.bg,
                    borderWidth: 1,
                    borderColor: st.border,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "800", color: st.fg }}>{item.status}</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  👍 {item.upvotesCount}
                </Text>
                <Pressable onPress={() => router.push(`/report/${item._id}`)}>
                  <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>
                    View Timeline →
                  </Text>
                </Pressable>
              </View>
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  logo: {
    height: 32,
    width: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metric: {
    width: "47%",
    flexGrow: 1,
    gap: 4,
  },
});
