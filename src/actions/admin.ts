"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Grievance } from "@/database/Grievance";
import { User } from "@/database/User";
import { ActivityLog } from "@/database/ActivityLog";
import { USER_ROLES } from "@/constants";
import mongoose from "mongoose";

export interface AdminDashboardData {
  counts: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    rejected: number;
    highUrgency: number;
  };
  grievances: Array<{
    _id: string;
    title: string;
    category: string;
    severity: string;
    status: string;
    reportedBy?: {
      name: string;
      email: string;
    } | null;
    location: {
      address?: string;
      ward?: string;
    };
    media: {
      originalSecureUrl: string;
      redactedSecureUrl?: string;
      resourceType?: "image" | "video";
    };
    upvotesCount: number;
    createdAt: string;
    assignedDepartment?: string;
  }>;
}

export async function getAdminDashboardDataAction(filters?: {
  status?: string;
  severity?: string;
  category?: string;
  ward?: string;
}): Promise<{
  success: boolean;
  data?: AdminDashboardData;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized. Please sign in." };
    }

    await connectToDatabase();

    const currentUser = await User.findById(session.user.id).lean();
    if (
      !currentUser ||
      (currentUser.role !== USER_ROLES.ADMIN &&
        currentUser.role !== USER_ROLES.MUNICIPAL_OFFICER)
    ) {
      return { success: false, message: "Forbidden: Admin access required." };
    }

    // Build filter query
    const query: Record<string, unknown> = {};
    if (filters?.status && filters.status !== "ALL") {
      query.status = filters.status;
    }
    if (filters?.severity && filters.severity !== "ALL") {
      query.severity = filters.severity;
    }
    if (filters?.category && filters.category !== "ALL") {
      query.category = filters.category;
    }
    if (filters?.ward && filters.ward !== "ALL") {
      query["location.ward"] = filters.ward;
    }

    // Metric counts across system
    const allGrievances = await Grievance.find({}).lean();
    const counts = {
      total: allGrievances.length,
      open: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0,
      highUrgency: 0,
    };

    allGrievances.forEach((g) => {
      if (g.status === "OPEN") counts.open++;
      if (g.status === "IN_PROGRESS") counts.inProgress++;
      if (g.status === "RESOLVED") counts.resolved++;
      if (g.status === "REJECTED") counts.rejected++;
      if (g.severity === "HIGH") counts.highUrgency++;
    });

    // Query filtered grievances
    const grievancesList = await Grievance.find(query)
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = grievancesList.map((g) => ({
      _id: g._id.toString(),
      title: g.title,
      category: g.category,
      severity: g.severity,
      status: g.status,
      reportedBy: g.reportedBy
        ? {
            name: (g.reportedBy as unknown as { name: string }).name,
            email: (g.reportedBy as unknown as { email: string }).email,
          }
        : null,
      location: {
        address: g.location?.address,
        ward: g.location?.ward,
      },
      media: {
        originalSecureUrl: g.media?.originalSecureUrl || "",
        redactedSecureUrl: g.media?.redactedSecureUrl,
        resourceType: g.media?.resourceType,
      },
      upvotesCount: g.upvotesCount || 0,
      createdAt: g.createdAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        counts,
        grievances: mapped,
      },
    };
  } catch (error) {
    console.error("getAdminDashboardDataAction error:", error);
    return { success: false, message: "Failed to load admin triage data." };
  }
}

export async function updateGrievanceStatusAction(
  grievanceId: string,
  newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED",
  notes?: string
): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized." };
    }

    await connectToDatabase();

    const currentUser = await User.findById(session.user.id).lean();
    if (
      !currentUser ||
      (currentUser.role !== USER_ROLES.ADMIN &&
        currentUser.role !== USER_ROLES.MUNICIPAL_OFFICER)
    ) {
      return { success: false, message: "Forbidden: Admin role required." };
    }

    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return { success: false, message: "Grievance not found." };
    }

    const previousStatus = grievance.status;
    grievance.status = newStatus;
    await grievance.save();

    // Create Audit ActivityLog
    await ActivityLog.create({
      grievanceId: grievance._id,
      performedBy: new mongoose.Types.ObjectId(session.user.id),
      action: "STATUS_UPDATED",
      previousStatus,
      newStatus,
      note: notes || `Status updated from ${previousStatus} to ${newStatus}`,
    });

    // If marked RESOLVED, award citizen reputation points
    if (newStatus === "RESOLVED" && grievance.reportedBy) {
      await User.findByIdAndUpdate(grievance.reportedBy, {
        $inc: { reputationPoints: 50 },
      });
    }

    return {
      success: true,
      message: `Status updated to ${newStatus}.`,
    };
  } catch (error) {
    console.error("updateGrievanceStatusAction error:", error);
    return { success: false, message: "Failed to update grievance status." };
  }
}
