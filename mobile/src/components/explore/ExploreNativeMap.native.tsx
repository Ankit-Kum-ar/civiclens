import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { siteConfig } from "@/config/site";

type Grievance = {
  _id: string;
  severity: string;
  location: { coordinates?: [number, number] };
};

export function ExploreNativeMap({
  grievances,
  onSelect,
  severityColor,
}: {
  grievances: Grievance[];
  onSelect: (g: Grievance) => void;
  severityColor: (s: string) => string;
}) {
  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        latitude: siteConfig.defaultCoordinates.lat,
        longitude: siteConfig.defaultCoordinates.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }}
    >
      {grievances.map((g) => {
        const coords = g.location?.coordinates;
        if (!coords || coords.length < 2) return null;
        const [lng, lat] = coords;
        return (
          <Marker
            key={g._id}
            coordinate={{ latitude: lat, longitude: lng }}
            pinColor={severityColor(g.severity)}
            onPress={() => onSelect(g)}
          />
        );
      })}
    </MapView>
  );
}
