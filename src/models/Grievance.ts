import mongoose, { Schema, Document, Model } from "mongoose";

export const GRIEVANCE_CATEGORIES = [
  "Open Manhole",
  "Exposed Live Wire",
  "Crater Pothole",
  "Severe Waterlogging",
  "Illegal Garbage Dump",
  "Broken Streetlight",
  "Damaged Guardrail",
] as const;

export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number];
export type GrievanceSeverity = "LOW" | "MEDIUM" | "HIGH";
export type GrievanceStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
export type MediaResourceType = "image" | "video";

export interface IGrievanceLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude] GeoJSON
  address: string;
  ward: string;
  city: string;
}

export interface IGrievanceMedia {
  publicId: string;
  originalSecureUrl: string;
  redactedSecureUrl?: string;
  resourceType: MediaResourceType;
  isRedacted: boolean;
}

export interface IAiTriage {
  audioPublicId?: string;
  audioSecureUrl?: string;
  transcript?: string;
  detectedCategory?: string;
  confidenceScore?: number;
}

export interface IResolution {
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  proofPublicId?: string;
  proofSecureUrl?: string;
  notes?: string;
}

export interface IGrievance extends Document {
  title: string;
  description: string;
  category: GrievanceCategory;
  severity: GrievanceSeverity;
  status: GrievanceStatus;
  reportedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  location: IGrievanceLocation;
  media: IGrievanceMedia;
  aiTriage?: IAiTriage;
  upvotedBy: mongoose.Types.ObjectId[];
  upvotesCount: number;
  resolution?: IResolution;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<IGrievanceLocation>(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, "Location coordinates are required"],
      validate: {
        validator: function (val: number[]) {
          return (
            Array.isArray(val) &&
            val.length === 2 &&
            val[0] >= -180 &&
            val[0] <= 180 &&
            val[1] >= -90 &&
            val[1] <= 90
          );
        },
        message: "Coordinates must be [longitude, latitude] within valid ranges",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    ward: {
      type: String,
      required: [true, "Ward is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
  },
  { _id: false }
);

const MediaSchema = new Schema<IGrievanceMedia>(
  {
    publicId: {
      type: String,
      required: [true, "Media publicId is required"],
      trim: true,
    },
    originalSecureUrl: {
      type: String,
      required: [true, "Media originalSecureUrl is required"],
      trim: true,
    },
    redactedSecureUrl: {
      type: String,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
      required: true,
    },
    isRedacted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const AiTriageSchema = new Schema<IAiTriage>(
  {
    audioPublicId: {
      type: String,
      trim: true,
    },
    audioSecureUrl: {
      type: String,
      trim: true,
    },
    transcript: {
      type: String,
      trim: true,
    },
    detectedCategory: {
      type: String,
      trim: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  { _id: false }
);

const ResolutionSchema = new Schema<IResolution>(
  {
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
    proofPublicId: {
      type: String,
      trim: true,
    },
    proofSecureUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const GrievanceSchema = new Schema<IGrievance>(
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
      required: [true, "Category is required"],
      enum: {
        values: GRIEVANCE_CATEGORIES,
        message: "{VALUE} is not a valid grievance category",
      },
      index: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
      index: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "OPEN",
      index: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "reportedBy is required"],
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    location: {
      type: LocationSchema,
      required: [true, "Location subdocument is required"],
    },
    media: {
      type: MediaSchema,
      required: [true, "Media subdocument is required"],
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

// 2dsphere spatial index for geospatial proximity queries
GrievanceSchema.index({ location: "2dsphere" });
// Index createdAt for chronological sorting and queries
GrievanceSchema.index({ createdAt: -1 });

export const Grievance: Model<IGrievance> =
  (mongoose.models.Grievance as Model<IGrievance>) ||
  mongoose.model<IGrievance>("Grievance", GrievanceSchema);

export default Grievance;
