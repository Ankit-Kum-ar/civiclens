"use client";

import * as React from "react";
import { Camera, Video, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportMediaDropzoneProps {
  onFileSelected: (file: File | null) => void;
  disabled: boolean;
}

export function ReportMediaDropzone({
  onFileSelected,
  disabled,
}: ReportMediaDropzoneProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isVideo, setIsVideo] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const isVid = selected.type.startsWith("video");
      setIsVideo(isVid);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      onFileSelected(selected);
    }
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setIsVideo(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelected(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <span>Visual Evidence</span>
          <span className="text-[#EF3826]">*</span>
        </label>
        {file && (
          <span className="text-[11px] font-semibold text-[#4880FF] bg-[#4880FF]/10 px-2 py-0.5 rounded-md font-mono">
            {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split("/")[1]?.toUpperCase()}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80 hover:border-[#4880FF]/80 bg-card/60 hover:bg-card p-8 sm:p-10 text-center transition-all cursor-pointer shadow-xs"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4880FF]/10 text-[#4880FF] group-hover:scale-105 transition-transform shadow-xs">
            <Camera className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">
              Tap to Take Photo or Record Video
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Captures hazard in high resolution. Bystander faces and vehicle numbers are automatically blurred at the edge.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2.5 py-1">
              <Camera className="h-3.5 w-3.5 text-[#4880FF]" /> Live Camera
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2.5 py-1">
              <Video className="h-3.5 w-3.5 text-[#FF9F43]" /> 10s Clip
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2.5 py-1">
              <UploadCloud className="h-3.5 w-3.5 text-[#00B69B]" /> Gallery
            </span>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-black/90 aspect-video flex items-center justify-center shadow-md">
          {isVideo ? (
            <video
              src={previewUrl}
              controls
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Hazard Evidence"
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          )}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClear}
            className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-lg cursor-pointer"
            title="Remove media"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] text-white font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B69B]" />
            <span>{isVideo ? "Video Ready" : "Photo Ready"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
