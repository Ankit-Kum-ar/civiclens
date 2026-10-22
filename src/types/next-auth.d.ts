import { DefaultSession } from "next-auth";

export type UserRole = "CITIZEN" | "MUNICIPAL_OFFICER" | "ADMIN";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    ward?: string;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      ward?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    ward?: string;
  }
}
