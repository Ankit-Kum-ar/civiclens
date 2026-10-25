"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, ThumbsUp } from "lucide-react";
import { HoverVideoPreview } from "@/components/ui/hover-video-preview";
import type { SerializedGrievance } from "./types";

interface ExploreIncidentPreviewProps {
  grievance: SerializedGrievance | null;
  onUpvote: (id: string) => void;
}

export function ExploreIncidentPreview({
  grievance,
  onUpvote,
}: ExploreIncidentPreviewProps) {
  if (!grievance) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
        Select a marker on the map to preview hazard details.
      </div>
    );
  }

  const imageUrl =
    grievance.media?.redactedSecureUrl || grievance.media?.originalSecureUrl;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Incident #{grievance._id.slice(-6).toUpperCase()}
        </span>
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            grievance.severity === "HIGH"
              ? "bg-[#EF3826]/10 text-[#EF3826] border border-[#EF3826]/20"
              : grievance.severity === "MEDIUM"
                ? "bg-[#FF9F43]/10 text-[#FF9F43] border border-[#FF9F43]/20"
                : "bg-[#00B69B]/10 text-[#00B69B] border border-[#00B69B]/20"
          }`}
        >
          {grievance.severity} PRIORITY
        </span>
      </div>

      {/* Media with Privacy Tag (Video or Redacted Image) */}
      {grievance.media?.resourceType === "video" ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border">
          <HoverVideoPreview
            src={grievance.media.originalSecureUrl}
            className="w-full h-full object-cover group/vid cursor-pointer"
          />
        </div>
      ) : imageUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border">
          <img
            src={imageUrl}
            alt={grievance.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-[#00B69B]" />
            <span>Privacy Redacted</span>
          </div>
        </div>
      ) : null}

      {/* Title & Description */}
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
          {grievance.title}
        </h2>
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {grievance.description}
        </p>
      </div>

      {/* Ward & GPS Badge */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
        <MapPin className="h-3.5 w-3.5 text-[#4880FF] shrink-0" />
        <span className="font-medium text-foreground">
          {grievance.location?.ward || "Ward 32"}
        </span>
        <span>•</span>
        <span className="truncate">{grievance.location?.address || "Location logged"}</span>
      </div>

      {/* Upvote & View Full Details CTAs */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/80">
        <button
          type="button"
          onClick={() => onUpvote(grievance._id)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-xs font-bold hover:bg-muted hover:text-foreground transition-all cursor-pointer"
        >
          <ThumbsUp className="h-3.5 w-3.5 text-[#4880FF]" />
          <span>Endorse ({grievance.upvotesCount})</span>
        </button>
        <Link
          href={`/report/${grievance._id}`}
          className="inline-flex items-center justify-center rounded-xl bg-[#4880FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4880FF]/90 transition-colors shadow-xs"
        >
          Inspect
        </Link>
      </div>
    </div>
  );
}
