import mongoose, { Schema, Document, Model } from "mongoose";
import {
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_SEVERITY,
  GRIEVANCE_STATUS,
  MEDIA_RESOURCE_TYPES,
  type GrievanceCategory,
  type GrievanceSeverity,
  type GrievanceStatus,
  type MediaResourceType,
} from "@/constants";

export interface IGrievanceDocument extends Document {
  title: string;
  description: string;
  category: GrievanceCategory;
  severity: GrievanceSeverity;
  status: GrievanceStatus;
  reportedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude] GeoJSON
    address?: string;
    ward?: string;
    city?: string;
  };
  media: {
    publicId: string;
    originalSecureUrl: string;
    redactedSecureUrl?: string;
    resourceType: MediaResourceType;
    isRedacted: boolean;
  };
  aiTriage?: {
    audioPublicId?: string;
    audioSecureUrl?: string;
    transcript?: string;
    detectedCategory?: string;
    confidenceScore?: number;
  };
  upvotedBy: mongoose.Types.ObjectId[];
  upvotesCount: number;
  resolution?: {
    resolvedBy?: mongoose.Types.ObjectId;
    resolvedAt?: Date;
    proofPublicId?: string;
    proofSecureUrl?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, "GPS coordinates are required [lng, lat]"],
    },
    address: { type: String, default: "" },
    ward: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  { _id: false }
);

const MediaSchema = new Schema(
  {
    publicId: { type: String, required: true },
    originalSecureUrl: { type: String, required: true },
    redactedSecureUrl: { type: String },
    resourceType: {
      type: String,
      enum: Object.values(MEDIA_RESOURCE_TYPES),
      default: MEDIA_RESOURCE_TYPES.IMAGE,
      required: true,
    },
    isRedacted: { type: Boolean, default: false },
  },
  { _id: false }
);

const AiTriageSchema = new Schema(
  {
    audioPublicId: { type: String },
    audioSecureUrl: { type: String },
    transcript: { type: String, default: "" },
    detectedCategory: { type: String },
    confidenceScore: { type: Number, min: 0, max: 1 },
  },
  { _id: false }
);

const ResolutionSchema = new Schema(
  {
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
    proofPublicId: { type: String },
    proofSecureUrl: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

const GrievanceSchema = new Schema<IGrievanceDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [120, "Title cannot exceed 120 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1500, "Description cannot exceed 1500 characters"],
      trim: true,
    },
    category: {
      type: String,
      enum: GRIEVANCE_CATEGORIES,
      required: [true, "Category is required"],
      index: true,
    },
    severity: {
      type: String,
      enum: Object.values(GRIEVANCE_SEVERITY),
      default: GRIEVANCE_SEVERITY.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(GRIEVANCE_STATUS),
      default: GRIEVANCE_STATUS.OPEN,
      index: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporting user reference is required"],
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    media: {
      type: MediaSchema,
      required: true,
    },
    aiTriage: {
      type: AiTriageSchema,
    },
    upvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvotesCount: {
      type: Number,
      default: 0,
      index: true,
    },
    resolution: {
      type: ResolutionSchema,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial proximity & radius queries
GrievanceSchema.index({ location: "2dsphere" });
// Compound index for efficient municipal status & severity sorting
GrievanceSchema.index({ status: 1, severity: 1, createdAt: -1 });

export const Grievance: Model<IGrievanceDocument> =
  mongoose.models.Grievance ||
  mongoose.model<IGrievanceDocument>("Grievance", GrievanceSchema);
