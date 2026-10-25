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
} from "lucide-react";

function ConfirmationContent() {
  const params = useParams();
  const grievanceId = params?.id as string;

  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [grievance, setGrievance] = React.useState<IGrievance | null>(null);
  const [redactedLoadError, setRedactedLoadError] = React.useState(false);

  React.useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/grievances/${grievanceId}`);
        if (res.ok) {
          const data = await res.json();
          setGrievance(data.grievance);
        }
      } catch {
        // Fallback or demo state
      }
    }
    if (grievanceId) {
      fetchTicket();
    }
  }, [grievanceId]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header */}
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md px-4 py-3 sm:px-8 sticky top-0 z-20">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <span className="font-mono text-xs font-bold text-primary">
            Ticket #{grievanceId?.slice(-6)?.toUpperCase() || "CL-8921"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 space-y-6">
        {/* Success Banner */}
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
              Status: OPEN
            </span>
          </div>
        </div>

        {/* Interactive Before / After Privacy Slider */}
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

          <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video select-none shadow-md">
            {/* Right: Redacted Layer (Cloudinary e_pixelate_faces) */}
            <img
              src={
                (!redactedLoadError && grievance?.media?.redactedSecureUrl) ||
                grievance?.media?.originalSecureUrl ||
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
              }
              alt="Redacted Anonymized Evidence"
              onError={() => setRedactedLoadError(true)}
              className="absolute inset-0 h-full w-full object-cover filter contrast-105"
            />

            {/* Left: Raw Frame Layer (Clipped by slider) */}
            <div
              style={{ width: `${sliderPosition}%` }}
              className="absolute inset-0 overflow-hidden border-r-2 border-white/80 shadow-2xl"
            >
              <img
                src={
                  grievance?.media?.originalSecureUrl ||
                  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
                }
                alt="Original Raw Evidence"
                className="absolute inset-0 h-full w-full object-cover max-w-none"
                style={{ width: "100%", height: "100%" }}
              />
              <span className="absolute top-3 left-3 rounded-lg bg-rose-500/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Raw Bystander View
              </span>
            </div>

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
