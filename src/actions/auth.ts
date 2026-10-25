"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/database/User";
import { USER_ROLES } from "@/constants";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  redirectTo?: string;
}

/**
 * Server action to register a new user in MongoDB Atlas.
 */
export async function registerUserAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      agreeTerms: formData.get("agreeTerms") === "true" || formData.get("agreeTerms") === "on",
    };

    const parsed = registerSchema.safeParse(rawData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return {
        success: false,
        message: "Please fix the validation errors below.",
        errors: fieldErrors,
      };
    }

    const { firstName, lastName, email, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();
    const fullName = `${firstName} ${lastName}`.trim();

    await connectDB();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return {
        success: false,
        message: "An account with this email address already exists.",
        errors: { email: "Email is already registered" },
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const role = adminEmails.includes(cleanEmail)
      ? USER_ROLES.ADMIN
      : USER_ROLES.CITIZEN;

    await User.create({
      name: fullName,
      email: cleanEmail,
      passwordHash,
      role,
      reputationPoints: 0,
    });

    return {
      success: true,
      message: "Account created successfully! You can now log in.",
      redirectTo: "/login?registered=true",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err?.message || "An unexpected error occurred during registration.",
    };
  }
}

/**
 * Server action to log in with Email & Password.
 */
export async function loginWithCredentialsAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get("email");
  const password = formData.get("password");

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Invalid input",
      errors: fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return {
      success: true,
      redirectTo: "/",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password. Please check your credentials.",
          };
        default:
          return {
            success: false,
            message: "Authentication failed. Please try again.",
          };
      }
    }
    // If NextAuth throws redirect, let it pass through
    throw error;
  }
}

/**
 * Server action to initiate Google OAuth.
 */
export async function signInWithGoogleAction(): Promise<void> {
  await signIn("google", { redirectTo: "/" });
}

/**
 * Server action to log out user.
 */
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
