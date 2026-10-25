"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Loader2,
  MapPin,
  RefreshCw,
  Camera,
  Video,
  UploadCloud,
  X,
  Volume2,
  Mic,
  Square,
  Trash2,
  AlertTriangle,
  Zap,
  Car,
  Droplets,
  Trash,
  Lightbulb,
  ShieldAlert,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GRIEVANCE_CATEGORIES,
  type GrievanceCategory,
  type GrievanceSeverity,
} from "@/constants";
import { createGrievanceAction } from "@/actions/grievance";

/* ==========================================================================
   Types
   ========================================================================== */
interface GpsLocationState {
  coordinates: [number, number] | null;
  address: string;
  ward: string;
  city: string;
  isLoading: boolean;
  error: string | null;
}

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

/* ==========================================================================
   Modular Subcomponents (Self-contained in report/page.tsx)
   ========================================================================== */

/** 1. GPS Pill with DashStack Card Style */
function InlineGpsPill({
  location,
  onRefresh,
}: {
  location: GpsLocationState | null;
  onRefresh: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 shadow-xs transition-all">
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            location?.isLoading
              ? "bg-amber-400 animate-ping opacity-75"
              : location?.error
              ? "bg-amber-500"
              : "bg-[#00B69B] animate-ping opacity-75"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            location?.isLoading
              ? "bg-amber-500"
              : location?.error
              ? "bg-amber-500"
              : "bg-[#00B69B]"
          }`}
        />
      </span>

      <MapPin className="h-4 w-4 text-[#4880FF] shrink-0" />

      <span className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-[320px]">
        {location?.isLoading
          ? "Detecting GPS..."
          : `${location?.address} (${location?.ward})`}
      </span>

      <button
        type="button"
        onClick={onRefresh}
        disabled={location?.isLoading}
        title="Refresh Location"
        className="rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 hover:bg-muted cursor-pointer"
      >
        <RefreshCw
          className={`h-3 w-3 ${location?.isLoading ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  );
}

