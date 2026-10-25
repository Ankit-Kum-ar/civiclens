"use client";

import * as React from "react";
import {
  AlertTriangle,
  Zap,
  Car,
  Droplets,
  Trash,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";
import { GRIEVANCE_CATEGORIES, type GrievanceCategory } from "@/constants";

const CATEGORY_META: Record<
  GrievanceCategory,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Open Manhole": { icon: AlertTriangle, color: "text-[#EF3826]", bg: "bg-[#EF3826]/10" },
  "Exposed Live Wire": { icon: Zap, color: "text-[#FF9F43]", bg: "bg-[#FF9F43]/10" },
  "Crater Pothole": { icon: Car, color: "text-[#4880FF]", bg: "bg-[#4880FF]/10" },
  "Severe Waterlogging": { icon: Droplets, color: "text-[#00B4D8]", bg: "bg-[#00B4D8]/10" },
  "Illegal Garbage Dump": { icon: Trash, color: "text-[#00B69B]", bg: "bg-[#00B69B]/10" },
  "Broken Streetlight": { icon: Lightbulb, color: "text-[#FFC107]", bg: "bg-[#FFC107]/10" },
  "Damaged Guardrail": { icon: ShieldAlert, color: "text-[#8854D0]", bg: "bg-[#8854D0]/10" },
};

interface ReportCategoryPickerProps {
  selectedCategory: GrievanceCategory;
  onSelectCategory: (cat: GrievanceCategory) => void;
  disabled: boolean;
}

export function ReportCategoryPicker({
  selectedCategory,
  onSelectCategory,
  disabled,
}: ReportCategoryPickerProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
        Select Hazard Category <span className="text-[#EF3826]">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {GRIEVANCE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;

          return (
            <button
              key={cat}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] shadow-xs ring-1 ring-[#4880FF]/30"
                  : "border-border/80 bg-card hover:bg-muted/50 text-foreground"
              } disabled:opacity-50`}
            >
              <div className={`p-1.5 rounded-lg ${meta.bg}`}>
                <Icon className={`h-4 w-4 ${meta.color}`} />
              </div>
              <span className="truncate">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
