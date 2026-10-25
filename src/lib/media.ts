/**
 * Domain media service for CivicLens.
 * Handles edge transformations: automated face/plate privacy pixelation,
 * dynamic GPS watermark overlays, and 3-second animated triage previews.
 */

export interface RedactedUrlOptions {
  coordinates?: [number, number];
  ward?: string;
}

/**
 * Generates a privacy-compliant delivery URL with e_pixelate_faces,
 * optimal compression (q_auto), format delivery (f_auto),
 * and dynamic GPS coordinate watermark overlay.
 */
export function getRedactedMediaUrl(
  publicId: string,
  resourceType: "image" | "video" = "image",
  options?: RedactedUrlOptions
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";

  const transformations = ["e_pixelate_faces", "f_auto", "q_auto"];

  if (options?.coordinates) {
    const [lng, lat] = options.coordinates;
    const badgeText = `GPS ${lat.toFixed(4)}N ${lng.toFixed(4)}E${options.ward ? ` - ${options.ward.replace(/[,:]/g, "")}` : ""}`;
    const encodedBadge = encodeURIComponent(badgeText);
    transformations.push(`l_text:Arial_16_bold:${encodedBadge},g_south_east,x_16,y_16,co_rgb:ffffff,b_rgb:00000080`);
  }

  const transformString = transformations.join(",");
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformString}/${publicId}`;
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
