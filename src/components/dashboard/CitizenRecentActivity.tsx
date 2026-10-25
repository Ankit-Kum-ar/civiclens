import * as React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, ThumbsUp, ArrowRight } from "lucide-react";
import { HoverVideoPreview } from "@/components/ui/hover-video-preview";

interface RecentGrievanceItem {
  _id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
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

interface CitizenRecentActivityProps {
  grievances: RecentGrievanceItem[];
}

export function CitizenRecentActivity({
  grievances,
}: CitizenRecentActivityProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Recent Hazard Feed</h2>
          <p className="text-xs text-muted-foreground">
            Latest privacy-redacted incidents logged by community citizens
          </p>
        </div>
        <Link
          href="/explore"
          className="text-xs font-semibold text-[#4880FF] hover:underline inline-flex items-center gap-1"
        >
          <span>View All on Grid</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {grievances.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
          No civic incidents recorded yet. Be the first to report!
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {grievances.map((item) => {
            const imageUrl =
              item.media.redactedSecureUrl || item.media.originalSecureUrl;

            return (
              <div
                key={item._id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.media.resourceType === "video" ? (
                    <HoverVideoPreview
                      src={item.media.originalSecureUrl}
                      className="relative h-12 w-16 rounded-lg overflow-hidden bg-black shrink-0 border border-border group/vid cursor-pointer shadow-xs"
                    />
                  ) : imageUrl ? (
                    <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
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
                    <div className="h-12 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#4880FF] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          item.status === "RESOLVED"
                            ? "bg-[#00B69B]/10 text-[#00B69B]"
                            : item.status === "IN_PROGRESS"
                              ? "bg-[#FF9F43]/10 text-[#FF9F43]"
                              : "bg-[#EF3826]/10 text-[#EF3826]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <Link
                      href={`/report/${item._id}`}
                      className="text-xs font-bold text-foreground hover:text-[#4880FF] transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{item.location.ward || "Ward 32"}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-background px-2.5 py-1 rounded-lg border border-border">
                    <ThumbsUp className="h-3 w-3 text-[#4880FF]" />
                    <span>{item.upvotesCount}</span>
                  </div>
                  <Link
                    href={`/report/${item._id}`}
                    className="rounded-lg bg-[#4880FF] px-3 py-1 text-xs font-semibold text-white hover:bg-[#4880FF]/90 transition-colors shadow-xs"
                  >
                    Inspect
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
