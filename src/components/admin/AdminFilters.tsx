import * as React from "react";
import { Search, LayoutGrid, Table } from "lucide-react";
import { GRIEVANCE_CATEGORIES } from "@/constants";

interface AdminFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (s: string) => void;
  severityFilter: string;
  onSeverityChange: (s: string) => void;
  categoryFilter: string;
  onCategoryChange: (c: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (m: "grid" | "table") => void;
}

export function AdminFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
  categoryFilter,
  onCategoryChange,
  viewMode,
  onViewModeChange,
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter by ticket title, ward, reporter..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-1 focus:ring-[#4880FF]"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-semibold cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Pending (OPEN)</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-semibold cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          <option value="HIGH">High Urgency</option>
          <option value="MEDIUM">Medium Urgency</option>
          <option value="LOW">Low Urgency</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-semibold cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          {GRIEVANCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* View Mode Toggle: Grid (Default) vs Table */}
        <div className="flex items-center rounded-xl border border-border bg-background p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#4880FF] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Card Grid with Large Media Preview"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-[#4880FF] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Compact Table View"
          >
            <Table className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>
    </div>
  );
}
