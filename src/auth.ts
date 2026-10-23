import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/auth.config";
import { connectDB } from "@/lib/db";
import { SignInSchema } from "@/lib/validations/auth";
import { UserModel, AccountModel } from "@/models/user";
import type { UserRole } from "@/types/next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = SignInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        await connectDB();

        const user = await UserModel.findOne({ email: parsed.data.email }).select(
          "+password name email role ward image"
        );

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = await compare(parsed.data.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          ward: user.ward ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      await connectDB();

      const existingUser =
        (await UserModel.findOne({ email: user.email })) ||
        (await UserModel.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: "CITIZEN",
        }));

      if (account.providerAccountId) {
        const existingAccount = await AccountModel.findOne({
          provider: "google",
          providerAccountId: account.providerAccountId,
        });

        if (!existingAccount) {
          await AccountModel.create({
            userId: existingUser._id,
            type: account.type ?? "oauth",
            provider: "google",
            providerAccountId: account.providerAccountId,
          });
        }
      }

      user.id = existingUser._id.toString();
      user.role = existingUser.role as UserRole;
      user.ward = existingUser.ward ?? undefined;

      return true;
    },
    async jwt({ token, user }) {
      if (!token.email) {
        return token;
      }

      await connectDB();

      const dbUser = await UserModel.findOne({ email: token.email }).select("_id role ward");

      if (!dbUser) {
        return token;
      }

      token.id = dbUser._id.toString();
      token.role = dbUser.role as UserRole;
      token.ward = dbUser.ward ?? undefined;

      if (user?.role && !token.role) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user.id = typeof token.id === "string" ? token.id : "";
      session.user.role = (typeof token.role === "string" ? token.role : "CITIZEN") as UserRole;
      session.user.ward = typeof token.ward === "string" ? token.ward : undefined;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
