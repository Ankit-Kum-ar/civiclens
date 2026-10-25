/**
 * Domain media service for CivicLens.
 * Handles edge transformations: automated face/plate privacy pixelation,
 * dynamic GPS watermark overlays, and 3-second animated triage previews.
 */

import type { DetectedRegion } from "./aiPrivacy";

export interface RedactedUrlOptions {
  coordinates?: [number, number];
  ward?: string;
  originalSecureUrl?: string;
  clientRegions?: DetectedRegion[];
}

export function sanitizeClientRegions(input: unknown): DetectedRegion[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 50).flatMap((r: any) => {
    const b = r?.box_2d;
    if (!Array.isArray(b) || b.length !== 4 || !b.every(Number.isFinite)) return [];
    const [y0, x0, y1, x1] = b.map((n: number) => Math.min(1000, Math.max(0, Math.round(n))));
    return y1 > y0 && x1 > x0 ? [{ type: "face", box_2d: [y0, x0, y1, x1] } as DetectedRegion] : [];
  });
}

/**
 * Generates an AI-sanitized privacy-compliant delivery URL.
 * Automatically runs OpenRouter Vision (google/gemini-2.5-flash) and Sharp to:
 * - Redact and blur faces at any angle (front, profile, tilted, downward)
 * - Redact and blur vehicle license plates
 * - Redact and blur house / address numbers
 * - Stamp dynamic GPS coordinate watermark overlay
 */
export async function getRedactedMediaUrl(
  publicId: string,
  resourceType: "image" | "video" = "image",
  options?: RedactedUrlOptions
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";

  let targetPublicId = publicId;

  // 1. Detect and blur regions directly onto image buffer via Vision AI + MediaPipe + Sharp
  if (options?.originalSecureUrl && resourceType === "image") {
    try {
      const { detectPrivacyRegions, generateAndUploadSanitizedImage } = await import("./aiPrivacy");
      
      const aiRegions = await detectPrivacyRegions(options.originalSecureUrl);
      const clientMediaPipeRegions = sanitizeClientRegions(options.clientRegions);
      
      // Combine Vision AI OR MediaPipe detected regions
      const regions = [...clientMediaPipeRegions, ...aiRegions];
      console.log(
        `[AI OR MediaPipe Privacy] Total regions: ${regions.length} (MediaPipe: ${clientMediaPipeRegions.length}, AI: ${aiRegions.length})`
      );

      if (regions && regions.length > 0) {
        const sanitizedUrl = await generateAndUploadSanitizedImage(
          options.originalSecureUrl,
          publicId,
          regions
        );
        if (sanitizedUrl) {
          targetPublicId = `${publicId}_redacted`;
          console.log("[AI Privacy] Successfully uploaded sanitized image:", targetPublicId);
        }
      }
    } catch (err) {
      console.error("[AI Privacy] Error processing image privacy:", err);
    }
  }

  // 2. Build Cloudinary delivery URL with optional GPS watermark
  const transformations: string[] = [];

  // If AI sharp upload wasn't used, also include Cloudinary's native face pixelation transform
  if (targetPublicId === publicId) {
    transformations.push("e_pixelate_faces:15");
  }

  if (options?.coordinates) {
    const [lng, lat] = options.coordinates;
    const badgeText = `GPS ${lat.toFixed(4)}N ${lng.toFixed(4)}E${options.ward ? ` - ${options.ward.replace(/[,:]/g, "")}` : ""}`;
    const encodedBadge = encodeURIComponent(badgeText);
    transformations.push(`l_text:Arial_16_bold:${encodedBadge},g_south_east,x_16,y_16,co_rgb:ffffff,b_rgb:00000080`);
  }

  transformations.push("f_auto", "q_auto");
  const transformString = transformations.join(",");

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformString}/${targetPublicId}`;
}

/**
 * Builds an ultra-lightweight 3-second animated preview snippet URL
 * for high-speed triage on the municipal engineer dashboard.
 * Uses Cloudinary edge transform: so_0,du_3,e_preview.
 */
export function getPreviewSnippetUrl(publicId: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,du_3,e_preview,f_auto,q_auto/${publicId}.mp4`;
}
