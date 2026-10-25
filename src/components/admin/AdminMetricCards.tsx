import * as React from "react";
import { AlertCircle, Clock, CheckCircle2, Flame } from "lucide-react";

interface AdminMetricCardsProps {
  counts: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    rejected: number;
    highUrgency: number;
  };
}

export function AdminMetricCards({ counts }: AdminMetricCardsProps) {
  const cards = [
    {
      title: "Pending Triage",
      value: counts.open,
      subtext: "Awaiting municipal assignment",
      icon: AlertCircle,
      color: "text-[#EF3826]",
      bg: "bg-[#EF3826]/10",
      border: "border-[#EF3826]/20",
    },
    {
      title: "In Progress Repairs",
      value: counts.inProgress,
      subtext: "Field crews dispatched",
      icon: Clock,
      color: "text-[#FF9F43]",
      bg: "bg-[#FF9F43]/10",
      border: "border-[#FF9F43]/20",
    },
    {
      title: "Resolved Hazards",
      value: counts.resolved,
      subtext: "Successfully verified & closed",
      icon: CheckCircle2,
      color: "text-[#00B69B]",
      bg: "bg-[#00B69B]/10",
      border: "border-[#00B69B]/20",
    },
    {
      title: "High Urgency Alerts",
      value: counts.highUrgency,
      subtext: "Open hazards requiring immediate SLA",
      icon: Flame,
      color: "text-[#4880FF]",
      bg: "bg-[#4880FF]/10",
      border: "border-[#4880FF]/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {c.title}
              </p>
              <p className="text-2xl font-black tracking-tight text-foreground">
                {c.value}
              </p>
              <p className="text-[11px] text-muted-foreground">{c.subtext}</p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg} ${c.color} border ${c.border} shrink-0`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
