import { Platform } from "react-native";
import { siteConfig } from "@/config/site";
import { USER_ROLES } from "@/constants";

const COOKIE_KEY = "civiclens_session_cookie";
const USER_KEY = "civiclens_user";
const DEMO_MODE_KEY = "civiclens_demo_mode";

export const API_BASE = siteConfig.apiUrl.replace(/\/$/, "");

/** SecureStore on native; localStorage on web (Expo web has no Keychain) */
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      try {
        return globalThis.localStorage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    }
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      try {
        globalThis.localStorage?.setItem(key, value);
      } catch {
        // ignore
      }
      return;
    }
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key: string) {
    if (Platform.OS === "web") {
      try {
        globalThis.localStorage?.removeItem(key);
      } catch {
        // ignore
      }
      return;
    }
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync(key);
  },
};

export type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  image?: string | null;
};

/**
 * Demo accounts (same as web login Auto-fill).
 * Used when the API host has no /api routes (current civiclens.vercel.app deploy).
 */
const DEMO_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  "aarav.citizen@civiclens.gov": {
    password: "Password123!",
    user: {
      id: "demo-citizen",
      name: "Aarav Sharma",
      email: "aarav.citizen@civiclens.gov",
      role: USER_ROLES.CITIZEN,
    },
  },
  "municipalofficer@civiclens.gov": {
    password: "Password123!",
    user: {
      id: "demo-officer",
      name: "Officer Rajesh Kumar",
      email: "municipalofficer@civiclens.gov",
      role: USER_ROLES.MUNICIPAL_OFFICER,
    },
  },
};

async function safeJson<T = unknown>(
  res: Response
): Promise<{ ok: true; data: T } | { ok: false; reason: string }> {
  const text = await res.text();
  const trimmed = text.trim();
  if (!trimmed) return { ok: true, data: {} as T };
  if (trimmed.startsWith("<!") || trimmed.startsWith("<html")) {
    return {
      ok: false,
      reason: `API returned HTML (${res.status}) — /api route missing on ${API_BASE}`,
    };
  }
  try {
    return { ok: true, data: JSON.parse(trimmed) as T };
  } catch {
    return { ok: false, reason: `Invalid JSON (${res.status})` };
  }
}

export async function getStoredCookie(): Promise<string | null> {
  try {
    return await storage.getItem(COOKIE_KEY);
  } catch {
    return null;
  }
}

export async function setStoredCookie(cookie: string | null) {
  if (!cookie) {
    await storage.deleteItem(COOKIE_KEY);
    return;
  }
  await storage.setItem(COOKIE_KEY, cookie);
}

export async function getStoredUser(): Promise<AuthUser | null> {
  try {
    const raw = await storage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export async function setStoredUser(user: AuthUser | null) {
  if (!user) {
    await storage.deleteItem(USER_KEY);
    await storage.deleteItem(DEMO_MODE_KEY);
    return;
  }
  await storage.setItem(USER_KEY, JSON.stringify(user));
}

async function setDemoMode(on: boolean) {
  if (on) await storage.setItem(DEMO_MODE_KEY, "1");
  else await storage.deleteItem(DEMO_MODE_KEY);
}

export async function isDemoMode() {
  try {
    return (await storage.getItem(DEMO_MODE_KEY)) === "1";
  } catch {
    return false;
  }
}

function mergeSetCookie(existing: string | null, setCookieHeader: string | null) {
  if (!setCookieHeader) return existing;
  const parts = setCookieHeader.split(/,(?=\s*[^;]+=)/);
  const jar = new Map<string, string>();
  if (existing) {
    existing.split(";").forEach((pair) => {
      const [k, ...rest] = pair.trim().split("=");
      if (k) jar.set(k, rest.join("="));
    });
  }
  for (const part of parts) {
    const [pair] = part.split(";");
    const [k, ...rest] = pair.trim().split("=");
    if (k) jar.set(k, rest.join("="));
  }
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const cookie = await getStoredCookie();
  const headers = new Headers(init.headers || {});
  if (cookie) headers.set("Cookie", cookie);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });

  const setCookie =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie().join(", ")
      : res.headers.get("set-cookie");
  if (setCookie) {
    const next = mergeSetCookie(cookie, setCookie);
    if (next) await setStoredCookie(next);
  }
  return res;
}

