"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getGrievancesFeedAction,
  toggleUpvoteGrievanceAction,
} from "@/actions/grievance";
import type { SerializedGrievance } from "@/components/explore/types";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { ExploreControls } from "@/components/explore/ExploreControls";
import { ExploreIncidentPreview } from "@/components/explore/ExploreIncidentPreview";
import { ExploreIncidentQueue } from "@/components/explore/ExploreIncidentQueue";
import { ExploreIncidentGrid } from "@/components/explore/ExploreIncidentGrid";

// Dynamically import Leaflet map component with loading state
const ExploreMap = dynamic(
  () => import("@/components/explore/ExploreMap").then((mod) => mod.ExploreMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] flex items-center justify-center bg-card rounded-2xl border border-border">
        <div className="flex flex-col items-center gap-2 text-muted-foreground text-xs font-medium">
          <Loader2 className="h-6 w-6 animate-spin text-[#4880FF]" />
          <span>Rendering Civic Geospatial Grid...</span>
        </div>
      </div>
    ),
  }
);

export default function ExplorePage() {
  const [viewMode, setViewMode] = React.useState<"map" | "list">("map");
  const [grievances, setGrievances] = React.useState<SerializedGrievance[]>([]);
  const [, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("ALL");
  const [sortBy, setSortBy] = React.useState<"upvotes" | "latest">("upvotes");

  const [activeGrievance, setActiveGrievance] = React.useState<SerializedGrievance | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await getGrievancesFeedAction({
          category: selectedCategory,
          severity: selectedSeverity,
          sortBy,
        });
        if (isMounted && res.success && res.grievances) {
          const list = res.grievances as unknown as SerializedGrievance[];
          setGrievances(list);
          if (list.length > 0) {
            setActiveGrievance((prev) => prev ?? list[0]);
          }
        }
      } catch {
        if (isMounted) toast.error("Failed to load civic feed.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSeverity, sortBy]);

  const handleUpvote = async (grievanceId: string) => {
    try {
      const res = await toggleUpvoteGrievanceAction(grievanceId);
      if (!res.success) {
        toast.error(res.message || "Failed to upvote.");
        return;
      }

      setGrievances((prev) =>
        prev.map((g) => {
          if (g._id === grievanceId) {
            return {
              ...g,
              upvotesCount: res.upvotesCount ?? g.upvotesCount,
            };
          }
          return g;
        })
      );

      toast.success(res.upvoted ? "Endorsed! Community priority boosted." : "Endorsement removed.");
    } catch {
      toast.error("Failed to process upvote.");
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      (g.location?.ward && g.location.ward.toLowerCase().includes(q)) ||
      (g.location?.address && g.location.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-12 flex flex-col">
      <ExploreHeader />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-5 sm:px-8 flex flex-col gap-4">
        <ExploreControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedSeverity={selectedSeverity}
          onSeverityChange={setSelectedSeverity}
          sortBy={sortBy}
          onToggleSort={() => setSortBy((prev) => (prev === "upvotes" ? "latest" : "upvotes"))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "map" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[560px]">
            {/* Left / Center: Interactive Map */}
            <div className="lg:col-span-8 h-[480px] lg:h-full rounded-2xl overflow-hidden border border-border bg-card shadow-xs relative">
              <ExploreMap
                grievances={filteredGrievances}
                activeGrievanceId={activeGrievance?._id}
                onSelectGrievance={(g) => {
                  const match = filteredGrievances.find((item) => item._id === g._id);
                  if (match) setActiveGrievance(match);
                }}
              />
            </div>

            {/* Right: Selected Hazard & Nearby Queue */}
            <div className="lg:col-span-4 flex flex-col gap-3 h-full">
              <ExploreIncidentPreview
                grievance={activeGrievance}
                onUpvote={handleUpvote}
              />
              <ExploreIncidentQueue
                grievances={filteredGrievances}
                activeGrievanceId={activeGrievance?._id}
                onSelectGrievance={setActiveGrievance}
              />
            </div>
          </div>
        ) : (
          <ExploreIncidentGrid
            grievances={filteredGrievances}
            onUpvote={handleUpvote}
          />
        )}
      </main>
    </div>
  );
}
