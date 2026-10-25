"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

interface ReportUploadProgressProps {
  uploadProgress: number;
  pipelineStep: string;
}

export function ReportUploadProgress({
  uploadProgress,
  pipelineStep,
}: ReportUploadProgressProps) {
  return (
    <div className="rounded-2xl border border-[#4880FF]/30 bg-[#4880FF]/5 p-4 space-y-2 shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-[#4880FF] flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {pipelineStep}
        </span>
        <span className="font-mono text-[#4880FF] font-bold">
          {uploadProgress}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-[#4880FF]/20 overflow-hidden">
        <div
          style={{ width: `${uploadProgress}%` }}
          className="h-full bg-[#4880FF] rounded-full transition-all duration-300"
        />
      </div>
    </div>
  );
}
