import { GrievanceCategory, GrievanceSeverity } from "@/constants";

export interface SerializedGrievance {
  _id: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  severity: GrievanceSeverity;
  status: string;
  reportedBy?: { _id: string; name: string; image?: string } | null;
  location: {
    coordinates: [number, number];
    address?: string;
    ward?: string;
    city?: string;
  };
  media: {
    publicId: string;
    originalSecureUrl: string;
    redactedSecureUrl?: string;
    resourceType: "image" | "video";
    isRedacted: boolean;
  };
  upvotedBy: string[];
  upvotesCount: number;
  createdAt: string;
}
