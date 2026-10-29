import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api";
import { GRIEVANCE_CATEGORIES } from "@/constants";
import { radius } from "@/theme/colors";

type AdminGrievance = {
  _id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  reportedBy?: { name: string; email: string } | null;
  location: { address?: string; ward?: string };
  media: {
    originalSecureUrl: string;
    redactedSecureUrl?: string;
    resourceType?: "image" | "video";
  };
  upvotesCount: number;
  createdAt: string;
};

type Counts = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  highUrgency: number;
};

export default function AdminDashboardScreen() {
  const { user, signOut, isOfficer } = useAuth();
  const { colors } = useTheme();
  const [grievances, setGrievances] = useState<AdminGrievance[]>([]);
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    highUrgency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const qs = new URLSearchParams({
          status: statusFilter,
          severity: severityFilter,
          category: categoryFilter,
        });
        const res = await apiFetch(`/api/mobile/admin?${qs}`);
        if (res.ok) {
          const data = await res.json();
          setCounts(
            data.data?.counts || {
              total: 0,
              open: 0,
              inProgress: 0,
              resolved: 0,
              rejected: 0,
              highUrgency: 0,
            }
          );
          setGrievances(data.data?.grievances || []);
        }
      } catch {
        // keep previous
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusFilter, severityFilter, categoryFilter]
  );

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return grievances;
    return grievances.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.location.ward?.toLowerCase().includes(q) ||
        g.location.address?.toLowerCase().includes(q) ||
        g.reportedBy?.name?.toLowerCase().includes(q)
    );
  }, [grievances, searchQuery]);

  const updateStatus = async (
    id: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  ) => {
    setUpdatingId(id);
    try {
      const res = await apiFetch(`/api/mobile/admin/grievances/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await load(true);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOfficer && user) {
    // Non-officers shouldn't stay here
    router.replace("/");
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          gap: 8,
        }}
      >
        <ActivityIndicator color={colors.destructive} size="large" />
        <Text style={{ fontSize: 12, fontWeight: "700", color: colors.mutedForeground }}>
          Connecting to Municipal Triage Hub...
        </Text>
      </View>
    );
  }

  const metricCards = [
    {
      title: "Pending Triage",
      value: counts.open,
      sub: "Awaiting municipal assignment",
      color: colors.destructive,
      icon: "alert-circle" as const,
    },
    {
      title: "In Progress Repairs",
      value: counts.inProgress,
      sub: "Field crews dispatched",
      color: colors.warning,
      icon: "time" as const,
    },
    {
      title: "Resolved Hazards",
      value: counts.resolved,
      sub: "Successfully verified & closed",
      color: colors.success,
      icon: "checkmark-circle" as const,
    },
    {
      title: "High Urgency Alerts",
      value: counts.highUrgency,
      sub: "Open hazards requiring immediate SLA",
      color: colors.primary,
      icon: "flame" as const,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: `${colors.card}E6` },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={[styles.logo, { backgroundColor: colors.destructive }]}>
            <Ionicons name="shield-checkmark" size={16} color="#fff" />
          </View>
          <View>
            <Text style={{ fontWeight: "800", color: colors.foreground }}>CivicLens</Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                color: colors.mutedForeground,
                textTransform: "uppercase",
              }}
            >
              Municipal Triage Hub
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Pressable onPress={() => load(true)} disabled={refreshing}>
            <Ionicons
              name="refresh"
              size={18}
              color={refreshing ? colors.mutedForeground : colors.primary}
            />
          </Pressable>
          <ThemeToggle />
          <Pressable onPress={() => signOut().then(() => router.replace("/login"))}>
            <Ionicons name="log-out-outline" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 14, gap: 12, paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <View style={styles.metrics}>
              {metricCards.map((m) => (
                <Card key={m.title} style={styles.metric}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                      <Text style={{ fontSize: 22, fontWeight: "900", color: colors.foreground }}>
                        {m.value}
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{m.sub}</Text>
                    </View>
                    <View
                      style={{
                        height: 44,
                        width: 44,
                        borderRadius: radius["2xl"],
                        backgroundColor: `${m.color}1A`,
                        borderWidth: 1,
                        borderColor: `${m.color}33`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name={m.icon} size={20} color={m.color} />
                    </View>
                  </View>
                </Card>
              ))}
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
                borderRadius: radius.xl,
                paddingHorizontal: 12,
                height: 42,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                placeholder="Search tickets, wards, reporters..."
                placeholderTextColor={colors.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1, color: colors.foreground, fontSize: 13 }}
              />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setStatusFilter(s)}
                  style={[
                    styles.filter,
                    {
                      backgroundColor: statusFilter === s ? colors.primary : colors.card,
                      borderColor: statusFilter === s ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: statusFilter === s ? "#fff" : colors.mutedForeground,
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {["ALL", "HIGH", "MEDIUM", "LOW"].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSeverityFilter(s)}
                  style={[
                    styles.filter,
                    {
                      borderColor: severityFilter === s ? colors.primary : colors.border,
                      backgroundColor:
                        severityFilter === s ? `${colors.primary}1A` : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: severityFilter === s ? colors.primary : colors.mutedForeground,
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
              {["ALL", ...GRIEVANCE_CATEGORIES.slice(0, 3)].map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCategoryFilter(c)}
                  style={[
                    styles.filter,
                    {
                      borderColor: categoryFilter === c ? colors.primary : colors.border,
                      backgroundColor: categoryFilter === c ? `${colors.primary}1A` : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: categoryFilter === c ? colors.primary : colors.mutedForeground,
                    }}
                    numberOfLines={1}
                  >
                    {c === "ALL" ? "All categories" : c}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Card style={{ paddingVertical: 36 }}>
            <Text style={{ textAlign: "center", color: colors.mutedForeground, fontSize: 12 }}>
              No hazard incidents found matching the selected triage filters.
            </Text>
          </Card>
        }
        renderItem={({ item }) => {
          const img = item.media.redactedSecureUrl || item.media.originalSecureUrl;
          const busy = updatingId === item._id;
          return (
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <Pressable onPress={() => router.push(`/report/${item._id}`)}>
                {img ? (
                  <Image
                    source={{ uri: img }}
                    style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" }}
                  />
                ) : (
                  <View
                    style={{
                      aspectRatio: 16 / 9,
                      backgroundColor: colors.muted,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="shield-checkmark" size={28} color={colors.mutedForeground} />
                  </View>
                )}
              </Pressable>
              <View style={{ padding: 14, gap: 8 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "800",
                    color: colors.primary,
                    textTransform: "uppercase",
                  }}
                >
                  {item.category} • {item.severity}
                </Text>
                <Text style={{ fontWeight: "800", color: colors.foreground }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  📍 {item.location.ward || item.location.address || "Ward 32"}
                </Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  👤 {item.reportedBy?.name || "Citizen"} • 👍 {item.upvotesCount}
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                  {(
                    [
                      ["OPEN", "Open"],
                      ["IN_PROGRESS", "Dispatch"],
                      ["RESOLVED", "Resolved"],
                      ["REJECTED", "Reject"],
                    ] as const
                  ).map(([status, label]) => (
                    <Pressable
                      key={status}
                      disabled={busy}
                      onPress={() => updateStatus(item._id, status)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor:
                          item.status === status ? colors.primary : colors.border,
                        backgroundColor:
                          item.status === status ? `${colors.primary}1A` : colors.card,
                        opacity: busy ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "800",
                          color:
                            item.status === status ? colors.primary : colors.mutedForeground,
                        }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    height: 32,
    width: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metric: { width: "47%", flexGrow: 1 },
  filter: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
