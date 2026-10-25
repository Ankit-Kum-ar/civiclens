import { z } from "zod";
import { GRIEVANCE_CATEGORIES } from "@/constants";

export const createGrievanceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1500, "Description cannot exceed 1500 characters"),
  category: z.enum(GRIEVANCE_CATEGORIES),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  location: z.object({
    coordinates: z
      .tuple([z.number(), z.number()])
      .refine(
        ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
        "Valid GPS coordinates are required [longitude, latitude]"
      ),
    address: z.string().trim().optional().default("Reported Field Location"),
    ward: z.string().trim().optional().default("Ward 32"),
    city: z.string().trim().optional().default("New Delhi"),
  }),
  media: z.object({
    publicId: z.string().min(1, "Media public ID is required"),
    originalSecureUrl: z.string().url("Valid media URL is required"),
    resourceType: z.enum(["image", "video"]).default("image"),
  }),
  aiTriage: z
    .object({
      audioPublicId: z.string().optional(),
      audioSecureUrl: z.string().url().optional(),
      transcript: z.string().optional(),
      detectedCategory: z.string().optional(),
      confidenceScore: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export type CreateGrievanceInput = z.infer<typeof createGrievanceSchema>;
