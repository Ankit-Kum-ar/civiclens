import mongoose, { Schema, Document, Model } from "mongoose";

export const ACTIVITY_LOG_ACTIONS = [
  "CREATED",
  "STATUS_UPDATED",
  "SEVERITY_CHANGED",
  "ASSIGNED",
  "RESOLVED",
  "COMMENTED",
  "REJECTED",
] as const;

export type ActivityLogAction = (typeof ACTIVITY_LOG_ACTIONS)[number];

export interface IActivityLog extends Document {
  grievanceId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  action: ActivityLogAction;
  previousStatus?: string;
  newStatus?: string;
  note?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    grievanceId: {
      type: Schema.Types.ObjectId,
      ref: "Grievance",
      required: [true, "grievanceId is required"],
      index: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "performedBy is required"],
      index: true,
    },
    action: {
      type: String,
      required: [true, "action is required"],
      enum: {
        values: ACTIVITY_LOG_ACTIONS,
        message: "{VALUE} is not a valid activity log action",
      },
      index: true,
    },
    previousStatus: {
      type: String,
      trim: true,
    },
    newStatus: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound index for timeline queries on a grievance
ActivityLogSchema.index({ grievanceId: 1, createdAt: -1 });

export const ActivityLog: Model<IActivityLog> =
  (mongoose.models.ActivityLog as Model<IActivityLog>) ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
