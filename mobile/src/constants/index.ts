export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  REPORT: "/report",
  EXPLORE: "/explore",
  MY_REPORTS: "/my-reports",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

export const USER_ROLES = {
  CITIZEN: "CITIZEN",
  MUNICIPAL_OFFICER: "MUNICIPAL_OFFICER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

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
