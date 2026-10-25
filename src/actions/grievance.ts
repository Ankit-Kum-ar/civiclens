"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Grievance } from "@/database/Grievance";
import { ActivityLog } from "@/database/ActivityLog";
import { User } from "@/database/User";
import {
  GRIEVANCE_STATUS,
  ACTIVITY_ACTIONS,
  type MediaResourceType,
} from "@/constants";
import { getRedactedMediaUrl } from "@/lib/media";
import {
  createGrievanceSchema,
  type CreateGrievanceInput,
} from "@/lib/validations/grievance";

export interface CreateGrievanceResult {
  success: boolean;
  message?: string;
  grievanceId?: string;
  errors?: Record<string, string>;
}

/**
 * Server action to persist a citizen hazard grievance in MongoDB Atlas.
 */
export async function createGrievanceAction(
  input: CreateGrievanceInput
): Promise<CreateGrievanceResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to submit a grievance.",
      };
    }

    const parsed = createGrievanceSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      return {
        success: false,
        message: "Validation failed. Please verify your report fields.",
        errors: fieldErrors,
      };
    }

    const data = parsed.data;

    // Generate privacy-compliant edge redacted URL with AI detection
    const redactedSecureUrl = await getRedactedMediaUrl(
      data.media.publicId,
      data.media.resourceType as MediaResourceType,
      {
        coordinates: data.location.coordinates,
        ward: data.location.ward,
        originalSecureUrl: data.media.originalSecureUrl,
      }
    );

    await connectDB();

    const reporterObjectId = new mongoose.Types.ObjectId(session.user.id);

    // 1. Persist Grievance document
    const newGrievance = await Grievance.create({
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity,
      status: GRIEVANCE_STATUS.OPEN,
      reportedBy: reporterObjectId,
      location: {
        type: "Point",
        coordinates: data.location.coordinates,
        address: data.location.address,
        ward: data.location.ward,
        city: data.location.city,
      },
      media: {
        publicId: data.media.publicId,
        originalSecureUrl: data.media.originalSecureUrl,
        redactedSecureUrl,
        resourceType: data.media.resourceType,
        isRedacted: true,
      },
      aiTriage: data.aiTriage,
      upvotedBy: [reporterObjectId], // Automatically endorse reporter's own ticket
      upvotesCount: 1,
    });

    // 2. Append immutable timeline entry in ActivityLog
    await ActivityLog.create({
      grievanceId: newGrievance._id,
      performedBy: reporterObjectId,
      action: ACTIVITY_ACTIONS.CREATED,
      newStatus: GRIEVANCE_STATUS.OPEN,
      note: `Hazard reported by citizen: ${data.title}`,
    });

    // 3. Award citizen reputation points for verified submission
    await User.findByIdAndUpdate(reporterObjectId, {
      $inc: { reputationPoints: 10 },
    });

    revalidatePath("/explore");
    revalidatePath("/admin/dashboard");
    revalidatePath("/my-reports");

    return {
      success: true,
      message: "Grievance submitted and privacy-sanitized successfully!",
      grievanceId: String(newGrievance._id),
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err?.message || "Failed to create grievance. Please try again.",
    };
  }
}
