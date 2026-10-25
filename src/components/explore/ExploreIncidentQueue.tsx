"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import type { SerializedGrievance } from "./types";

interface ExploreIncidentQueueProps {
  grievances: SerializedGrievance[];
  activeGrievanceId?: string;
  onSelectGrievance: (g: SerializedGrievance) => void;
}

export function ExploreIncidentQueue({
  grievances,
  activeGrievanceId,
  onSelectGrievance,
}: ExploreIncidentQueueProps) {
  return (
    <div className="flex-1 rounded-2xl border border-border bg-card p-3 space-y-2 overflow-y-auto max-h-[300px]">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
        Active Nearby Queue ({grievances.length})
      </div>
      {grievances.map((item) => (
        <button
          key={item._id}
          type="button"
          onClick={() => onSelectGrievance(item)}
          className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border flex items-center justify-between gap-2 ${
            activeGrievanceId === item._id
              ? "border-[#4880FF] bg-[#4880FF]/10 text-foreground"
              : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="truncate pr-2">
            <p className="text-xs font-semibold truncate text-foreground">
              {item.title}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {item.location?.ward || "Ward 32"} • {item.upvotesCount} Endorsements
            </p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
        </button>
      ))}
      {grievances.length === 0 && (
        <p className="text-xs text-muted-foreground p-3 text-center">
          No matching hazards in this queue.
        </p>
      )}
    </div>
  );
}
