import type {
  UserRole,
  AccountType,
  AuthProvider,
  GrievanceCategory,
  GrievanceSeverity,
  GrievanceStatus,
  MediaResourceType,
  ActivityAction,
} from "@/constants";

declare global {
  /**
   * User Domain
   */
  export interface IUser {
    _id: string;
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

  /**
   * Account Domain (NextAuth Account mapping)
   */
  export interface IAccount {
    _id: string;
    userId: string;
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

  /**
   * Subdocuments for Grievance
   */
  export interface IGeoJSONPoint {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude] GeoJSON
    address?: string;
    ward?: string;
    city?: string;
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
    resolvedBy?: string;
    resolvedAt?: Date;
    proofPublicId?: string;
    proofSecureUrl?: string;
    notes?: string;
  }

  /**
   * Grievance Domain
   */
  export interface IGrievance {
    _id: string;
    title: string;
    description: string;
    category: GrievanceCategory;
    severity: GrievanceSeverity;
    status: GrievanceStatus;
    reportedBy: string;
    assignedTo?: string;
    location: IGeoJSONPoint;
    media: IGrievanceMedia;
    aiTriage?: IAiTriage;
    upvotedBy: string[];
    upvotesCount: number;
    resolution?: IResolution;
    createdAt: Date;
    updatedAt: Date;
  }

  /**
   * Activity Log Domain
   */
  export interface IActivityLog {
    _id: string;
    grievanceId: string;
    performedBy: string;
    action: ActivityAction;
    previousStatus?: string;
    newStatus?: string;
    note?: string;
    createdAt: Date;
  }
}

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

export type {
  UserRole,
  AccountType,
  AuthProvider,
  GrievanceCategory,
  GrievanceSeverity,
  GrievanceStatus,
  MediaResourceType,
  ActivityAction,
};

