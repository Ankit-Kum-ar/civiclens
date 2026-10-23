import mongoose, { type InferSchemaType, type Model } from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["CITIZEN", "MUNICIPAL_OFFICER", "ADMIN"],
      default: "CITIZEN",
      required: true,
    },
    ward: { type: String },
  },
  { timestamps: true }
);

export const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true }
);

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };
export type AccountDoc = InferSchemaType<typeof accountSchema>;

export const UserModel =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", userSchema);

export const AccountModel =
  (mongoose.models.Account as Model<AccountDoc>) ||
  mongoose.model<AccountDoc>("Account", accountSchema);
