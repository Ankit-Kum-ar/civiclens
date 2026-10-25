import mongoose, { Schema, Document, Model } from "mongoose";
import { ACTIVITY_ACTIONS, type ActivityAction } from "@/constants";

export interface IActivityLogDocument extends Document {
  grievanceId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  action: ActivityAction;
  previousStatus?: string;
  newStatus?: string;
  note?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    grievanceId: {
      type: Schema.Types.ObjectId,
      ref: "Grievance",
      required: true,
      index: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(ACTIVITY_ACTIONS),
      required: true,
    },
    previousStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Logs are append-only audit records
  }
);

ActivityLogSchema.index({ grievanceId: 1, createdAt: -1 });

export const ActivityLog: Model<IActivityLogDocument> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLogDocument>("ActivityLog", ActivityLogSchema);
