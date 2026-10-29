import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthUser,
  getSession,
  getStoredUser,
  loginWithCredentials,
  logout as apiLogout,
  registerAccount,
  setStoredUser,
} from "@/lib/api";
import { USER_ROLES } from "@/constants";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOfficer: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    agreeTerms: boolean;
  }) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const cached = await getStoredUser();
    if (cached) setUser(cached);
    const session = await getSession();
    if (session?.user) {
      setUser(session.user);
      await setStoredUser(session.user);
    } else if (!cached) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refresh();
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await loginWithCredentials(email, password);
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(
    async (input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      agreeTerms: boolean;
    }) => {
      const res = await registerAccount(input);
      if (!res.success) {
        throw new Error(res.error || "Failed to create account");
      }
      return signIn(input.email, input.password);
    },
    [signIn]
  );

  const signOut = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const role = user?.role || USER_ROLES.CITIZEN;
  const isOfficer =
    role === USER_ROLES.ADMIN || role === USER_ROLES.MUNICIPAL_OFFICER;

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isOfficer,
      signIn,
      signUp,
      signOut,
      refresh,
    }),
    [user, loading, isOfficer, signIn, signUp, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
