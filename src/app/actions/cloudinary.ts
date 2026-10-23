"use server";

import { cloudinary } from "@/lib/cloudinary";

export interface CloudinarySignatureResponse {
  success: boolean;
  timestamp?: number;
  signature?: string;
  apiKey?: string;
  cloudName?: string;
  folder?: string;
  uploadPreset?: string;
  error?: string;
}

/**
 * Server Action: Generates a cryptographically signed upload signature
 * for direct, authenticated client-side uploads to Cloudinary.
 *
 * Keeps CLOUDINARY_API_SECRET strictly server-side.
 */
export async function getCloudinaryUploadSignature(
  folder: string = "civiclens/reports"
): Promise<CloudinarySignatureResponse> {
  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!apiSecret || !apiKey || !cloudName) {
      return {
        success: false,
        error: "Cloudinary server configuration missing credentials.",
      };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Parameters to sign must match the parameters sent in the client POST request
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
    };

    if (uploadPreset) {
      paramsToSign.upload_preset = uploadPreset;
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return {
      success: true,
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder,
      uploadPreset: uploadPreset || undefined,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error generating signature";
    return {
      success: false,
      error: message,
    };
  }
}
