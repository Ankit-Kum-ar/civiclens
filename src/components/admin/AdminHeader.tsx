"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, RefreshCw, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AdminHeaderProps {
  adminName: string;
  adminRole: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function AdminHeader({
  adminName,
  adminRole,
  onRefresh,
  isRefreshing,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-foreground"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EF3826] text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block leading-tight">
                CivicLens
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                Municipal Authority Triage
              </span>
            </div>
          </Link>
          <span className="text-muted-foreground text-xs hidden sm:inline-block">/</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EF3826]/10 text-[#EF3826] border border-[#EF3826]/20 hidden sm:inline-block">
            {adminRole} • {adminName}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#4880FF]" : "text-muted-foreground"}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Citizen Portal</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              title="Sign Out"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-[#EF3826] hover:bg-[#EF3826]/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
