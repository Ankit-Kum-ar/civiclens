"use client";

import * as React from "react";
import { Search, Flame, Clock, Map as MapIcon, List } from "lucide-react";
import { GRIEVANCE_CATEGORIES } from "@/constants";

interface ExploreControlsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedSeverity: string;
  onSeverityChange: (val: string) => void;
  sortBy: "upvotes" | "latest";
  onToggleSort: () => void;
  viewMode: "map" | "list";
  onViewModeChange: (mode: "map" | "list") => void;
}

export function ExploreControls({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSeverity,
  onSeverityChange,
  sortBy,
  onToggleSort,
  viewMode,
  onViewModeChange,
}: ExploreControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
      {/* Search Input styled with DashStack search bar aesthetics */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by street, ward, or hazard keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-1 focus:ring-[#4880FF] transition-all"
        />
      </div>

      {/* Filter and View Mode Group */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#4880FF]"
        >
          <option value="ALL">All Categories</option>
          {GRIEVANCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Severity Filter */}
        <select
          value={selectedSeverity}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#4880FF]"
        >
          <option value="ALL">All Severities</option>
          <option value="HIGH">High Urgency</option>
          <option value="MEDIUM">Medium Urgency</option>
          <option value="LOW">Low Urgency</option>
        </select>

        {/* Sort Filter */}
        <button
          type="button"
          onClick={onToggleSort}
          className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-semibold flex items-center gap-1.5 hover:bg-muted cursor-pointer shrink-0 transition-colors"
        >
          {sortBy === "upvotes" ? (
            <>
              <Flame className="h-3.5 w-3.5 text-[#FF9F43]" />
              <span>Top Endorsed</span>
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5 text-[#4880FF]" />
              <span>Latest</span>
            </>
          )}
        </button>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-xl border border-border bg-muted/60 p-1 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("map")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "map"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Map</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>
    </div>
  );
}
