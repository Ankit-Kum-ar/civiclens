import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/database/User";
import { Account } from "@/database/Account";
import { USER_ROLES, ACCOUNT_TYPES } from "@/constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    // 1. Google OAuth Provider (Active and ready with your .env credentials)
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // 2. Credentials Provider (Email & Password for reliable instant testing)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const email = String(credentials.email).toLowerCase().trim();
        let user = await User.findOne({ email }).select("+passwordHash");

        // Seed demo accounts on-demand if logging in for the first time
        if (!user && (email === "aarav.citizen@civiclens.gov" || email === "municipalofficer@civiclens.gov")) {
          const isOfficer = email === "municipalofficer@civiclens.gov";
          const defaultHash = await bcrypt.hash("Password123!", 12);
          user = await User.create({
            name: isOfficer ? "Officer Rajesh Kumar" : "Aarav Sharma",
            email,
            passwordHash: defaultHash,
            role: isOfficer ? USER_ROLES.MUNICIPAL_OFFICER : USER_ROLES.CITIZEN,
            reputationPoints: isOfficer ? 100 : 15,
            ward: "Ward 32",
          });
        }

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || USER_ROLES.CITIZEN,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const email = user.email?.toLowerCase().trim();
        if (!email) return false;

        let existingUser = await User.findOne({ email });
        const adminEmails = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase());

        const assignedRole = adminEmails.includes(email)
          ? USER_ROLES.ADMIN
          : USER_ROLES.CITIZEN;

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name || "Civic User",
            email,
            image: user.image || "",
            role: assignedRole,
          });
        } else if (existingUser.role !== assignedRole) {
          existingUser.role = assignedRole;
          await existingUser.save();
        }
        user.role = existingUser.role;

        // Persist/Update OAuth Account in MongoDB
        await Account.findOneAndUpdate(
          {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
          {
            userId: existingUser._id,
            type: account.type || ACCOUNT_TYPES.OAUTH,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
          },
          { upsert: true, returnDocument: "after" }
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || USER_ROLES.CITIZEN;
      }
      if (token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email.toLowerCase().trim() });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = token.role || USER_ROLES.CITIZEN;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
