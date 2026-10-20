"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, ShieldCheck, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [reportTitle, setReportTitle] = useState("");

  useEffect(() => {
    // Sync theme class on html element
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    toast.info(`Switched to ${!isDark ? "Dark" : "Light"} mode`);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      toast.warning("Please type a sample hazard description");
      return;
    }
    toast.success("Sample Report Created!", {
      description: `"${reportTitle}" submitted with automatic privacy redaction.`,
    });
    setReportTitle("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <main className="w-full max-w-md space-y-6">
        {/* Top bar with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">{siteConfig.name}</span>
            <Badge variant="outline" className="text-xs">
              Preview
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-indigo-500" />}
            <span className="text-xs font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </Button>
        </div>

        {/* Showcase Card */}
        <Card className="shadow-lg border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-primary text-primary-foreground text-xs">
                <Sparkles className="size-3 mr-1" /> AI Triaged
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <ShieldCheck className="size-3 mr-1" /> DPDP Compliant
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold">{siteConfig.tagline}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Test your newly applied shadcn preset theme in both light and dark mode.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleTestSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Quick Incident Sample
                </label>
                <Input
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Open manhole on 5th avenue..."
                  className="text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 text-xs">
                  <Send className="size-3.5 mr-1.5" /> Submit Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs"
                  onClick={() => toast.success("Toast Notification Works!")}
                >
                  Test Toast
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="border-t border-border pt-3 text-[11px] text-muted-foreground flex justify-between">
            <span>Preset: base-maia</span>
            <span>Next.js 16 + Tailwind v4</span>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
