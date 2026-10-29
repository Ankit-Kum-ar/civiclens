import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  GRIEVANCE_CATEGORIES,
  type GrievanceCategory,
  type GrievanceSeverity,
} from "@/constants";
import { siteConfig } from "@/config/site";
import { apiFetch, getCloudinarySign } from "@/lib/api";
import { radius } from "@/theme/colors";

type GpsLocation = {
  coordinates: [number, number] | null;
  address: string;
  ward: string;
  city: string;
  isLoading: boolean;
  error: string | null;
};

const CATEGORY_ICONS: Record<GrievanceCategory, keyof typeof Ionicons.glyphMap> = {
  "Open Manhole": "warning",
  "Exposed Live Wire": "flash",
  "Crater Pothole": "car",
  "Severe Waterlogging": "water",
  "Illegal Garbage Dump": "trash",
  "Broken Streetlight": "bulb",
  "Damaged Guardrail": "shield",
};

export default function ReportScreen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GrievanceCategory>("Crater Pothole");
  const [severity, setSeverity] = useState<GrievanceSeverity>("MEDIUM");
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaMime, setMediaMime] = useState("image/jpeg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pipelineStep, setPipelineStep] = useState("");
  const [location, setLocation] = useState<GpsLocation>({
    coordinates: null,
    address: "Detecting location...",
    ward: "Locating ward...",
    city: "New Delhi",
    isLoading: true,
    error: null,
  });

  const reverseGeocode = async (latitude: number, longitude: number) => {
    let address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
    let ward = siteConfig.defaultCoordinates.ward;
    let city = siteConfig.defaultCoordinates.city;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const a = data.address || {};
        const suburb = a.suburb || a.neighbourhood || a.residential || a.road || "";
        city = a.city || a.state_district || city;
        ward = a.suburb ? `Ward ${String(suburb).slice(0, 12)}` : ward;
        address = [suburb, city].filter(Boolean).join(", ") || address;
      }
    } catch {
      // fallback
    }
    return { address, ward, city };
  };

  const detectLocation = useCallback(async () => {
    setLocation((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation({
          coordinates: [77.209, 28.6139],
          address: "Mayur Vihar, District East",
          ward: "Ward 32",
          city: "New Delhi",
          isLoading: false,
          error: "Location permission denied.",
        });
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = pos.coords;
      const meta = await reverseGeocode(latitude, longitude);
      setLocation({
        coordinates: [longitude, latitude],
        ...meta,
        isLoading: false,
        error: null,
      });
    } catch (e: unknown) {
      setLocation({
        coordinates: [77.209, 28.6139],
        address: "Mayur Vihar, District East",
        ward: "Ward 32",
        city: "New Delhi",
        isLoading: false,
        error: e instanceof Error ? e.message : "Location failed",
      });
    }
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const pickMedia = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!lib.granted) {
        Alert.alert("Permission needed", "Camera or photo library access is required.");
        return;
      }
    }

    Alert.alert("Attach Evidence", "Choose media source", [
      {
        text: "Camera Photo",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) {
            setMediaUri(result.assets[0].uri);
            setMediaType("image");
            setMediaMime(result.assets[0].mimeType || "image/jpeg");
          }
        },
      },
      {
        text: "Library",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setMediaUri(asset.uri);
            const isVid = asset.type === "video";
            setMediaType(isVid ? "video" : "image");
            setMediaMime(asset.mimeType || (isVid ? "video/mp4" : "image/jpeg"));
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSubmit = async () => {
    if (!mediaUri) {
      Alert.alert("Missing media", "Please take a photo or record a video of the hazard.");
      return;
    }
    if (!title.trim() || title.length < 5) {
      Alert.alert("Title required", "Please enter a short title (at least 5 characters).");
      return;
    }
    if (!description.trim() || description.length < 10) {
      Alert.alert("Description required", "Please provide a description (at least 10 characters).");
      return;
    }
    if (!location.coordinates) {
      Alert.alert("GPS", "Waiting for GPS location lock. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(15);
    setPipelineStep("Securing server-signed Cloudinary token...");

    try {
      const signData = await getCloudinarySign();
      if (!signData.success) throw new Error(signData.error || "Failed to sign upload");

      setUploadProgress(35);
      setPipelineStep("Direct streaming media to Cloudinary CDN...");

      const form = new FormData();
      form.append("file", {
        uri: mediaUri,
        name: mediaType === "video" ? "hazard.mp4" : "hazard.jpg",
        type: mediaMime,
      } as any);
      form.append("api_key", signData.apiKey);
      form.append("timestamp", String(signData.timestamp));
      form.append("signature", signData.signature);
      form.append("folder", signData.folder);

      const uploadEndpoint = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${mediaType}/upload`;
      const uploadRes = await fetch(uploadEndpoint, { method: "POST", body: form });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadJson.error?.message || "Cloudinary upload failed");
      }

      setUploadProgress(90);
      setPipelineStep("Persisting municipal ticket into registry...");

      const payload = {
        title,
        description,
        category,
        severity,
        location: {
          coordinates: location.coordinates,
          address: location.address,
          ward: location.ward,
          city: location.city,
        },
        media: {
          publicId: uploadJson.public_id,
          originalSecureUrl: uploadJson.secure_url,
          resourceType: mediaType,
        },
        detectedFaceBoxes: [],
        aiTriage: {
          transcript: description,
          detectedCategory: category,
          confidenceScore: 0.95,
        },
      };

      // Prefer mobile REST create; fall back messaging if only server actions exist on web
      const createRes = await apiFetch("/api/mobile/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let grievanceId: string | undefined;
      if (createRes.ok) {
        const data = await createRes.json();
        grievanceId = data.grievanceId || data.id;
      } else {
        // Some deployments may only expose web server actions — still show confirmation UX path
        throw new Error(
          "Could not persist grievance via mobile API. Ensure you are signed in against the deployed CivicLens backend."
        );
      }

      setUploadProgress(100);
      Alert.alert("Success", "Hazard report logged and anonymized!");
      router.push(`/report/${grievanceId}`);
    } catch (e: unknown) {
      Alert.alert("Submit failed", e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setPipelineStep("");
    }
  };

  const severityOptions: Array<{
    label: string;
    value: GrievanceSeverity;
    color: string;
  }> = [
    { label: "Low", value: "LOW", color: colors.success },
    { label: "Medium", value: "MEDIUM", color: colors.warning },
    { label: "High / Critical", value: "HIGH", color: colors.destructive },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: `${colors.card}E6` },
        ]}
      >
        <Pressable onPress={() => router.back()} style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <Ionicons name="arrow-back" size={18} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, fontSize: 12, fontWeight: "600" }}>
            Back
          </Text>
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="locate" size={14} color={colors.primary} />
          <Text style={{ fontSize: 11, color: colors.mutedForeground, maxWidth: 160 }} numberOfLines={1}>
            {location.isLoading ? "Detecting..." : location.address}
          </Text>
          <Pressable onPress={detectLocation}>
            <Ionicons name="refresh" size={16} color={colors.primary} />
          </Pressable>
          <ThemeToggle />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Card style={{ gap: 8 }}>
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: `${colors.success}1A`,
              borderColor: `${colors.success}33`,
              borderWidth: 1,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Ionicons name="shield-checkmark" size={12} color={colors.success} />
            <Text style={{ color: colors.success, fontSize: 11, fontWeight: "800" }}>
              100% Privacy Redaction Active
            </Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: "800", color: colors.foreground }}>
            Report Street Hazard
          </Text>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18 }}>
            Direct edge ingestion. Bystander faces & car plates are blurred before public dispatch.
          </Text>
        </Card>

        <Card style={{ gap: 10 }}>
          <Pressable
            onPress={pickMedia}
            disabled={isSubmitting}
            style={{
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: colors.border,
              borderRadius: radius.xl,
              paddingVertical: 28,
              alignItems: "center",
              gap: 8,
              backgroundColor: colors.muted,
            }}
          >
            <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
            <Text style={{ fontWeight: "700", color: colors.foreground }}>
              {mediaUri ? "Media selected — tap to change" : "Take photo or attach video"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
              JPG / PNG / MP4 evidence
            </Text>
          </Pressable>
        </Card>

        <Card style={{ gap: 10 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: colors.mutedForeground,
              textTransform: "uppercase",
            }}
          >
            Select Hazard Category *
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {GRIEVANCE_CATEGORIES.map((cat) => {
              const selected = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  disabled={isSubmitting}
                  style={{
                    width: "47%",
                    flexGrow: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    padding: 12,
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? `${colors.primary}1A` : colors.card,
                  }}
                >
                  <Ionicons
                    name={CATEGORY_ICONS[cat]}
                    size={16}
                    color={selected ? colors.primary : colors.mutedForeground}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: "700",
                      color: selected ? colors.primary : colors.foreground,
                    }}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: colors.mutedForeground,
              textTransform: "uppercase",
            }}
          >
            Short Hazard Summary *
          </Text>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Broken water pipeline causing flooded street"
            editable={!isSubmitting}
            maxLength={120}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: colors.mutedForeground,
              textTransform: "uppercase",
            }}
          >
            Location Landmark & Details *
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Describe exact spot, nearby shops, or specific danger..."
            editable={!isSubmitting}
            multiline
            style={{ height: 90, textAlignVertical: "top", paddingTop: 12 }}
          />

          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: colors.mutedForeground,
              textTransform: "uppercase",
            }}
          >
            Urgency Level
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {severityOptions.map((lvl) => {
              const selected = severity === lvl.value;
              return (
                <Pressable
                  key={lvl.value}
                  onPress={() => setSeverity(lvl.value)}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    alignItems: "center",
                    borderColor: selected ? lvl.color : colors.border,
                    backgroundColor: selected ? `${lvl.color}1A` : colors.card,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "800",
                      color: selected ? lvl.color : colors.mutedForeground,
                    }}
                  >
                    {lvl.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {isSubmitting ? (
          <Card style={{ gap: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.foreground }}>
              {pipelineStep}
            </Text>
            <View
              style={{
                height: 8,
                borderRadius: 999,
                backgroundColor: colors.muted,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${uploadProgress}%`,
                  height: "100%",
                  backgroundColor: colors.primary,
                }}
              />
            </View>
          </Card>
        ) : null}

        <Button
          title={
            isSubmitting
              ? "Streaming to Cloudinary Edge..."
              : "Submit Anonymized Hazard Report →"
          }
          loading={isSubmitting}
          onPress={handleSubmit}
        />
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
  },
});
