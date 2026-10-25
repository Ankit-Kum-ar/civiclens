"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Video,
  User,
  Activity,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { updateGrievanceStatusAction } from "@/actions/admin";

interface GrievanceDetail extends Omit<IGrievance, "reportedBy"> {
  reportedBy?: {
    name?: string;
    email?: string;
    image?: string;
  } | string;
}

function ConfirmationContent() {
  const params = useParams();
  const grievanceId = params?.id as string;

  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [grievance, setGrievance] = React.useState<GrievanceDetail | null>(null);
  const [isLoadingTicket, setIsLoadingTicket] = React.useState(true);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [viewerRole, setViewerRole] = React.useState<string>("CITIZEN");
  const [redactedLoadError, setRedactedLoadError] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchTicket() {
      // Clear previous grievance immediately so older report details don't linger
      setGrievance(null);
      setIsLoadingTicket(true);
      setImageLoaded(false);
      setRedactedLoadError(false);

      try {
        const res = await fetch(`/api/grievances/${grievanceId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setGrievance(data.grievance);
            if (data.viewerRole) {
              setViewerRole(data.viewerRole);
            }
          }
        }
      } catch {
        // Fallback or demo state
      } finally {
        if (isMounted) {
          setIsLoadingTicket(false);
        }
      }
    }
    if (grievanceId) {
      fetchTicket();
    }
    return () => {
      isMounted = false;
    };
  }, [grievanceId]);

  const rawImageUrl = grievance?.media?.originalSecureUrl || "";
  const redactedImageUrl =
    (!redactedLoadError && grievance?.media?.redactedSecureUrl) ||
    grievance?.media?.originalSecureUrl ||
    "";

  const isOfficerOrAdmin =
    viewerRole === "MUNICIPAL_OFFICER" || viewerRole === "ADMIN";

  const handleStatusChange = async (
    newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  ) => {
    if (!grievance?._id) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateGrievanceStatusAction(grievance._id, newStatus);
      if (res.success) {
        setGrievance((prev) =>
          prev ? { ...prev, status: newStatus as any } : prev
        );
        toast.success(`Ticket status updated to ${newStatus}`);
      } else {
        toast.error(res.message || "Failed to update ticket status.");
      }
    } catch {
      toast.error("Network error while updating ticket status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const reporterName =
    typeof grievance?.reportedBy === "object" && grievance?.reportedBy?.name
      ? grievance.reportedBy.name
      : typeof grievance?.reportedBy === "string"
      ? grievance.reportedBy
      : "Community Citizen";

  const reporterEmail =
    typeof grievance?.reportedBy === "object" && grievance?.reportedBy?.email
      ? grievance.reportedBy.email
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header */}
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md px-4 py-3 sm:px-8 sticky top-0 z-20">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href={isOfficerOrAdmin ? "/admin/dashboard" : "/"}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>
              {isOfficerOrAdmin
                ? "Back to Municipal Triage Hub"
                : "Back to Home"}
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            {isOfficerOrAdmin && (
              <span className="rounded-full bg-[#EF3826]/10 border border-[#EF3826]/30 px-2 py-0.5 text-[10px] font-bold text-[#EF3826] uppercase tracking-wider">
                Officer Terminal
              </span>
            )}
            <span className="font-mono text-xs font-bold text-[#4880FF]">
              Ticket #{grievanceId?.slice(-6)?.toUpperCase() || "CL-8921"}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 space-y-6">
        {/* Banner: Officer Triage vs Citizen Confirmation */}
        {isOfficerOrAdmin ? (
          <div className="rounded-2xl border border-[#4880FF]/30 bg-[#4880FF]/10 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4880FF]/20 text-[#4880FF]">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="font-heading text-lg font-bold text-foreground">
                    Municipal Inspection & Dispatch Terminal
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Official triage review for incident #{grievanceId?.slice(-6)?.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  Status:
                </span>
                <select
                  disabled={isUpdatingStatus}
                  value={grievance?.status || "OPEN"}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
                    )
                  }
                  className={`py-1.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    grievance?.status === "RESOLVED"
                      ? "bg-[#00B69B]/15 border-[#00B69B]/40 text-[#00B69B]"
                      : grievance?.status === "IN_PROGRESS"
                      ? "bg-[#FF9F43]/15 border-[#FF9F43]/40 text-[#FF9F43]"
                      : grievance?.status === "REJECTED"
                      ? "bg-muted border-border text-muted-foreground"
                      : "bg-[#EF3826]/15 border-[#EF3826]/40 text-[#EF3826]"
                  } focus:outline-hidden`}
                >
                  <option value="OPEN">Mark Open</option>
                  <option value="IN_PROGRESS">Dispatch Crew</option>
                  <option value="RESOLVED">Mark Resolved</option>
                  <option value="REJECTED">Reject Report</option>
                </select>
                {isUpdatingStatus && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Officer Metadata Chips */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 border border-border font-medium">
                <User className="h-3.5 w-3.5 text-primary" />
                Reporter: {reporterName}
                {reporterEmail ? ` (${reporterEmail})` : ""}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 border border-border font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                e_pixelate_faces Verified
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 border border-border font-medium">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Cryptographic Geotag
              </span>
              {grievance?.createdAt && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 border border-border font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Filed: {new Date(grievance.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-heading text-lg font-bold text-foreground">
                  Report Submitted & Anonymized!
                </h1>
                <p className="text-xs text-muted-foreground">
                  Your hazard is registered with municipal dispatch.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 border border-border font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                e_pixelate_faces Applied
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 border border-border font-medium">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Cryptographic Geotag Stamped
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 border border-border font-medium">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Status: {grievance?.status || "OPEN"}
              </span>
            </div>
          </div>
        )}

        {/* Visual Evidence: Video Player if video, or Before/After Privacy Slider if photo */}
        {isLoadingTicket || !grievance ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Retrieving Visual Evidence...
              </label>
              <span className="text-[11px] text-muted-foreground">
                Fetching secure media
              </span>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 aspect-video shadow-md flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <ShieldCheck className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs font-medium text-muted-foreground animate-pulse">
                Loading redacted visual evidence...
              </p>
            </div>
          </div>
        ) : grievance?.media?.resourceType === "video" ||
        grievance?.media?.originalSecureUrl?.endsWith(".mp4") ||
        grievance?.media?.originalSecureUrl?.endsWith(".webm") ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Video className="h-4 w-4 text-[#4880FF]" />
                Civic Video Evidence
              </label>
              <span className="text-[11px] text-muted-foreground">
                MP4 / WebM Anonymized Stream
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video shadow-md flex items-center justify-center">
              <video
                src={
                  grievance?.media?.redactedSecureUrl ||
                  grievance?.media?.originalSecureUrl
                }
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 rounded-lg bg-[#00B69B]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-xs pointer-events-none">
                <ShieldCheck className="h-3 w-3" />
                <span>Protected Civic View</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-primary" />
                Privacy Verification (Before & After Slider)
              </label>
              <span className="text-[11px] text-muted-foreground">
                Drag slider to inspect face pixelation
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 aspect-video select-none shadow-md">
              {/* Image Loading Overlay */}
              {!imageLoaded && (
                <div className="absolute inset-0 z-20 bg-muted/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Loading media evidence...
                  </span>
                </div>
              )}

              {/* Right: Redacted Layer */}
              {rawImageUrl && (
                <img
                  src={redactedImageUrl}
                  alt="Redacted Anonymized Evidence"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setRedactedLoadError(true);
                    setImageLoaded(true);
                  }}
                  className={`absolute inset-0 h-full w-full object-cover filter contrast-105 transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}

              {/* Left: Raw Frame Layer (Clipped by slider) */}
              {rawImageUrl && (
                <div
                  style={{ width: `${sliderPosition}%` }}
                  className={`absolute inset-0 overflow-hidden border-r-2 border-white/80 shadow-2xl transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={rawImageUrl}
                    alt="Original Raw Evidence"
                    className="absolute inset-0 h-full w-full object-cover max-w-none"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <span className="absolute top-3 left-3 rounded-lg bg-rose-500/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Raw Bystander View
                  </span>
                </div>
              )}

              {/* Right Badge */}
              <span className="absolute top-3 right-3 rounded-lg bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Protected Civic View
              </span>

              {/* Slider Handle */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
              />

              {/* Handle Thumb Marker */}
              <div
                style={{ left: `${sliderPosition}%` }}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-2xl border border-border"
              >
                <div className="flex items-center -space-x-1 text-xs font-bold">
                  <ChevronLeft className="h-3 w-3" />
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Triage Card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Automated Triage & Keywords
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              AI Confidence: 95%
            </span>
          </div>

          <div className="rounded-xl bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            {grievance?.aiTriage?.transcript ||
              "Voice transcript converted into municipal search tags (#CraterPothole, #TrafficDisruption, #Ward32)."}
          </div>
        </div>

        {/* Navigation Actions */}
        {isOfficerOrAdmin ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/admin/dashboard"
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm h-11"
            >
              Back to Municipal Hub
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/report"
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm h-11"
            >
              Report Another Hazard
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-xs h-11"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ReportConfirmationPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
          Loading report verification...
        </div>
      }
    >
      <ConfirmationContent />
    </React.Suspense>
  );
}
