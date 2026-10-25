import * as React from "react";
import { FileText, ThumbsUp, CheckCircle2, Award } from "lucide-react";

interface CitizenMetricCardsProps {
  totalReported: number;
  totalEndorsements: number;
  resolvedCount: number;
  reputationPoints: number;
}

export function CitizenMetricCards({
  totalReported,
  totalEndorsements,
  resolvedCount,
  reputationPoints,
}: CitizenMetricCardsProps) {
  const cards = [
    {
      title: "Hazards Reported",
      value: totalReported,
      subtext: "Logged to civic grid",
      icon: FileText,
      color: "text-[#4880FF]",
      bg: "bg-[#4880FF]/10",
      border: "border-[#4880FF]/20",
    },
    {
      title: "Community Upvotes",
      value: totalEndorsements,
      subtext: "Civic endorsements received",
      icon: ThumbsUp,
      color: "text-[#FF9F43]",
      bg: "bg-[#FF9F43]/10",
      border: "border-[#FF9F43]/20",
    },
    {
      title: "Hazards Resolved",
      value: resolvedCount,
      subtext: "Repaired by municipality",
      icon: CheckCircle2,
      color: "text-[#00B69B]",
      bg: "bg-[#00B69B]/10",
      border: "border-[#00B69B]/20",
    },
    {
      title: "Reputation Points",
      value: reputationPoints,
      subtext: "Civic Vanguard Score",
      icon: Award,
      color: "text-[#8280FF]",
      bg: "bg-[#8280FF]/10",
      border: "border-[#8280FF]/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-[#4880FF]/40 transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-2xl font-black tracking-tight text-foreground">
                {card.value.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {card.subtext}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} ${card.color} border ${card.border} shrink-0`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
