import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "CITIZEN" | "MUNICIPAL_OFFICER" | "ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
  role: UserRole;
  ward?: string;
  city?: string;
  phone?: string;
  reputationPoints: number;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
      select: false,
    },
    image: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["CITIZEN", "MUNICIPAL_OFFICER", "ADMIN"],
        message: "{VALUE} is not a valid user role",
      },
      default: "CITIZEN",
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
    },
    emailVerified: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
