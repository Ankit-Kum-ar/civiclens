"use client";

import { SessionProvider as AuthSessionProvider } from "next-auth/react";

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
