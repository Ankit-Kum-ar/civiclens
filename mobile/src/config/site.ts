/** Deployed API with /api routes. No .env required — override only if needed. */
const DEFAULT_API_URL = "https://civiclens-seven-taupe.vercel.app";

export const siteConfig = {
  name: "CivicLens",
  tagline: "Privacy-Compliant, AI-Triaged Citizen Infrastructure Reporting",
  description:
    "Empowering local communities to report street hazards with automated privacy redaction, vernacular voice transcription, and high-speed municipal triage.",
  apiUrl: process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL,
  defaultCoordinates: {
    lat: 28.6139,
    lng: 77.209,
    ward: "Ward 32",
    city: "New Delhi",
  },
  categories: [
    "Open Manhole",
    "Exposed Live Wire",
    "Crater Pothole",
    "Severe Waterlogging",
    "Illegal Garbage Dump",
    "Broken Streetlight",
    "Damaged Guardrail",
  ] as const,
  severities: ["LOW", "MEDIUM", "HIGH"] as const,
  statuses: ["OPEN", "IN_PROGRESS", "RESOLVED"] as const,
};

export type SiteConfig = typeof siteConfig;
