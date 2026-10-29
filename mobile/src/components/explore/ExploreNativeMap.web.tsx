import React from "react";
import { Text, View } from "react-native";
import { siteConfig } from "@/config/site";

type Grievance = {
  _id: string;
  severity: string;
  location: { coordinates?: [number, number] };
};

/** Web stub — react-native-maps is not supported in browsers */
export function ExploreNativeMap({
  grievances,
}: {
  grievances: Grievance[];
  onSelect: (g: Grievance) => void;
  severityColor: (s: string) => string;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Text style={{ fontWeight: "700", textAlign: "center" }}>
        Map view runs on iOS/Android (Expo Go)
      </Text>
      <Text style={{ marginTop: 8, fontSize: 12, textAlign: "center", opacity: 0.7 }}>
        {grievances.length} incidents near {siteConfig.defaultCoordinates.city}
      </Text>
    </View>
  );
}
