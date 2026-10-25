import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary Node SDK with strict environment credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface SignedUploadResult {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Pure infrastructure helper: Computes an immutable SHA signature
 * for direct-to-cloud client uploads.
 */
export function signUploadParameters(
  paramsToSign: Record<string, string | number>
): string {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error("Missing CLOUDINARY_API_SECRET in environment variables");
  }
  return cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
}
