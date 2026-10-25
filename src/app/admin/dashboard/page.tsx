"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getAdminDashboardDataAction,
  updateGrievanceStatusAction,
  type AdminDashboardData,
} from "@/actions/admin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMetricCards } from "@/components/admin/AdminMetricCards";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { AdminTriageTable } from "@/components/admin/AdminTriageTable";
import { AdminTriageGrid } from "@/components/admin/AdminTriageGrid";

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [severityFilter, setSeverityFilter] = React.useState("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  const loadDashboard = React.useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await getAdminDashboardDataAction({
        status: statusFilter,
        severity: severityFilter,
        category: categoryFilter,
      });

      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.message || "Failed to load admin data.");
      }
    } catch {
      toast.error("Network error while connecting to municipal console.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [statusFilter, severityFilter, categoryFilter]);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      setIsLoading(true);
      try {
        const res = await getAdminDashboardDataAction({
          status: statusFilter,
          severity: severityFilter,
          category: categoryFilter,
        });
        if (isMounted && res.success && res.data) {
          setData(res.data);
        }
      } catch {
        if (isMounted) toast.error("Failed to load admin data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void init();

    return () => {
      isMounted = false;
    };
  }, [statusFilter, severityFilter, categoryFilter]);

  const handleStatusChange = async (
    grievanceId: string,
    newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  ) => {
    setUpdatingId(grievanceId);
    try {
      const res = await updateGrievanceStatusAction(grievanceId, newStatus);
      if (res.success) {
        toast.success(res.message || `Status updated to ${newStatus}`);
        await loadDashboard(true);
      } else {
        toast.error(res.message || "Failed to update status.");
      }
    } catch {
      toast.error("Failed to commit status change.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredGrievances = (data?.grievances || []).filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      (g.location.ward && g.location.ward.toLowerCase().includes(q)) ||
      (g.location.address && g.location.address.toLowerCase().includes(q)) ||
      (g.reportedBy?.name && g.reportedBy.name.toLowerCase().includes(q))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-[#EF3826]" />
          <span>Connecting to Municipal Triage Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-12">
      <AdminHeader
        adminName="Municipal Officer"
        adminRole="MUNICIPAL_OFFICER"
        onRefresh={() => loadDashboard(true)}
        isRefreshing={isRefreshing}
      />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-8 space-y-5">
        {/* KPI Metrics */}
        <AdminMetricCards
          counts={
            data?.counts || {
              total: 0,
              open: 0,
              inProgress: 0,
              resolved: 0,
              rejected: 0,
              highUrgency: 0,
            }
          }
        />

        {/* Filters & View Mode Toggle */}
        <AdminFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          severityFilter={severityFilter}
          onSeverityChange={setSeverityFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Triage Grid or Table View */}
        {viewMode === "grid" ? (
          <AdminTriageGrid
            grievances={filteredGrievances}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        ) : (
          <AdminTriageTable
            grievances={filteredGrievances}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        )}
      </main>
    </div>
  );
}
