"use client";

import * as React from "react";
import { Play, ShieldCheck } from "lucide-react";

interface HoverVideoPreviewProps {
  src: string;
  className?: string;
}

export function HoverVideoPreview({
  src,
  className = "relative h-12 w-16 rounded-xl overflow-hidden bg-black shrink-0 border border-border group/vid cursor-pointer shadow-xs",
}: HoverVideoPreviewProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
      video.play().catch(() => {});
      setIsPlaying(true);

      // Loop after 3 seconds
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 3000);
    } catch {
      // Ignored
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (timerRef.current) clearInterval(timerRef.current);
    if (!video) return;

    try {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    } catch {
      // Ignored
    }
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover pointer-events-none"
      />

      {/* Redacted privacy shield */}
      <div className="absolute top-1 left-1 rounded bg-black/70 p-0.5">
        <ShieldCheck className="h-2.5 w-2.5 text-[#00B69B]" />
      </div>

      {/* Hover prompt or active playing indicator */}
      <div
        className={`absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[8px] font-bold text-white flex items-center gap-0.5 transition-all ${
          isPlaying
            ? "bg-[#00B69B] shadow-xs"
            : "bg-black/80 backdrop-blur-xs group-hover/vid:bg-[#4880FF]"
        }`}
      >
        <Play className={`h-2 w-2 fill-current ${isPlaying ? "animate-pulse" : ""}`} />
        <span>{isPlaying ? "3s LOOP" : "HOVER"}</span>
      </div>
    </div>
  );
}
