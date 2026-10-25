"use client";

import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GrievanceCategory, GrievanceSeverity } from "@/constants";

export interface GrievancePoint {
  _id: string;
  title: string;
  description?: string;
  category: GrievanceCategory;
  severity: GrievanceSeverity;
  status?: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
    address?: string;
    ward?: string;
    city?: string;
  };
  media: {
    originalSecureUrl: string;
    redactedSecureUrl?: string;
    resourceType?: "image" | "video";
    isRedacted?: boolean;
  };
  upvotedBy?: string[];
  upvotesCount: number;
  createdAt?: string;
}

export interface ExploreMapProps<T extends GrievancePoint = GrievancePoint> {
  grievances: T[];
  activeGrievanceId?: string;
  onSelectGrievance: (g: T) => void;
}

// Leaflet custom marker generator with DashStack color tokens
function createMarkerIcon(severity: GrievanceSeverity, isSelected: boolean) {
  const colorMap = {
    HIGH: "#EF3826",
    MEDIUM: "#FF9F43",
    LOW: "#00B69B",
  };
  const color = colorMap[severity] || "#4880FF";
  const size = isSelected ? 34 : 26;

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: transform 0.2s ease;
      transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
    ">
      <div style="
        width: ${Math.round(size * 0.35)}px;
        height: ${Math.round(size * 0.35)}px;
        border-radius: 50%;
        background: white;
      "></div>
    </div>
  `;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function ExploreMap<T extends GrievancePoint = GrievancePoint>({
  grievances,
  activeGrievanceId,
  onSelectGrievance,
}: ExploreMapProps<T>) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);
  const markersLayerRef = React.useRef<L.LayerGroup | null>(null);

  const initialGrievancesRef = React.useRef(grievances);

  // Initialize Leaflet Map once
  React.useEffect(() => {
    if (!containerRef.current) return;

    // If an instance exists or container was already initialized, clean it up
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialList = initialGrievancesRef.current;
    const defaultCenter: [number, number] =
      initialList.length > 0 && initialList[0]?.location?.coordinates
        ? [initialList[0].location.coordinates[1], initialList[0].location.coordinates[0]]
        : [28.6139, 77.209];

    const map = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: 13,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      markersLayer.clearLayers();
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []); // Run once on mount

  // Sync Markers
  React.useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    grievances.forEach((g) => {
      if (!g.location || !g.location.coordinates) return;
      const [lng, lat] = g.location.coordinates;
      const isSelected = g._id === activeGrievanceId;

      const marker = L.marker([lat, lng], {
        icon: createMarkerIcon(g.severity, isSelected),
      });

      marker.bindPopup(`
        <div class="p-1 space-y-1 text-xs font-sans">
          <p class="font-bold text-gray-900">${g.title}</p>
          <p class="text-gray-500 text-[11px]">${g.location.ward || "Ward 32"}</p>
          <p class="text-blue-600 font-semibold text-[11px]">👍 ${g.upvotesCount} Endorsements</p>
        </div>
      `);

      marker.on("click", () => {
        onSelectGrievance(g);
      });

      markersLayer.addLayer(marker);
    });
  }, [grievances, activeGrievanceId, onSelectGrievance]);

  // Sync Pan to Active Grievance
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeGrievanceId) return;

    const activeGrievance = grievances.find((g) => g._id === activeGrievanceId);
    if (activeGrievance && activeGrievance.location?.coordinates) {
      const targetCenter: [number, number] = [
        activeGrievance.location.coordinates[1],
        activeGrievance.location.coordinates[0],
      ];
      try {
        map.panTo(targetCenter, { animate: true });
      } catch {
        // Fallback if panTo fails
        map.setView(targetCenter, map.getZoom());
      }
    }
  }, [activeGrievanceId, grievances]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[480px] z-10"
      style={{ height: "100%", width: "100%", minHeight: "480px" }}
    />
  );
}
