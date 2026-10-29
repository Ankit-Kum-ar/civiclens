import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { radius } from "@/theme/colors";
import { API_BASE, apiFetch } from "@/lib/api";

type DashboardStats = {
  totalReported: number;
  totalEndorsements: number;
  resolvedCount: number;
  reputationPoints: number;
  recentGrievances: Array<{
    _id: string;
    title: string;
    category: string;
    severity: string;
    status: string;
    location: { address?: string; ward?: string };
    media: {
      originalSecureUrl: string;
      redactedSecureUrl?: string;
      resourceType?: "image" | "video";
    };
    upvotesCount: number;
    createdAt: string;
  }>;
};

function PublicLanding() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={styles.landingWrap}>
        <Card style={styles.landingCard}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: `${colors.primary}1A`,
                borderColor: `${colors.primary}33`,
              },
            ]}
          >
            <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>
              CivicLens Platform Live
            </Text>
          </View>

          <Text style={[styles.landingTitle, { color: colors.foreground }]}>
            Welcome to CivicLens
          </Text>
          <Text style={[styles.landingSub, { color: colors.mutedForeground }]}>
            AI privacy-compliant citizen hazard reporting, transparent public maps,
            and automated municipal triage.
          </Text>

          <View style={{ gap: 10, marginTop: 8 }}>
            <Button title="Sign In" onPress={() => router.push("/login")} />
            <Button
              title="Create an Account"
              variant="outline"
              onPress={() => router.push("/register")}
            />
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: 16,
              marginTop: 8,
              alignItems: "center",
            }}
          >
            <Pressable onPress={() => router.push("/explore")}>
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>
                Explore Public Civic Map without Sign In →
              </Text>
            </Pressable>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

