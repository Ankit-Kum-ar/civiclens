import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  provider: string;
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

const AccountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Account type is required"],
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
    },
    providerAccountId: {
      type: String,
      required: [true, "providerAccountId is required"],
    },
    refresh_token: {
      type: String,
    },
    access_token: {
      type: String,
    },
    expires_at: {
      type: Number,
    },
    token_type: {
      type: String,
    },
    scope: {
      type: String,
    },
    id_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for OAuth provider accounts
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const Account: Model<IAccount> =
  (mongoose.models.Account as Model<IAccount>) ||
  mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
