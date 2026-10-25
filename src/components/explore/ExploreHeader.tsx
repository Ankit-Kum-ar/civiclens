"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Plus, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ExploreHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-foreground"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4880FF] text-white shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight">CivicLens</span>
          </Link>
          <span className="text-muted-foreground text-xs hidden sm:inline-block">/</span>
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline-block">
            Public Civic Grid
          </span>
        </div>

        {/* Action CTAs aligned with DashStack theme */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/my-reports"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold hover:bg-muted hover:text-foreground transition-all"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span>My Reports</span>
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#4880FF] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#4880FF]/90 transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Report Hazard</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
