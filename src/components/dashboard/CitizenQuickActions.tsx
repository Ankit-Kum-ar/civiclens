import * as React from "react";
import Link from "next/link";
import { PlusCircle, Compass, FileText, ArrowUpRight } from "lucide-react";

export function CitizenQuickActions() {
  const actions = [
    {
      title: "Report Hazard",
      description: "Log road crater, live wire, or manhole with AI privacy redaction",
      href: "/report",
      icon: PlusCircle,
      cta: "New Report",
      bg: "bg-[#4880FF]",
      text: "text-white",
      hover: "hover:bg-[#4880FF]/90",
    },
    {
      title: "Explore Civic Grid",
      description: "Interactive real-time map with verified municipal incidents",
      href: "/explore",
      icon: Compass,
      cta: "Open Map",
      bg: "bg-card",
      text: "text-foreground",
      border: "border border-border",
      hover: "hover:bg-muted",
    },
    {
      title: "Track My Reports",
      description: "Review progress updates, endorsements, and resolution tickets",
      href: "/my-reports",
      icon: FileText,
      cta: "View Reports",
      bg: "bg-card",
      text: "text-foreground",
      border: "border border-border",
      hover: "hover:bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link
            key={act.title}
            href={act.href}
            className={`group rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${act.bg} ${act.text} ${act.border || ""} ${act.hover}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6" />
                <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-base leading-snug">{act.title}</h3>
              <p className="text-xs opacity-80 leading-relaxed">
                {act.description}
              </p>
            </div>
            <div className="pt-2 text-xs font-bold inline-flex items-center gap-1">
              <span>{act.cta}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
