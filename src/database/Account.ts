import mongoose, { Schema, Document, Model } from "mongoose";
import {
  ACCOUNT_TYPES,
  type AccountType,
  type AuthProvider,
} from "@/constants";

export interface IAccountDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: AccountType;
  provider: AuthProvider | string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(ACCOUNT_TYPES),
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
  },
  {
    timestamps: true,
  }
);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const Account: Model<IAccountDocument> =
  mongoose.models.Account ||
  mongoose.model<IAccountDocument>("Account", AccountSchema);