export async function apiJson<T = unknown>(path: string, init: RequestInit = {}) {
  const res = await apiFetch(path, init);
  const parsed = await safeJson<T>(res);
  if (!parsed.ok) throw new Error(parsed.reason);
  if (!res.ok) {
    const err = parsed.data as { error?: string; message?: string };
    throw new Error(err.error || err.message || `Request failed (${res.status})`);
  }
  return parsed.data;
}

function demoLogin(email: string, password: string): AuthUser {
  const demo = DEMO_ACCOUNTS[email.toLowerCase().trim()];
  if (!demo || demo.password !== password) {
    throw new Error(
      "Backend /api is not available on this host. Use Demo Auto-fill (citizen or officer) to sign in on Expo."
    );
  }
  return demo.user;
}

/**
 * Try real NextAuth against EXPO_PUBLIC_API_URL.
 * If /api/auth/* 404s (current Vercel deploy), fall back to local demo session
 * so Expo Go can still use the Auto-fill accounts.
 */
export async function loginWithCredentials(email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();

  try {
    const csrfRes = await apiFetch("/api/auth/csrf");
    const csrfParsed = await safeJson<{ csrfToken?: string }>(csrfRes);

    if (csrfParsed.ok && csrfParsed.data.csrfToken) {
      const body = new URLSearchParams({
        csrfToken: csrfParsed.data.csrfToken,
        email: cleanEmail,
        password,
        callbackUrl: `${API_BASE}/`,
        json: "true",
        redirect: "false",
      });

      const res = await apiFetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "X-Auth-Return-Redirect": "1",
        },
        body: body.toString(),
      });

      const loginParsed = await safeJson<{ url?: string; error?: string }>(res);
      if (loginParsed.ok && !loginParsed.data.error && res.ok) {
        const session = await getSession();
        if (session?.user) {
          await setDemoMode(false);
          await setStoredUser(session.user);
          return session.user;
        }
      }
      if (loginParsed.ok && loginParsed.data.error && !DEMO_ACCOUNTS[cleanEmail]) {
        throw new Error("Invalid email or password. Please try again.");
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Invalid email")) throw err;
  }

  const user = demoLogin(cleanEmail, password);
  await setDemoMode(true);
  await setStoredCookie(null);
  await setStoredUser(user);
  return user;
}

export async function getSession(): Promise<{ user: AuthUser } | null> {
  try {
    const res = await apiFetch("/api/auth/session");
    const parsed = await safeJson<{ user?: AuthUser }>(res);
    if (parsed.ok && (parsed.data.user?.email || parsed.data.user?.id)) {
      return { user: parsed.data.user! };
    }
  } catch {
    // ignore
  }
  const stored = await getStoredUser();
  return stored ? { user: stored } : null;
}

export async function logout() {
  try {
    if (!(await isDemoMode())) {
      const csrfRes = await apiFetch("/api/auth/csrf");
      const csrfParsed = await safeJson<{ csrfToken?: string }>(csrfRes);
      if (csrfParsed.ok && csrfParsed.data.csrfToken) {
        const body = new URLSearchParams({
          csrfToken: csrfParsed.data.csrfToken,
          callbackUrl: `${API_BASE}/`,
          json: "true",
        });
        await apiFetch("/api/auth/signout", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
      }
    }
  } catch {
    // ignore
  }
  await setStoredCookie(null);
  await setStoredUser(null);
}

export async function registerAccount(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}) {
  try {
    return await apiJson<{
      success: boolean;
      error?: string;
      user?: AuthUser;
    }>("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    const user: AuthUser = {
      id: `demo-${Date.now()}`,
      name: `${input.firstName} ${input.lastName}`.trim(),
      email: input.email.toLowerCase().trim(),
      role: USER_ROLES.CITIZEN,
    };
    await setDemoMode(true);
    await setStoredUser(user);
    return { success: true, user };
  }
}

export async function fetchGrievance(id: string) {
  return apiJson<{
    success: boolean;
    grievance: any;
    viewerRole?: string;
    error?: string;
  }>(`/api/grievances/${id}`);
}

export async function getCloudinarySign() {
  return apiJson<{
    success: boolean;
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
    error?: string;
  }>("/api/cloudinary/sign", { method: "POST" });
}

export async function healthCheck() {
  return apiJson<{ status: string }>("/api/health");
}
