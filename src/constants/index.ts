/**
 * System-wide constant definitions for CivicLens.
 */

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  REPORT: "/report",
  EXPLORE: "/explore",
  MY_REPORTS: "/my-reports",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const USER_ROLES = {
  CITIZEN: "CITIZEN",
  MUNICIPAL_OFFICER: "MUNICIPAL_OFFICER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ACCOUNT_TYPES = {
  OAUTH: "oauth",
  CREDENTIALS: "credentials",
} as const;

export type AccountType = (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];

export const AUTH_PROVIDERS = {
  GOOGLE: "google",
  CREDENTIALS: "credentials",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

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

export const GRIEVANCE_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type GrievanceSeverity =
  (typeof GRIEVANCE_SEVERITY)[keyof typeof GRIEVANCE_SEVERITY];

export const GRIEVANCE_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;

export type GrievanceStatus =
  (typeof GRIEVANCE_STATUS)[keyof typeof GRIEVANCE_STATUS];

export const MEDIA_RESOURCE_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
} as const;

export type MediaResourceType =
  (typeof MEDIA_RESOURCE_TYPES)[keyof typeof MEDIA_RESOURCE_TYPES];

export const ACTIVITY_ACTIONS = {
  CREATED: "CREATED",
  STATUS_UPDATED: "STATUS_UPDATED",
  SEVERITY_CHANGED: "SEVERITY_CHANGED",
  ASSIGNED: "ASSIGNED",
  RESOLVED: "RESOLVED",
  COMMENTED: "COMMENTED",
  REJECTED: "REJECTED",
} as const;

export type ActivityAction =
  (typeof ACTIVITY_ACTIONS)[keyof typeof ACTIVITY_ACTIONS];
