import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/db";
import { SignUpSchema } from "@/lib/validations/auth";
import { UserModel } from "@/models/user";
import { handleApiError } from "@/lib/handlers/error";
import { RequestError } from "@/lib/http-errors";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // 1. Validate payload against Zod SignUpSchema
    const validated = SignUpSchema.parse(json);

    // 2. Connect to MongoDB
    await connectDB();

    // 3. Check for existing user by email
    const existingUser = await UserModel.findOne({ email: validated.email });
    if (existingUser) {
      throw new RequestError("A user with this email address already exists", 409);
    }

    // 4. Hash password with bcrypt
    const hashedPassword = await hash(validated.password, 12);

    // 5. Create user record
    const newUser = await UserModel.create({
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      ward: validated.ward || undefined,
      role: "CITIZEN",
    });

    logger.info(
      { userId: newUser._id, email: newUser.email },
      "User registered successfully"
    );

    // 6. Return sanitized user data (exclude password)
    return NextResponse.json(
      {
        success: true,
        data: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          ward: newUser.ward,
        },
        message: "Account registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, { context: "RegisterAPI" });
  }
}
