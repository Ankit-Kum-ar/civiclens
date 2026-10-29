import React, { useEffect, useMemo, useState } from "react";
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
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { GRIEVANCE_CATEGORIES } from "@/constants";
import { apiFetch } from "@/lib/api";
import { radius } from "@/theme/colors";
import { ExploreNativeMap } from "@/components/explore/ExploreNativeMap";

type Grievance = {
  _id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  location: {
    coordinates?: [number, number];
    address?: string;
    ward?: string;
    city?: string;
  };
  media: {
    originalSecureUrl: string;
    redactedSecureUrl?: string;
    resourceType?: "image" | "video";
  };
  upvotesCount: number;
  createdAt: string;
};

const severityColor = (s: string, colors: { success: string; warning: string; destructive: string }) => {
  if (s === "LOW") return colors.success;
  if (s === "MEDIUM") return colors.warning;
  return colors.destructive;
};

export default function ExploreScreen() {
  const { colors } = useTheme();
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [sortBy, setSortBy] = useState<"upvotes" | "latest">("upvotes");
  const [active, setActive] = useState<Grievance | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({
          category: selectedCategory,
          severity: selectedSeverity,
          sortBy,
        });
        // Try public feed endpoint variants used by CivicLens
        const paths = [
          `/api/mobile/grievances?${qs}`,
          `/api/grievances?${qs}`,
        ];
        let loaded: Grievance[] = [];
        for (const path of paths) {
          const res = await apiFetch(path);
          if (res.ok) {
            const data = await res.json();
            loaded = (data.grievances || data.data || []) as Grievance[];
            if (loaded.length || data.success) break;
          }
        }
        if (mounted) {
          setGrievances(loaded);
          if (loaded[0]) setActive((prev) => prev ?? loaded[0]);
        }
      } catch {
        if (mounted) setGrievances([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedCategory, selectedSeverity, sortBy]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return grievances;
    return grievances.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q) ||
        g.location?.ward?.toLowerCase().includes(q) ||
        g.location?.address?.toLowerCase().includes(q)
    );
  }, [grievances, searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: `${colors.card}E6` },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable onPress={() => router.push("/")}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                <Ionicons name="shield-checkmark" size={16} color="#fff" />
              </View>
              <Text style={{ fontWeight: "800", color: colors.foreground }}>CivicLens</Text>
            </View>
          </Pressable>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>/ Public Civic Grid</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <ThemeToggle />
          <Pressable
            onPress={() => router.push("/my-reports")}
            style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.foreground }}>
              My Reports
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/report")}
            style={[styles.chip, { backgroundColor: colors.primary, borderColor: colors.primary }]}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>Report</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ padding: 12, gap: 10, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderRadius: radius.xl,
            paddingHorizontal: 12,
            height: 42,
          }}
        >
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            placeholder="Search ward, title, landmark..."
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, color: colors.foreground, fontSize: 13 }}
          />
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {["ALL", ...GRIEVANCE_CATEGORIES].map((c) => (
            <Pressable
              key={c}
              onPress={() => setSelectedCategory(c)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedCategory === c ? colors.primary : colors.card,
                  borderColor: selectedCategory === c ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: selectedCategory === c ? "#fff" : colors.mutedForeground,
                }}
              >
                {c === "ALL" ? "All" : c}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((s) => (
            <Pressable
              key={s}
              onPress={() => setSelectedSeverity(s)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedSeverity === s ? `${colors.primary}1A` : colors.card,
                  borderColor: selectedSeverity === s ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: selectedSeverity === s ? colors.primary : colors.mutedForeground,
                }}
              >
                {s}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => setSortBy((p) => (p === "upvotes" ? "latest" : "upvotes"))}
            style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: colors.foreground }}>
              Sort: {sortBy}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode((v) => (v === "map" ? "list" : "map"))}
            style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: colors.foreground }}>
              {viewMode === "map" ? "List" : "Map"}
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
            <ActivityIndicator color={colors.primary} />
            <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
              Rendering Civic Geospatial Grid...
            </Text>
          </View>
        ) : viewMode === "map" ? (
          <View style={{ flex: 1, gap: 10 }}>
            <View
              style={{
                flex: 1,
                borderRadius: radius["2xl"],
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 280,
              }}
            >
              <ExploreNativeMap
                grievances={filtered}
                onSelect={(g) => {
                  const full = filtered.find((item) => item._id === g._id);
                  if (full) setActive(full);
                }}
                severityColor={(s) => severityColor(s, colors)}
              />
            </View>

            {active ? (
              <Card style={{ gap: 8 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "800",
                    color: colors.primary,
                    textTransform: "uppercase",
                  }}
                >
                  {active.category}
                </Text>
                <Text style={{ fontWeight: "800", color: colors.foreground }}>{active.title}</Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  {active.location.address || active.location.ward || "New Delhi"}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                    👍 {active.upvotesCount}
                  </Text>
                  <Pressable onPress={() => router.push(`/report/${active._id}`)}>
                    <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>
                      Inspect →
                    </Text>
                  </Pressable>
                </View>
              </Card>
            ) : (
              <Card>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, textAlign: "center" }}>
                  {filtered.length === 0
                    ? "No incidents on the civic grid yet."
                    : "Tap a map pin to preview an incident."}
                </Text>
              </Card>
            )}
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: colors.mutedForeground, marginTop: 40 }}>
                No incidents found.
              </Text>
            }
            renderItem={({ item }) => {
              const img = item.media.redactedSecureUrl || item.media.originalSecureUrl;
              return (
                <Pressable onPress={() => router.push(`/report/${item._id}`)}>
                  <Card style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                    {img ? (
                      <Image
                        source={{ uri: img }}
                        style={{ width: 72, height: 56, borderRadius: 12, backgroundColor: "#000" }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 72,
                          height: 56,
                          borderRadius: 12,
                          backgroundColor: colors.muted,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="shield-checkmark" size={20} color={colors.mutedForeground} />
                      </View>
                    )}
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "800",
                          color: colors.primary,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.category}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontWeight: "800", color: colors.foreground }}
                      >
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
                        {item.location.ward || "Ward 32"} • 👍 {item.upvotesCount}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
    flexWrap: "wrap",
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
  filterChip: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
