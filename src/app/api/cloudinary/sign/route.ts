import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { signUploadParameters } from "@/lib/cloudinary";

/**
 * Generates signed Cloudinary upload credentials.
 * Security enforcement: The target folder is strictly determined on the server
 * and scoped to the authenticated user ID. Client inputs for folder are completely ignored.
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to upload media." },
        { status: 401 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiKey || !cloudName) {
      return NextResponse.json(
        { success: false, error: "Cloudinary is not properly configured on the server." },
        { status: 500 }
      );
    }

    // Security: Server-enforced directory strictly isolated to the authenticated user
    const folder = `civiclens/grievances/${session.user.id}`;

    const signature = signUploadParameters({
      folder,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate upload signature";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
