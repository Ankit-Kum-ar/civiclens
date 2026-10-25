import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Grievance } from "@/database/Grievance";
import "@/database/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const grievance = await Grievance.findById(id).populate(
      "reportedBy",
      "name email image"
    );

    if (!grievance) {
      return NextResponse.json(
        { success: false, error: "Grievance ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      grievance,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch grievance";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
