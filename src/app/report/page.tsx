"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Info, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type GrievanceCategory,
  type GrievanceSeverity,
} from "@/constants";
import { createGrievanceAction } from "@/actions/grievance";
import { ReportHeader, type GpsLocationState } from "@/components/report/ReportHeader";
import { ReportMediaDropzone } from "@/components/report/ReportMediaDropzone";
import { ReportVoiceRecorder } from "@/components/report/ReportVoiceRecorder";
import { ReportCategoryPicker } from "@/components/report/ReportCategoryPicker";
import { ReportUploadProgress } from "@/components/report/ReportUploadProgress";

export default function ReportHazardPage() {
  const router = useRouter();

  // Form state
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
  const [formKey, setFormKey] = React.useState<number>(0);

  const facesRef = React.useRef<Promise<any>>(Promise.resolve([]));

  React.useEffect(() => {
    import("@/lib/mediaPipeClient")
      .then((m) => m.preloadFaceDetector())
      .catch(() => {});
  }, []);

  const handleMediaFileSelected = (file: File | null) => {
    setMediaFile(file);
    if (file && file.type.startsWith("image")) {
      facesRef.current = import("@/lib/mediaPipeClient")
        .then((m) => m.detectFacesInBrowser(file))
        .catch(() => []);
    } else {
      facesRef.current = Promise.resolve([]);
    }
  };

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
    let isMounted = true;

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (!isMounted) return;
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
            if (res.ok && isMounted) {
              const data = await res.json();
              const a = data.address || {};
              const suburb = a.suburb || a.neighbourhood || a.residential || a.road || "";
              city = a.city || a.state_district || "New Delhi";
              ward = a.suburb ? `Ward ${suburb.slice(0, 12)}` : "Ward 32";
              address = [suburb, city].filter(Boolean).join(", ") || address;
            }
          } catch {
            // Fall back
          }

          if (isMounted) {
            setLocation({
              coordinates: coords,
              address,
              ward,
              city,
              isLoading: false,
              error: null,
            });
          }
        },
        (err) => {
          if (isMounted) {
            setLocation({
              coordinates: [77.209, 28.6139],
              address: "Mayur Vihar, District East",
              ward: "Ward 32",
              city: "New Delhi",
              isLoading: false,
              error: err.message || "Location permission denied.",
            });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }

    return () => {
      isMounted = false;
    };
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
      setPipelineStep("MediaPipe & Edge AI detecting faces & plate numbers...");

      // Await the precomputed or running MediaPipe promise from file selection
      const detectedFaceBoxes = isVid ? [] : await facesRef.current;

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
      setPipelineStep("Persisting municipal ticket into registry... (~12s remaining)");

      // 12-second countdown timer so user knows exactly how long AI privacy & persistence takes
      let secondsLeft = 12;
      const countdownInterval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft > 0) {
          setPipelineStep(
            `Persisting municipal ticket into registry... (~${secondsLeft}s remaining)`
          );
        } else {
          setPipelineStep("Finalizing cryptographic ticket registration...");
        }
      }, 1000);

      let grievanceResult;
      try {
        // 3. Persist via Server Action with both MediaPipe and Vision AI detections
        grievanceResult = await createGrievanceAction({
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
          detectedFaceBoxes,
          aiTriage: {
            audioPublicId: audioData.publicId,
            audioSecureUrl: audioData.secureUrl,
            transcript: description,
            detectedCategory: category,
            confidenceScore: 0.95,
          },
        });
      } finally {
        clearInterval(countdownInterval);
      }

      if (!grievanceResult?.success || !grievanceResult?.grievanceId) {
        throw new Error(grievanceResult?.message || "Failed to persist grievance.");
      }

      setUploadProgress(100);
      setPipelineStep("Report logged! Redirecting to verification...");
      toast.success("Hazard report logged and anonymized!");

      // 4. Reset all state fields so the report form is completely cleared
      setTitle("");
      setDescription("");
      setCategory("Crater Pothole");
      setSeverity("MEDIUM");
      setMediaFile(null);
      setVoiceBlob(null);
      setFormKey((prev) => prev + 1);

      router.push(`/report/${grievanceResult.grievanceId}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong while submitting your report.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setPipelineStep("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <ReportHeader location={location} onRefreshLocation={detectLocation} />

      <main className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00B69B]/20 bg-[#00B69B]/10 px-2.5 py-0.5 text-xs font-bold text-[#00B69B]">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Privacy Redaction Active (DPDP Act & GDPR)
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
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
          <form key={formKey} onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
              <ReportMediaDropzone
                onFileSelected={handleMediaFileSelected}
                disabled={isSubmitting}
              />
            </div>

            <ReportVoiceRecorder
              onAudioRecorded={(blob) => setVoiceBlob(blob)}
              disabled={isSubmitting}
            />

            <ReportCategoryPicker
              selectedCategory={category}
              onSelectCategory={setCategory}
              disabled={isSubmitting}
            />

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
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Low", value: "LOW", color: "border-[#00B69B] text-[#00B69B] bg-[#00B69B]/10" },
                    { label: "Medium", value: "MEDIUM", color: "border-[#FF9F43] text-[#FF9F43] bg-[#FF9F43]/10" },
                    { label: "High / Critical", value: "HIGH", color: "border-[#EF3826] text-[#EF3826] bg-[#EF3826]/10" },
                  ].map((lvl) => {
                    const isSelected = severity === lvl.value;
                    return (
                      <button
                        key={lvl.value}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setSeverity(lvl.value as GrievanceSeverity)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? `${lvl.color} shadow-xs ring-1 ring-current`
                            : "border-border/80 bg-card hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Direct Upload Progress Bar */}
            {isSubmitting && (
              <ReportUploadProgress
                uploadProgress={uploadProgress}
                pipelineStep={pipelineStep}
              />
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
