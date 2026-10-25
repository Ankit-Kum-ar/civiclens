"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, ThumbsUp, MapPin, ExternalLink, Loader2 } from "lucide-react";
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

interface AdminTriageTableProps {
  grievances: TriageGrievance[];
  onStatusChange: (
    id: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  ) => Promise<void>;
  updatingId: string | null;
}

export function AdminTriageTable({
  grievances,
  onStatusChange,
  updatingId,
}: AdminTriageTableProps) {
  if (grievances.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground bg-card">
        No hazard incidents found matching the selected triage filters.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Hazard Incident</th>
              <th className="py-3 px-4">Ward / Location</th>
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Endorsements</th>
              <th className="py-3 px-4">Reported By</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-right">Triage Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {grievances.map((item) => {
              const imageUrl =
                item.media.redactedSecureUrl || item.media.originalSecureUrl;
              const isUpdating = updatingId === item._id;

              return (
                <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                  {/* Incident info & Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {item.media.resourceType === "video" ? (
                        <HoverVideoPreview
                          src={item.media.originalSecureUrl}
                          className="relative h-11 w-14 rounded-lg overflow-hidden bg-black shrink-0 border border-border group/vid cursor-pointer"
                        />
                      ) : imageUrl ? (
                        <div className="relative h-11 w-14 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-0.5 left-0.5 rounded bg-black/70 p-0.5">
                            <ShieldCheck className="h-2.5 w-2.5 text-[#00B69B]" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-11 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="max-w-[220px]">
                        <span className="text-[10px] font-bold text-[#4880FF] uppercase tracking-wider block">
                          {item.category}
                        </span>
                        <Link
                          href={`/report/${item._id}`}
                          className="font-bold text-foreground hover:text-[#4880FF] transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground">
                          ID: #{item._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Ward / Location */}
                  <td className="py-3 px-4 text-muted-foreground">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.location.ward || "Ward 32"}</span>
                    </div>
                    <span className="text-[10px] truncate max-w-[140px] block">
                      {item.location.address || "GPS Logged"}
                    </span>
                  </td>

                  {/* Urgency */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.severity === "HIGH"
                          ? "bg-[#EF3826]/10 text-[#EF3826] border border-[#EF3826]/20"
                          : item.severity === "MEDIUM"
                            ? "bg-[#FF9F43]/10 text-[#FF9F43] border border-[#FF9F43]/20"
                            : "bg-[#00B69B]/10 text-[#00B69B] border border-[#00B69B]/20"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>

                  {/* Endorsements */}
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                      <ThumbsUp className="h-3 w-3 text-[#4880FF]" />
                      <span>{item.upvotesCount}</span>
                    </div>
                  </td>

                  {/* Reported By */}
                  <td className="py-3 px-4 text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      {item.reportedBy?.name || "Anonymous Citizen"}
                    </p>
                    <p className="text-[10px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "RESOLVED"
                          ? "bg-[#00B69B]/10 text-[#00B69B] border border-[#00B69B]/20"
                          : item.status === "IN_PROGRESS"
                            ? "bg-[#FF9F43]/10 text-[#FF9F43] border border-[#FF9F43]/20"
                            : item.status === "REJECTED"
                              ? "bg-muted text-muted-foreground border border-border"
                              : "bg-[#EF3826]/10 text-[#EF3826] border border-[#EF3826]/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Action Triage Selection */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#4880FF]" />
                      ) : (
                        <select
                          value={item.status}
                          onChange={(e) =>
                            onStatusChange(
                              item._id,
                              e.target.value as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-semibold cursor-pointer hover:border-[#4880FF] focus:outline-hidden"
                        >
                          <option value="OPEN">Mark Open</option>
                          <option value="IN_PROGRESS">Dispatch Crew</option>
                          <option value="RESOLVED">Mark Resolved</option>
                          <option value="REJECTED">Reject Report</option>
                        </select>
                      )}

                      <Link
                        href={`/report/${item._id}`}
                        className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-[#4880FF] transition-colors"
                        title="Open Full Report Details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
