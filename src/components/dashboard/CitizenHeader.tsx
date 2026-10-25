import * as React from "react";
import Link from "next/link";
import { ShieldCheck, User, LogOut, Settings } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface CitizenHeaderProps {
  userName: string;
  userEmail: string;
  role: string;
}

export function CitizenHeader({
  userName,
  userEmail,
  role,
}: CitizenHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-foreground"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4880FF] text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block leading-tight">
                CivicLens
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                Citizen Portal
              </span>
            </div>
          </Link>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {(role === "ADMIN" || role === "MUNICIPAL_OFFICER") && (
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#8280FF]/10 text-[#8280FF] border border-[#8280FF]/20 px-3 py-1.5 text-xs font-semibold hover:bg-[#8280FF]/20 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Admin Console</span>
            </Link>
          )}

          <div className="flex items-center gap-2.5 bg-background border border-border px-3 py-1.5 rounded-xl shadow-xs">
            <div className="h-7 w-7 rounded-lg bg-[#4880FF]/10 text-[#4880FF] flex items-center justify-center font-bold text-xs">
              {userName ? userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold leading-tight text-foreground">
                {userName}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight truncate max-w-[120px]">
                {userEmail}
              </p>
            </div>
          </div>

          <ThemeToggle />

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