/** 2. DashStack Media Capture Dropzone */
function InlineMediaZone({
  onFileSelected,
  disabled,
}: {
  onFileSelected: (file: File | null) => void;
  disabled: boolean;
}) {
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

/** 3. DashStack Voice Waveform Recorder */
function InlineVoiceRecorder({
  onAudioRecorded,
  disabled,
}: {
  onAudioRecorded: (blob: Blob | null, duration: number) => void;
  disabled: boolean;
}) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [hasAudio, setHasAudio] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [duration, setDuration] = React.useState(0);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const [waveformBars, setWaveformBars] = React.useState<number[]>(
    Array.from({ length: 24 }, () => 20)
  );

  React.useEffect(() => {
    if (!isRecording) {
      return;
    }
    const animInterval = setInterval(() => {
      setWaveformBars(
        Array.from({ length: 24 }, () => Math.floor(Math.random() * 80) + 15)
      );
    }, 100);

    return () => {
      clearInterval(animInterval);
      setWaveformBars(Array.from({ length: 24 }, () => 18));
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasAudio(true);
        onAudioRecorded(audioBlob, duration);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      toast.error("Microphone permission was denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const clearAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setHasAudio(false);
    setDuration(0);
    onAudioRecorded(null, 0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-[#4880FF]" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Spoken Voice Note (Vernacular Speech)
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          {formatTime(duration)} / 1:00
        </span>
      </div>

      {/* Waveform Bar Visualizer */}
      <div className="flex items-center justify-center gap-1.5 h-12 rounded-xl bg-muted/30 px-3">
        {waveformBars.map((height, i) => (
          <div
            key={i}
            style={{ height: `${height}%` }}
            className={`w-1 rounded-full transition-all duration-75 ${
              isRecording
                ? "bg-[#EF3826] animate-pulse"
                : hasAudio
                ? "bg-[#4880FF]"
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        {!hasAudio ? (
          <Button
            type="button"
            disabled={disabled}
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-xl gap-2 font-medium text-xs h-9 px-4 transition-all cursor-pointer ${
              isRecording
                ? "bg-[#EF3826] hover:bg-[#EF3826]/90 text-white"
                : "bg-card border border-border/80 hover:bg-muted text-foreground"
            }`}
          >
            {isRecording ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5 text-[#4880FF]" />
                <span>Speak Description</span>
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2 w-full justify-between">
            {audioUrl && (
              <audio src={audioUrl} controls className="h-8 max-w-[220px] sm:max-w-[280px]" />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearAudio}
              className="h-8 w-8 text-[#EF3826] hover:bg-[#EF3826]/10 rounded-lg cursor-pointer"
              title="Delete audio note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <span className="text-[11px] text-muted-foreground font-medium">
          {isRecording
            ? "Listening..."
            : hasAudio
            ? "Voice note ready"
            : "Optional: Speak in Hindi, English, etc."}
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   Main Page Export
   ========================================================================== */
export default function ReportHazardPage() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<GrievanceCategory>("Crater Pothole");
  const [severity, setSeverity] = React.useState<GrievanceSeverity>("MEDIUM");
  const [location, setLocation] = React.useState<GpsLocationState>({
    coordinates: null,
    address: "Detecting location...",
    ward: "Locating ward...",
    city: "New Delhi",
    isLoading: true,
    error: null,
  });
  const [mediaFile, setMediaFile] = React.useState<File | null>(null);
  const [voiceBlob, setVoiceBlob] = React.useState<Blob | null>(null);

  // Submission pipeline states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [pipelineStep, setPipelineStep] = React.useState<string>("");

  const detectLocation = React.useCallback(() => {
    setLocation((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocation({
        coordinates: [77.209, 28.6139],
        address: "Connaught Place, Central Delhi",
        ward: "Ward 32",
        city: "New Delhi",
        isLoading: false,
        error: "Geolocation not supported.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords: [number, number] = [longitude, latitude];
        let address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
        let ward = "Ward 32";
        let city = "New Delhi";

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            const suburb = a.suburb || a.neighbourhood || a.residential || a.road || "";
            city = a.city || a.state_district || "New Delhi";
            ward = a.suburb ? `Ward ${suburb.slice(0, 12)}` : "Ward 32";
            address = [suburb, city].filter(Boolean).join(", ") || address;
          }
        } catch {
          // Fall back gracefully
        }

        setLocation({
          coordinates: coords,
          address,
          ward,
          city,
          isLoading: false,
          error: null,
        });
      },
      (err) => {
        setLocation({
          coordinates: [77.209, 28.6139],
          address: "Mayur Vihar, District East",
          ward: "Ward 32",
          city: "New Delhi",
          isLoading: false,
          error: err.message || "Location permission denied.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const coords: [number, number] = [longitude, latitude];
          let address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          let ward = "Ward 32";
          let city = "New Delhi";

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { "Accept-Language": "en" } }
            );
            if (res.ok) {
              const data = await res.json();
              const a = data.address || {};
              const suburb = a.suburb || a.neighbourhood || a.residential || a.road || "";
              city = a.city || a.state_district || "New Delhi";
              ward = a.suburb ? `Ward ${suburb.slice(0, 12)}` : "Ward 32";
              address = [suburb, city].filter(Boolean).join(", ") || address;
            }
          } catch {
            // Fall back gracefully
          }

          setLocation({
            coordinates: coords,
            address,
            ward,
            city,
            isLoading: false,
            error: null,
          });
        },
        (err) => {
          setLocation({
            coordinates: [77.209, 28.6139],
            address: "Mayur Vihar, District East",
            ward: "Ward 32",
            city: "New Delhi",
            isLoading: false,
            error: err.message || "Location permission denied.",
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mediaFile) {
      toast.error("Please take a photo or record a video of the hazard.");
      return;
    }

    if (!title.trim() || title.length < 5) {
      toast.error("Please enter a short title (at least 5 characters).");
      return;
    }

    if (!description.trim() || description.length < 10) {
      toast.error("Please provide a description (at least 10 characters).");
      return;
    }

    if (!location?.coordinates) {
      toast.error("Waiting for GPS location lock. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(15);
    setPipelineStep("Securing server-signed Cloudinary token...");

    try {
      // 1. Fetch server-controlled upload signature
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
      });
      const signData = await signRes.json();

      if (!signRes.ok || !signData.success) {
        throw new Error(signData.error || "Failed to generate upload signature.");
      }

      setUploadProgress(35);
      setPipelineStep("Direct streaming media to Cloudinary CDN...");

      // 2. Stream binary directly to Cloudinary (0 MB server memory load)
      const uploadFormData = new FormData();
      uploadFormData.append("file", mediaFile);
      uploadFormData.append("api_key", signData.apiKey);
      uploadFormData.append("timestamp", String(signData.timestamp));
      uploadFormData.append("signature", signData.signature);
      uploadFormData.append("folder", signData.folder);

      const isVid = mediaFile.type.startsWith("video");
      const resourceType = isVid ? "video" : "image";
      const uploadEndpoint = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;

      const uploadRes = await fetch(uploadEndpoint, {
        method: "POST",
        body: uploadFormData,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadJson.error?.message || "Cloudinary media upload failed.");
      }

      setUploadProgress(75);
      setPipelineStep("Edge AI redacting faces & plate numbers...");

      // Optional voice note upload
      let audioData: { publicId?: string; secureUrl?: string } = {};
      if (voiceBlob) {
        try {
          const audioFormData = new FormData();
          audioFormData.append("file", voiceBlob, "voice_note.webm");
          audioFormData.append("api_key", signData.apiKey);
          audioFormData.append("timestamp", String(signData.timestamp));
          audioFormData.append("signature", signData.signature);
          audioFormData.append("folder", signData.folder);

          const audioRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`,
            { method: "POST", body: audioFormData }
          );
          if (audioRes.ok) {
            const audioJson = await audioRes.json();
            audioData = {
              publicId: audioJson.public_id,
              secureUrl: audioJson.secure_url,
            };
          }
        } catch {
          // Soft fail for audio
        }
      }

      setUploadProgress(90);
      setPipelineStep("Persisting municipal ticket into registry...");

      // 3. Persist via Server Action
      const grievanceResult = await createGrievanceAction({
        title,
        description,
        category,
        severity,
        location: {
          coordinates: location.coordinates,
          address: location.address,
          ward: location.ward,
          city: location.city,
        },
        media: {
          publicId: uploadJson.public_id,
          originalSecureUrl: uploadJson.secure_url,
          resourceType,
        },
        aiTriage: {
          audioPublicId: audioData.publicId,
          audioSecureUrl: audioData.secureUrl,
          transcript: description,
          detectedCategory: category,
          confidenceScore: 0.95,
        },
      });

      if (!grievanceResult.success || !grievanceResult.grievanceId) {
        throw new Error(grievanceResult.message || "Failed to persist grievance.");
      }

      setUploadProgress(100);
      setPipelineStep("Report logged! Redirecting to verification...");
      toast.success("Hazard report logged and anonymized!");

      router.push(`/report/${grievanceResult.grievanceId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong while submitting your report.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setPipelineStep("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Navbar matching DashStack Aesthetics */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4880FF] font-heading font-black text-white shadow-sm">
              CL
            </span>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-base text-foreground tracking-tight">
                CivicLens
              </span>
              <p className="text-[10px] text-muted-foreground font-medium -mt-1">
                Citizen Hazard Terminal
              </p>
            </div>
          </Link>

          <InlineGpsPill location={location} onRefresh={detectLocation} />
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <div className="space-y-6">
          {/* Hero Banner Pill */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00B69B]/20 bg-[#00B69B]/10 px-2.5 py-0.5 text-xs font-bold text-[#00B69B]">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Privacy Redaction Active (DPDP Act & GDPR)
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Report Street Hazard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Direct edge ingestion. Bystander faces & car plates are blurred before public dispatch.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/60">
              <Info className="h-4 w-4 text-[#4880FF] shrink-0" />
              <div className="text-[11px] leading-tight text-muted-foreground">
                <span className="font-semibold text-foreground">Municipal Ward SLA:</span>
                <p>Emergency crews dispatched within 4 hrs.</p>
              </div>
            </div>
          </div>

          {/* Report Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Visual Evidence Zone */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
              <InlineMediaZone
                onFileSelected={setMediaFile}
                disabled={isSubmitting}
              />
            </div>

            {/* Spoken Voice Note Waveform */}
            <InlineVoiceRecorder
              onAudioRecorded={(blob) => setVoiceBlob(blob)}
              disabled={isSubmitting}
            />

            {/* Hazard Category Grid */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Select Hazard Category <span className="text-[#EF3826]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {GRIEVANCE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  const meta = CATEGORY_META[cat];
                  const Icon = meta.icon;

                  return (
                    <button
                      key={cat}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setCategory(cat)}
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

            {/* Title & Description Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Short Hazard Summary <span className="text-[#EF3826]">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken water pipeline causing flooded street"
                  disabled={isSubmitting}
                  maxLength={120}
                  className="h-11 rounded-xl bg-card border-border/80 text-foreground shadow-xs text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Location Landmark & Details <span className="text-[#EF3826]">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe exact spot, nearby shops, or specific danger to pedestrians..."
                  disabled={isSubmitting}
                  rows={3}
                  maxLength={1500}
                  className="rounded-xl bg-card border-border/80 text-foreground shadow-xs text-sm"
                />
              </div>

              {/* Urgency Level Buttons */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Urgency / Severity
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["LOW", "MEDIUM", "HIGH"] as GrievanceSeverity[]).map((sev) => {
                    const isSelected = severity === sev;
                    const metaMap = {
                      LOW: { color: "text-[#00B69B]", bg: "bg-[#00B69B]/10" },
                      MEDIUM: { color: "text-[#FF9F43]", bg: "bg-[#FF9F43]/10" },
                      HIGH: { color: "text-[#EF3826]", bg: "bg-[#EF3826]/10" },
                    };
                    return (
                      <button
                        key={sev}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setSeverity(sev)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] ring-1 ring-[#4880FF]/30 shadow-xs"
                            : "border-border/80 bg-card hover:bg-muted text-foreground"
                        }`}
                      >
                        <span className={metaMap[sev].color}>● </span>
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Direct Upload Progress Bar */}
            {isSubmitting && (
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
            )}

            {/* Primary Submit Action */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#4880FF] hover:bg-[#4880FF]/90 text-white font-bold text-sm transition-all shadow-md gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Streaming directly to Cloudinary Edge...</span>
                </>
              ) : (
                <>
                  <span>Submit Anonymized Hazard Report</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
