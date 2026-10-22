import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-background">
      {/* Decorative background glow accents for DashStack theme */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-chart-1/5 blur-[120px] dark:bg-chart-5/10" />
      </div>

      {/* Main Split-Screen Container Card */}
      <main className="relative z-10 w-full max-w-[1100px] overflow-hidden rounded-[24px] bg-card p-3 sm:p-4 shadow-xl ring-1 ring-border/60 transition-all">
        {/* Mobile-only header (since left banner collapses on small viewports) */}
        <div className="flex items-center justify-between p-3 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-black text-sm">
              CL
            </div>
            <span className="font-heading font-bold text-lg text-foreground">
              {siteConfig.name}
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Home</span>
          </Link>
        </div>

        {/* Children contains the Split Layout (Hero banner on left + Form container on right) */}
        {children}
      </main>
    </div>
  );
}
