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
    'Locate precise bounding boxes for privacy redaction in this image: ' +
    '1) Human heads/faces (from forehead to chin, ear to ear - only head/face, NOT body), ' +
    '2) Vehicle license/registration number plates, ' +
    '3) Street house address numbers. ' +
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
        max_tokens: 1000,
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

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return Array.isArray(parsed.regions) ? parsed.regions : [];
  } catch {
    return [];
  }
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
    const imgBuf = Buffer.from(arrayBuffer);

    const metadata = await sharp(imgBuf).metadata();
    if (!metadata.width || !metadata.height) return null;

    const overlays: OverlayOptions[] = [];

    for (const r of regions) {
      const [ymin, xmin, ymax, xmax] = r.box_2d;
      const paddingX = Math.round(((xmax - xmin) / 1000) * metadata.width * 0.12);
      const paddingY = Math.round(((ymax - ymin) / 1000) * metadata.height * 0.12);

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

      // Extract bounding box region, downscale-upscale for pixelation, and apply Gaussian blur
      const patch = await sharp(imgBuf)
        .extract({ left, top, width, height })
        .resize(Math.max(1, Math.round(width / 6)), Math.max(1, Math.round(height / 6)), {
          kernel: "nearest",
        })
        .resize(width, height, { kernel: "nearest" })
        .blur(4)
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
