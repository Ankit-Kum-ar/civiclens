"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ThumbsUp,
  MapPin,
  ExternalLink,
  Loader2,
  Calendar,
  User,
} from "lucide-react";
import { HoverVideoPreview } from "@/components/ui/hover-video-preview";

interface TriageGrievance {
  _id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  reportedBy?: {
    name: string;
    email: string;
  } | null;
  location: {
    address?: string;
    ward?: string;
  };
  media: {
    originalSecureUrl: string;
    redactedSecureUrl?: string;
    resourceType?: "image" | "video";
  };
  upvotesCount: number;
  createdAt: string;
}

interface AdminTriageGridProps {
  grievances: TriageGrievance[];
  onStatusChange: (
    id: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  ) => Promise<void>;
  updatingId: string | null;
}

export function AdminTriageGrid({
  grievances,
  onStatusChange,
  updatingId,
}: AdminTriageGridProps) {
  if (grievances.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground bg-card">
        No hazard incidents found matching the selected triage filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {grievances.map((item) => {
        const imageUrl =
          item.media.redactedSecureUrl || item.media.originalSecureUrl;
        const isUpdating = updatingId === item._id;

        return (
          <div
            key={item._id}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-[#4880FF]/60 hover:shadow-md transition-all flex flex-col group/card"
          >
            {/* Prominent High-Def Media Area (16:9 Aspect Ratio) */}
            <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-border">
              {item.media.resourceType === "video" ? (
                <HoverVideoPreview
                  src={item.media.originalSecureUrl}
                  className="w-full h-full object-cover group/vid cursor-pointer"
                />
              ) : imageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-lg bg-black/70 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                    <ShieldCheck className="h-3 w-3 text-[#00B69B]" />
                    <span>Redacted</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              {/* Urgency Badge */}
              <span
                className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-xs pointer-events-none ${
                  item.severity === "HIGH"
                    ? "bg-[#EF3826] text-white"
                    : item.severity === "MEDIUM"
                      ? "bg-[#FF9F43] text-white"
                      : "bg-[#00B69B] text-white"
                }`}
              >
                {item.severity} URGENCY
              </span>

              {/* Endorsement chip */}
              <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/75 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-white flex items-center gap-1 border border-white/10 pointer-events-none">
                <ThumbsUp className="h-3 w-3 text-[#4880FF]" />
                <span>{item.upvotesCount} Endorsements</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4880FF]">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    #{item._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <Link
                  href={`/report/${item._id}`}
                  className="text-sm font-bold text-foreground hover:text-[#4880FF] transition-colors line-clamp-2 leading-snug"
                >
                  {item.title}
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-[#4880FF] shrink-0" />
                  <span className="font-semibold text-foreground">
                    {item.location.ward || "Ward 32"}
                  </span>
                  <span>•</span>
                  <span className="truncate">{item.location.address || "New Delhi"}</span>
                </div>
              </div>

              {/* Reporter Info & Date */}
              <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1 truncate max-w-[150px]">
                  <User className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.reportedBy?.name || "Citizen"}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Triage Action Toolbar */}
              <div className="pt-2.5 border-t border-border/70 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <select
                    disabled={isUpdating}
                    value={item.status}
                    onChange={(e) =>
                      onStatusChange(
                        item._id,
                        e.target.value as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
                      )
                    }
                    className={`w-full py-1.5 px-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      item.status === "RESOLVED"
                        ? "bg-[#00B69B]/10 border-[#00B69B]/30 text-[#00B69B]"
                        : item.status === "IN_PROGRESS"
                          ? "bg-[#FF9F43]/10 border-[#FF9F43]/30 text-[#FF9F43]"
                          : item.status === "REJECTED"
                            ? "bg-muted border-border text-muted-foreground"
                            : "bg-[#EF3826]/10 border-[#EF3826]/30 text-[#EF3826]"
                    } focus:outline-hidden`}
                  >
                    <option value="OPEN">Mark Open</option>
                    <option value="IN_PROGRESS">Dispatch Crew</option>
                    <option value="RESOLVED">Mark Resolved</option>
                    <option value="REJECTED">Reject Report</option>
                  </select>
                </div>

                <Link
                  href={`/report/${item._id}`}
                  className="rounded-xl bg-[#4880FF] hover:bg-[#4880FF]/90 text-white p-2 transition-colors flex items-center justify-center shrink-0 shadow-xs"
                  title="Inspect Hazard Details"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
