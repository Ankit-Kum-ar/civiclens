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

/**
 * Toggles a citizen's upvote/endorsement on an existing grievance.
 * Used for duplicate prevention and community prioritization.
 */
export async function toggleUpvoteGrievanceAction(grievanceId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required to upvote." };
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const gId = new mongoose.Types.ObjectId(grievanceId);

    const grievance = await Grievance.findById(gId);
    if (!grievance) {
      return { success: false, message: "Grievance ticket not found." };
    }

    const alreadyUpvoted = grievance.upvotedBy.some((id: mongoose.Types.ObjectId) =>
      id.equals(userId)
    );

    if (alreadyUpvoted) {
      grievance.upvotedBy = grievance.upvotedBy.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
      grievance.upvotesCount = Math.max(0, grievance.upvotesCount - 1);
      await grievance.save();

      // Deduct reputation points
      await User.findByIdAndUpdate(userId, { $inc: { reputationPoints: -2 } });

      revalidatePath("/explore");
      revalidatePath("/my-reports");

      return {
        success: true,
        upvoted: false,
        upvotesCount: grievance.upvotesCount,
      };
    } else {
      grievance.upvotedBy.push(userId);
      grievance.upvotesCount += 1;
      await grievance.save();

      // Reward community endorsement
      await User.findByIdAndUpdate(userId, { $inc: { reputationPoints: 2 } });

      // Log endorsement activity
      await ActivityLog.create({
        grievanceId: gId,
        performedBy: userId,
        action: ACTIVITY_ACTIONS.COMMENTED,
        note: "Citizen endorsed this community report.",
      });

      revalidatePath("/explore");
      revalidatePath("/my-reports");

      return {
        success: true,
        upvoted: true,
        upvotesCount: grievance.upvotesCount,
      };
    }
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to update upvote status.",
    };
  }
}

export interface GrievanceFeedFilters {
  category?: string;
  severity?: string;
  status?: string;
  ward?: string;
  sortBy?: "upvotes" | "latest";
}

/**
 * Retrieves the public civic feed of reported grievances.
 */
export async function getGrievancesFeedAction(filters?: GrievanceFeedFilters) {
  try {
    await connectDB();

    const query: Record<string, unknown> = {};

    if (filters?.category && filters.category !== "ALL") {
      query.category = filters.category;
    }
    if (filters?.severity && filters.severity !== "ALL") {
      query.severity = filters.severity;
    }
    if (filters?.status && filters.status !== "ALL") {
      query.status = filters.status;
    }
    if (filters?.ward && filters.ward !== "ALL") {
      query["location.ward"] = filters.ward;
    }

    const sortOptions: Record<string, 1 | -1> =
      filters?.sortBy === "upvotes"
        ? { upvotesCount: -1, createdAt: -1 }
        : { createdAt: -1 };

    const items = await Grievance.find(query)
      .sort(sortOptions)
      .limit(60)
      .populate("reportedBy", "name image")
      .lean();

    const serialized = items.map((doc) => ({
      ...doc,
      _id: String(doc._id),
      reportedBy: doc.reportedBy
        ? {
            _id: String((doc.reportedBy as { _id?: unknown })._id),
            name: (doc.reportedBy as { name?: string }).name || "Citizen",
            image: (doc.reportedBy as { image?: string }).image || "",
          }
        : null,
      upvotedBy: Array.isArray(doc.upvotedBy)
        ? doc.upvotedBy.map((id) => String(id))
        : [],
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, grievances: serialized };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, grievances: [], error: err.message };
  }
}

/**
 * Retrieves grievances filed or endorsed by the current authenticated citizen.
 */
export async function getUserGrievancesAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required." };
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const [submitted, endorsed, userDoc] = await Promise.all([
      Grievance.find({ reportedBy: userId }).sort({ createdAt: -1 }).lean(),
      Grievance.find({ upvotedBy: userId, reportedBy: { $ne: userId } })
        .sort({ createdAt: -1 })
        .lean(),
      User.findById(userId).select("reputationPoints role ward").lean(),
    ]);

    const serialize = (arr: typeof submitted) =>
      arr.map((doc) => ({
        ...doc,
        _id: String(doc._id),
        reportedBy: String(doc.reportedBy),
        upvotedBy: Array.isArray(doc.upvotedBy) ? doc.upvotedBy.map((id) => String(id)) : [],
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
      }));

    return {
      success: true,
      submitted: serialize(submitted),
      endorsed: serialize(endorsed),
      reputationPoints: userDoc?.reputationPoints || 0,
      userRole: userDoc?.role || "CITIZEN",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

