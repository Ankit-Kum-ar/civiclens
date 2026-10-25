"use client";

import type { FaceDetector } from "@mediapipe/tasks-vision";
import type { DetectedRegion } from "@/lib/aiPrivacy";

const WASM_PATH = "/mediapipe/wasm";
const MODEL_PATH = "/mediapipe/blaze_face_short_range.tflite";
const MAX_SIDE = 1600;        // downscale huge phone photos
const TILE_GRIDS = [1, 2, 3]; // full image, 2x2, 3x3 tiles for small distant faces
const TILE_OVERLAP = 0.3;
const PAD = 0.2;              // grow tight face boxes ~20% per side

const NOISE =
  /^(INFO|WARNING):|TensorFlow Lite|XNNPACK|gl_context|inference_feedback_manager|Feedback manager|OpenGL error|_fd_write/i;

async function withQuietConsole<T>(fn: () => Promise<T> | T): Promise<T> {
  const methods = ["log", "info", "warn", "error"] as const;
  const originals = methods.map((m) => console[m]);
  methods.forEach((m, i) => {
    console[m] = (...args: unknown[]) => {
      if (typeof args[0] === "string" && NOISE.test(args[0])) return;
      originals[i].apply(console, args as []);
    };
  });
  try {
    return await fn();
  } finally {
    methods.forEach((m, i) => (console[m] = originals[i]));
  }
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

let detectorPromise: Promise<FaceDetector> | null = null;

/** Call on page mount so the download/compile cost is paid before submit. */
export function preloadFaceDetector(): Promise<FaceDetector> {
  if (!detectorPromise) {
    detectorPromise = withQuietConsole(async () => {
      const { FilesetResolver, FaceDetector } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
      return FaceDetector.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_PATH, delegate: "CPU" },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.3,
        minSuppressionThreshold: 0.3,
      });
    }).catch((err) => {
      detectorPromise = null; // allow retry
      throw err;
    });
  }
  return detectorPromise;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
}

function iou(a: Box, b: Box) {
  const x1 = Math.max(a.x, b.x),
    y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w),
    y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  return inter / (a.w * a.h + b.w * b.h - inter || 1);
}

function nms(boxes: Box[], threshold = 0.4): Box[] {
  const sorted = [...boxes].sort((a, b) => b.score - a.score);
  const kept: Box[] = [];
  for (const b of sorted) if (kept.every((k) => iou(k, b) < threshold)) kept.push(b);
  return kept;
}

export async function detectFacesInBrowser(file: File): Promise<DetectedRegion[]> {
  if (typeof window === "undefined" || !file.type.startsWith("image")) return [];

  try {
    const detector = await withTimeout(preloadFaceDetector(), 30_000, "MediaPipe init");

    // Decode with EXIF orientation applied, so box coords match what users see.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const W = Math.round(bitmap.width * scale);
    const H = Math.round(bitmap.height * scale);

    const base = document.createElement("canvas");
    base.width = W;
    base.height = H;
    base.getContext("2d")!.drawImage(bitmap, 0, 0, W, H);
    bitmap.close();

    const found: Box[] = await withTimeout(
      withQuietConsole(async () => {
        const out: Box[] = [];
        for (const n of TILE_GRIDS) {
          const tw = n === 1 ? W : Math.ceil((W / n) * (1 + TILE_OVERLAP));
          const th = n === 1 ? H : Math.ceil((H / n) * (1 + TILE_OVERLAP));
          const stepX = n === 1 ? 0 : (W - tw) / (n - 1);
          const stepY = n === 1 ? 0 : (H - th) / (n - 1);
          for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
              const sx = Math.round(c * stepX),
                sy = Math.round(r * stepY);
              const tile = document.createElement("canvas");
              tile.width = tw;
              tile.height = th;
              tile.getContext("2d")!.drawImage(base, sx, sy, tw, th, 0, 0, tw, th);
              const res = detector.detect(tile);
              for (const d of res.detections) {
                const bb = d.boundingBox;
                if (!bb) continue;
                out.push({
                  x: bb.originX + sx,
                  y: bb.originY + sy,
                  w: bb.width,
                  h: bb.height,
                  score: d.categories?.[0]?.score ?? 0,
                });
              }
            }
          }
        }
        return out;
      }),
      20_000,
      "MediaPipe detect"
    );

    const clamp = (v: number) => Math.min(1000, Math.max(0, Math.round(v)));
    const finalBoxes = nms(found).map((b) => {
      const px = b.w * PAD,
        py = b.h * PAD;
      return {
        type: "face",
        box_2d: [
          clamp(((b.y - py) / H) * 1000),
          clamp(((b.x - px) / W) * 1000),
          clamp(((b.y + b.h + py) / H) * 1000),
          clamp(((b.x + b.w + px) / W) * 1000),
        ],
      } as DetectedRegion; // [ymin, xmin, ymax, xmax] in 0-1000
    });

    console.log(`[MediaPipe Tiled Client] Successfully detected ${finalBoxes.length} faces in browser`);
    return finalBoxes;
  } catch (err) {
    // warn, not error: the dev overlay only pops for console.error
    console.warn("[MediaPipe] face detection failed:", err);
    return [];
  }
}
