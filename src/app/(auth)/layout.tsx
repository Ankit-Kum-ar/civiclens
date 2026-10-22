import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-background transition-colors duration-200">
      {/* Decorative ambient background glows */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-[#6226EF]/10 blur-[130px]" />
      </div>

      {/* Main Split-Screen Container Card */}
      <main className="relative z-10 w-full max-w-[1100px] overflow-hidden rounded-[24px] bg-card p-3 sm:p-4 shadow-2xl ring-1 ring-border transition-all">
        {/* Top bar with Theme Toggle */}
        <div className="flex items-center justify-between p-2 mb-1">
          {/* Mobile-only logo (since left hero collapses on mobile) */}
          <div className="flex items-center gap-2 lg:invisible">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-black text-sm">
                CL
              </div>
              <span className="font-heading font-bold text-lg text-foreground">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* Theme switcher on the top right */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="lg:hidden inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* Children contains the Split Layout (Hero banner on left + Form container on right) */}
        {children}
      </main>
    </div>
  );
}
