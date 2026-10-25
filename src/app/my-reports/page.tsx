"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  FileText,
  ThumbsUp,
  Clock,
  MapPin,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getUserGrievancesAction } from "@/actions/grievance";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface UserGrievance {
  _id: string;
  title: string;
  description: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  location: {
    address?: string;
    ward?: string;
    city?: string;
  };
  media: {
    originalSecureUrl: string;
    redactedSecureUrl?: string;
  };
  upvotesCount: number;
  createdAt: string;
}

export default function MyReportsPage() {
  const [tab, setTab] = React.useState<"submitted" | "endorsed">("submitted");
  const [submittedReports, setSubmittedReports] = React.useState<UserGrievance[]>([]);
  const [endorsedReports, setEndorsedReports] = React.useState<UserGrievance[]>([]);
  const [reputationPoints, setReputationPoints] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadReports() {
      try {
        const res = await getUserGrievancesAction();
        if (res.success) {
          setSubmittedReports((res.submitted || []) as unknown as UserGrievance[]);
          setEndorsedReports((res.endorsed || []) as unknown as UserGrievance[]);
          setReputationPoints(res.reputationPoints || 0);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, []);

  const currentList = tab === "submitted" ? submittedReports : endorsedReports;

  // Compute metrics
  const activeCount = submittedReports.filter(
    (r) => r.status === "OPEN" || r.status === "IN_PROGRESS"
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4880FF] text-white shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span>CivicLens</span>
            </Link>
            <span className="text-muted-foreground text-xs hidden sm:inline-block">/</span>
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline-block">
              Citizen Hub
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/explore"
              className="rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
            >
              Public Grid
            </Link>
            <Link
              href="/report"
              className="rounded-xl bg-[#4880FF] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#4880FF]/90 transition-colors shadow-xs"
            >
              Report Hazard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 space-y-6 flex-1">
        {/* Metric Cards Banner (DashStack Aesthetics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Card 1: Reputation Points */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Civic Reputation</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4880FF]/10 text-[#4880FF]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {reputationPoints}
            </p>
            <p className="text-[11px] text-[#00B69B] font-semibold flex items-center gap-0.5">
              <span>+10 per report verified</span>
            </p>
          </div>

          {/* Card 2: Filed Reports */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">My Reports</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00B69B]/10 text-[#00B69B]">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {submittedReports.length}
            </p>
            <p className="text-[11px] text-muted-foreground">Incidents filed</p>
          </div>

          {/* Card 3: Active Triage */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">In Progress</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF9F43]/10 text-[#FF9F43]">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">{activeCount}</p>
            <p className="text-[11px] text-muted-foreground">Under municipal review</p>
          </div>

          {/* Card 4: Endorsed */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Endorsed</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00B69B]/10 text-[#00B69B]">
                <ThumbsUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {endorsedReports.length}
            </p>
            <p className="text-[11px] text-muted-foreground">Community issues supported</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("submitted")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === "submitted"
                  ? "bg-[#4880FF] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              My Reports ({submittedReports.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("endorsed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === "endorsed"
                  ? "bg-[#4880FF] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Endorsed by Me ({endorsedReports.length})
            </button>
          </div>

          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            {currentList.length} total entries
          </span>
        </div>

        {/* List of Grievance Cards */}
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-xs text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#4880FF]" />
            <span>Loading citizen reports...</span>
          </div>
        ) : currentList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No reports found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {tab === "submitted"
                ? "You haven't filed any street hazard reports yet. Spot an issue? Help your neighborhood by logging it."
                : "You haven't endorsed any neighborhood reports yet. Explore the civic grid to support priority fixes."}
            </p>
            <div className="pt-2">
              <Link
                href="/report"
                className="inline-flex items-center justify-center rounded-xl bg-[#4880FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4880FF]/90 transition-colors shadow-xs"
              >
                File First Hazard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentList.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-[#4880FF]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Media Thumbnail & Meta */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="relative h-18 w-24 rounded-xl overflow-hidden bg-black shrink-0 border border-border">
                    <img
                      src={item.media.redactedSecureUrl || item.media.originalSecureUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4880FF]">
                        {item.category}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground truncate max-w-md">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-[#4880FF] shrink-0" />
                      <span className="truncate">{item.location.address || item.location.ward || "New Delhi"}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges & CTAs */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-border/80">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      item.status === "RESOLVED"
                        ? "bg-[#00B69B]/10 text-[#00B69B] border border-[#00B69B]/20"
                        : item.status === "IN_PROGRESS"
                          ? "bg-[#4880FF]/10 text-[#4880FF] border border-[#4880FF]/20"
                          : "bg-[#FF9F43]/10 text-[#FF9F43] border border-[#FF9F43]/20"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <ThumbsUp className="h-3.5 w-3.5 text-[#4880FF]" />
                    <span>{item.upvotesCount}</span>
                  </div>

                  <Link
                    href={`/report/${item._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#4880FF] hover:underline"
                  >
                    <span>View Timeline</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
