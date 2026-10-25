"use client";

import * as React from "react";
import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import { HoverVideoPreview } from "@/components/ui/hover-video-preview";
import type { SerializedGrievance } from "./types";

interface ExploreIncidentGridProps {
  grievances: SerializedGrievance[];
  onUpvote: (id: string) => void;
}

export function ExploreIncidentGrid({
  grievances,
  onUpvote,
}: ExploreIncidentGridProps) {
  if (grievances.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground col-span-full">
        No grievances match your filter criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {grievances.map((item) => {
        const imageUrl =
          item.media?.redactedSecureUrl || item.media?.originalSecureUrl;

        return (
          <div
            key={item._id}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-[#4880FF]/50 transition-all flex flex-col"
          >
            {item.media?.resourceType === "video" ? (
              <div className="relative aspect-video bg-black">
                <HoverVideoPreview
                  src={item.media.originalSecureUrl}
                  className="w-full h-full object-cover group/vid cursor-pointer"
                />
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md pointer-events-none ${
                    item.severity === "HIGH"
                      ? "bg-[#EF3826]/90 text-white"
                      : item.severity === "MEDIUM"
                        ? "bg-[#FF9F43]/90 text-white"
                        : "bg-[#00B69B]/90 text-white"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
            ) : imageUrl ? (
              <div className="relative aspect-video bg-black">
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                    item.severity === "HIGH"
                      ? "bg-[#EF3826]/90 text-white"
                      : item.severity === "MEDIUM"
                        ? "bg-[#FF9F43]/90 text-white"
                        : "bg-[#00B69B]/90 text-white"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
            ) : null}

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4880FF]">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border/80">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate">{item.location?.ward || "Ward 32"}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpvote(item._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-1.5 text-xs font-bold hover:bg-muted cursor-pointer transition-colors"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-[#4880FF]" />
                    <span>{item.upvotesCount}</span>
                  </button>
                  <Link
                    href={`/report/${item._id}`}
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#4880FF] py-1.5 text-xs font-semibold text-white hover:bg-[#4880FF]/90 transition-colors shadow-xs"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
