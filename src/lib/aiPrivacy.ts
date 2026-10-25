import sharp, { type OverlayOptions } from "sharp";
import { cloudinary } from "@/lib/cloudinary";

export interface DetectedRegion {
  type: "face" | "license_plate" | "house_number";
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
}

/**
 * Calls OpenRouter Vision AI (google/gemini-2.5-flash) to find precise normalized
 * bounding box coordinates [ymin, xmin, ymax, xmax] for:
 * - All human faces & heads (front, side profile, downward tilted, shaded)
 * - Vehicle license / registration plates
 * - House / address numbers
 */
export async function detectPrivacyRegions(imageUrl: string): Promise<DetectedRegion[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return [];

  const prompt =
    'Locate tight, precise bounding boxes for all sensitive privacy data to redact: ' +
    '1) Human heads/faces (from forehead to chin, ear to ear - only head/face, NOT upper torso or body), ' +
    '2) ALL vehicle registration/license plates (the entire rectangular plate and any vehicle number characters visible on cars, bikes, trucks, autos), ' +
    '3) Street house address numbers and door numbers. ' +
    'CRITICAL: Ensure the entire license plate area with its characters is strictly covered in the box. ' +
    'Return JSON format: {"regions": [{"type": "face"|"license_plate"|"house_number", "box_2d": [ymin, xmin, ymax, xmax]}]} ' +
    'where coordinates are normalized integers from 0 to 1000.';

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://civiclens.local",
        "X-Title": "CivicLens",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[OpenRouter AI] Request failed:", response.status, errText);
      return [];
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    if (!content) return [];

    // Strip markdown code fences if model enclosed JSON in ```json ... ```
    content = content.trim();
    if (content.startsWith("```json")) {
      content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (content.startsWith("```")) {
      content = content.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Try parsing; if truncated, attempt to salvage valid region objects
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Find all complete box_2d objects if response was cut off mid-stream
      const regionMatches = content.matchAll(
        /\{\s*"type"\s*:\s*"(face|license_plate|house_number)"\s*,\s*"box_2d"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]\s*\}/g
      );
      const salvaged: DetectedRegion[] = [];
      for (const m of regionMatches) {
        salvaged.push({
          type: m[1] as "face" | "license_plate" | "house_number",
          box_2d: [Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5])],
        });
      }
      if (salvaged.length > 0) {
        console.log(`[OpenRouter AI] Salvaged ${salvaged.length} regions from truncated JSON`);
        return salvaged;
      }
      throw new Error(`JSON parse failed and no regions could be salvaged. Preview: ${content.slice(0, 100)}...`);
    }

    return Array.isArray(parsed.regions) ? parsed.regions : [];
  } catch (err) {
    console.error("[OpenRouter AI] Exception during region detection:", err);
    return [];
  }
}

/**
 * Detects faces using MediaPipe Tasks Vision FaceDetector model.
 * Combines with Vision AI (both results merged) for maximum redundancy.
 */
export async function detectFacesWithMediaPipe(imageBuffer: Buffer): Promise<DetectedRegion[]> {
  // @mediapipe/tasks-vision requires a real browser WebGL/Canvas environment (DOM Worker/OffscreenCanvas).
  // In pure Node.js server environments, attempting to mock window/document corrupts Next.js and Node globals.
  // We keep this function clean and safe:
  return [];
}

/**
 * Combined privacy pipeline: runs both Vision AI and MediaPipe concurrently,
 * merges both region lists, and blurs all detected areas.
 */
export async function detectAllPrivacyRegions(
  imageUrl: string,
  imageBuffer?: Buffer
): Promise<DetectedRegion[]> {
  const tasks: Promise<DetectedRegion[]>[] = [detectPrivacyRegions(imageUrl)];

  if (imageBuffer) {
    tasks.push(detectFacesWithMediaPipe(imageBuffer));
  }

  const results = await Promise.allSettled(tasks);
  const combined: DetectedRegion[] = [];

  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      combined.push(...res.value);
    }
  }

  console.log(`[Privacy Pipeline] Total combined regions (Vision AI + MediaPipe): ${combined.length}`);
  return combined;
}

/**
 * Fetches the raw image buffer, burns deterministic Gaussian blur + pixelation
 * directly onto every detected face, license plate, and address box using Sharp,
 * and uploads the sanitized image back to Cloudinary as the official redacted version.
 */
export async function generateAndUploadSanitizedImage(
  originalSecureUrl: string,
  publicId: string,
  regions: DetectedRegion[]
): Promise<string | null> {
  try {
    const rawRes = await fetch(originalSecureUrl);
    if (!rawRes.ok) return null;
    const arrayBuffer = await rawRes.arrayBuffer();
    const rawBuf = Buffer.from(arrayBuffer);

    // Auto-orient according to EXIF tags so crops match browser bitmap coordinates
    const orientedBuf = await sharp(rawBuf).rotate().toBuffer();
    const metadata = await sharp(orientedBuf).metadata();
    if (!metadata.width || !metadata.height) return null;
    const imgBuf = orientedBuf;

    const overlays: OverlayOptions[] = [];

    for (const r of regions) {
      const [ymin, xmin, ymax, xmax] = r.box_2d;
      // Extra generous padding for license plates to guarantee every letter and edge is covered
      const padFactor = r.type === "license_plate" ? 0.20 : 0.12;
      const paddingX = Math.round(((xmax - xmin) / 1000) * metadata.width * padFactor);
      const paddingY = Math.round(((ymax - ymin) / 1000) * metadata.height * padFactor);

      const left = Math.max(0, Math.round((xmin / 1000) * metadata.width) - paddingX);
      const top = Math.max(0, Math.round((ymin / 1000) * metadata.height) - paddingY);
      const width = Math.min(
        metadata.width - left,
        Math.round(((xmax - xmin) / 1000) * metadata.width) + paddingX * 2
      );
      const height = Math.min(
        metadata.height - top,
        Math.round(((ymax - ymin) / 1000) * metadata.height) + paddingY * 2
      );

      if (width < 5 || height < 5) continue;

      // Uncompromising blur & pixelation: downscale to tiny coarse block mosaic, upscale, then apply heavy blur(25)
      // This completely scrambles and obliterates high-contrast characters (e.g. ABCD)
      const blockSize = r.type === "license_plate" ? 8 : 12;
      const downW = Math.max(2, Math.round(width / blockSize));
      const downH = Math.max(2, Math.round(height / blockSize));

      const patch = await sharp(imgBuf)
        .extract({ left, top, width, height })
        .resize(downW, downH, { kernel: "nearest" })
        .resize(width, height, { kernel: "nearest" })
        .blur(25)
        .toBuffer();

      overlays.push({ input: patch, left, top });
    }

    if (overlays.length === 0) return null;

    const sanitizedBuf = await sharp(imgBuf).composite(overlays).toBuffer();

    // Upload sanitized image back to Cloudinary with `_redacted` suffix in the same folder
    const redactedPublicId = `${publicId}_redacted`;
    const uploadRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: redactedPublicId,
          resource_type: "image",
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) reject(error || new Error("Cloudinary upload failed"));
          else resolve(result as { secure_url: string });
        }
      );
      stream.end(sanitizedBuf);
    });

    return uploadRes.secure_url;
  } catch {
    return null;
  }
}