function CitizenDashboard() {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalReported: 0,
    totalEndorsements: 0,
    resolvedCount: 0,
    reputationPoints: 0,
    recentGrievances: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Prefer dedicated mobile/dashboard if present; fall back to empty metrics
        const res = await apiFetch("/api/mobile/dashboard");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.stats) setStats(data.stats);
        }
      } catch {
        // Backend may not expose mobile dashboard yet — keep zeros
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = [
    {
      title: "Hazards Reported",
      value: stats.totalReported,
      sub: "Logged to civic grid",
      color: colors.primary,
      icon: "document-text" as const,
    },
    {
      title: "Community Upvotes",
      value: stats.totalEndorsements,
      sub: "Civic endorsements received",
      color: colors.warning,
      icon: "thumbs-up" as const,
    },
    {
      title: "Hazards Resolved",
      value: stats.resolvedCount,
      sub: "Repaired by municipality",
      color: colors.success,
      icon: "checkmark-circle" as const,
    },
    {
      title: "Reputation Points",
      value: stats.reputationPoints,
      sub: "Civic Vanguard Score",
      color: colors.purpleSoft,
      icon: "ribbon" as const,
    },
  ];

  const actions = [
    {
      title: "Report Hazard",
      description: "Log road crater, live wire, or manhole with AI privacy redaction",
      href: "/report",
      primary: true,
      cta: "New Report",
      icon: "add-circle" as const,
    },
    {
      title: "Explore Civic Grid",
      description: "Interactive real-time map with verified municipal incidents",
      href: "/explore",
      primary: false,
      cta: "Open Map",
      icon: "compass" as const,
    },
    {
      title: "Track My Reports",
      description: "Review progress updates, endorsements, and resolution tickets",
      href: "/my-reports",
      primary: false,
      cta: "View Reports",
      icon: "documents" as const,
    },
  ];

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      <View
        style={[
          styles.header,
          { backgroundColor: `${colors.card}CC`, borderBottomColor: colors.border },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="shield-checkmark" size={18} color="#fff" />
          </View>
          <View>
            <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 16 }}>
              CivicLens
            </Text>
            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: 10,
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Citizen Portal
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.xl,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <View
              style={{
                height: 28,
                width: 28,
                borderRadius: 8,
                backgroundColor: `${colors.primary}1A`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>
                {(user?.name || "C").charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <ThemeToggle />
          <Pressable
            onPress={() => signOut()}
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
            <Ionicons name="log-out-outline" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            gap: 12,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: `${colors.primary}1A`,
              borderRadius: radius["2xl"],
            }}
          />
          <Text style={{ fontSize: 22, fontWeight: "900", color: colors.foreground }}>
            Hello, {user?.name || "Citizen"} 👋
          </Text>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18 }}>
            Your municipal reporting portal is live. Log public hazards, track municipal
            repair SLA, and build civic trust.
          </Text>
          <Button
            title="Report Incident →"
            onPress={() => router.push("/report")}
            style={{ alignSelf: "flex-start", paddingHorizontal: 20 }}
          />
        </Card>

        <View style={styles.metricGrid}>
          {metrics.map((m) => (
            <Card key={m.title} style={styles.metricCard}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: colors.mutedForeground,
                    textTransform: "uppercase",
                  }}
                >
                  {m.title}
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "900", color: colors.foreground }}>
                  {loading ? "—" : m.value}
                </Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{m.sub}</Text>
              </View>
              <View
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: radius["2xl"],
                  backgroundColor: `${m.color}1A`,
                  borderWidth: 1,
                  borderColor: `${m.color}33`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={m.icon} size={22} color={m.color} />
              </View>
            </Card>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          {actions.map((a) => (
            <Pressable key={a.title} onPress={() => router.push(a.href as any)}>
              <Card
                style={{
                  backgroundColor: a.primary ? colors.primary : colors.card,
                  borderColor: a.primary ? colors.primary : colors.border,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Ionicons
                    name={a.icon}
                    size={22}
                    color={a.primary ? "#fff" : colors.foreground}
                  />
                  <Ionicons
                    name="arrow-up-right-box-outline"
                    size={16}
                    color={a.primary ? "#ffffff99" : colors.mutedForeground}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: "800",
                    fontSize: 16,
                    color: a.primary ? "#fff" : colors.foreground,
                  }}
                >
                  {a.title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 17,
                    color: a.primary ? "#ffffffcc" : colors.mutedForeground,
                  }}
                >
                  {a.description}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "800",
                    color: a.primary ? "#fff" : colors.foreground,
                  }}
                >
                  {a.cta}
                </Text>
              </Card>
            </Pressable>
          ))}
        </View>

        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontWeight: "800", color: colors.foreground }}>
                Recent Hazard Feed
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                Latest privacy-redacted incidents
              </Text>
            </View>
            <Link href="/explore" asChild>
              <Pressable>
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>
                  View All →
                </Text>
              </Pressable>
            </Link>
          </View>
          {stats.recentGrievances.length === 0 ? (
            <View
              style={{
                paddingVertical: 28,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: colors.border,
                borderRadius: radius.xl,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                No civic incidents recorded yet. Be the first to report!
              </Text>
            </View>
          ) : (
            stats.recentGrievances.map((g) => (
              <Pressable
                key={g._id}
                onPress={() => router.push(`/report/${g._id}`)}
                style={{
                  paddingVertical: 10,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "800",
                    color: colors.primary,
                    textTransform: "uppercase",
                  }}
                >
                  {g.category}
                </Text>
                <Text style={{ fontWeight: "800", color: colors.foreground, marginTop: 2 }}>
                  {g.title}
                </Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>
                  {g.location.ward || "Ward 32"} • {new Date(g.createdAt).toLocaleDateString()}
                </Text>
              </Pressable>
            ))
          )}
        </Card>

        <Text style={{ fontSize: 10, color: colors.mutedForeground, textAlign: "center" }}>
          API: {API_BASE}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const { user, loading, isOfficer } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={[styles.flex, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) return <PublicLanding />;
  if (isOfficer) return <Redirect href="/admin/dashboard" />;
  return <CitizenDashboard />;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  landingWrap: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  landingCard: { gap: 16, alignItems: "center" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  landingTitle: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  landingSub: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    height: 36,
    width: 36,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
