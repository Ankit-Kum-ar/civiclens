
import { Suspense } from "react";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { getCitizenDashboardStatsAction } from "@/actions/dashboard";
import { CitizenHeader } from "@/components/dashboard/CitizenHeader";
import { CitizenMetricCards } from "@/components/dashboard/CitizenMetricCards";
import { CitizenQuickActions } from "@/components/dashboard/CitizenQuickActions";
import { CitizenRecentActivity } from "@/components/dashboard/CitizenRecentActivity";

async function AuthenticatedDashboard({
  user,
}: {
  user: { name?: string | null; email?: string | null; role?: string };
}) {
  const res = await getCitizenDashboardStatsAction();
  const stats = res.stats || {
    totalReported: 0,
    totalEndorsements: 0,
    resolvedCount: 0,
    inProgressCount: 0,
    reputationPoints: 0,
    recentGrievances: [],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-12">
      <CitizenHeader
        userName={user.name || "Citizen"}
        userEmail={user.email || ""}
        role={user.role || "CITIZEN"}
      />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-8 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-border bg-gradient-to-r from-[#4880FF]/10 via-card to-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Hello, {user.name || "Citizen"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your municipal reporting portal is live. Log public hazards, track municipal repair SLA, and build civic trust.
            </p>
          </div>
          <Link
            href="/report"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4880FF] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#4880FF]/90 transition-all shadow-xs shrink-0"
          >
            <span>Report Incident</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* DashStack KPI Metric Cards */}
        <CitizenMetricCards
          totalReported={stats.totalReported}
          totalEndorsements={stats.totalEndorsements}
          resolvedCount={stats.resolvedCount}
          reputationPoints={stats.reputationPoints}
        />

        {/* Quick Action Navigation Tiles */}
        <CitizenQuickActions />

        {/* Recent Hazard Activity */}
        <CitizenRecentActivity grievances={stats.recentGrievances} />
      </main>
    </div>
  );
}

function PublicLanding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-lg text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#4880FF]/10 text-[#4880FF] border border-[#4880FF]/20">
          <ShieldCheck className="h-4 w-4" />
          <span>CivicLens Platform Live</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Welcome to CivicLens
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          AI privacy-compliant citizen hazard reporting, transparent public maps, and automated municipal triage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#4880FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4880FF]/90 transition-colors shadow-xs"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-semibold hover:bg-muted transition-colors shadow-xs"
          >
            Create an Account
          </Link>
        </div>

        <div className="pt-4 border-t border-border">
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#4880FF] hover:underline inline-flex items-center gap-1"
          >
            <span>Explore Public Civic Map without Sign In</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

async function SessionRouter() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return <PublicLanding />;
  }

  const role = (session.user as { role?: string }).role;

  // If logged in user is ADMIN or MUNICIPAL_OFFICER, redirect directly to the admin triage portal
  if (role === "ADMIN" || role === "MUNICIPAL_OFFICER") {
    redirect("/admin/dashboard");
  }

  return (
    <AuthenticatedDashboard
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-[#4880FF]" />
        </div>
      }
    >
      <SessionRouter />
    </Suspense>
  );
}
