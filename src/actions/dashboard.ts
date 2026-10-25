"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Grievance } from "@/database/Grievance";
import { User } from "@/database/User";
import mongoose from "mongoose";

export interface CitizenDashboardStats {
  totalReported: number;
  totalEndorsements: number;
  resolvedCount: number;
  inProgressCount: number;
  reputationPoints: number;
  recentGrievances: Array<{
    _id: string;
    title: string;
    category: string;
    severity: string;
    status: string;
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
  }>;
}

export async function getCitizenDashboardStatsAction(): Promise<{
  success: boolean;
  stats?: CitizenDashboardStats;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized. Please sign in." };
    }

    await connectToDatabase();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Fetch user for reputation points
    const userDoc = await User.findById(userId).lean();
    const reputationPoints = userDoc?.reputationPoints ?? 0;

    // Aggregate user's reports count by status
    const submittedReports = await Grievance.find({ reportedBy: userId }).lean();

    const totalReported = submittedReports.length;
    let totalEndorsements = 0;
    let resolvedCount = 0;
    let inProgressCount = 0;

    submittedReports.forEach((r) => {
      totalEndorsements += r.upvotesCount || 0;
      if (r.status === "RESOLVED") resolvedCount++;
      if (r.status === "IN_PROGRESS") inProgressCount++;
    });

    // Recent 5 grievances across user's ward or overall
    const recent = await Grievance.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentGrievances = recent.map((g) => ({
      _id: g._id.toString(),
      title: g.title,
      category: g.category,
      severity: g.severity,
      status: g.status,
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
      stats: {
        totalReported,
        totalEndorsements,
        resolvedCount,
        inProgressCount,
        reputationPoints,
        recentGrievances,
      },
    };
  } catch (error) {
    console.error("getCitizenDashboardStatsAction error:", error);
    return { success: false, message: "Failed to load dashboard metrics." };
  }
}
