import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";
import { logger } from "@/lib/logger";

let isConfigured = false;

/**
 * Configure and connect Cloudinary instance.
 * Supports CLOUDINARY_CLOUD_NAME / CLOUD_NAME, CLOUDINARY_API_KEY / API_KEY, CLOUDINARY_API_SECRET / API_SECRET.
 */
export function cloudinaryConnect() {
  try {
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
    const apiSecret =
      process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      logger.warn("Cloudinary credentials missing in environment variables");
      return cloudinary;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    isConfigured = true;
    return cloudinary;
  } catch (error) {
    logger.error({ err: error }, "Error connecting to Cloudinary");
    return cloudinary;
  }
}

// Auto-initialize configuration on import
cloudinaryConnect();

export interface UploadOptions {
  height?: number;
  quality?: number | string;
  resource_type?: "auto" | "image" | "video" | "raw";
}

/**
 * Uploads an image/media file to Cloudinary.
 * Accepts a file path or base64/data URI string and optional height/quality transformations.
 */
export async function uploadImageToCloudinary(
  filePathOrData: string,
  folder: string = process.env.FOLDER_NAME || "civiclens",
  height?: number,
  quality?: number | string
): Promise<UploadApiResponse> {
  cloudinaryConnect();

  const options: UploadApiOptions = { folder };

  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(filePathOrData, options);
}

export { cloudinary, isConfigured };
export default cloudinary;
