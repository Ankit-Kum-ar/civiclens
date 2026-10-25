import mongoose, { Schema, Document, Model } from "mongoose";
import { USER_ROLES, type UserRole } from "@/constants";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
  role: UserRole;
  ward?: string;
  city?: string;
  phone?: string;
  reputationPoints: number;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      select: false, // Don't return password by default in queries
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CITIZEN,
      index: true,
    },
    ward: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    reputationPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
