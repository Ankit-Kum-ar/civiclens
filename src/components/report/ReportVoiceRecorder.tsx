"use client";

import * as React from "react";
import { Volume2, Mic, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReportVoiceRecorderProps {
  onAudioRecorded: (blob: Blob | null, duration: number) => void;
  disabled: boolean;
}

export function ReportVoiceRecorder({
  onAudioRecorded,
  disabled,
}: ReportVoiceRecorderProps) {
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

  const stopRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

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
