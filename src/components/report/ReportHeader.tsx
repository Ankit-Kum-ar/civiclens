"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export interface GpsLocationState {
  coordinates: [number, number] | null;
  address: string;
  ward: string;
  city: string;
  isLoading: boolean;
  error: string | null;
}

interface ReportHeaderProps {
  location: GpsLocationState | null;
  onRefreshLocation: () => void;
}

export function ReportHeader({
  location,
  onRefreshLocation,
}: ReportHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4880FF] font-black text-white shadow-sm">
            CL
          </span>
          <div className="hidden sm:block">
            <span className="font-bold text-base text-foreground tracking-tight">
              CivicLens
            </span>
            <p className="text-[10px] text-muted-foreground font-medium -mt-1">
              Citizen Hazard Terminal
            </p>
          </div>
        </Link>

        {/* GPS location pill and theme toggle */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-1.5 shadow-xs transition-all">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${
                  location?.isLoading
                    ? "bg-amber-400 animate-ping opacity-75"
                    : location?.error
                      ? "bg-amber-500"
                      : "bg-[#00B69B] animate-ping opacity-75"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  location?.isLoading
                    ? "bg-amber-500"
                    : location?.error
                      ? "bg-amber-500"
                      : "bg-[#00B69B]"
                }`}
              />
            </span>

            <MapPin className="h-3.5 w-3.5 text-[#4880FF] shrink-0" />

            <span className="text-xs font-semibold text-foreground truncate max-w-[150px] sm:max-w-[260px]">
              {location?.isLoading
                ? "Detecting GPS..."
                : `${location?.address} (${location?.ward})`}
            </span>

            <button
              type="button"
              onClick={onRefreshLocation}
              disabled={location?.isLoading}
              title="Refresh Location"
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 hover:bg-muted cursor-pointer"
            >
              <RefreshCw
                className={`h-3 w-3 ${location?.isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
